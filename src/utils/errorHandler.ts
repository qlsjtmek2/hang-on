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
  details?: any;
  originalError?: any;
}

/**
 * 사용자 친화적인 에러 메시지 매핑
 */
const USER_FRIENDLY_MESSAGES: Record<string, string> = {
  // 네트워크 에러
  NETWORK_ERROR: '네트워크 연결에 문제가 있습니다. 인터넷 연결을 확인해주세요.',
  TIMEOUT: '요청 시간이 초과되었습니다. 다시 시도해주세요.',

  // 인증 에러
  INVALID_CREDENTIALS: '이메일 또는 비밀번호가 올바르지 않습니다.',
  EMAIL_NOT_CONFIRMED: '이메일 인증이 필요합니다. 인증 메일을 확인해주세요.',
  USER_ALREADY_EXISTS: '이미 가입된 이메일입니다.',
  INVALID_TOKEN: '인증 토큰이 만료되었거나 유효하지 않습니다.',
  SESSION_EXPIRED: '세션이 만료되었습니다. 다시 로그인해주세요.',

  // 권한 에러
  INSUFFICIENT_PERMISSIONS: '이 작업을 수행할 권한이 없습니다.',
  UNAUTHORIZED: '로그인이 필요한 서비스입니다.',

  // 유효성 검사 에러
  VALIDATION_ERROR: '입력한 정보가 올바르지 않습니다.',
  REQUIRED_FIELD: '필수 항목을 입력해주세요.',
  INVALID_FORMAT: '올바른 형식으로 입력해주세요.',

  // 데이터 에러
  NOT_FOUND: '요청한 정보를 찾을 수 없습니다.',
  ALREADY_EXISTS: '이미 존재하는 데이터입니다.',
  CONFLICT: '데이터 충돌이 발생했습니다. 다시 시도해주세요.',

  // 서버 에러
  SERVER_ERROR: '서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
  SERVICE_UNAVAILABLE: '서비스를 일시적으로 사용할 수 없습니다.',

  // 기본 에러
  UNKNOWN_ERROR: '알 수 없는 오류가 발생했습니다. 다시 시도해주세요.',
};

/**
 * Supabase 에러 코드를 ErrorType으로 매핑
 */
const SUPABASE_ERROR_MAP: Record<string, ErrorType> = {
  // Auth 관련
  '23505': ErrorType.CONFLICT, // unique violation
  '23503': ErrorType.VALIDATION, // foreign key violation
  '23502': ErrorType.VALIDATION, // not null violation
  '23514': ErrorType.VALIDATION, // check constraint violation
  '22P02': ErrorType.VALIDATION, // invalid text representation
  PGRST301: ErrorType.AUTH, // JWT expired
  PGRST302: ErrorType.AUTH, // Invalid JWT
  '42501': ErrorType.PERMISSION, // insufficient privileges
  '42P01': ErrorType.NOT_FOUND, // table does not exist
  '42703': ErrorType.NOT_FOUND, // column does not exist
};

/**
 * Supabase 에러 처리
 */
export function handleSupabaseError(error: PostgrestError | null): StandardError {
  if (!error) {
    return {
      type: ErrorType.UNKNOWN,
      message: USER_FRIENDLY_MESSAGES.UNKNOWN_ERROR,
    };
  }

  // 에러 코드로 타입 결정
  const errorType = SUPABASE_ERROR_MAP[error.code] || ErrorType.SERVER;

  // 사용자 친화적 메시지 결정
  let userMessage = USER_FRIENDLY_MESSAGES.SERVER_ERROR;

  switch (errorType) {
    case ErrorType.CONFLICT:
      if (error.details?.includes('email')) {
        userMessage = USER_FRIENDLY_MESSAGES.USER_ALREADY_EXISTS;
      } else {
        userMessage = USER_FRIENDLY_MESSAGES.ALREADY_EXISTS;
      }
      break;

    case ErrorType.AUTH:
      if (error.message?.includes('expired')) {
        userMessage = USER_FRIENDLY_MESSAGES.SESSION_EXPIRED;
      } else if (error.message?.includes('invalid')) {
        userMessage = USER_FRIENDLY_MESSAGES.INVALID_TOKEN;
      } else {
        userMessage = USER_FRIENDLY_MESSAGES.UNAUTHORIZED;
      }
      break;

    case ErrorType.VALIDATION:
      if (error.details?.includes('not-null')) {
        userMessage = USER_FRIENDLY_MESSAGES.REQUIRED_FIELD;
      } else {
        userMessage = USER_FRIENDLY_MESSAGES.VALIDATION_ERROR;
      }
      break;

    case ErrorType.PERMISSION:
      userMessage = USER_FRIENDLY_MESSAGES.INSUFFICIENT_PERMISSIONS;
      break;

    case ErrorType.NOT_FOUND:
      userMessage = USER_FRIENDLY_MESSAGES.NOT_FOUND;
      break;

    default:
      userMessage = USER_FRIENDLY_MESSAGES.SERVER_ERROR;
  }

  return {
    type: errorType,
    message: userMessage,
    code: error.code,
    details: error.details,
    originalError: error,
  };
}

/**
 * Auth 에러 처리
 */
export function handleAuthError(error: any): StandardError {
  const message = error?.message?.toLowerCase() || '';

  if (message.includes('email not confirmed')) {
    return {
      type: ErrorType.AUTH,
      message: USER_FRIENDLY_MESSAGES.EMAIL_NOT_CONFIRMED,
      originalError: error,
    };
  }

  if (message.includes('invalid login credentials')) {
    return {
      type: ErrorType.AUTH,
      message: USER_FRIENDLY_MESSAGES.INVALID_CREDENTIALS,
      originalError: error,
    };
  }

  if (message.includes('user already registered')) {
    return {
      type: ErrorType.CONFLICT,
      message: USER_FRIENDLY_MESSAGES.USER_ALREADY_EXISTS,
      originalError: error,
    };
  }

  if (message.includes('jwt') || message.includes('token')) {
    return {
      type: ErrorType.AUTH,
      message: USER_FRIENDLY_MESSAGES.INVALID_TOKEN,
      originalError: error,
    };
  }

  return {
    type: ErrorType.AUTH,
    message: USER_FRIENDLY_MESSAGES.UNAUTHORIZED,
    originalError: error,
  };
}

/**
 * 네트워크 에러 처리
 */
export function handleNetworkError(error: any): StandardError {
  const message = error?.message?.toLowerCase() || '';

  if (message.includes('network') || message.includes('fetch')) {
    return {
      type: ErrorType.NETWORK,
      message: USER_FRIENDLY_MESSAGES.NETWORK_ERROR,
      originalError: error,
    };
  }

  if (message.includes('timeout')) {
    return {
      type: ErrorType.NETWORK,
      message: USER_FRIENDLY_MESSAGES.TIMEOUT,
      originalError: error,
    };
  }

  return {
    type: ErrorType.NETWORK,
    message: USER_FRIENDLY_MESSAGES.NETWORK_ERROR,
    originalError: error,
  };
}

/**
 * 일반 에러 처리
 */
export function handleError(error: any): StandardError {
  // null 또는 undefined 체크
  if (!error) {
    return {
      type: ErrorType.UNKNOWN,
      message: USER_FRIENDLY_MESSAGES.UNKNOWN_ERROR,
    };
  }

  // Supabase PostgrestError 체크
  if (error.code && error.message && error.details !== undefined) {
    return handleSupabaseError(error as PostgrestError);
  }

  // Auth 관련 에러 체크
  if (
    error.message?.includes('auth') ||
    error.message?.includes('login') ||
    error.message?.includes('jwt')
  ) {
    return handleAuthError(error);
  }

  // 네트워크 에러 체크
  if (
    error.message?.includes('network') ||
    error.message?.includes('fetch') ||
    error.message?.includes('timeout')
  ) {
    return handleNetworkError(error);
  }

  // 기본 에러 처리
  return {
    type: ErrorType.UNKNOWN,
    message: error.message || USER_FRIENDLY_MESSAGES.UNKNOWN_ERROR,
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

  // 예상 가능한 Auth 에러 메시지 패턴
  const expectedPatterns = [
    'invalid login credentials',
    'invalid_credentials',
    '이메일 또는 비밀번호가 올바르지 않습니다',
    'email not confirmed',
    'user already registered',
    '이미 가입된 이메일입니다',
  ];

  const messageOrCode =
    `${error.message} ${error.code} ${error.originalError?.message || ''}`.toLowerCase();

  return expectedPatterns.some(pattern => messageOrCode.includes(pattern.toLowerCase()));
}

/**
 * 에러 로깅 (개발 환경)
 * @param silent - true이면 콘솔에 출력하지 않음 (예상 가능한 Auth 에러는 자동으로 silent 처리)
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
 * 에러 토스트 메시지 표시를 위한 헬퍼
 * (실제 토스트 라이브러리와 연동 시 사용)
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
 * 에러 타입별 제목 반환
 */
function getErrorTitle(type: ErrorType): string {
  switch (type) {
    case ErrorType.NETWORK:
      return '네트워크 오류';
    case ErrorType.AUTH:
      return '인증 오류';
    case ErrorType.VALIDATION:
      return '입력 오류';
    case ErrorType.PERMISSION:
      return '권한 오류';
    case ErrorType.NOT_FOUND:
      return '찾을 수 없음';
    case ErrorType.CONFLICT:
      return '중복 오류';
    case ErrorType.SERVER:
      return '서버 오류';
    default:
      return '오류';
  }
}

/**
 * 재시도 가능한 에러인지 확인
 */
export function isRetryableError(error: StandardError): boolean {
  return [ErrorType.NETWORK, ErrorType.SERVER].includes(error.type);
}

/**
 * 로그인이 필요한 에러인지 확인
 */
export function isAuthRequired(error: StandardError): boolean {
  return error.type === ErrorType.AUTH || error.type === ErrorType.PERMISSION;
}

// Export default handler for convenience
export default {
  handle: handleError,
  handleSupabase: handleSupabaseError,
  handleAuth: handleAuthError,
  handleNetwork: handleNetworkError,
  log: logError,
  isRetryable: isRetryableError,
  isAuthRequired,
};
