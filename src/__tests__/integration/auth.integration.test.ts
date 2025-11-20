/**
 * 인증 플로우 통합 테스트
 *
 * 회원가입 → 로그인 플로우를 테스트합니다.
 * - 이메일/비밀번호 회원가입
 * - 이메일/비밀번호 로그인
 * - 로그인 실패 잠금 메커니즘
 * - 세션 관리
 */

import { User, Session } from '@supabase/supabase-js';

import * as authService from '@/services/authService';
import { useAuthStore } from '@/store/authStore';

// Mock 데이터
const mockUser: User = {
  id: 'test-user-id',
  email: 'test@example.com',
  app_metadata: {},
  user_metadata: {},
  aud: 'authenticated',
  created_at: new Date().toISOString(),
} as User;

const mockSession: Session = {
  access_token: 'mock-access-token',
  refresh_token: 'mock-refresh-token',
  expires_in: 3600,
  token_type: 'bearer',
  user: mockUser,
} as Session;

describe('인증 플로우 통합 테스트', () => {
  beforeEach(() => {
    // 각 테스트 전에 상태 초기화
    useAuthStore.setState({
      user: null,
      session: null,
      isLoading: false,
      isAuthenticated: false,
      error: null,
    });

    // 모든 이메일의 로그인 실패 기록 초기화
    // loginAttempts Map을 직접 초기화할 수 없으므로
    // resetLoginAttempts를 사용하여 테스트에서 사용할 이메일들을 초기화
    const testEmails = ['test@example.com', 'newuser@example.com'];
    testEmails.forEach(email => {
      useAuthStore.getState().resetLoginAttempts(email);
    });

    // Mock 함수 초기화
    jest.clearAllMocks();
  });

  describe('회원가입 → 로그인 플로우', () => {
    it('성공적으로 회원가입하고 로그인할 수 있다', async () => {
      const email = 'newuser@example.com';
      const password = 'password123';

      // 1. 회원가입 성공 mock
      (authService.signUp as jest.Mock).mockResolvedValueOnce({
        user: mockUser,
        session: mockSession,
        error: null,
      });

      // 2. 회원가입 실행
      const signUpResult = await useAuthStore.getState().signUp(email, password);

      expect(signUpResult).toBe(true);
      expect(authService.signUp).toHaveBeenCalledWith({ email, password });
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
      expect(useAuthStore.getState().user).toEqual(mockUser);

      // 3. 로그아웃
      (authService.signOut as jest.Mock).mockResolvedValueOnce({ error: null });
      await useAuthStore.getState().signOut();

      expect(useAuthStore.getState().isAuthenticated).toBe(false);
      expect(useAuthStore.getState().user).toBe(null);

      // 4. 로그인 성공 mock
      (authService.signIn as jest.Mock).mockResolvedValueOnce({
        user: mockUser,
        session: mockSession,
        error: null,
      });

      // 5. 로그인 실행
      const signInResult = await useAuthStore.getState().signIn(email, password);

      expect(signInResult).toBe(true);
      expect(authService.signIn).toHaveBeenCalledWith({ email, password });
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
      expect(useAuthStore.getState().user).toEqual(mockUser);
    });

    it('회원가입 시 이메일 확인이 필요한 경우 처리한다', async () => {
      const email = 'newuser@example.com';
      const password = 'password123';

      // 회원가입 성공하지만 세션 없음 (이메일 확인 필요)
      (authService.signUp as jest.Mock).mockResolvedValueOnce({
        user: mockUser,
        session: null,
        error: null,
      });

      const signUpResult = await useAuthStore.getState().signUp(email, password);

      expect(signUpResult).toBe(true);
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
      expect(useAuthStore.getState().error).toContain('이메일을 확인해주세요');
    });
  });

  describe('로그인 실패 잠금 메커니즘', () => {
    const email = 'test@example.com';
    const password = 'wrong-password';

    it('5회 로그인 실패 시 15분간 잠금된다', async () => {
      const authError = new Error('Invalid login credentials');
      (authService.signIn as jest.Mock).mockResolvedValue({
        user: null,
        session: null,
        error: authError,
      });

      // 5회 로그인 실패
      for (let i = 0; i < 5; i++) {
        const result = await useAuthStore.getState().signIn(email, password);
        expect(result).toBe(false);

        const error = useAuthStore.getState().error;
        if (i < 4) {
          // 4회까지는 남은 시도 횟수 표시
          expect(error).toContain(`남은 시도 횟수: ${4 - i}회`);
        } else {
          // 5회째에는 잠금 메시지
          expect(error).toContain('로그인 시도 횟수를 초과했습니다');
          expect(error).toContain('15분 후에 다시 시도해주세요');
        }
      }

      // 6회째 시도 시 즉시 차단
      const sixthAttempt = await useAuthStore.getState().signIn(email, password);
      expect(sixthAttempt).toBe(false);
      expect(useAuthStore.getState().error).toContain('로그인 시도 횟수를 초과했습니다');

      // signIn이 5회만 호출되었는지 확인 (6회째는 잠금으로 차단됨)
      expect(authService.signIn).toHaveBeenCalledTimes(5);
    });

    it('로그인 성공 시 실패 기록이 초기화된다', async () => {
      const authError = new Error('Invalid login credentials');

      // 2회 실패
      (authService.signIn as jest.Mock).mockResolvedValue({
        user: null,
        session: null,
        error: authError,
      });

      await useAuthStore.getState().signIn(email, password);
      await useAuthStore.getState().signIn(email, password);

      expect(useAuthStore.getState().error).toContain('남은 시도 횟수: 3회');

      // 3회째에 성공
      (authService.signIn as jest.Mock).mockResolvedValueOnce({
        user: mockUser,
        session: mockSession,
        error: null,
      });

      const result = await useAuthStore.getState().signIn(email, password);
      expect(result).toBe(true);

      // 로그아웃 후 다시 실패하면 새로 카운트 시작
      (authService.signOut as jest.Mock).mockResolvedValueOnce({ error: null });
      await useAuthStore.getState().signOut();

      (authService.signIn as jest.Mock).mockResolvedValue({
        user: null,
        session: null,
        error: authError,
      });

      await useAuthStore.getState().signIn(email, password);
      expect(useAuthStore.getState().error).toContain('남은 시도 횟수: 4회');
    });

    it('잠금 상태를 확인할 수 있다', () => {
      const { checkLockout } = useAuthStore.getState();

      // 잠금되지 않은 상태
      const unlocked = checkLockout(email);
      expect(unlocked.isLockedOut).toBe(false);
      expect(unlocked.remainingTime).toBeUndefined();
    });
  });

  describe('에러 처리', () => {
    it('네트워크 에러를 처리한다', async () => {
      const networkError = new Error('Network request failed');
      (authService.signIn as jest.Mock).mockResolvedValueOnce({
        user: null,
        session: null,
        error: networkError,
      });

      const result = await useAuthStore.getState().signIn('test@example.com', 'password');

      expect(result).toBe(false);
      expect(useAuthStore.getState().error).toBeTruthy();
    });

    it('에러를 초기화할 수 있다', () => {
      useAuthStore.setState({ error: 'Test error' });

      expect(useAuthStore.getState().error).toBe('Test error');

      useAuthStore.getState().clearError();

      expect(useAuthStore.getState().error).toBe(null);
    });
  });

  describe('세션 관리', () => {
    it('세션을 설정할 수 있다', () => {
      const { setSession } = useAuthStore.getState();

      setSession(mockSession);

      expect(useAuthStore.getState().session).toEqual(mockSession);
      expect(useAuthStore.getState().user).toEqual(mockUser);
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
    });

    it('세션을 null로 설정할 수 있다', () => {
      // 먼저 세션 설정
      useAuthStore.setState({
        session: mockSession,
        user: mockUser,
        isAuthenticated: true,
      });

      // 세션 제거
      const { setSession } = useAuthStore.getState();
      setSession(null);

      expect(useAuthStore.getState().session).toBe(null);
      expect(useAuthStore.getState().user).toBe(null);
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
    });
  });

  describe('초기화', () => {
    it('세션이 있으면 자동 로그인된다', async () => {
      (authService.getSession as jest.Mock).mockResolvedValueOnce(mockSession);
      (authService.onAuthStateChange as jest.Mock).mockReturnValueOnce(() => {});

      await useAuthStore.getState().initialize();

      expect(useAuthStore.getState().isAuthenticated).toBe(true);
      expect(useAuthStore.getState().user).toEqual(mockUser);
      expect(useAuthStore.getState().session).toEqual(mockSession);
    });

    it('세션이 없으면 로그아웃 상태로 초기화된다', async () => {
      (authService.getSession as jest.Mock).mockResolvedValueOnce(null);

      await useAuthStore.getState().initialize();

      expect(useAuthStore.getState().isAuthenticated).toBe(false);
      expect(useAuthStore.getState().user).toBe(null);
      expect(useAuthStore.getState().session).toBe(null);
    });
  });
});
