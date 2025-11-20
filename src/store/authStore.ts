import { User, Session } from '@supabase/supabase-js';
import { create } from 'zustand';

import {
  signIn as authSignIn,
  signUp as authSignUp,
  signOut as authSignOut,
  getSession,
  onAuthStateChange,
} from '@/services/authService';
import { handleError, logError } from '@/utils/errorHandler';

// 로그인 실패 추적 (메모리 기반)
// TODO: AsyncStorage 또는 Supabase 테이블로 이전
interface LoginAttempt {
  count: number;
  lockoutUntil: number | null; // Unix timestamp (ms)
}

const loginAttempts: Map<string, LoginAttempt> = new Map();

// 로그인 실패 제한 설정
const MAX_LOGIN_ATTEMPTS = 15;
const LOCKOUT_DURATION_MS = 10 * 60 * 1000; // 10분

interface AuthStore {
  // 상태
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;

  // 액션
  initialize: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<boolean>;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  clearError: () => void;
  setSession: (session: Session | null) => void;
  setUser: (user: User | null) => void;
  // 로그인 실패 추적
  checkLockout: (email: string) => { isLockedOut: boolean; remainingTime?: number };
  resetLoginAttempts: (email: string) => void;
}

export const useAuthStore = create<AuthStore>((set, _get) => ({
  // 초기 상태
  user: null,
  session: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,

  // 세션 초기화
  initialize: async () => {
    try {
      set({ isLoading: true, error: null });

      // 현재 세션 가져오기
      const session = await getSession();

      if (session) {
        set({
          user: session.user,
          session,
          isAuthenticated: true,
          isLoading: false,
        });

        // 세션 변경 리스너 설정
        const unsubscribe = onAuthStateChange((_event, authSession) => {
          console.log('[AuthStore.onAuthStateChange] 이벤트:', _event, '세션:', !!authSession);

          const currentState = _get();

          // 로그인/회원가입 중에는 상태 변경 무시 (에러 메시지가 덮어써지는 것을 방지)
          if (currentState.isLoading) {
            console.log('[AuthStore.onAuthStateChange] isLoading=true, 상태 변경 무시');
            return;
          }

          set({
            user: authSession?.user || null,
            session: authSession,
            isAuthenticated: !!authSession,
            error: currentState.error, // 현재 error 유지
          });
        });

        // 클린업 함수 저장 (나중에 필요시 사용)
        (globalThis as typeof globalThis & { authUnsubscribe?: () => void }).authUnsubscribe =
          unsubscribe;
      } else {
        set({
          user: null,
          session: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch (error) {
      const errorMessage = handleError(error);
      logError(errorMessage, 'AuthStore.initialize');
      set({
        error: errorMessage.message,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  },

  // 회원가입
  signUp: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });

      const result = await authSignUp({ email, password });

      if (result.error) {
        throw result.error;
      }

      if (result.user) {
        // 회원가입 성공 후 이메일 확인이 필요한 경우
        if (result.session) {
          set({
            user: result.user,
            session: result.session,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          // 이메일 확인 대기
          set({
            user: null,
            session: null,
            isAuthenticated: false,
            isLoading: false,
            error: '이메일을 확인해주세요. 인증 링크를 보냈습니다.',
          });
        }
        return true;
      }

      set({ isLoading: false });
      return false;
    } catch (error) {
      const errorMessage = handleError(error);
      logError(errorMessage, 'AuthStore.signUp');
      set({
        error: errorMessage.message,
        isLoading: false,
      });
      return false;
    }
  },

  // 로그인
  signIn: async (email: string, password: string) => {
    try {
      console.log('[AuthStore.signIn] 시작', { email });

      // 1. 잠금 상태 확인
      const lockoutCheck = _get().checkLockout(email);
      if (lockoutCheck.isLockedOut) {
        const remainingMinutes = Math.ceil((lockoutCheck.remainingTime || 0) / 60000);
        const errorMsg = `로그인 시도 횟수를 초과했습니다. ${remainingMinutes}분 후에 다시 시도해주세요.`;
        set({ error: errorMsg, isLoading: false });
        return false;
      }

      set({ isLoading: true, error: null });

      // 2. 로그인 시도
      const result = await authSignIn({ email, password });
      console.log('[AuthStore.signIn] Auth 응답', {
        hasUser: !!result.user,
        hasSession: !!result.session,
        hasError: !!result.error,
      });

      if (result.error) {
        throw result.error;
      }

      if (result.user && result.session) {
        // 3. 로그인 성공 - 실패 기록 초기화
        _get().resetLoginAttempts(email);

        set({
          user: result.user,
          session: result.session,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        console.log('[AuthStore.signIn] 성공');
        return true;
      }

      console.log('[AuthStore.signIn] user 또는 session이 없음');
      set({ isLoading: false, error: null });
      return false;
    } catch (error) {
      console.log('[AuthStore.signIn] 에러 발생', error);
      const errorMessage = handleError(error);
      console.log('[AuthStore.signIn] 처리된 에러 메시지', errorMessage.message);
      logError(errorMessage, 'AuthStore.signIn');

      // 4. 로그인 실패 - 실패 횟수 증가
      const attempt = loginAttempts.get(email) || { count: 0, lockoutUntil: null };
      attempt.count += 1;

      if (attempt.count >= MAX_LOGIN_ATTEMPTS) {
        // 잠금 설정
        attempt.lockoutUntil = Date.now() + LOCKOUT_DURATION_MS;
        loginAttempts.set(email, attempt);

        const currentState = _get();
        set({
          user: currentState.user,
          session: currentState.session,
          isAuthenticated: currentState.isAuthenticated,
          error: '로그인 시도 횟수를 초과했습니다. 10분 후에 다시 시도해주세요.',
          isLoading: false,
        });
      } else {
        loginAttempts.set(email, attempt);

        const currentState = _get();
        set({
          user: currentState.user,
          session: currentState.session,
          isAuthenticated: currentState.isAuthenticated,
          error: errorMessage.message,
          isLoading: false,
        });
      }

      console.log('[AuthStore.signIn] 에러 상태 설정 완료');
      return false;
    }
  },

  // 로그아웃
  signOut: async () => {
    try {
      set({ isLoading: true, error: null });

      const result = await authSignOut();

      if (result.error) {
        throw result.error;
      }

      set({
        user: null,
        session: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage = handleError(error);
      logError(errorMessage, 'AuthStore.signOut');
      set({
        error: errorMessage.message,
        isLoading: false,
      });
    }
  },

  // 에러 초기화
  clearError: () => {
    console.log('[AuthStore.clearError] 호출됨', new Error().stack);
    set({ error: null });
  },

  // 세션 설정 (내부 사용)
  setSession: (session: Session | null) => {
    set({
      session,
      user: session?.user || null,
      isAuthenticated: !!session,
    });
  },

  // 사용자 설정 (내부 사용)
  setUser: (user: User | null) => {
    set({ user });
  },

  // 잠금 상태 확인
  checkLockout: (email: string) => {
    const attempt = loginAttempts.get(email);

    if (!attempt || !attempt.lockoutUntil) {
      return { isLockedOut: false };
    }

    const now = Date.now();
    if (now < attempt.lockoutUntil) {
      // 아직 잠금 중
      return {
        isLockedOut: true,
        remainingTime: attempt.lockoutUntil - now,
      };
    }

    // 잠금 시간이 지남 - 리셋
    loginAttempts.delete(email);
    return { isLockedOut: false };
  },

  // 로그인 실패 기록 초기화
  resetLoginAttempts: (email: string) => {
    loginAttempts.delete(email);
  },
}));
