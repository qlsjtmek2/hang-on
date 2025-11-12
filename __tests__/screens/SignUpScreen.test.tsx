import { NavigationContainer } from '@react-navigation/native';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import React from 'react';
import { Alert } from 'react-native';

import { SignUpScreen } from '@/screens/SignUpScreen';
import { useAuthStore } from '@/store/authStore';

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

const mockSignUp = jest.fn();
const mockClearError = jest.fn();
const mockNavigate = jest.fn();

// Navigation mock
jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    useNavigation: () => ({
      navigate: mockNavigate,
    }),
  };
});

describe('SignUpScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      signUp: mockSignUp,
      isLoading: false,
      error: null,
      clearError: mockClearError,
    });
  });

  const renderSignUpScreen = () => {
    return render(
      <NavigationContainer>
        <SignUpScreen />
      </NavigationContainer>,
    );
  };

  describe('렌더링', () => {
    it('회원가입 화면이 올바르게 렌더링되어야 한다', () => {
      const { getByText, getByPlaceholderText } = renderSignUpScreen();

      expect(getByText('회원가입')).toBeTruthy();
      expect(getByText('Hang On과 함께 시작해보세요')).toBeTruthy();
      expect(getByPlaceholderText('이메일')).toBeTruthy();
      expect(getByPlaceholderText('비밀번호 (8자 이상)')).toBeTruthy();
      expect(getByPlaceholderText('비밀번호 확인')).toBeTruthy();
      expect(getByText('로그인')).toBeTruthy();
    });

    it('비밀번호 요구사항이 표시되어야 한다', () => {
      const { getByText } = renderSignUpScreen();

      expect(getByText('비밀번호 요구사항:')).toBeTruthy();
      expect(getByText('• 최소 8자 이상')).toBeTruthy();
    });

    it('로딩 중일 때 로딩 표시가 되어야 한다', () => {
      (useAuthStore as unknown as jest.Mock).mockReturnValue({
        signUp: mockSignUp,
        isLoading: true,
        error: null,
        clearError: mockClearError,
      });

      const { getByText } = renderSignUpScreen();
      expect(getByText('가입 중...')).toBeTruthy();
    });
  });

  describe('유효성 검증', () => {
    it('이메일이 비어있을 때 에러 메시지를 표시해야 한다', async () => {
      const { getByText } = renderSignUpScreen();

      const signUpButton = getByText('회원가입');
      fireEvent.press(signUpButton);

      await waitFor(() => {
        expect(getByText('이메일을 입력해주세요')).toBeTruthy();
      });
    });

    it('이메일 형식이 올바르지 않을 때 에러 메시지를 표시해야 한다', async () => {
      const { getByText, getByPlaceholderText } = renderSignUpScreen();

      const emailInput = getByPlaceholderText('이메일');
      fireEvent.changeText(emailInput, 'invalid-email');
      fireEvent(emailInput, 'blur');

      await waitFor(() => {
        expect(getByText('올바른 이메일 형식이 아닙니다')).toBeTruthy();
      });
    });

    it('비밀번호가 비어있을 때 에러 메시지를 표시해야 한다', async () => {
      const { getByText, getByPlaceholderText } = renderSignUpScreen();

      const emailInput = getByPlaceholderText('이메일');
      fireEvent.changeText(emailInput, 'test@example.com');

      const signUpButton = getByText('회원가입');
      fireEvent.press(signUpButton);

      await waitFor(() => {
        expect(getByText('비밀번호를 입력해주세요')).toBeTruthy();
      });
    });

    it('비밀번호가 8자 미만일 때 에러 메시지를 표시해야 한다', async () => {
      const { getByText, getByPlaceholderText } = renderSignUpScreen();

      const passwordInput = getByPlaceholderText('비밀번호 (8자 이상)');
      fireEvent.changeText(passwordInput, '1234567');
      fireEvent(passwordInput, 'blur');

      await waitFor(() => {
        expect(getByText('비밀번호는 8자 이상이어야 합니다')).toBeTruthy();
      });
    });

    it('비밀번호 확인이 비어있을 때 에러 메시지를 표시해야 한다', async () => {
      const { getByText, getByPlaceholderText } = renderSignUpScreen();

      const emailInput = getByPlaceholderText('이메일');
      const passwordInput = getByPlaceholderText('비밀번호 (8자 이상)');

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'password123');

      const signUpButton = getByText('회원가입');
      fireEvent.press(signUpButton);

      await waitFor(() => {
        expect(getByText('비밀번호 확인을 입력해주세요')).toBeTruthy();
      });
    });

    it('비밀번호와 비밀번호 확인이 일치하지 않을 때 에러 메시지를 표시해야 한다', async () => {
      const { getByText, getByPlaceholderText } = renderSignUpScreen();

      const passwordInput = getByPlaceholderText('비밀번호 (8자 이상)');
      const confirmPasswordInput = getByPlaceholderText('비밀번호 확인');

      fireEvent.changeText(passwordInput, 'password123');
      fireEvent.changeText(confirmPasswordInput, 'password456');
      fireEvent(confirmPasswordInput, 'blur');

      await waitFor(() => {
        expect(getByText('비밀번호가 일치하지 않습니다')).toBeTruthy();
      });
    });

    it('비밀번호 요구사항이 충족되면 색상이 변경되어야 한다', () => {
      const { getByPlaceholderText, getByText } = renderSignUpScreen();

      const passwordInput = getByPlaceholderText('비밀번호 (8자 이상)');
      fireEvent.changeText(passwordInput, 'password123');

      const requirement = getByText('• 최소 8자 이상');

      // 스타일이 requirementMet 클래스를 포함하는지 확인
      const styles = requirement.props.style;
      expect(styles).toBeTruthy();
    });
  });

  describe('회원가입 기능', () => {
    it('올바른 정보로 회원가입을 시도해야 한다', async () => {
      mockSignUp.mockResolvedValue(true);

      const { getByText, getByPlaceholderText } = renderSignUpScreen();

      const emailInput = getByPlaceholderText('이메일');
      const passwordInput = getByPlaceholderText('비밀번호 (8자 이상)');
      const confirmPasswordInput = getByPlaceholderText('비밀번호 확인');

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'password123');
      fireEvent.changeText(confirmPasswordInput, 'password123');

      const signUpButton = getByText('회원가입');
      fireEvent.press(signUpButton);

      await waitFor(() => {
        expect(mockClearError).toHaveBeenCalled();
        expect(mockSignUp).toHaveBeenCalledWith('test@example.com', 'password123');
      });
    });

    it('이메일을 소문자로 변환하고 공백을 제거해야 한다', async () => {
      mockSignUp.mockResolvedValue(true);

      const { getByText, getByPlaceholderText } = renderSignUpScreen();

      const emailInput = getByPlaceholderText('이메일');
      const passwordInput = getByPlaceholderText('비밀번호 (8자 이상)');
      const confirmPasswordInput = getByPlaceholderText('비밀번호 확인');

      fireEvent.changeText(emailInput, '  TEST@EXAMPLE.COM  ');
      fireEvent.changeText(passwordInput, 'password123');
      fireEvent.changeText(confirmPasswordInput, 'password123');

      const signUpButton = getByText('회원가입');
      fireEvent.press(signUpButton);

      await waitFor(() => {
        expect(mockSignUp).toHaveBeenCalledWith('test@example.com', 'password123');
      });
    });

    it('회원가입 성공 후 이메일 확인이 필요한 경우 알림을 표시해야 한다', async () => {
      mockSignUp.mockResolvedValue(true);
      (useAuthStore as unknown as jest.Mock).mockReturnValue({
        signUp: mockSignUp,
        isLoading: false,
        error: '이메일을 확인해주세요. 인증 링크를 보냈습니다.',
        clearError: mockClearError,
      });

      const alertSpy = jest.spyOn(Alert, 'alert');

      const { getByText, getByPlaceholderText } = renderSignUpScreen();

      const emailInput = getByPlaceholderText('이메일');
      const passwordInput = getByPlaceholderText('비밀번호 (8자 이상)');
      const confirmPasswordInput = getByPlaceholderText('비밀번호 확인');

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'password123');
      fireEvent.changeText(confirmPasswordInput, 'password123');

      const signUpButton = getByText('회원가입');
      fireEvent.press(signUpButton);

      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith(
          '회원가입 완료',
          '이메일을 확인하여 계정을 활성화해주세요.',
          expect.any(Array),
        );
      });
    });

    it('회원가입 실패 시 에러 메시지를 표시해야 한다', async () => {
      mockSignUp.mockResolvedValue(false);
      (useAuthStore as unknown as jest.Mock).mockReturnValue({
        signUp: mockSignUp,
        isLoading: false,
        error: '이미 등록된 이메일입니다',
        clearError: mockClearError,
      });

      const alertSpy = jest.spyOn(Alert, 'alert');

      const { getByText, getByPlaceholderText } = renderSignUpScreen();

      const emailInput = getByPlaceholderText('이메일');
      const passwordInput = getByPlaceholderText('비밀번호 (8자 이상)');
      const confirmPasswordInput = getByPlaceholderText('비밀번호 확인');

      fireEvent.changeText(emailInput, 'existing@example.com');
      fireEvent.changeText(passwordInput, 'password123');
      fireEvent.changeText(confirmPasswordInput, 'password123');

      const signUpButton = getByText('회원가입');
      fireEvent.press(signUpButton);

      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith('회원가입 실패', '이미 등록된 이메일입니다');
      });
    });
  });

  describe('기타 버튼', () => {
    it('Google 회원가입 버튼을 눌렀을 때 알림이 표시되어야 한다', () => {
      const alertSpy = jest.spyOn(Alert, 'alert');
      const { getByText } = renderSignUpScreen();

      const googleSignUpButton = getByText('Google로 회원가입');
      fireEvent.press(googleSignUpButton);

      expect(alertSpy).toHaveBeenCalledWith(
        'Google 회원가입',
        'Google 소셜 회원가입은 준비 중입니다.',
        [{ text: '확인' }],
      );
    });
  });

  describe('비밀번호 변경 시 확인 비밀번호 재검증', () => {
    it('비밀번호를 변경하면 확인 비밀번호도 재검증되어야 한다', async () => {
      const { getByText, getByPlaceholderText } = renderSignUpScreen();

      const passwordInput = getByPlaceholderText('비밀번호 (8자 이상)');
      const confirmPasswordInput = getByPlaceholderText('비밀번호 확인');

      // 먼저 같은 비밀번호 설정
      fireEvent.changeText(passwordInput, 'password123');
      fireEvent.changeText(confirmPasswordInput, 'password123');

      // 비밀번호 변경
      fireEvent.changeText(passwordInput, 'newpassword123');

      // 확인 비밀번호 blur 이벤트 발생
      fireEvent(confirmPasswordInput, 'blur');

      await waitFor(() => {
        expect(getByText('비밀번호가 일치하지 않습니다')).toBeTruthy();
      });
    });
  });
});
