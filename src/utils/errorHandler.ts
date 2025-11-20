/**
 * 에러 핸들러 유틸리티
 * Supabase 에러와 일반 에러를 처리합니다.
 */

import { PostgrestError } from '@supabase/supabase-js';

/**
 * 에러 타입 열거형
 */
export enum ErrorType {
  NETWORK = 'NETWORK',
  AUTH = 'AUTH',
  VALIDATION = 'VALIDATION',
  PERMISSION = 'PERMISSION',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  SERVER = 'SERVER',
  UNKNOWN = 'UNKNOWN',
}

/**
 * 표준화된 에러 응답 인터페이스
 */
export interface StandardError {
  type: ErrorType;
  message: string;
  code?: string;
  details?: Record<string, unknown>;
  originalError?: unknown;
}

/**
 * 에러 패턴 매핑 정의
 */
interface ErrorPattern {
  pattern: RegExp;
  type: ErrorType;
  message: string;
}

/**
 * 메시지 패턴 기반 에러 매핑
 * 새로운 에러 추가 시 이 배열에 패턴만 추가하면 됨
 */
const ERROR_PATTERNS: ErrorPattern[] = [
  // Auth 에러
  {
    pattern: /email not confirmed/i,
    type: ErrorType.AUTH,
    message: '이메일 인증이 필요합니다. 인증 메일을 확인해주세요.',
  },
  {
    pattern: /invalid login credentials/i,
    type: ErrorType.AUTH,
    message: '이메일 또는 비밀번호가 올바르지 않습니다.',
  },
  {
    pattern: /user already registered/i,
    type: ErrorType.CONFLICT,
    message: '이미 가입된 이메일입니다.',
  },
  {
    pattern: /((jwt|token).*(expired|invalid)|(expired|invalid).*(jwt|token))/i,
    type: ErrorType.AUTH,
    message: '인증 토큰이 만료되었거나 유효하지 않습니다.',
  },
  {
    pattern: /session.*expired/i,
    type: ErrorType.AUTH,
    message: '세션이 만료되었습니다. 다시 로그인해주세요.',
  },

  // Network 에러
  {
    pattern: /(network|fetch)/i,
    type: ErrorType.NETWORK,
    message: '네트워크 연결에 문제가 있습니다. 인터넷 연결을 확인해주세요.',
  },
  {
    pattern: /timeout/i,
    type: ErrorType.NETWORK,
    message: '요청 시간이 초과되었습니다. 다시 시도해주세요.',
  },
];

/**
 * Supabase 에러 코드 매핑
 */
const SUPABASE_ERROR_MAP: Record<
  string,
  { type: ErrorType; getMessage?: (details?: string) => string }
> = {
  // Constraint violations
  '23505': {
    type: ErrorType.CONFLICT,
    getMessage: details =>
      details?.includes('email') ? '이미 가입된 이메일입니다.' : '이미 존재하는 데이터입니다.',
  },
  '23503': { type: ErrorType.VALIDATION, getMessage: () => '올바른 형식으로 입력해주세요.' },
  '23502': { type: ErrorType.VALIDATION, getMessage: () => '필수 항목을 입력해주세요.' },
  '23514': { type: ErrorType.VALIDATION, getMessage: () => '입력한 정보가 올바르지 않습니다.' },
  '22P02': { type: ErrorType.VALIDATION, getMessage: () => '올바른 형식으로 입력해주세요.' },

  // Auth errors
  PGRST301: {
    type: ErrorType.AUTH,
    getMessage: () => '세션이 만료되었습니다. 다시 로그인해주세요.',
  },
  PGRST302: { type: ErrorType.AUTH, getMessage: () => '인증 토큰이 유효하지 않습니다.' },

  // Permission errors
  '42501': { type: ErrorType.PERMISSION, getMessage: () => '이 작업을 수행할 권한이 없습니다.' },

  // Not found errors
  '42P01': { type: ErrorType.NOT_FOUND, getMessage: () => '요청한 정보를 찾을 수 없습니다.' },
  '42703': { type: ErrorType.NOT_FOUND, getMessage: () => '요청한 정보를 찾을 수 없습니다.' },
};

/**
 * 기본 에러 메시지
 */
const DEFAULT_MESSAGES = {
  [ErrorType.NETWORK]: '네트워크 연결에 문제가 있습니다.',
  [ErrorType.AUTH]: '로그인이 필요한 서비스입니다.',
  [ErrorType.VALIDATION]: '입력한 정보가 올바르지 않습니다.',
  [ErrorType.PERMISSION]: '이 작업을 수행할 권한이 없습니다.',
  [ErrorType.NOT_FOUND]: '요청한 정보를 찾을 수 없습니다.',
  [ErrorType.CONFLICT]: '데이터 충돌이 발생했습니다.',
  [ErrorType.SERVER]: '서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
  [ErrorType.UNKNOWN]: '알 수 없는 오류가 발생했습니다. 다시 시도해주세요.',
};

/**
 * 타입 가드: Error 객체인지 확인
 */
function isError(error: unknown): error is Error {
  return (
    error instanceof Error || (typeof error === 'object' && error !== null && 'message' in error)
  );
}

/**
 * 타입 가드: Supabase PostgrestError인지 확인
 */
function isPostgrestError(error: unknown): error is PostgrestError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error &&
    'details' in error
  );
}

/**
 * Supabase 에러 처리
 */
function handleSupabaseError(error: PostgrestError): StandardError {
  const mapping = SUPABASE_ERROR_MAP[error.code];

  if (mapping) {
    return {
      type: mapping.type,
      message: mapping.getMessage?.(error.details || undefined) || DEFAULT_MESSAGES[mapping.type],
      code: error.code,
      details: typeof error.details === 'string' ? { message: error.details } : undefined,
      originalError: error,
    };
  }

  // 매핑되지 않은 Supabase 에러는 서버 에러로 처리
  return {
    type: ErrorType.SERVER,
    message: DEFAULT_MESSAGES[ErrorType.SERVER],
    code: error.code,
    originalError: error,
  };
}

/**
 * 에러 메시지에서 패턴 매칭으로 타입과 메시지 찾기
 */
function matchErrorPattern(message: string): Pick<StandardError, 'type' | 'message'> | null {
  const lowerMessage = message.toLowerCase();

  for (const pattern of ERROR_PATTERNS) {
    if (pattern.pattern.test(lowerMessage)) {
      return { type: pattern.type, message: pattern.message };
    }
  }

  return null;
}

/**
 * 일반 에러 처리 (메인 진입점)
 *
 * @example
 * try {
 *   await login(email, password);
 * } catch (error) {
 *   const standardError = handleError(error);
 *   Alert.alert('오류', standardError.message);
 * }
 */
export function handleError(error: unknown): StandardError {
  // null 또는 undefined
  if (!error) {
    return {
      type: ErrorType.UNKNOWN,
      message: DEFAULT_MESSAGES[ErrorType.UNKNOWN],
    };
  }

  // Supabase PostgrestError
  if (isPostgrestError(error)) {
    return handleSupabaseError(error);
  }

  // Error 객체가 아닌 경우
  if (!isError(error)) {
    return {
      type: ErrorType.UNKNOWN,
      message: DEFAULT_MESSAGES[ErrorType.UNKNOWN],
      originalError: error,
    };
  }

  // 메시지 패턴 매칭
  const matched = matchErrorPattern(error.message || '');
  if (matched) {
    return {
      ...matched,
      originalError: error,
    };
  }

  // 패턴에 매칭되지 않는 일반 에러
  return {
    type: ErrorType.UNKNOWN,
    message: error.message || DEFAULT_MESSAGES[ErrorType.UNKNOWN],
    originalError: error,
  };
}

/**
 * 예상 가능한 Auth 에러인지 확인
 * 예상 가능한 에러는 사용자의 정상적인 행동(잘못된 비밀번호 입력 등)이므로 콘솔에 에러로 로깅하지 않음
 */
function isExpectedAuthError(error: StandardError): boolean {
  if (error.type !== ErrorType.AUTH) {
    return false;
  }

  const expectedPatterns = [
    '이메일 또는 비밀번호가 올바르지 않습니다',
    '이메일 인증이 필요합니다',
    '이미 가입된 이메일입니다',
  ];

  return expectedPatterns.some(pattern => error.message.includes(pattern));
}

/**
 * 에러 로깅 (개발 환경)
 *
 * @param error - 표준화된 에러
 * @param context - 에러 발생 컨텍스트 (예: 'Login', 'SignUp')
 * @param silent - true이면 콘솔에 출력하지 않음
 *
 * @example
 * const error = handleError(e);
 * logError(error, 'Login');
 */
export function logError(error: StandardError, context?: string, silent?: boolean): void {
  if (!__DEV__) {
    return;
  }

  // 예상 가능한 Auth 에러는 자동으로 silent 처리
  const shouldBeSilent = silent || isExpectedAuthError(error);

  if (shouldBeSilent) {
    // Silent 모드: info 레벨로만 간단히 로깅
    console.log(
      `ℹ️ ${context || 'Error'}: ${error.message}`,
      error.type !== ErrorType.AUTH ? `(Type: ${error.type})` : '',
    );
    return;
  }

  // 일반 에러: 상세 로깅
  console.group(`🚨 Error${context ? ` in ${context}` : ''}`);
  console.error('Type:', error.type);
  console.error('Message:', error.message);
  if (error.code) console.error('Code:', error.code);
  if (error.details) console.error('Details:', error.details);
  if (error.originalError) console.error('Original:', error.originalError);
  console.groupEnd();
}

/**
 * 재시도 가능한 에러인지 확인
 *
 * @example
 * if (isRetryableError(error)) {
 *   // 재시도 로직
 * }
 */
export function isRetryableError(error: StandardError): boolean {
  return [ErrorType.NETWORK, ErrorType.SERVER].includes(error.type);
}

/**
 * 로그인이 필요한 에러인지 확인
 *
 * @example
 * if (isAuthRequired(error)) {
 *   navigation.navigate('Login');
 * }
 */
export function isAuthRequired(error: StandardError): boolean {
  return error.type === ErrorType.AUTH || error.type === ErrorType.PERMISSION;
}

/**
 * 에러 타입별 제목 반환
 */
function getErrorTitle(type: ErrorType): string {
  const titles: Record<ErrorType, string> = {
    [ErrorType.NETWORK]: '네트워크 오류',
    [ErrorType.AUTH]: '인증 오류',
    [ErrorType.VALIDATION]: '입력 오류',
    [ErrorType.PERMISSION]: '권한 오류',
    [ErrorType.NOT_FOUND]: '찾을 수 없음',
    [ErrorType.CONFLICT]: '중복 오류',
    [ErrorType.SERVER]: '서버 오류',
    [ErrorType.UNKNOWN]: '오류',
  };

  return titles[type];
}

/**
 * 에러 토스트 메시지 표시를 위한 헬퍼
 * (실제 토스트 라이브러리와 연동 시 사용)
 *
 * @example
 * const toastConfig = getErrorToastConfig(error);
 * Toast.show(toastConfig);
 */
export function getErrorToastConfig(error: StandardError) {
  return {
    type: error.type === ErrorType.NETWORK ? 'warning' : 'error',
    title: getErrorTitle(error.type),
    message: error.message,
    duration: error.type === ErrorType.NETWORK ? 5000 : 4000,
  };
}

/**
 * 편의를 위한 기본 export
 */
export default {
  handle: handleError,
  log: logError,
  isRetryable: isRetryableError,
  isAuthRequired,
  getToastConfig: getErrorToastConfig,
};
