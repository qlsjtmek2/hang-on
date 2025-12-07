/**
 * useDraft Hook - 자동 임시 저장
 *
 * WriteScreen에서 사용하여 입력 내용을 자동으로 저장하고
 * 앱 재시작 시 복구할 수 있게 합니다.
 *
 * 기능:
 * - 5초 간격 자동 저장
 * - 앱 재시작 시 복구 프롬프트
 * - 저장 완료 시 draft 삭제
 *
 * 사용법:
 * const {
 *   draftContent,
 *   hasDraft,
 *   saveDraft,
 *   clearDraft,
 *   restoreDraft,
 * } = useDraft(emotionLevel, content, setContent);
 */

import { useEffect, useRef, useCallback } from 'react';

import { useDraftStore, getDraftAgeMinutes, Draft } from '@/store/draftStore';
import type { EmotionLevel } from '@/types/emotion';

const AUTO_SAVE_INTERVAL = 5000; // 5초

interface UseDraftReturn {
  /** 저장된 임시 데이터 */
  savedDraft: Draft | null;
  /** 임시 저장이 존재하는지 여부 */
  hasDraft: boolean;
  /** 임시 저장 나이 (분) */
  draftAgeMinutes: number;
  /** 수동으로 저장 */
  saveDraft: () => void;
  /** 임시 저장 삭제 */
  clearDraft: () => void;
  /** 저장된 내용 복구 */
  restoreDraft: () => { emotionLevel: EmotionLevel; content: string } | null;
}

/**
 * useDraft - 자동 임시 저장 훅
 *
 * @param emotionLevel 현재 선택된 감정 레벨
 * @param content 현재 입력된 내용
 * @param enabled 자동 저장 활성화 여부 (기본: true)
 */
export function useDraft(
  emotionLevel: EmotionLevel,
  content: string,
  enabled: boolean = true,
): UseDraftReturn {
  const { draft, saveDraft: storeSaveDraft, clearDraft: storeClearDraft } = useDraftStore();

  const contentRef = useRef(content);
  const emotionRef = useRef(emotionLevel);
  const lastSavedContentRef = useRef('');

  // refs 업데이트
  useEffect(() => {
    contentRef.current = content;
    emotionRef.current = emotionLevel;
  }, [content, emotionLevel]);

  // 수동 저장
  const saveDraft = useCallback(() => {
    const currentContent = contentRef.current;
    const currentEmotion = emotionRef.current;

    // 내용이 같으면 저장하지 않음
    if (currentContent === lastSavedContentRef.current) {
      return;
    }

    // 빈 내용이면 저장하지 않음
    if (!currentContent.trim()) {
      return;
    }

    storeSaveDraft(currentEmotion, currentContent);
    lastSavedContentRef.current = currentContent;
  }, [storeSaveDraft]);

  // 자동 저장 (5초 간격)
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const intervalId = setInterval(() => {
      saveDraft();
    }, AUTO_SAVE_INTERVAL);

    return () => {
      clearInterval(intervalId);
    };
  }, [enabled, saveDraft]);

  // 컴포넌트 언마운트 시 저장
  useEffect(() => {
    return () => {
      if (enabled && contentRef.current.trim()) {
        storeSaveDraft(emotionRef.current, contentRef.current);
      }
    };
  }, [enabled, storeSaveDraft]);

  // 저장된 내용 복구
  const restoreDraft = useCallback((): { emotionLevel: EmotionLevel; content: string } | null => {
    if (!draft) {
      return null;
    }

    return {
      emotionLevel: draft.emotionLevel,
      content: draft.content,
    };
  }, [draft]);

  // 임시 저장 삭제
  const clearDraft = useCallback(() => {
    storeClearDraft();
    lastSavedContentRef.current = '';
  }, [storeClearDraft]);

  return {
    savedDraft: draft,
    hasDraft: draft !== null && draft.content.trim().length > 0,
    draftAgeMinutes: getDraftAgeMinutes(),
    saveDraft,
    clearDraft,
    restoreDraft,
  };
}

/**
 * useDraftRecovery - 임시 저장 복구 확인 훅
 *
 * 화면 진입 시 임시 저장이 있으면 복구 여부를 확인합니다.
 */
export function useDraftRecovery(): {
  draft: Draft | null;
  hasDraft: boolean;
  clearDraft: () => void;
} {
  const { draft, clearDraft } = useDraftStore();

  return {
    draft,
    hasDraft: draft !== null && draft.content.trim().length > 0,
    clearDraft,
  };
}

export default useDraft;
