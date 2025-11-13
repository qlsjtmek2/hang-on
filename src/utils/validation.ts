import { EMAIL_REGEX } from '@/constants/patterns';

/**
 * 유효성 검사 결과 타입
 */
export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

/**
 * 이메일 유효성 검사
 *
 * @param email - 검사할 이메일 주소
 * @returns 유효성 검사 결과
 *
 * @example
 * const result = validateEmail('user@example.com');
 * if (!result.isValid) {
 *   setEmailError(result.errorMessage);
 * }
 */
export function validateEmail(email: string): ValidationResult {
  if (!email) {
    return {
      isValid: false,
      errorMessage: '이메일을 입력해주세요',
    };
  }

  if (!EMAIL_REGEX.test(email)) {
    return {
      isValid: false,
      errorMessage: '올바른 이메일 형식이 아닙니다',
    };
  }

  return { isValid: true };
}

/**
 * 비밀번호 유효성 검사
 *
 * @param password - 검사할 비밀번호
 * @param options - 검사 옵션
 * @param options.minLength - 최소 길이 (기본값: 8)
 * @param options.requireStrong - 강한 비밀번호 요구 여부 (기본값: false)
 * @returns 유효성 검사 결과
 *
 * @example
 * const result = validatePassword('mypassword', { minLength: 8 });
 * if (!result.isValid) {
 *   setPasswordError(result.errorMessage);
 * }
 */
export function validatePassword(
  password: string,
  options: { minLength?: number; requireStrong?: boolean } = {},
): ValidationResult {
  const { minLength = 8, requireStrong = false } = options;

  if (!password) {
    return {
      isValid: false,
      errorMessage: '비밀번호를 입력해주세요',
    };
  }

  if (password.length < minLength) {
    return {
      isValid: false,
      errorMessage: `비밀번호는 ${minLength}자 이상이어야 합니다`,
    };
  }

  if (requireStrong) {
    // 강한 비밀번호 조건: 문자, 숫자, 특수문자 각 1개 이상
    const hasLetter = /[A-Za-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[@$!%*#?&]/.test(password);

    if (!hasLetter || !hasNumber || !hasSpecial) {
      return {
        isValid: false,
        errorMessage: '비밀번호는 문자, 숫자, 특수문자를 각각 1개 이상 포함해야 합니다',
      };
    }
  }

  return { isValid: true };
}

/**
 * 비밀번호 확인 검사
 *
 * @param password - 원본 비밀번호
 * @param confirmPassword - 확인 비밀번호
 * @returns 유효성 검사 결과
 *
 * @example
 * const result = validateConfirmPassword(password, confirmPassword);
 * if (!result.isValid) {
 *   setConfirmPasswordError(result.errorMessage);
 * }
 */
export function validateConfirmPassword(
  password: string,
  confirmPassword: string,
): ValidationResult {
  if (!confirmPassword) {
    return {
      isValid: false,
      errorMessage: '비밀번호 확인을 입력해주세요',
    };
  }

  if (confirmPassword !== password) {
    return {
      isValid: false,
      errorMessage: '비밀번호가 일치하지 않습니다',
    };
  }

  return { isValid: true };
}

/**
 * 닉네임 유효성 검사
 *
 * @param nickname - 검사할 닉네임
 * @param options - 검사 옵션
 * @param options.minLength - 최소 길이 (기본값: 2)
 * @param options.maxLength - 최대 길이 (기본값: 10)
 * @returns 유효성 검사 결과
 *
 * @example
 * const result = validateNickname('홍길동');
 * if (!result.isValid) {
 *   setNicknameError(result.errorMessage);
 * }
 */
export function validateNickname(
  nickname: string,
  options: { minLength?: number; maxLength?: number } = {},
): ValidationResult {
  const { minLength = 2, maxLength = 10 } = options;

  if (!nickname) {
    return {
      isValid: false,
      errorMessage: '닉네임을 입력해주세요',
    };
  }

  if (nickname.length < minLength || nickname.length > maxLength) {
    return {
      isValid: false,
      errorMessage: `닉네임은 ${minLength}자 이상 ${maxLength}자 이하로 입력해주세요`,
    };
  }

  // 한글, 영문, 숫자만 허용
  const nicknameRegex = /^[가-힣a-zA-Z0-9]+$/;
  if (!nicknameRegex.test(nickname)) {
    return {
      isValid: false,
      errorMessage: '닉네임은 한글, 영문, 숫자만 사용할 수 있습니다',
    };
  }

  return { isValid: true };
}
