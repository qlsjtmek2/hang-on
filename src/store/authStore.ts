import { User, Session } from '@supabase/supabase-js';
import { create } from 'zustand';

import {
  supabase,
  signIn as supabaseSignIn,
  signUp as supabaseSignUp,
  signOut as supabaseSignOut,
} from '@/services/supabase';
import { handleSupabaseError, logError } from '@/utils/errorHandler';

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
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        set({
          user: session.user,
          session,
          isAuthenticated: true,
          isLoading: false,
        });

        // 세션 변경 리스너 설정
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, authSession) => {
          set({
            user: authSession?.user || null,
            session: authSession,
            isAuthenticated: !!authSession,
          });
        });

        // 클린업 함수 저장 (나중에 필요시 사용)
        (globalThis as typeof globalThis & { authSubscription?: typeof subscription }).authSubscription = subscription;
      } else {
        set({
          user: null,
          session: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch (error) {
      const errorMessage = handleSupabaseError(error as never);
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

      const data = await supabaseSignUp(email, password);

      if (data.user) {
        // 회원가입 성공 후 이메일 확인이 필요한 경우
        if (data.session) {
          set({
            user: data.user,
            session: data.session,
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
      const errorMessage = handleSupabaseError(error as never);
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
      set({ isLoading: true, error: null });

      const data = await supabaseSignIn(email, password);

      if (data.user && data.session) {
        set({
          user: data.user,
          session: data.session,
          isAuthenticated: true,
          isLoading: false,
        });
        return true;
      }

      set({ isLoading: false });
      return false;
    } catch (error) {
      const errorMessage = handleSupabaseError(error as never);
      logError(errorMessage, 'AuthStore.signIn');

      // 사용자 친화적 에러 메시지
      let userMessage = errorMessage.message;
      if (userMessage.includes('Invalid login credentials')) {
        userMessage = '이메일 또는 비밀번호가 올바르지 않습니다.';
      }

      set({
        error: userMessage,
        isLoading: false,
      });
      return false;
    }
  },

  // 로그아웃
  signOut: async () => {
    try {
      set({ isLoading: true, error: null });

      await supabaseSignOut();

      set({
        user: null,
        session: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage = handleSupabaseError(error as never);
      logError(errorMessage, 'AuthStore.signOut');
      set({
        error: errorMessage.message,
        isLoading: false,
      });
    }
  },

  // 에러 초기화
  clearError: () => {
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
}));
