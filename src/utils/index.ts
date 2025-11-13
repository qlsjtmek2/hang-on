/**
 * 유틸리티 함수 모음
 */

// 날짜 포맷터
export {
  formatRelativeTime,
  formatAbsoluteTime,
  formatTime,
  formatDate,
  formatDateWithDay,
  formatSmartTime,
  formatDateDifference,
  defaultFormatTime,
} from './dateFormatter';

export type { DateFormatterOptions } from './dateFormatter';

// 에러 핸들러
export {
  ErrorType,
  handleError,
  logError,
  getErrorToastConfig,
  isRetryableError,
  isAuthRequired,
} from './errorHandler';

export type { StandardError } from './errorHandler';

// 기본 export
import errorHandler from './errorHandler';
export { errorHandler };
