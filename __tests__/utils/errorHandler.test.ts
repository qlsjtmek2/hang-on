import {
  handleSupabaseError,
  handleAuthError,
  handleNetworkError,
  handleError,
  isRetryableError,
  isAuthRequired,
  logError,
  StandardError,
} from '@/utils/errorHandler';

// Mock console methods
const originalConsole = { ...console };
beforeAll(() => {
  console.error = jest.fn();
  console.log = jest.fn();
  console.warn = jest.fn();
});

afterAll(() => {
  console.error = originalConsole.error;
  console.log = originalConsole.log;
  console.warn = originalConsole.warn;
});

describe('errorHandler', () => {
  describe('handleSupabaseError', () => {
    it('handles CONFLICT error (23505)', () => {
      const error = {
        code: '23505',
        message: 'duplicate key value violates unique constraint',
        details: 'Key already exists',
      };
      const result = handleSupabaseError(error);
      expect(result.code).toBe('CONFLICT');
      expect(result.userMessage).toBe('이미 존재하는 데이터입니다');
      expect(result.isRetryable).toBe(false);
    });

    it('handles VALIDATION error (23502)', () => {
      const error = {
        code: '23502',
        message: 'null value in column "name" violates not-null constraint',
      };
      const result = handleSupabaseError(error);
      expect(result.code).toBe('VALIDATION');
      expect(result.userMessage).toBe('입력 데이터가 올바르지 않습니다');
      expect(result.isRetryable).toBe(false);
    });

    it('handles AUTH error (PGRST301)', () => {
      const error = {
        code: 'PGRST301',
        message: 'JWT expired',
      };
      const result = handleSupabaseError(error);
      expect(result.code).toBe('AUTH');
      expect(result.userMessage).toBe('다시 로그인해주세요');
      expect(result.requiresAuth).toBe(true);
    });

    it('handles PERMISSION error (42501)', () => {
      const error = {
        code: '42501',
        message: 'insufficient privilege',
      };
      const result = handleSupabaseError(error);
      expect(result.code).toBe('PERMISSION');
      expect(result.userMessage).toBe('권한이 없습니다');
      expect(result.isRetryable).toBe(false);
    });

    it('handles NOT_FOUND error (42P01)', () => {
      const error = {
        code: '42P01',
        message: 'relation "users" does not exist',
      };
      const result = handleSupabaseError(error);
      expect(result.code).toBe('NOT_FOUND');
      expect(result.userMessage).toBe('요청한 데이터를 찾을 수 없습니다');
    });

    it('handles CHECK_VIOLATION error (23514)', () => {
      const error = {
        code: '23514',
        message: 'new row violates check constraint',
      };
      const result = handleSupabaseError(error);
      expect(result.code).toBe('VALIDATION');
      expect(result.userMessage).toBe('입력 데이터가 올바르지 않습니다');
    });

    it('handles FOREIGN_KEY error (23503)', () => {
      const error = {
        code: '23503',
        message: 'foreign key violation',
      };
      const result = handleSupabaseError(error);
      expect(result.code).toBe('REFERENCE');
      expect(result.userMessage).toBe('참조하는 데이터가 올바르지 않습니다');
    });

    it('handles CONNECTION error', () => {
      const error = {
        code: 'CONNECTION_ERROR',
        message: 'Could not connect to server',
      };
      const result = handleSupabaseError(error);
      expect(result.code).toBe('NETWORK');
      expect(result.userMessage).toBe('네트워크 연결을 확인해주세요');
      expect(result.isRetryable).toBe(true);
    });

    it('handles TIMEOUT error', () => {
      const error = {
        code: 'TIMEOUT',
        message: 'Request timeout',
      };
      const result = handleSupabaseError(error);
      expect(result.code).toBe('TIMEOUT');
      expect(result.userMessage).toBe('요청 시간이 초과되었습니다');
      expect(result.isRetryable).toBe(true);
    });

    it('handles unknown error codes', () => {
      const error = {
        code: 'UNKNOWN_CODE',
        message: 'Something went wrong',
      };
      const result = handleSupabaseError(error);
      expect(result.code).toBe('SERVER');
      expect(result.userMessage).toBe('서버 오류가 발생했습니다');
    });

    it('handles null error', () => {
      const result = handleSupabaseError(null);
      expect(result.code).toBe('UNKNOWN');
      expect(result.userMessage).toBe('알 수 없는 오류가 발생했습니다');
    });

    it('handles undefined error', () => {
      const result = handleSupabaseError(undefined);
      expect(result.code).toBe('UNKNOWN');
      expect(result.userMessage).toBe('알 수 없는 오류가 발생했습니다');
    });
  });

  describe('handleAuthError', () => {
    it('handles email not confirmed error', () => {
      const error = {
        message: 'Email not confirmed',
        status: 400,
      };
      const result = handleAuthError(error);
      expect(result.code).toBe('EMAIL_NOT_VERIFIED');
      expect(result.userMessage).toBe('이메일 인증이 필요합니다');
    });

    it('handles invalid credentials error', () => {
      const error = {
        message: 'Invalid login credentials',
      };
      const result = handleAuthError(error);
      expect(result.code).toBe('INVALID_CREDENTIALS');
      expect(result.userMessage).toBe('이메일 또는 비밀번호가 올바르지 않습니다');
    });

    it('handles user already registered error', () => {
      const error = {
        message: 'User already registered',
      };
      const result = handleAuthError(error);
      expect(result.code).toBe('USER_EXISTS');
      expect(result.userMessage).toBe('이미 가입된 사용자입니다');
    });

    it('handles weak password error', () => {
      const error = {
        message: 'Password should be at least 6 characters',
      };
      const result = handleAuthError(error);
      expect(result.code).toBe('WEAK_PASSWORD');
      expect(result.userMessage).toBe('비밀번호는 최소 6자 이상이어야 합니다');
    });

    it('handles expired token error', () => {
      const error = {
        message: 'Token has expired',
      };
      const result = handleAuthError(error);
      expect(result.code).toBe('TOKEN_EXPIRED');
      expect(result.userMessage).toBe('인증이 만료되었습니다');
      expect(result.requiresAuth).toBe(true);
    });

    it('handles refresh token error', () => {
      const error = {
        message: 'Invalid refresh token',
      };
      const result = handleAuthError(error);
      expect(result.code).toBe('INVALID_TOKEN');
      expect(result.userMessage).toBe('인증 토큰이 유효하지 않습니다');
      expect(result.requiresAuth).toBe(true);
    });

    it('handles rate limit error', () => {
      const error = {
        message: 'Rate limit exceeded',
      };
      const result = handleAuthError(error);
      expect(result.code).toBe('RATE_LIMIT');
      expect(result.userMessage).toBe('너무 많은 요청입니다. 잠시 후 다시 시도해주세요');
      expect(result.isRetryable).toBe(true);
    });

    it('handles generic auth error', () => {
      const error = {
        message: 'Authentication failed',
      };
      const result = handleAuthError(error);
      expect(result.code).toBe('AUTH');
      expect(result.userMessage).toBe('인증 오류가 발생했습니다');
    });
  });

  describe('handleNetworkError', () => {
    it('detects network failure', () => {
      const error = new Error('Network request failed');
      const result = handleNetworkError(error);
      expect(result.code).toBe('NETWORK');
      expect(result.userMessage).toBe('네트워크 연결을 확인해주세요');
      expect(result.isRetryable).toBe(true);
    });

    it('detects fetch error', () => {
      const error = new Error('Failed to fetch');
      const result = handleNetworkError(error);
      expect(result.code).toBe('NETWORK');
      expect(result.isRetryable).toBe(true);
    });

    it('detects timeout error', () => {
      const error = new Error('Request timeout');
      const result = handleNetworkError(error);
      expect(result.code).toBe('TIMEOUT');
      expect(result.userMessage).toBe('요청 시간이 초과되었습니다');
      expect(result.isRetryable).toBe(true);
    });

    it('detects CORS error', () => {
      const error = new Error('CORS policy blocked');
      const result = handleNetworkError(error);
      expect(result.code).toBe('CORS');
      expect(result.userMessage).toBe('서버 접근이 차단되었습니다');
    });

    it('detects offline state', () => {
      const error = new Error('No internet connection');
      const result = handleNetworkError(error);
      expect(result.code).toBe('OFFLINE');
      expect(result.userMessage).toBe('인터넷 연결이 없습니다');
      expect(result.isRetryable).toBe(true);
    });

    it('returns null for non-network errors', () => {
      const error = new Error('Some other error');
      const result = handleNetworkError(error);
      expect(result).toBeNull();
    });
  });

  describe('handleError', () => {
    it('integrates Supabase error handling', () => {
      const error = {
        code: '23505',
        message: 'duplicate key',
      };
      const result = handleError(error);
      expect(result.code).toBe('CONFLICT');
      expect(result.source).toBe('supabase');
    });

    it('integrates Auth error handling', () => {
      const error = {
        message: 'Invalid login credentials',
      };
      const result = handleError(error);
      expect(result.code).toBe('INVALID_CREDENTIALS');
      expect(result.source).toBe('auth');
    });

    it('integrates Network error handling', () => {
      const error = new Error('Network request failed');
      const result = handleError(error);
      expect(result.code).toBe('NETWORK');
      expect(result.source).toBe('network');
    });

    it('handles JavaScript Error objects', () => {
      const error = new Error('Custom error message');
      const result = handleError(error);
      expect(result.originalMessage).toBe('Custom error message');
    });

    it('handles string errors', () => {
      const result = handleError('String error');
      expect(result.originalMessage).toBe('String error');
      expect(result.code).toBe('UNKNOWN');
    });

    it('handles null errors', () => {
      const result = handleError(null);
      expect(result.code).toBe('UNKNOWN');
      expect(result.userMessage).toBe('알 수 없는 오류가 발생했습니다');
    });

    it('handles undefined errors', () => {
      const result = handleError(undefined);
      expect(result.code).toBe('UNKNOWN');
      expect(result.userMessage).toBe('알 수 없는 오류가 발생했습니다');
    });

    it('preserves error stack trace', () => {
      const error = new Error('Test error');
      const result = handleError(error);
      expect(result.stack).toBeDefined();
    });

    it('includes timestamp', () => {
      const result = handleError(new Error('Test'));
      expect(result.timestamp).toBeDefined();
      expect(new Date(result.timestamp).getTime()).toBeLessThanOrEqual(Date.now());
    });
  });

  describe('isRetryableError', () => {
    it('returns true for network errors', () => {
      const error: StandardError = {
        code: 'NETWORK',
        userMessage: 'Network error',
        originalMessage: 'Network error',
        isRetryable: true,
      };
      expect(isRetryableError(error)).toBe(true);
    });

    it('returns true for timeout errors', () => {
      const error: StandardError = {
        code: 'TIMEOUT',
        userMessage: 'Timeout',
        originalMessage: 'Timeout',
        isRetryable: true,
      };
      expect(isRetryableError(error)).toBe(true);
    });

    it('returns true for rate limit errors', () => {
      const error: StandardError = {
        code: 'RATE_LIMIT',
        userMessage: 'Rate limited',
        originalMessage: 'Rate limited',
        isRetryable: true,
      };
      expect(isRetryableError(error)).toBe(true);
    });

    it('returns false for validation errors', () => {
      const error: StandardError = {
        code: 'VALIDATION',
        userMessage: 'Invalid input',
        originalMessage: 'Invalid input',
        isRetryable: false,
      };
      expect(isRetryableError(error)).toBe(false);
    });

    it('returns false for permission errors', () => {
      const error: StandardError = {
        code: 'PERMISSION',
        userMessage: 'No permission',
        originalMessage: 'No permission',
        isRetryable: false,
      };
      expect(isRetryableError(error)).toBe(false);
    });

    it('checks isRetryable flag', () => {
      const error: StandardError = {
        code: 'CUSTOM',
        userMessage: 'Custom',
        originalMessage: 'Custom',
        isRetryable: true,
      };
      expect(isRetryableError(error)).toBe(true);
    });
  });

  describe('isAuthRequired', () => {
    it('returns true for auth errors', () => {
      const error: StandardError = {
        code: 'AUTH',
        userMessage: 'Auth required',
        originalMessage: 'Auth required',
        requiresAuth: true,
      };
      expect(isAuthRequired(error)).toBe(true);
    });

    it('returns true for token expired', () => {
      const error: StandardError = {
        code: 'TOKEN_EXPIRED',
        userMessage: 'Token expired',
        originalMessage: 'Token expired',
        requiresAuth: true,
      };
      expect(isAuthRequired(error)).toBe(true);
    });

    it('returns true for invalid token', () => {
      const error: StandardError = {
        code: 'INVALID_TOKEN',
        userMessage: 'Invalid token',
        originalMessage: 'Invalid token',
        requiresAuth: true,
      };
      expect(isAuthRequired(error)).toBe(true);
    });

    it('returns false for other errors', () => {
      const error: StandardError = {
        code: 'NETWORK',
        userMessage: 'Network error',
        originalMessage: 'Network error',
      };
      expect(isAuthRequired(error)).toBe(false);
    });

    it('checks requiresAuth flag', () => {
      const error: StandardError = {
        code: 'CUSTOM',
        userMessage: 'Custom',
        originalMessage: 'Custom',
        requiresAuth: true,
      };
      expect(isAuthRequired(error)).toBe(true);
    });
  });

  describe('logError', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('logs error in development mode', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const error: StandardError = {
        code: 'TEST_ERROR',
        userMessage: 'Test error',
        originalMessage: 'Original test error',
      };

      logError(error, 'TestComponent');

      expect(console.error).toHaveBeenCalledWith('[TestComponent] Error:', error);

      process.env.NODE_ENV = originalEnv;
    });

    it('does not log in production mode', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const error: StandardError = {
        code: 'TEST_ERROR',
        userMessage: 'Test error',
        originalMessage: 'Original test error',
      };

      logError(error, 'TestComponent');

      expect(console.error).not.toHaveBeenCalled();

      process.env.NODE_ENV = originalEnv;
    });

    it('logs with default context when not provided', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const error: StandardError = {
        code: 'TEST_ERROR',
        userMessage: 'Test error',
        originalMessage: 'Original test error',
      };

      logError(error);

      expect(console.error).toHaveBeenCalledWith('[Unknown] Error:', error);

      process.env.NODE_ENV = originalEnv;
    });
  });
});
