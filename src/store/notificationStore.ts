import { create } from 'zustand';

/**
 * 알림 타입
 */
export type NotificationType = 'empathy' | 'message';

/**
 * 알림 아이템
 */
export interface NotificationItem {
  id: string;
  type: NotificationType;
  recordId: string;
  recordPreview: string; // 기록 내용 미리보기
  createdAt: Date;
  isRead: boolean;
}

interface NotificationState {
  notifications: NotificationItem[];
  unreadCount: number;
}

interface NotificationActions {
  addNotification: (notification: Omit<NotificationItem, 'id' | 'isRead'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
}

// 고유 ID 생성
const generateId = (): string => `notif-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

// 샘플 알림 데이터
const createSampleNotifications = (): NotificationItem[] => {
  const now = new Date();

  return [
    {
      id: generateId(),
      type: 'empathy',
      recordId: 'record-1',
      recordPreview: '오늘 하루가 너무 힘들었어요...',
      createdAt: new Date(now.getTime() - 10 * 60 * 1000), // 10분 전
      isRead: false,
    },
    {
      id: generateId(),
      type: 'message',
      recordId: 'record-1',
      recordPreview: '오늘 하루가 너무 힘들었어요...',
      createdAt: new Date(now.getTime() - 30 * 60 * 1000), // 30분 전
      isRead: false,
    },
    {
      id: generateId(),
      type: 'empathy',
      recordId: 'record-2',
      recordPreview: '날씨가 좋아서 기분이 좋아요',
      createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2시간 전
      isRead: true,
    },
  ];
};

export const useNotificationStore = create<NotificationState & NotificationActions>(set => ({
  notifications: createSampleNotifications(),
  unreadCount: 2, // 초기 읽지 않은 알림 수

  addNotification: notification => {
    const newNotification: NotificationItem = {
      ...notification,
      id: generateId(),
      isRead: false,
    };

    set(state => ({
      notifications: [newNotification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },

  markAsRead: id => {
    set(state => {
      const notification = state.notifications.find(n => n.id === id);
      if (!notification || notification.isRead) return state;

      return {
        notifications: state.notifications.map(n => (n.id === id ? { ...n, isRead: true } : n)),
        unreadCount: Math.max(0, state.unreadCount - 1),
      };
    });
  },

  markAllAsRead: () => {
    set(state => ({
      notifications: state.notifications.map(n => ({ ...n, isRead: true })),
      unreadCount: 0,
    }));
  },

  clearAll: () => {
    set({ notifications: [], unreadCount: 0 });
  },
}));
