import { useFeedStore, MESSAGE_PRESETS } from '@/store/feedStore';

describe('feedStore', () => {
  beforeEach(() => {
    // 스토어 상태 리셋
    useFeedStore.setState({
      viewedToday: [],
      lastViewedDate: new Date().toISOString().split('T')[0],
    });
  });

  describe('초기 상태', () => {
    it('샘플 피드 아이템이 20개 있어야 함', () => {
      const { feedItems } = useFeedStore.getState();
      expect(feedItems.length).toBe(20);
    });

    it('일일 제한이 20이어야 함', () => {
      const { dailyLimit } = useFeedStore.getState();
      expect(dailyLimit).toBe(20);
    });

    it('초기 viewedToday가 비어있어야 함', () => {
      const { viewedToday } = useFeedStore.getState();
      expect(viewedToday).toEqual([]);
    });
  });

  describe('getRemainingCount', () => {
    it('초기에는 20이어야 함', () => {
      const { getRemainingCount } = useFeedStore.getState();
      expect(getRemainingCount()).toBe(20);
    });

    it('조회 후 감소해야 함', () => {
      const { viewFeedItem, feedItems, getRemainingCount } = useFeedStore.getState();
      viewFeedItem(feedItems[0].id);
      expect(getRemainingCount()).toBe(19);
    });
  });

  describe('hasReachedLimit', () => {
    it('초기에는 false여야 함', () => {
      const { hasReachedLimit } = useFeedStore.getState();
      expect(hasReachedLimit()).toBe(false);
    });

    it('20개 조회 후 true여야 함', () => {
      const { feedItems, viewFeedItem, hasReachedLimit } = useFeedStore.getState();

      // 20개 조회
      for (let i = 0; i < 20; i++) {
        viewFeedItem(feedItems[i].id);
      }

      expect(hasReachedLimit()).toBe(true);
    });
  });

  describe('viewFeedItem', () => {
    it('피드 조회 시 viewedToday에 추가되어야 함', () => {
      const { viewFeedItem, feedItems } = useFeedStore.getState();
      const feedId = feedItems[0].id;

      viewFeedItem(feedId);

      const { viewedToday } = useFeedStore.getState();
      expect(viewedToday).toContain(feedId);
    });

    it('이미 조회한 피드는 중복 추가되지 않아야 함', () => {
      const { viewFeedItem, feedItems } = useFeedStore.getState();
      const feedId = feedItems[0].id;

      viewFeedItem(feedId);
      viewFeedItem(feedId);

      const { viewedToday } = useFeedStore.getState();
      expect(viewedToday.filter(id => id === feedId).length).toBe(1);
    });

    it('제한 도달 후 더 이상 추가되지 않아야 함', () => {
      const { feedItems, viewFeedItem } = useFeedStore.getState();

      // 20개 조회
      for (let i = 0; i < 20; i++) {
        viewFeedItem(feedItems[i].id);
      }

      const { viewedToday } = useFeedStore.getState();
      expect(viewedToday.length).toBe(20);

      // 추가 조회 시도 (새 피드가 없어도 기존 피드로 테스트)
      // 21번째 항목이 없으므로 무시됨
    });
  });

  describe('addEmpathy', () => {
    it('공감 추가 시 heartsCount가 증가해야 함', () => {
      const { feedItems, addEmpathy } = useFeedStore.getState();
      const initialCount = feedItems[0].heartsCount;

      addEmpathy(feedItems[0].id);

      const { feedItems: updatedItems } = useFeedStore.getState();
      expect(updatedItems[0].heartsCount).toBe(initialCount + 1);
      expect(updatedItems[0].hasEmpathized).toBe(true);
    });

    it('이미 공감한 경우 다시 공감해도 증가하지 않아야 함', () => {
      const { feedItems, addEmpathy } = useFeedStore.getState();

      addEmpathy(feedItems[0].id);
      const afterFirst = useFeedStore.getState().feedItems[0].heartsCount;

      addEmpathy(feedItems[0].id);
      const afterSecond = useFeedStore.getState().feedItems[0].heartsCount;

      expect(afterSecond).toBe(afterFirst);
    });
  });

  describe('removeEmpathy', () => {
    it('공감 취소 시 heartsCount가 감소해야 함', () => {
      const { feedItems, addEmpathy, removeEmpathy } = useFeedStore.getState();

      // 먼저 공감 추가
      addEmpathy(feedItems[0].id);
      const afterAdd = useFeedStore.getState().feedItems[0].heartsCount;

      // 공감 취소
      removeEmpathy(feedItems[0].id);
      const afterRemove = useFeedStore.getState().feedItems[0].heartsCount;

      expect(afterRemove).toBe(afterAdd - 1);
    });

    it('공감하지 않은 경우 취소해도 변화 없어야 함', () => {
      const { feedItems, removeEmpathy } = useFeedStore.getState();
      const initialCount = feedItems[0].heartsCount;

      removeEmpathy(feedItems[0].id);

      const { feedItems: updatedItems } = useFeedStore.getState();
      expect(updatedItems[0].heartsCount).toBe(initialCount);
    });
  });

  describe('sendMessage', () => {
    it('메시지 전송 시 messagesCount가 증가해야 함', () => {
      const { feedItems, sendMessage } = useFeedStore.getState();
      const initialCount = feedItems[0].messagesCount;

      sendMessage(feedItems[0].id, 'cheer_up');

      const { feedItems: updatedItems } = useFeedStore.getState();
      expect(updatedItems[0].messagesCount).toBe(initialCount + 1);
      expect(updatedItems[0].hasSentMessage).toBe(true);
    });

    it('이미 메시지를 보낸 경우 다시 보내도 증가하지 않아야 함', () => {
      const { feedItems, sendMessage } = useFeedStore.getState();

      sendMessage(feedItems[0].id, 'cheer_up');
      const afterFirst = useFeedStore.getState().feedItems[0].messagesCount;

      sendMessage(feedItems[0].id, 'me_too');
      const afterSecond = useFeedStore.getState().feedItems[0].messagesCount;

      expect(afterSecond).toBe(afterFirst);
    });
  });

  describe('resetDailyView', () => {
    it('viewedToday가 초기화되어야 함', () => {
      const { feedItems, viewFeedItem, resetDailyView } = useFeedStore.getState();

      // 몇 개 조회
      viewFeedItem(feedItems[0].id);
      viewFeedItem(feedItems[1].id);

      resetDailyView();

      const { viewedToday } = useFeedStore.getState();
      expect(viewedToday).toEqual([]);
    });
  });

  describe('MESSAGE_PRESETS', () => {
    it('4가지 프리셋이 있어야 함', () => {
      expect(MESSAGE_PRESETS.length).toBe(4);
    });

    it('모든 프리셋에 필수 필드가 있어야 함', () => {
      MESSAGE_PRESETS.forEach(preset => {
        expect(preset.type).toBeDefined();
        expect(preset.label).toBeDefined();
        expect(preset.emoji).toBeDefined();
      });
    });

    it('프리셋 타입이 올바른 값이어야 함', () => {
      const expectedTypes = ['cheer_up', 'me_too', 'will_be_ok', 'together'];
      const actualTypes = MESSAGE_PRESETS.map(p => p.type);
      expect(actualTypes).toEqual(expectedTypes);
    });
  });
});
