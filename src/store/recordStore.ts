import { create } from 'zustand';

import type { EmotionLevel } from '@/types/emotion';

/**
 * 기록 공개 상태
 * - private: 비공개 (혼자 간직하기)
 * - scheduled: 예약 공개 (내일 나누기)
 * - public: 즉시 공개 (지금 나누기)
 */
export type RecordVisibility = 'private' | 'scheduled' | 'public';

/**
 * 감정 기록 인터페이스
 */
export interface Record {
  id: string;
  emotionLevel: EmotionLevel;
  content: string;
  visibility: RecordVisibility;
  heartsCount: number;
  messagesCount: number;
  createdAt: Date;
  scheduledPublishAt?: Date; // 예약 공개 시간 (scheduled일 때만)
}

/**
 * 새 기록 생성 시 필요한 입력
 */
export interface CreateRecordInput {
  emotionLevel: EmotionLevel;
  content: string;
  visibility: RecordVisibility;
}

// 고유 ID 생성 헬퍼
const generateId = (): string => `record-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

// 샘플 데이터 (Mock)
const createSampleRecords = (): Record[] => {
  const now = new Date();

  return [
    {
      id: generateId(),
      emotionLevel: 5,
      content: '오늘 정말 좋은 하루였다. 오랜만에 친구들을 만나서 맛있는 음식도 먹고 즐거운 시간을 보냈다.',
      visibility: 'public',
      heartsCount: 12,
      messagesCount: 3,
      createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2시간 전
    },
    {
      id: generateId(),
      emotionLevel: 3,
      content: '평범한 하루. 특별한 일은 없었지만 그래도 나쁘지 않았다.',
      visibility: 'public',
      heartsCount: 5,
      messagesCount: 1,
      createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000), // 1일 전
    },
    {
      id: generateId(),
      emotionLevel: 2,
      content: '일이 잘 안 풀리는 날이었다. 내일은 더 나아지길.',
      visibility: 'private',
      heartsCount: 0,
      messagesCount: 0,
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2일 전
    },
    {
      id: generateId(),
      emotionLevel: 4,
      content: '조금 흐린 날씨였지만 마음은 맑았다. 새로운 프로젝트가 시작됐는데 기대가 된다.',
      visibility: 'public',
      heartsCount: 8,
      messagesCount: 2,
      createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3일 전
    },
    {
      id: generateId(),
      emotionLevel: 1,
      content: '많이 힘든 날이었다. 하지만 이 감정도 지나갈 거라는 걸 안다.',
      visibility: 'private',
      heartsCount: 0,
      messagesCount: 0,
      createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5일 전
    },
    {
      id: generateId(),
      emotionLevel: 5,
      content: '승진 소식을 들었다! 노력이 인정받는 기분이라 정말 기쁘다.',
      visibility: 'public',
      heartsCount: 25,
      messagesCount: 7,
      createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // 7일 전
    },
    {
      id: generateId(),
      emotionLevel: 3,
      content: '그저 그런 하루. 내일을 위해 오늘은 푹 쉬어야겠다.',
      visibility: 'scheduled',
      heartsCount: 0,
      messagesCount: 0,
      createdAt: new Date(now.getTime() - 1 * 60 * 60 * 1000), // 1시간 전
      scheduledPublishAt: new Date(now.getTime() + 24 * 60 * 60 * 1000), // 내일
    },
  ];
};

interface RecordStore {
  // 상태
  records: Record[];
  isLoading: boolean;
  error: string | null;

  // 액션
  addRecord: (input: CreateRecordInput) => Promise<Record>;
  updateRecord: (id: string, updates: Partial<Omit<Record, 'id' | 'createdAt'>>) => Promise<boolean>;
  deleteRecord: (id: string) => Promise<boolean>;
  getRecordById: (id: string) => Record | undefined;
  getMyRecords: () => Record[];
  getPublicRecords: () => Record[];
  clearError: () => void;
}

export const useRecordStore = create<RecordStore>((set, get) => ({
  // 초기 상태 (샘플 데이터 포함)
  records: createSampleRecords(),
  isLoading: false,
  error: null,

  // 기록 추가
  addRecord: async (input: CreateRecordInput) => {
    set({ isLoading: true, error: null });

    // 시뮬레이션 딜레이
    await new Promise<void>(resolve => setTimeout(resolve, 300));

    const now = new Date();
    const newRecord: Record = {
      id: generateId(),
      emotionLevel: input.emotionLevel,
      content: input.content,
      visibility: input.visibility,
      heartsCount: 0,
      messagesCount: 0,
      createdAt: now,
      ...(input.visibility === 'scheduled' && {
        scheduledPublishAt: new Date(now.getTime() + 24 * 60 * 60 * 1000),
      }),
    };

    set(state => ({
      records: [newRecord, ...state.records],
      isLoading: false,
    }));

    return newRecord;
  },

  // 기록 수정
  updateRecord: async (id: string, updates: Partial<Omit<Record, 'id' | 'createdAt'>>) => {
    set({ isLoading: true, error: null });

    // 시뮬레이션 딜레이
    await new Promise<void>(resolve => setTimeout(resolve, 200));

    const { records } = get();
    const recordIndex = records.findIndex(r => r.id === id);

    if (recordIndex === -1) {
      set({ error: '기록을 찾을 수 없습니다.', isLoading: false });
      return false;
    }

    const updatedRecords = [...records];
    updatedRecords[recordIndex] = {
      ...updatedRecords[recordIndex],
      ...updates,
    };

    set({ records: updatedRecords, isLoading: false });
    return true;
  },

  // 기록 삭제
  deleteRecord: async (id: string) => {
    set({ isLoading: true, error: null });

    // 시뮬레이션 딜레이
    await new Promise<void>(resolve => setTimeout(resolve, 200));

    const { records } = get();
    const filteredRecords = records.filter(r => r.id !== id);

    if (filteredRecords.length === records.length) {
      set({ error: '기록을 찾을 수 없습니다.', isLoading: false });
      return false;
    }

    set({ records: filteredRecords, isLoading: false });
    return true;
  },

  // ID로 기록 조회
  getRecordById: (id: string) => {
    return get().records.find(r => r.id === id);
  },

  // 내 기록 조회 (모든 가시성)
  getMyRecords: () => {
    return get().records.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
  },

  // 공개 기록 조회 (public만)
  getPublicRecords: () => {
    return get()
      .records.filter(r => r.visibility === 'public')
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  },

  // 에러 초기화
  clearError: () => {
    set({ error: null });
  },
}));
