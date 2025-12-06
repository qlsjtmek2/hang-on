import { create } from 'zustand';

// Mock 사용자 타입
interface MockUser {
  id: string;
  email: string;
  created_at: string;
}

// 테스트 계정
const TEST_ACCOUNT = {
  email: 'test@example.com',
  password: 'password123',
};

// 개발용 Google Mock 계정
const GOOGLE_DEV_ACCOUNT = {
  email: 'google-dev@example.com',
  password: 'google-dev-password',
};

// Mock 사용자 데이터
const createMockUser = (email: string): MockUser => ({
  id: `mock-user-${Date.now()}`,
  email,
  created_at: new Date().toISOString(),
});

// 등록된 사용자 저장소 (메모리 기반)
const registeredUsers: Map<string, { email: string; password: string }> = new Map([
  [TEST_ACCOUNT.email, TEST_ACCOUNT],
  [GOOGLE_DEV_ACCOUNT.email, GOOGLE_DEV_ACCOUNT],
]);

interface AuthStore {
  // 상태
  user: MockUser | null;
  session: { user: MockUser } | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;

  // 액션
  initialize: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<boolean>;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  clearError: () => void;
  setSession: (session: { user: MockUser } | null) => void;
  setUser: (user: MockUser | null) => void;
  // 로그인 실패 추적 (기존 인터페이스 유지)
  checkLockout: (email: string) => { isLockedOut: boolean; remainingTime?: number };
  resetLoginAttempts: (email: string) => void;
}

export const useAuthStore = create<AuthStore>((set, _get) => ({
  // 초기 상태
  user: null,
  session: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,

  // 세션 초기화 (Mock: 항상 비로그인 상태로 시작)
  initialize: async () => {
    set({
      user: null,
      session: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  },

  // 회원가입 (Mock)
  signUp: async (email: string, password: string) => {
    set({ isLoading: true, error: null });

    // 시뮬레이션 딜레이
    await new Promise<void>(resolve => setTimeout(resolve, 500));

    // 이미 등록된 이메일 확인
    if (registeredUsers.has(email)) {
      set({
        error: '이미 등록된 이메일입니다.',
        isLoading: false,
      });
      return false;
    }

    // 새 사용자 등록
    registeredUsers.set(email, { email, password });

    // 자동 로그인
    const mockUser = createMockUser(email);
    set({
      user: mockUser,
      session: { user: mockUser },
      isAuthenticated: true,
      isLoading: false,
      error: null,
    });

    return true;
  },

  // 로그인 (Mock)
  signIn: async (email: string, password: string) => {
    console.log('[MockAuthStore.signIn] 시작', { email });
    set({ isLoading: true, error: null });

    // 시뮬레이션 딜레이
    await new Promise<void>(resolve => setTimeout(resolve, 500));

    // 등록된 사용자 확인
    const user = registeredUsers.get(email);

    if (!user) {
      console.log('[MockAuthStore.signIn] 사용자 없음');
      set({
        error: '등록되지 않은 이메일입니다.',
        isLoading: false,
      });
      return false;
    }

    if (user.password !== password) {
      console.log('[MockAuthStore.signIn] 비밀번호 불일치');
      set({
        error: '비밀번호가 일치하지 않습니다.',
        isLoading: false,
      });
      return false;
    }

    // 로그인 성공
    const mockUser = createMockUser(email);
    console.log('[MockAuthStore.signIn] 성공');

    set({
      user: mockUser,
      session: { user: mockUser },
      isAuthenticated: true,
      isLoading: false,
      error: null,
    });

    return true;
  },

  // 로그아웃 (Mock)
  signOut: async () => {
    set({ isLoading: true, error: null });

    // 시뮬레이션 딜레이
    await new Promise<void>(resolve => setTimeout(resolve, 300));

    set({
      user: null,
      session: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  // 에러 초기화
  clearError: () => {
    set({ error: null });
  },

  // 세션 설정 (내부 사용)
  setSession: (session: { user: MockUser } | null) => {
    set({
      session,
      user: session?.user || null,
      isAuthenticated: !!session,
    });
  },

  // 사용자 설정 (내부 사용)
  setUser: (user: MockUser | null) => {
    set({ user });
  },

  // 잠금 상태 확인 (Mock: 항상 잠금 없음)
  checkLockout: (_email: string) => {
    return { isLockedOut: false };
  },

  // 로그인 실패 기록 초기화 (Mock: no-op)
  resetLoginAttempts: (_email: string) => {
    // Mock에서는 아무 것도 하지 않음
  },
}));
