/**
 * Draft Store - 임시 저장 상태 관리
 *
 * 글쓰기 중인 내용을 AsyncStorage에 자동 저장하여
 * 앱이 종료되어도 내용을 복구할 수 있습니다.
 *
 * 사용법:
 * const { draft, saveDraft, loadDraft, clearDraft } = useDraftStore();
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import type { EmotionLevel } from '@/types/emotion';

const DRAFT_STORAGE_KEY = '@hang-on/draft';

export interface Draft {
  emotionLevel: EmotionLevel;
  content: string;
  lastSavedAt: number; // timestamp
}

interface DraftState {
  draft: Draft | null;
  isLoading: boolean;

  // 액션
  saveDraft: (emotionLevel: EmotionLevel, content: string) => void;
  clearDraft: () => void;
  setLoading: (loading: boolean) => void;
}

export const useDraftStore = create<DraftState>()(
  persist(
    (set) => ({
      draft: null,
      isLoading: false,

      saveDraft: (emotionLevel: EmotionLevel, content: string) => {
        // 빈 내용이면 저장하지 않음
        if (!content.trim()) {
          return;
        }

        set({
          draft: {
            emotionLevel,
            content,
            lastSavedAt: Date.now(),
          },
        });
      },

      clearDraft: () => {
        set({ draft: null });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: DRAFT_STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ draft: state.draft }), // draft만 저장
    }
  )
);

/**
 * Draft 존재 여부 확인
 */
export const hasDraft = (): boolean => {
  const { draft } = useDraftStore.getState();
  return draft !== null && draft.content.trim().length > 0;
};

/**
 * Draft 나이 확인 (분 단위)
 */
export const getDraftAgeMinutes = (): number => {
  const { draft } = useDraftStore.getState();
  if (!draft) return 0;

  const now = Date.now();
  const diffMs = now - draft.lastSavedAt;
  return Math.floor(diffMs / 60000);
};

/**
 * Draft가 오래되었는지 확인 (24시간 이상)
 */
export const isDraftStale = (): boolean => {
  const ageMinutes = getDraftAgeMinutes();
  return ageMinutes > 24 * 60; // 24시간 = 1440분
};

export default useDraftStore;
