/**
 * 날짜 포맷터 유틸리티
 * 상대적 시간 표시와 절대적 시간 표시를 지원합니다.
 */

export interface DateFormatterOptions {
  showSeconds?: boolean;
  use24Hour?: boolean;
  showYear?: boolean;
  shortFormat?: boolean;
}

/**
 * Date 객체 또는 문자열을 Date 객체로 변환
 */
const toDate = (date: Date | string | number): Date => {
  if (date instanceof Date) {
    return date;
  }
  return new Date(date);
};

/**
 * 상대적 시간 표시 ("5분 전", "어제", "3일 전" 등)
 */
export function formatRelativeTime(date: Date | string | number): string {
  const d = toDate(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);
  const diffWeek = Math.floor(diffMs / 604800000);
  const diffMonth = Math.floor(diffMs / 2592000000); // 약 30일
  const diffYear = Math.floor(diffMs / 31536000000); // 약 365일

  // 미래 시간인 경우
  if (diffMs < 0) {
    return formatAbsoluteTime(d);
  }

  // 1분 미만
  if (diffSec < 60) {
    if (diffSec < 10) return '방금 전';
    return `${diffSec}초 전`;
  }

  // 1시간 미만
  if (diffMin < 60) {
    return `${diffMin}분 전`;
  }

  // 1일 미만
  if (diffHour < 24) {
    if (diffHour === 1) return '1시간 전';
    return `${diffHour}시간 전`;
  }

  // 1주일 미만
  if (diffDay < 7) {
    if (diffDay === 1) return '어제';
    if (diffDay === 2) return '그저께';
    return `${diffDay}일 전`;
  }

  // 1개월 미만
  if (diffWeek < 4) {
    if (diffWeek === 1) return '1주일 전';
    return `${diffWeek}주일 전`;
  }

  // 1년 미만
  if (diffMonth < 12) {
    if (diffMonth === 1) return '1개월 전';
    return `${diffMonth}개월 전`;
  }

  // 1년 이상
  if (diffYear === 1) return '1년 전';
  return `${diffYear}년 전`;
}

/**
 * 절대적 시간 표시 ("오늘 오전 10:30", "어제 오후 5:20", "1월 15일" 등)
 */
export function formatAbsoluteTime(
  date: Date | string | number,
  options: DateFormatterOptions = {},
): string {
  const { use24Hour = false, showYear = false, shortFormat = false } = options;
  const d = toDate(date);
  const now = new Date();

  // 오늘인지 확인
  const isToday =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();

  // 어제인지 확인
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday =
    d.getDate() === yesterday.getDate() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getFullYear() === yesterday.getFullYear();

  // 내일인지 확인
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const isTomorrow =
    d.getDate() === tomorrow.getDate() &&
    d.getMonth() === tomorrow.getMonth() &&
    d.getFullYear() === tomorrow.getFullYear();

  // 시간 포맷팅
  const hours = d.getHours();
  const minutes = d.getMinutes();
  const timeStr = formatTime(hours, minutes, use24Hour);

  if (isToday) {
    return shortFormat ? timeStr : `오늘 ${timeStr}`;
  }

  if (isYesterday) {
    return shortFormat ? `어제 ${timeStr}` : `어제 ${timeStr}`;
  }

  if (isTomorrow) {
    return shortFormat ? `내일 ${timeStr}` : `내일 ${timeStr}`;
  }

  // 올해인지 확인
  const isThisYear = d.getFullYear() === now.getFullYear();

  // 날짜 포맷팅
  const month = d.getMonth() + 1;
  const day = d.getDate();

  if (isThisYear && !showYear) {
    return shortFormat ? `${month}/${day}` : `${month}월 ${day}일 ${timeStr}`;
  }

  const year = d.getFullYear();
  return shortFormat ? `${year}.${month}.${day}` : `${year}년 ${month}월 ${day}일 ${timeStr}`;
}

/**
 * 시간 포맷팅 (오전/오후 또는 24시간 형식)
 */
export function formatTime(hours: number, minutes: number, use24Hour: boolean = false): string {
  const minuteStr = minutes.toString().padStart(2, '0');

  if (use24Hour) {
    const hourStr = hours.toString().padStart(2, '0');
    return `${hourStr}:${minuteStr}`;
  }

  const period = hours >= 12 ? '오후' : '오전';
  const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  return `${period} ${displayHour}:${minuteStr}`;
}

/**
 * 날짜만 포맷팅 ("2024년 1월 15일", "1/15", "2024.1.15" 등)
 */
export function formatDate(
  date: Date | string | number,
  format: 'full' | 'short' | 'numeric' = 'full',
): string {
  const d = toDate(date);
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();

  switch (format) {
    case 'short':
      return `${month}/${day}`;
    case 'numeric':
      return `${year}.${month.toString().padStart(2, '0')}.${day.toString().padStart(2, '0')}`;
    case 'full':
    default:
      return `${year}년 ${month}월 ${day}일`;
  }
}

/**
 * 요일 포함 날짜 포맷팅
 */
export function formatDateWithDay(date: Date | string | number, showYear: boolean = true): string {
  const d = toDate(date);
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const dayOfWeek = days[d.getDay()];

  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();

  if (showYear) {
    return `${year}년 ${month}월 ${day}일 (${dayOfWeek})`;
  }
  return `${month}월 ${day}일 (${dayOfWeek})`;
}

/**
 * 스마트 포맷팅 (상황에 따라 최적의 형식 선택)
 * - 1시간 이내: 상대적 시간 ("5분 전")
 * - 오늘: "오늘 오전 10:30"
 * - 어제: "어제 오후 5:20"
 * - 이번 주: "월요일 오전 10:30"
 * - 올해: "1월 15일"
 * - 그 외: "2023년 1월 15일"
 */
export function formatSmartTime(
  date: Date | string | number,
  options: DateFormatterOptions = {},
): string {
  const d = toDate(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffHour = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);

  // 1시간 이내면 상대적 시간 표시
  if (diffHour < 1 && diffMs > 0) {
    return formatRelativeTime(d);
  }

  // 오늘이나 어제면 "오늘/어제 + 시간"
  if (diffDay <= 1) {
    return formatAbsoluteTime(d, { ...options, shortFormat: false });
  }

  // 일주일 이내면 요일과 시간 표시
  if (diffDay < 7 && diffMs > 0) {
    const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
    const dayOfWeek = days[d.getDay()];
    const hours = d.getHours();
    const minutes = d.getMinutes();
    const timeStr = formatTime(hours, minutes, options.use24Hour);
    return `${dayOfWeek} ${timeStr}`;
  }

  // 올해면 월일만 표시
  const isThisYear = d.getFullYear() === now.getFullYear();
  if (isThisYear) {
    return formatDate(d, 'full').replace(`${now.getFullYear()}년 `, '');
  }

  // 그 외는 전체 날짜 표시
  return formatDate(d, 'full');
}

/**
 * 두 날짜 사이의 차이를 텍스트로 표시
 */
export function formatDateDifference(
  startDate: Date | string | number,
  endDate: Date | string | number,
): string {
  const start = toDate(startDate);
  const end = toDate(endDate);
  const diffMs = Math.abs(end.getTime() - start.getTime());

  const days = Math.floor(diffMs / 86400000);
  const hours = Math.floor((diffMs % 86400000) / 3600000);
  const minutes = Math.floor((diffMs % 3600000) / 60000);

  if (days > 0) {
    if (hours > 0) {
      return `${days}일 ${hours}시간`;
    }
    return `${days}일`;
  }

  if (hours > 0) {
    if (minutes > 0) {
      return `${hours}시간 ${minutes}분`;
    }
    return `${hours}시간`;
  }

  return `${minutes}분`;
}

// RecordCard 컴포넌트에서 사용할 기본 포맷터 export
export const defaultFormatTime = formatSmartTime;
