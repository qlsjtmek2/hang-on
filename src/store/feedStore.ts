import { create } from 'zustand';

import type { EmotionLevel } from '@/types/emotion';

/**
 * 피드 아이템 (다른 사람의 기록)
 */
export interface FeedItem {
  id: string;
  emotionLevel: EmotionLevel;
  content: string;
  heartsCount: number;
  messagesCount: number;
  createdAt: Date;
  hasEmpathized: boolean; // 내가 공감했는지 여부
  hasSentMessage: boolean; // 내가 메시지를 보냈는지 여부
}

/**
 * 메시지 프리셋 타입
 */
export type MessagePreset =
  | 'cheer_up' // 힘내세요 💪
  | 'me_too' // 저도 그래요 🫂
  | 'will_be_ok' // 괜찮을 거예요 🌈
  | 'together'; // 함께해요 ✨

export interface MessagePresetData {
  type: MessagePreset;
  label: string;
  emoji: string;
}

export const MESSAGE_PRESETS: MessagePresetData[] = [
  { type: 'cheer_up', label: '힘내세요', emoji: '💪' },
  { type: 'me_too', label: '저도 그래요', emoji: '🫂' },
  { type: 'will_be_ok', label: '괜찮을 거예요', emoji: '🌈' },
  { type: 'together', label: '함께해요', emoji: '✨' },
];

// 일일 피드 조회 제한
const DAILY_FEED_LIMIT = 20;

// 고유 ID 생성
const generateId = (): string =>
  `feed-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

// 다른 사람의 기록 샘플 데이터
const createSampleFeedItems = (): FeedItem[] => {
  const now = new Date();

  return [
    {
      id: generateId(),
      emotionLevel: 2,
      content:
        '오늘 하루가 너무 힘들었어요. 회사에서 프로젝트가 잘 안 풀리고, 집에 와서도 마음이 무거워요. 내일은 좀 나아지겠죠?',
      heartsCount: 8,
      messagesCount: 3,
      createdAt: new Date(now.getTime() - 30 * 60 * 1000), // 30분 전
      hasEmpathized: false,
      hasSentMessage: false,
    },
    {
      id: generateId(),
      emotionLevel: 1,
      content:
        '모든 게 막막하게 느껴지는 날이에요. 어디서부터 시작해야 할지 모르겠어요.',
      heartsCount: 15,
      messagesCount: 7,
      createdAt: new Date(now.getTime() - 1 * 60 * 60 * 1000), // 1시간 전
      hasEmpathized: false,
      hasSentMessage: false,
    },
    {
      id: generateId(),
      emotionLevel: 3,
      content:
        '특별한 일은 없었지만, 그냥 그런 하루. 평범함도 나쁘지 않다고 스스로 위로해봐요.',
      heartsCount: 5,
      messagesCount: 1,
      createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2시간 전
      hasEmpathized: false,
      hasSentMessage: false,
    },
    {
      id: generateId(),
      emotionLevel: 4,
      content:
        '오랜만에 좋아하는 음악을 들으면서 산책했어요. 작은 것에서 행복을 찾는 법을 배워가는 중이에요.',
      heartsCount: 12,
      messagesCount: 4,
      createdAt: new Date(now.getTime() - 3 * 60 * 60 * 1000), // 3시간 전
      hasEmpathized: false,
      hasSentMessage: false,
    },
    {
      id: generateId(),
      emotionLevel: 2,
      content:
        '친구와 다퉜어요. 별일 아닌 것 같은데 마음이 많이 쓰여요. 먼저 연락해야 하나...',
      heartsCount: 20,
      messagesCount: 9,
      createdAt: new Date(now.getTime() - 5 * 60 * 60 * 1000), // 5시간 전
      hasEmpathized: false,
      hasSentMessage: false,
    },
    {
      id: generateId(),
      emotionLevel: 5,
      content:
        '시험 결과가 생각보다 좋게 나왔어요! 열심히 한 보람이 있네요. 오늘 하루 종일 기분이 좋아요.',
      heartsCount: 35,
      messagesCount: 12,
      createdAt: new Date(now.getTime() - 8 * 60 * 60 * 1000), // 8시간 전
      hasEmpathized: false,
      hasSentMessage: false,
    },
    {
      id: generateId(),
      emotionLevel: 1,
      content:
        '불면증이 계속돼요. 밤마다 여러 생각이 머리를 떠나지 않아요. 잠들기가 무서운 밤이에요.',
      heartsCount: 28,
      messagesCount: 15,
      createdAt: new Date(now.getTime() - 10 * 60 * 60 * 1000), // 10시간 전
      hasEmpathized: false,
      hasSentMessage: false,
    },
    {
      id: generateId(),
      emotionLevel: 3,
      content: '날씨가 흐린 날은 왜 마음도 흐려지는 걸까요. 커피 한 잔 마시며 생각 정리 중.',
      heartsCount: 9,
      messagesCount: 2,
      createdAt: new Date(now.getTime() - 12 * 60 * 60 * 1000), // 12시간 전
      hasEmpathized: false,
      hasSentMessage: false,
    },
    {
      id: generateId(),
      emotionLevel: 4,
      content:
        '부모님과 오랜만에 통화했어요. 별다른 이야기는 아니었는데, 통화 후에 마음이 따뜻해졌어요.',
      heartsCount: 22,
      messagesCount: 6,
      createdAt: new Date(now.getTime() - 15 * 60 * 60 * 1000), // 15시간 전
      hasEmpathized: false,
      hasSentMessage: false,
    },
    {
      id: generateId(),
      emotionLevel: 2,
      content:
        '퇴근하고 집에 오니까 아무도 없는 방이 더 외롭게 느껴져요. 혼자 있는 시간이 힘들 때가 있어요.',
      heartsCount: 18,
      messagesCount: 8,
      createdAt: new Date(now.getTime() - 18 * 60 * 60 * 1000), // 18시간 전
      hasEmpathized: false,
      hasSentMessage: false,
    },
    {
      id: generateId(),
      emotionLevel: 5,
      content:
        '오늘 새로 시작한 취미 클래스에 갔는데, 생각보다 재미있었어요. 새로운 사람들도 만나고!',
      heartsCount: 30,
      messagesCount: 10,
      createdAt: new Date(now.getTime() - 20 * 60 * 60 * 1000), // 20시간 전
      hasEmpathized: false,
      hasSentMessage: false,
    },
    {
      id: generateId(),
      emotionLevel: 1,
      content:
        '가끔은 아무 이유 없이 눈물이 나요. 슬프다고 말하기도 애매한, 그냥 마음이 무거운 그런 날.',
      heartsCount: 42,
      messagesCount: 20,
      createdAt: new Date(now.getTime() - 22 * 60 * 60 * 1000), // 22시간 전
      hasEmpathized: false,
      hasSentMessage: false,
    },
    {
      id: generateId(),
      emotionLevel: 3,
      content:
        '요즘 매일이 비슷비슷해요. 특별히 나쁜 건 아닌데, 뭔가 허전한 기분. 이게 뭘까요.',
      heartsCount: 7,
      messagesCount: 3,
      createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000), // 1일 전
      hasEmpathized: false,
      hasSentMessage: false,
    },
    {
      id: generateId(),
      emotionLevel: 4,
      content:
        '맛있는 거 먹으니까 기분이 좀 나아졌어요. 음식의 힘은 대단해요. 작은 위로지만 충분해요.',
      heartsCount: 15,
      messagesCount: 5,
      createdAt: new Date(now.getTime() - 26 * 60 * 60 * 1000), // 26시간 전
      hasEmpathized: false,
      hasSentMessage: false,
    },
    {
      id: generateId(),
      emotionLevel: 2,
      content:
        '실수를 했어요. 다들 괜찮다고 하는데 혼자 계속 신경 쓰여요. 마음이 편치 않아요.',
      heartsCount: 25,
      messagesCount: 11,
      createdAt: new Date(now.getTime() - 28 * 60 * 60 * 1000), // 28시간 전
      hasEmpathized: false,
      hasSentMessage: false,
    },
    {
      id: generateId(),
      emotionLevel: 5,
      content:
        '드디어 긴 프로젝트가 끝났어요! 힘들었지만 해냈다는 성취감이 좋아요. 오늘은 푹 쉴 거예요.',
      heartsCount: 45,
      messagesCount: 18,
      createdAt: new Date(now.getTime() - 30 * 60 * 60 * 1000), // 30시간 전
      hasEmpathized: false,
      hasSentMessage: false,
    },
    {
      id: generateId(),
      emotionLevel: 1,
      content:
        '아무에게도 말 못 할 고민이 있어요. 혼자 끙끙 앓는 게 힘드네요. 누군가 들어줬으면...',
      heartsCount: 55,
      messagesCount: 25,
      createdAt: new Date(now.getTime() - 32 * 60 * 60 * 1000), // 32시간 전
      hasEmpathized: false,
      hasSentMessage: false,
    },
    {
      id: generateId(),
      emotionLevel: 3,
      content: '그냥 멍하니 창밖을 바라봤어요. 구름이 천천히 흘러가는 걸 보니 마음도 조금 느긋해졌어요.',
      heartsCount: 11,
      messagesCount: 4,
      createdAt: new Date(now.getTime() - 34 * 60 * 60 * 1000), // 34시간 전
      hasEmpathized: false,
      hasSentMessage: false,
    },
    {
      id: generateId(),
      emotionLevel: 4,
      content:
        '오랜 친구에게서 연락이 왔어요. 서로 바빠서 오래 못 만났는데, 곧 만나기로 했어요. 기대돼요!',
      heartsCount: 20,
      messagesCount: 7,
      createdAt: new Date(now.getTime() - 36 * 60 * 60 * 1000), // 36시간 전
      hasEmpathized: false,
      hasSentMessage: false,
    },
    {
      id: generateId(),
      emotionLevel: 2,
      content:
        '자존감이 바닥인 날이에요. 남들은 다 잘 하는 것 같은데 나만 제자리인 것 같아요.',
      heartsCount: 38,
      messagesCount: 16,
      createdAt: new Date(now.getTime() - 38 * 60 * 60 * 1000), // 38시간 전
      hasEmpathized: false,
      hasSentMessage: false,
    },
  ];
};

// 오늘 날짜 키 생성 (YYYY-MM-DD)
const getTodayKey = (): string => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
};

interface FeedStore {
  // 상태
  feedItems: FeedItem[];
  viewedToday: string[]; // 오늘 조회한 피드 ID 목록
  lastViewedDate: string; // 마지막 조회 날짜 (날짜 변경 감지용)
  isLoading: boolean;
  error: string | null;

  // 일일 제한 관련
  dailyLimit: number;
  getRemainingCount: () => number;
  hasReachedLimit: () => boolean;

  // 액션
  getAvailableFeed: () => FeedItem[];
  viewFeedItem: (id: string) => void;
  addEmpathy: (id: string) => void;
  removeEmpathy: (id: string) => void;
  sendMessage: (id: string, preset: MessagePreset) => void;
  resetDailyView: () => void;
  clearError: () => void;
}

export const useFeedStore = create<FeedStore>((set, get) => ({
  // 초기 상태
  feedItems: createSampleFeedItems(),
  viewedToday: [],
  lastViewedDate: getTodayKey(),
  isLoading: false,
  error: null,
  dailyLimit: DAILY_FEED_LIMIT,

  // 남은 조회 수
  getRemainingCount: () => {
    const { dailyLimit, viewedToday, lastViewedDate } = get();

    // 날짜가 바뀌었으면 리셋
    if (lastViewedDate !== getTodayKey()) {
      get().resetDailyView();
      return dailyLimit;
    }

    return Math.max(0, dailyLimit - viewedToday.length);
  },

  // 일일 제한 도달 여부
  hasReachedLimit: () => {
    return get().getRemainingCount() <= 0;
  },

  // 조회 가능한 피드 목록
  getAvailableFeed: () => {
    const { feedItems, viewedToday, lastViewedDate } = get();

    // 날짜가 바뀌었으면 리셋
    if (lastViewedDate !== getTodayKey()) {
      get().resetDailyView();
    }

    // 아직 조회하지 않은 피드만 반환
    return feedItems.filter(item => !viewedToday.includes(item.id));
  },

  // 피드 조회
  viewFeedItem: (id: string) => {
    const { viewedToday, lastViewedDate, dailyLimit } = get();

    // 날짜가 바뀌었으면 리셋
    if (lastViewedDate !== getTodayKey()) {
      set({ viewedToday: [], lastViewedDate: getTodayKey() });
    }

    // 이미 조회했거나 제한 도달 시 무시
    if (viewedToday.includes(id) || viewedToday.length >= dailyLimit) {
      return;
    }

    set({ viewedToday: [...viewedToday, id] });
  },

  // 공감 추가
  addEmpathy: (id: string) => {
    set(state => ({
      feedItems: state.feedItems.map(item =>
        item.id === id && !item.hasEmpathized
          ? { ...item, heartsCount: item.heartsCount + 1, hasEmpathized: true }
          : item,
      ),
    }));
  },

  // 공감 제거
  removeEmpathy: (id: string) => {
    set(state => ({
      feedItems: state.feedItems.map(item =>
        item.id === id && item.hasEmpathized
          ? { ...item, heartsCount: Math.max(0, item.heartsCount - 1), hasEmpathized: false }
          : item,
      ),
    }));
  },

  // 메시지 전송
  sendMessage: (id: string, _preset: MessagePreset) => {
    set(state => ({
      feedItems: state.feedItems.map(item =>
        item.id === id && !item.hasSentMessage
          ? { ...item, messagesCount: item.messagesCount + 1, hasSentMessage: true }
          : item,
      ),
    }));
  },

  // 일일 조회 리셋
  resetDailyView: () => {
    set({ viewedToday: [], lastViewedDate: getTodayKey() });
  },

  // 에러 초기화
  clearError: () => {
    set({ error: null });
  },
}));
