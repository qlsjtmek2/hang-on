import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { LoginScreen } from '@/screens/LoginScreen';
import { useAuthStore } from '@/store/authStore';
import { NavigationContainer } from '@react-navigation/native';

// Mock 설정
jest.mock('@/store/authStore');
jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    useNavigation: () => ({
      navigate: jest.fn(),
    }),
  };
});

const mockSignIn = jest.fn();
const mockClearError = jest.fn();

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      signIn: mockSignIn,
      isLoading: false,
      error: null,
      clearError: mockClearError,
    });
  });

  const renderLoginScreen = () => {
    return render(
      <NavigationContainer>
        <LoginScreen />
      </NavigationContainer>
    );
  };

  describe('렌더링', () => {
    it('로그인 화면이 올바르게 렌더링되어야 한다', () => {
      const { getByText, getByPlaceholderText } = renderLoginScreen();

      expect(getByText('Hang On')).toBeTruthy();
      expect(getByText('감정을 나누고 함께 성장해요')).toBeTruthy();
      expect(getByPlaceholderText('이메일')).toBeTruthy();
      expect(getByPlaceholderText('비밀번호')).toBeTruthy();
      expect(getByText('로그인')).toBeTruthy();
      expect(getByText('회원가입')).toBeTruthy();
    });

    it('로딩 중일 때 로딩 표시가 되어야 한다', () => {
      (useAuthStore as unknown as jest.Mock).mockReturnValue({
        signIn: mockSignIn,
        isLoading: true,
        error: null,
        clearError: mockClearError,
      });

      const { getByText } = renderLoginScreen();
      expect(getByText('로그인 중...')).toBeTruthy();
    });
  });

  describe('유효성 검증', () => {
    it('이메일이 비어있을 때 에러 메시지를 표시해야 한다', async () => {
      const { getByText, getByPlaceholderText } = renderLoginScreen();

      const loginButton = getByText('로그인');
      fireEvent.press(loginButton);

      await waitFor(() => {
        expect(getByText('이메일을 입력해주세요')).toBeTruthy();
      });
    });

    it('이메일 형식이 올바르지 않을 때 에러 메시지를 표시해야 한다', async () => {
      const { getByText, getByPlaceholderText } = renderLoginScreen();

      const emailInput = getByPlaceholderText('이메일');
      fireEvent.changeText(emailInput, 'invalid-email');
      fireEvent(emailInput, 'blur');

      await waitFor(() => {
        expect(getByText('올바른 이메일 형식이 아닙니다')).toBeTruthy();
      });
    });

    it('비밀번호가 비어있을 때 에러 메시지를 표시해야 한다', async () => {
      const { getByText, getByPlaceholderText } = renderLoginScreen();

      const emailInput = getByPlaceholderText('이메일');
      fireEvent.changeText(emailInput, 'test@example.com');

      const loginButton = getByText('로그인');
      fireEvent.press(loginButton);

      await waitFor(() => {
        expect(getByText('비밀번호를 입력해주세요')).toBeTruthy();
      });
    });

    it('비밀번호가 8자 미만일 때 에러 메시지를 표시해야 한다', async () => {
      const { getByText, getByPlaceholderText } = renderLoginScreen();

      const passwordInput = getByPlaceholderText('비밀번호');
      fireEvent.changeText(passwordInput, '1234567');
      fireEvent(passwordInput, 'blur');

      await waitFor(() => {
        expect(getByText('비밀번호는 8자 이상이어야 합니다')).toBeTruthy();
      });
    });
  });

  describe('로그인 기능', () => {
    it('올바른 이메일과 비밀번호로 로그인을 시도해야 한다', async () => {
      mockSignIn.mockResolvedValue(true);

      const { getByText, getByPlaceholderText } = renderLoginScreen();

      const emailInput = getByPlaceholderText('이메일');
      const passwordInput = getByPlaceholderText('비밀번호');

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'password123');

      const loginButton = getByText('로그인');
      fireEvent.press(loginButton);

      await waitFor(() => {
        expect(mockClearError).toHaveBeenCalled();
        expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'password123');
      });
    });

    it('이메일을 소문자로 변환하고 공백을 제거해야 한다', async () => {
      mockSignIn.mockResolvedValue(true);

      const { getByText, getByPlaceholderText } = renderLoginScreen();

      const emailInput = getByPlaceholderText('이메일');
      const passwordInput = getByPlaceholderText('비밀번호');

      fireEvent.changeText(emailInput, '  TEST@EXAMPLE.COM  ');
      fireEvent.changeText(passwordInput, 'password123');

      const loginButton = getByText('로그인');
      fireEvent.press(loginButton);

      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'password123');
      });
    });

    it('로그인 실패 시 에러 메시지를 표시해야 한다', async () => {
      mockSignIn.mockResolvedValue(false);
      (useAuthStore as unknown as jest.Mock).mockReturnValue({
        signIn: mockSignIn,
        isLoading: false,
        error: '로그인에 실패했습니다',
        clearError: mockClearError,
      });

      const alertSpy = jest.spyOn(Alert, 'alert');

      const { getByText, getByPlaceholderText } = renderLoginScreen();

      const emailInput = getByPlaceholderText('이메일');
      const passwordInput = getByPlaceholderText('비밀번호');

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'wrongpassword');

      const loginButton = getByText('로그인');
      fireEvent.press(loginButton);

      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith(
          '로그인 실패',
          '로그인에 실패했습니다'
        );
      });
    });
  });

  describe('기타 버튼', () => {
    it('비밀번호 찾기 버튼을 눌렀을 때 알림이 표시되어야 한다', () => {
      const alertSpy = jest.spyOn(Alert, 'alert');
      const { getByText } = renderLoginScreen();

      const forgotPasswordButton = getByText('비밀번호를 잊으셨나요?');
      fireEvent.press(forgotPasswordButton);

      expect(alertSpy).toHaveBeenCalledWith(
        '비밀번호 찾기',
        '비밀번호 재설정 기능은 준비 중입니다.',
        [{ text: '확인' }]
      );
    });

    it('Google 로그인 버튼을 눌렀을 때 알림이 표시되어야 한다', () => {
      const alertSpy = jest.spyOn(Alert, 'alert');
      const { getByText } = renderLoginScreen();

      const googleLoginButton = getByText('Google로 로그인');
      fireEvent.press(googleLoginButton);

      expect(alertSpy).toHaveBeenCalledWith(
        'Google 로그인',
        'Google 소셜 로그인은 준비 중입니다.',
        [{ text: '확인' }]
      );
    });
  });
});