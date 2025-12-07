import { Heart, Moon } from 'lucide-react-native';
import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  ViewToken,
  Platform,
  LayoutChangeEvent,
} from 'react-native';

import { FeedCard } from '@/components/FeedCard';
import { MessagePresetBottomSheet } from '@/components/MessagePresetBottomSheet';
import { ReportBottomSheet, ReportReason } from '@/components/ReportBottomSheet';
import { FeedCardSkeleton } from '@/components/SkeletonLoader';
import { useToast } from '@/contexts/ToastContext';
import { useFeedStore, FeedItem, MessagePreset } from '@/store/feedStore';
import { theme } from '@/theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
// 초기 카드 높이 (onLayout에서 실제 높이로 업데이트됨)
const INITIAL_CARD_HEIGHT = SCREEN_HEIGHT * 0.75;

/**
 * 누군가와 함께 화면 (피드)
 * - Wide View: 사이드바 제거, 텍스트 영역 최대화
 * - 일일 20개 제한
 * - 헤더에 남은 이야기 수 표시
 * - 더보기 버튼으로 신고 기능 접근
 */
export const FeedScreen: React.FC = () => {
  const {
    feedItems,
    getRemainingCount,
    hasReachedLimit,
    viewFeedItem,
    addEmpathy,
    removeEmpathy,
    sendMessage,
    dailyLimit,
  } = useFeedStore();
  const { showToast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [messageSheetVisible, setMessageSheetVisible] = useState(false);
  const [reportSheetVisible, setReportSheetVisible] = useState(false);
  const [selectedFeedId, setSelectedFeedId] = useState<string | null>(null);
  const [cardHeight, setCardHeight] = useState(INITIAL_CARD_HEIGHT);

  const remainingCount = getRemainingCount();

  // 초기 로딩 시뮬레이션 (실제 데이터는 Supabase 연동 시 구현)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // 실제 컨테이너 높이를 측정하여 카드 높이 설정
  const handleLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    if (height > 0 && height !== cardHeight) {
      setCardHeight(height);
    }
  };
  const limitReached = hasReachedLimit();

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        const newIndex = viewableItems[0].index;
        setActiveIndex(newIndex);

        // 피드 조회 기록
        const item = feedItems[newIndex];
        if (item) {
          viewFeedItem(item.id);
        }
      }
    },
  ).current;

  const handleEmpathyPress = useCallback(
    (id: string, hasEmpathized: boolean) => {
      if (hasEmpathized) {
        removeEmpathy(id);
      } else {
        addEmpathy(id);
      }
    },
    [addEmpathy, removeEmpathy],
  );

  const handleMessagePress = useCallback((id: string) => {
    setSelectedFeedId(id);
    setMessageSheetVisible(true);
  }, []);

  const handleMorePress = useCallback((id: string) => {
    setSelectedFeedId(id);
    setReportSheetVisible(true);
  }, []);

  const handleMessageSelect = (preset: MessagePreset) => {
    if (selectedFeedId) {
      sendMessage(selectedFeedId, preset);
      showToast('success', '따뜻한 메시지를 보냈어요');
    }
  };

  const handleReportSubmit = (reason: ReportReason, detail?: string) => {
    // Mock: 신고 처리 로그
    console.log('Report submitted:', { feedId: selectedFeedId, reason, detail });
  };

  const selectedFeedItem = selectedFeedId
    ? feedItems.find(item => item.id === selectedFeedId)
    : null;

  const renderCard = ({ item, index }: { item: FeedItem; index: number }) => (
    <FeedCard
      record={item}
      isActive={index === activeIndex}
      onEmpathyPress={handleEmpathyPress}
      onMessagePress={handleMessagePress}
      onMorePress={handleMorePress}
      cardHeight={cardHeight}
    />
  );

  // 일일 제한 도달 시 화면
  const renderLimitReachedState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyContent}>
        <Moon size={64} color={theme.colors.primary.main} strokeWidth={1} />
        <Text style={styles.emptyTitle}>오늘은 모두 읽었어요</Text>
        <Text style={styles.emptyHint}>
          내일 다시 와주세요{'\n'}새로운 이야기가 기다리고 있을 거예요
        </Text>
      </View>
    </View>
  );

  // 데이터 없을 때 화면
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyContent}>
        <Heart size={64} color={theme.colors.text.secondary} strokeWidth={1} />
        <Text style={styles.emptyTitle}>도착한 이야기가 없어요</Text>
        <Text style={styles.emptyHint}>
          비슷한 감정을 가진 사람들의{'\n'}이야기가 곧 도착할 거예요
        </Text>
      </View>
    </View>
  );

  // 로딩 중일 때 스켈레톤 표시
  if (isLoading) {
    return (
      <View style={styles.container}>
        <FeedCardSkeleton cardHeight={cardHeight} />
      </View>
    );
  }

  if (limitReached) {
    return renderLimitReachedState();
  }

  if (feedItems.length === 0) {
    return renderEmptyState();
  }

  return (
    <View style={styles.container} onLayout={handleLayout}>
      <FlatList
        data={feedItems}
        renderItem={renderCard}
        keyExtractor={item => item.id}
        pagingEnabled
        snapToInterval={cardHeight}
        snapToAlignment="start"
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={(_, index) => ({
          length: cardHeight,
          offset: cardHeight * index,
          index,
        })}
      />

      {/* 헤더: 남은 이야기 카운터 */}
      <View style={styles.headerContainer}>
        <View style={styles.counterBadge}>
          <Text style={styles.counterText}>
            오늘 남은 이야기: {remainingCount}/{dailyLimit}
          </Text>
        </View>
      </View>

      {/* 메시지 프리셋 바텀시트 */}
      <MessagePresetBottomSheet
        visible={messageSheetVisible}
        onClose={() => setMessageSheetVisible(false)}
        onSelect={handleMessageSelect}
        hasSentMessage={selectedFeedItem?.hasSentMessage ?? false}
      />

      {/* 신고 바텀시트 */}
      <ReportBottomSheet
        visible={reportSheetVisible}
        onClose={() => setReportSheetVisible(false)}
        onSubmit={handleReportSubmit}
        recordId={selectedFeedId ?? ''}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  // Header
  headerContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    width: '100%',
    alignItems: 'center',
  },
  counterBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  counterText: {
    ...theme.typography.bodySmall,
    fontWeight: '600',
    color: theme.colors.primary.main,
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContent: { alignItems: 'center', padding: theme.spacing.xl },
  emptyTitle: {
    ...theme.typography.body,
    fontSize: 18,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  emptyHint: {
    ...theme.typography.bodySmall,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});
