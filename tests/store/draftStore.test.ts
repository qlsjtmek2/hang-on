/**
 * Draft Store Tests
 */

import { act, renderHook } from '@testing-library/react-native';

import { useDraftStore, hasDraft, getDraftAgeMinutes, isDraftStale } from '@/store/draftStore';

// AsyncStorage mock
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

describe('draftStore', () => {
  beforeEach(() => {
    // 각 테스트 전 store 초기화
    const { result } = renderHook(() => useDraftStore());
    act(() => {
      result.current.clearDraft();
    });
  });

  describe('saveDraft', () => {
    it('saves draft with emotion level and content', () => {
      const { result } = renderHook(() => useDraftStore());

      act(() => {
        result.current.saveDraft(3, '테스트 내용입니다');
      });

      expect(result.current.draft).not.toBeNull();
      expect(result.current.draft?.emotionLevel).toBe(3);
      expect(result.current.draft?.content).toBe('테스트 내용입니다');
      expect(result.current.draft?.lastSavedAt).toBeDefined();
    });

    it('does not save empty content', () => {
      const { result } = renderHook(() => useDraftStore());

      act(() => {
        result.current.saveDraft(3, '');
      });

      expect(result.current.draft).toBeNull();
    });

    it('does not save whitespace-only content', () => {
      const { result } = renderHook(() => useDraftStore());

      act(() => {
        result.current.saveDraft(3, '   ');
      });

      expect(result.current.draft).toBeNull();
    });

    it('updates lastSavedAt on each save', () => {
      const { result } = renderHook(() => useDraftStore());

      act(() => {
        result.current.saveDraft(3, '첫 번째 저장');
      });

      const firstSaveTime = result.current.draft?.lastSavedAt;

      // 시간 경과를 시뮬레이션
      jest.advanceTimersByTime(1000);

      act(() => {
        result.current.saveDraft(3, '두 번째 저장');
      });

      expect(result.current.draft?.lastSavedAt).toBeGreaterThanOrEqual(firstSaveTime!);
    });
  });

  describe('clearDraft', () => {
    it('clears saved draft', () => {
      const { result } = renderHook(() => useDraftStore());

      act(() => {
        result.current.saveDraft(3, '테스트 내용');
      });

      expect(result.current.draft).not.toBeNull();

      act(() => {
        result.current.clearDraft();
      });

      expect(result.current.draft).toBeNull();
    });
  });

  describe('hasDraft', () => {
    it('returns false when no draft exists', () => {
      expect(hasDraft()).toBe(false);
    });

    it('returns true when draft exists with content', () => {
      const { result } = renderHook(() => useDraftStore());

      act(() => {
        result.current.saveDraft(3, '테스트 내용');
      });

      expect(hasDraft()).toBe(true);
    });
  });

  describe('getDraftAgeMinutes', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('returns 0 when no draft exists', () => {
      expect(getDraftAgeMinutes()).toBe(0);
    });

    it('returns correct age in minutes', () => {
      const { result } = renderHook(() => useDraftStore());

      const now = Date.now();
      jest.setSystemTime(now);

      act(() => {
        result.current.saveDraft(3, '테스트 내용');
      });

      // 5분 경과
      jest.setSystemTime(now + 5 * 60 * 1000);

      expect(getDraftAgeMinutes()).toBe(5);
    });
  });

  describe('isDraftStale', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('returns false for fresh draft', () => {
      const { result } = renderHook(() => useDraftStore());
      const now = Date.now();
      jest.setSystemTime(now);

      act(() => {
        result.current.saveDraft(3, '테스트 내용');
      });

      expect(isDraftStale()).toBe(false);
    });

    it('returns true for draft older than 24 hours', () => {
      const { result } = renderHook(() => useDraftStore());
      const now = Date.now();
      jest.setSystemTime(now);

      act(() => {
        result.current.saveDraft(3, '테스트 내용');
      });

      // 25시간 경과
      jest.setSystemTime(now + 25 * 60 * 60 * 1000);

      expect(isDraftStale()).toBe(true);
    });
  });

  describe('setLoading', () => {
    it('sets loading state', () => {
      const { result } = renderHook(() => useDraftStore());

      expect(result.current.isLoading).toBe(false);

      act(() => {
        result.current.setLoading(true);
      });

      expect(result.current.isLoading).toBe(true);

      act(() => {
        result.current.setLoading(false);
      });

      expect(result.current.isLoading).toBe(false);
    });
  });
});
