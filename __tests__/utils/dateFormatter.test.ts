import {
  formatRelativeTime,
  formatAbsoluteTime,
  formatDate,
  formatDateWithDay,
  formatSmartTime,
  formatDateDifference,
} from '@/utils/dateFormatter';

describe('dateFormatter', () => {
  // Mock current date for consistent testing
  const mockNow = new Date('2024-11-10T12:00:00Z');

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(mockNow);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('formatRelativeTime', () => {
    it('returns "방금 전" for time less than 10 seconds ago', () => {
      const date = new Date('2024-11-10T11:59:55Z');
      expect(formatRelativeTime(date)).toBe('방금 전');
    });

    it('returns "N초 전" for 10-59 seconds ago', () => {
      const date = new Date('2024-11-10T11:59:30Z');
      expect(formatRelativeTime(date)).toBe('30초 전');
    });

    it('returns "N분 전" for 1-59 minutes ago', () => {
      const date = new Date('2024-11-10T11:30:00Z');
      expect(formatRelativeTime(date)).toBe('30분 전');
    });

    it('returns "N시간 전" for 1-23 hours ago', () => {
      const date = new Date('2024-11-10T06:00:00Z');
      expect(formatRelativeTime(date)).toBe('6시간 전');
    });

    it('returns "어제" for yesterday', () => {
      const date = new Date('2024-11-09T15:00:00Z');
      expect(formatRelativeTime(date)).toBe('어제');
    });

    it('returns "그저께" for 2 days ago', () => {
      const date = new Date('2024-11-08T15:00:00Z');
      expect(formatRelativeTime(date)).toBe('그저께');
    });

    it('returns "N일 전" for 3-6 days ago', () => {
      const date = new Date('2024-11-06T12:00:00Z');
      expect(formatRelativeTime(date)).toBe('4일 전');
    });

    it('returns "N주일 전" for 1-3 weeks ago', () => {
      const date = new Date('2024-10-27T12:00:00Z');
      expect(formatRelativeTime(date)).toBe('2주일 전');
    });

    it('returns "N개월 전" for 1-11 months ago', () => {
      const date = new Date('2024-08-10T12:00:00Z');
      expect(formatRelativeTime(date)).toBe('3개월 전');
    });

    it('returns "N년 전" for years ago', () => {
      const date = new Date('2022-11-10T12:00:00Z');
      expect(formatRelativeTime(date)).toBe('2년 전');
    });

    it('returns absolute time for future dates', () => {
      const date = new Date('2024-11-11T12:00:00Z');
      const result = formatRelativeTime(date);
      expect(result).toMatch(/2024년|11월/);
    });

    it('handles string input', () => {
      const dateString = '2024-11-10T11:59:30Z';
      expect(formatRelativeTime(dateString)).toBe('30초 전');
    });

    it('handles timestamp input', () => {
      const timestamp = new Date('2024-11-10T11:59:30Z').getTime();
      expect(formatRelativeTime(timestamp)).toBe('30초 전');
    });
  });

  describe('formatAbsoluteTime', () => {
    it('returns "오늘" prefix for today', () => {
      const date = new Date('2024-11-10T09:30:00Z');
      expect(formatAbsoluteTime(date)).toBe('오늘 오전 9:30');
    });

    it('returns "어제" prefix for yesterday', () => {
      const date = new Date('2024-11-09T14:30:00Z');
      expect(formatAbsoluteTime(date)).toBe('어제 오후 2:30');
    });

    it('returns "내일" prefix for tomorrow', () => {
      const date = new Date('2024-11-11T10:30:00Z');
      expect(formatAbsoluteTime(date)).toBe('내일 오전 10:30');
    });

    it('returns month and day for this year', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      expect(formatAbsoluteTime(date)).toBe('1월 15일');
    });

    it('returns full date for different years', () => {
      const date = new Date('2023-01-15T10:30:00Z');
      expect(formatAbsoluteTime(date)).toBe('2023년 1월 15일');
    });

    it('handles midnight correctly', () => {
      const date = new Date('2024-11-10T00:00:00Z');
      expect(formatAbsoluteTime(date)).toBe('오늘 오전 12:00');
    });

    it('handles noon correctly', () => {
      const date = new Date('2024-11-10T12:00:00Z');
      expect(formatAbsoluteTime(date)).toBe('오늘 오후 12:00');
    });
  });

  describe('formatDate', () => {
    const testDate = new Date('2024-01-15T14:30:00Z');

    it('formats date in full format', () => {
      expect(formatDate(testDate, 'full')).toBe('2024년 1월 15일');
    });

    it('formats date in short format', () => {
      expect(formatDate(testDate, 'short')).toBe('1월 15일');
    });

    it('formats date in numeric format', () => {
      expect(formatDate(testDate, 'numeric')).toBe('2024.01.15');
    });

    it('defaults to full format', () => {
      expect(formatDate(testDate)).toBe('2024년 1월 15일');
    });

    it('handles string input', () => {
      expect(formatDate('2024-01-15T14:30:00Z', 'numeric')).toBe('2024.01.15');
    });
  });

  describe('formatDateWithDay', () => {
    it('includes day of week', () => {
      const date = new Date('2024-11-10T12:00:00Z'); // Sunday
      expect(formatDateWithDay(date)).toBe('2024년 11월 10일 (일)');
    });

    it('formats correctly for Monday', () => {
      const date = new Date('2024-11-11T12:00:00Z');
      expect(formatDateWithDay(date)).toBe('2024년 11월 11일 (월)');
    });

    it('formats correctly for Saturday', () => {
      const date = new Date('2024-11-09T12:00:00Z');
      expect(formatDateWithDay(date)).toBe('2024년 11월 9일 (토)');
    });
  });

  describe('formatSmartTime', () => {
    it('uses relative time for recent dates', () => {
      const date = new Date('2024-11-10T11:59:00Z');
      expect(formatSmartTime(date)).toBe('1분 전');
    });

    it('uses relative time for dates within a week', () => {
      const date = new Date('2024-11-08T12:00:00Z');
      expect(formatSmartTime(date)).toBe('그저께');
    });

    it('uses absolute time for older dates', () => {
      const date = new Date('2024-10-10T12:00:00Z');
      expect(formatSmartTime(date)).toBe('10월 10일');
    });

    it('shows year for dates in different years', () => {
      const date = new Date('2023-10-10T12:00:00Z');
      expect(formatSmartTime(date)).toBe('2023년 10월 10일');
    });

    it('handles future dates', () => {
      const date = new Date('2024-11-11T12:00:00Z');
      expect(formatSmartTime(date)).toBe('내일 오후 12:00');
    });
  });

  describe('formatDateDifference', () => {
    it('calculates days difference correctly', () => {
      const start = new Date('2024-11-01T12:00:00Z');
      const end = new Date('2024-11-10T12:00:00Z');
      expect(formatDateDifference(start, end)).toBe('9일');
    });

    it('returns "오늘" for same day', () => {
      const start = new Date('2024-11-10T08:00:00Z');
      const end = new Date('2024-11-10T18:00:00Z');
      expect(formatDateDifference(start, end)).toBe('오늘');
    });

    it('returns "1일" for next day', () => {
      const start = new Date('2024-11-10T12:00:00Z');
      const end = new Date('2024-11-11T12:00:00Z');
      expect(formatDateDifference(start, end)).toBe('1일');
    });

    it('handles negative differences', () => {
      const start = new Date('2024-11-10T12:00:00Z');
      const end = new Date('2024-11-01T12:00:00Z');
      expect(formatDateDifference(start, end)).toBe('-9일');
    });

    it('handles string inputs', () => {
      const start = '2024-11-01T12:00:00Z';
      const end = '2024-11-10T12:00:00Z';
      expect(formatDateDifference(start, end)).toBe('9일');
    });
  });

  describe('Edge cases', () => {
    it('handles invalid dates gracefully', () => {
      const invalidDate = new Date('invalid');
      expect(formatRelativeTime(invalidDate)).toBe('');
      expect(formatAbsoluteTime(invalidDate)).toBe('');
      expect(formatDate(invalidDate)).toBe('');
    });

    it('handles null input', () => {
      expect(formatRelativeTime(null as any)).toBe('');
      expect(formatAbsoluteTime(null as any)).toBe('');
      expect(formatDate(null as any)).toBe('');
    });

    it('handles undefined input', () => {
      expect(formatRelativeTime(undefined as any)).toBe('');
      expect(formatAbsoluteTime(undefined as any)).toBe('');
      expect(formatDate(undefined as any)).toBe('');
    });

    it('handles empty string input', () => {
      expect(formatRelativeTime('')).toBe('');
      expect(formatAbsoluteTime('')).toBe('');
      expect(formatDate('')).toBe('');
    });

    it('handles very old dates', () => {
      const oldDate = new Date('1900-01-01T00:00:00Z');
      expect(formatRelativeTime(oldDate)).toBe('124년 전');
      expect(formatAbsoluteTime(oldDate)).toBe('1900년 1월 1일');
    });

    it('handles very future dates', () => {
      const futureDate = new Date('2100-01-01T00:00:00Z');
      expect(formatAbsoluteTime(futureDate)).toBe('2100년 1월 1일');
      expect(formatSmartTime(futureDate)).toBe('2100년 1월 1일');
    });
  });
});