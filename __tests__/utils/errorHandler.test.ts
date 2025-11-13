import {
  handleError,
  isRetryableError,
  isAuthRequired,
  logError,
  ErrorType,
  StandardError,
} from '@/utils/errorHandler';

// Mock console methods
const originalConsole = { ...console };
beforeAll(() => {
  console.error = jest.fn();
  console.log = jest.fn();
  console.warn = jest.fn();
  console.group = jest.fn();
  console.groupEnd = jest.fn();
});

afterAll(() => {
  console.error = originalConsole.error;
  console.log = originalConsole.log;
  console.warn = originalConsole.warn;
  console.group = originalConsole.group;
  console.groupEnd = originalConsole.groupEnd;
});

describe('errorHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('handleError - Supabase errors', () => {
    it('handles CONFLICT error (23505) - duplicate key', () => {
      const error = {
        code: '23505',
        message: 'duplicate key value violates unique constraint',
        details: 'Key (email)=(test@test.com) already exists.',
      };
      const result = handleError(error);
      expect(result.type).toBe(ErrorType.CONFLICT);
      expect(result.message).toBe('이미 가입된 이메일입니다.');
      expect(result.code).toBe('23505');
    });

    it('handles CONFLICT error (23505) - generic duplicate', () => {
      const error = {
        code: '23505',
        message: 'duplicate key',
        details: 'Some other key',
      };
      const result = handleError(error);
      expect(result.type).toBe(ErrorType.CONFLICT);
      expect(result.message).toBe('이미 존재하는 데이터입니다.');
    });

    it('handles VALIDATION error (23502) - not null violation', () => {
      const error = {
        code: '23502',
        message: 'null value in column "name" violates not-null constraint',
        details: '',
      };
      const result = handleError(error);
      expect(result.type).toBe(ErrorType.VALIDATION);
      expect(result.message).toBe('필수 항목을 입력해주세요.');
    });

    it('handles VALIDATION error (23514) - check constraint', () => {
      const error = {
        code: '23514',
        message: 'check constraint violation',
        details: '',
      };
      const result = handleError(error);
      expect(result.type).toBe(ErrorType.VALIDATION);
      expect(result.message).toBe('입력한 정보가 올바르지 않습니다.');
    });

    it('handles AUTH error (PGRST301) - JWT expired', () => {
      const error = {
        code: 'PGRST301',
        message: 'JWT expired',
        details: '',
      };
      const result = handleError(error);
      expect(result.type).toBe(ErrorType.AUTH);
      expect(result.message).toBe('세션이 만료되었습니다. 다시 로그인해주세요.');
    });

    it('handles PERMISSION error (42501)', () => {
      const error = {
        code: '42501',
        message: 'insufficient privilege',
        details: '',
      };
      const result = handleError(error);
      expect(result.type).toBe(ErrorType.PERMISSION);
      expect(result.message).toBe('이 작업을 수행할 권한이 없습니다.');
    });

    it('handles NOT_FOUND error (42P01)', () => {
      const error = {
        code: '42P01',
        message: 'relation "users" does not exist',
        details: '',
      };
      const result = handleError(error);
      expect(result.type).toBe(ErrorType.NOT_FOUND);
      expect(result.message).toBe('요청한 정보를 찾을 수 없습니다.');
    });

    it('handles unknown Supabase error codes', () => {
      const error = {
        code: 'UNKNOWN_CODE',
        message: 'Something went wrong',
        details: '',
      };
      const result = handleError(error);
      expect(result.type).toBe(ErrorType.SERVER);
      expect(result.message).toBe('서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
    });
  });

  describe('handleError - Auth errors', () => {
    it('handles email not confirmed error', () => {
      const error = new Error('Email not confirmed');
      const result = handleError(error);
      expect(result.type).toBe(ErrorType.AUTH);
      expect(result.message).toBe('이메일 인증이 필요합니다. 인증 메일을 확인해주세요.');
    });

    it('handles invalid login credentials error', () => {
      const error = new Error('Invalid login credentials');
      const result = handleError(error);
      expect(result.type).toBe(ErrorType.AUTH);
      expect(result.message).toBe('이메일 또는 비밀번호가 올바르지 않습니다.');
    });

    it('handles user already registered error', () => {
      const error = new Error('User already registered');
      const result = handleError(error);
      expect(result.type).toBe(ErrorType.CONFLICT);
      expect(result.message).toBe('이미 가입된 이메일입니다.');
    });

    it('handles JWT expired error', () => {
      const error = new Error('JWT token expired');
      const result = handleError(error);
      expect(result.type).toBe(ErrorType.AUTH);
      expect(result.message).toBe('인증 토큰이 만료되었거나 유효하지 않습니다.');
    });

    it('handles invalid token error', () => {
      const error = new Error('Invalid JWT token');
      const result = handleError(error);
      expect(result.type).toBe(ErrorType.AUTH);
      expect(result.message).toBe('인증 토큰이 만료되었거나 유효하지 않습니다.');
    });

    it('handles session expired error', () => {
      const error = new Error('Session has expired');
      const result = handleError(error);
      expect(result.type).toBe(ErrorType.AUTH);
      expect(result.message).toBe('세션이 만료되었습니다. 다시 로그인해주세요.');
    });
  });

  describe('handleError - Network errors', () => {
    it('handles network request failed error', () => {
      const error = new Error('Network request failed');
      const result = handleError(error);
      expect(result.type).toBe(ErrorType.NETWORK);
      expect(result.message).toBe('네트워크 연결에 문제가 있습니다. 인터넷 연결을 확인해주세요.');
    });

    it('handles fetch error', () => {
      const error = new Error('Failed to fetch');
      const result = handleError(error);
      expect(result.type).toBe(ErrorType.NETWORK);
      expect(result.message).toBe('네트워크 연결에 문제가 있습니다. 인터넷 연결을 확인해주세요.');
    });

    it('handles timeout error', () => {
      const error = new Error('Request timeout exceeded');
      const result = handleError(error);
      expect(result.type).toBe(ErrorType.NETWORK);
      expect(result.message).toBe('요청 시간이 초과되었습니다. 다시 시도해주세요.');
    });
  });

  describe('handleError - General cases', () => {
    it('handles null error', () => {
      const result = handleError(null);
      expect(result.type).toBe(ErrorType.UNKNOWN);
      expect(result.message).toBe('알 수 없는 오류가 발생했습니다. 다시 시도해주세요.');
    });

    it('handles undefined error', () => {
      const result = handleError(undefined);
      expect(result.type).toBe(ErrorType.UNKNOWN);
      expect(result.message).toBe('알 수 없는 오류가 발생했습니다. 다시 시도해주세요.');
    });

    it('handles generic Error object', () => {
      const error = new Error('Custom error message');
      const result = handleError(error);
      expect(result.type).toBe(ErrorType.UNKNOWN);
      expect(result.message).toBe('Custom error message');
      expect(result.originalError).toBe(error);
    });

    it('handles non-Error objects', () => {
      const result = handleError({ foo: 'bar' });
      expect(result.type).toBe(ErrorType.UNKNOWN);
      expect(result.message).toBe('알 수 없는 오류가 발생했습니다. 다시 시도해주세요.');
    });

    it('preserves originalError', () => {
      const error = new Error('Test error');
      const result = handleError(error);
      expect(result.originalError).toBe(error);
    });
  });

  describe('isRetryableError', () => {
    it('returns true for NETWORK errors', () => {
      const error: StandardError = {
        type: ErrorType.NETWORK,
        message: 'Network error',
      };
      expect(isRetryableError(error)).toBe(true);
    });

    it('returns true for SERVER errors', () => {
      const error: StandardError = {
        type: ErrorType.SERVER,
        message: 'Server error',
      };
      expect(isRetryableError(error)).toBe(true);
    });

    it('returns false for AUTH errors', () => {
      const error: StandardError = {
        type: ErrorType.AUTH,
        message: 'Auth error',
      };
      expect(isRetryableError(error)).toBe(false);
    });

    it('returns false for VALIDATION errors', () => {
      const error: StandardError = {
        type: ErrorType.VALIDATION,
        message: 'Validation error',
      };
      expect(isRetryableError(error)).toBe(false);
    });

    it('returns false for PERMISSION errors', () => {
      const error: StandardError = {
        type: ErrorType.PERMISSION,
        message: 'Permission error',
      };
      expect(isRetryableError(error)).toBe(false);
    });
  });

  describe('isAuthRequired', () => {
    it('returns true for AUTH errors', () => {
      const error: StandardError = {
        type: ErrorType.AUTH,
        message: 'Auth required',
      };
      expect(isAuthRequired(error)).toBe(true);
    });

    it('returns true for PERMISSION errors', () => {
      const error: StandardError = {
        type: ErrorType.PERMISSION,
        message: 'No permission',
      };
      expect(isAuthRequired(error)).toBe(true);
    });

    it('returns false for NETWORK errors', () => {
      const error: StandardError = {
        type: ErrorType.NETWORK,
        message: 'Network error',
      };
      expect(isAuthRequired(error)).toBe(false);
    });

    it('returns false for VALIDATION errors', () => {
      const error: StandardError = {
        type: ErrorType.VALIDATION,
        message: 'Validation error',
      };
      expect(isAuthRequired(error)).toBe(false);
    });
  });

  describe('logError', () => {
    it('logs non-auth errors with details in development mode', () => {
      const error: StandardError = {
        type: ErrorType.SERVER,
        message: 'Server error',
        code: 'TEST_ERROR',
        details: { info: 'test' },
      };

      logError(error, 'TestComponent');

      expect(console.group).toHaveBeenCalledWith('🚨 Error in TestComponent');
      expect(console.error).toHaveBeenCalledWith('Type:', ErrorType.SERVER);
      expect(console.error).toHaveBeenCalledWith('Message:', 'Server error');
      expect(console.error).toHaveBeenCalledWith('Code:', 'TEST_ERROR');
      expect(console.groupEnd).toHaveBeenCalled();
    });

    it('logs expected auth errors silently', () => {
      const error: StandardError = {
        type: ErrorType.AUTH,
        message: '이메일 또는 비밀번호가 올바르지 않습니다.',
      };

      logError(error, 'Login');

      expect(console.log).toHaveBeenCalledWith(
        'ℹ️ Login: 이메일 또는 비밀번호가 올바르지 않습니다.',
        '',
      );
      expect(console.group).not.toHaveBeenCalled();
    });

    it('respects silent parameter', () => {
      const error: StandardError = {
        type: ErrorType.SERVER,
        message: 'Server error',
      };

      logError(error, 'TestComponent', true);

      expect(console.log).toHaveBeenCalled();
      expect(console.group).not.toHaveBeenCalled();
    });

    it('logs without context', () => {
      const error: StandardError = {
        type: ErrorType.NETWORK,
        message: 'Network error',
      };

      logError(error);

      expect(console.group).toHaveBeenCalledWith('🚨 Error');
    });
  });
});
