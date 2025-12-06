import { Heart, MessageCircle, Moon } from 'lucide-react-native';
import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Animated,
  ViewToken,
  Easing,
  Platform,
  LayoutChangeEvent,
} from 'react-native';

import { HeartButton } from '@/components/HeartButton';
import { MessagePresetBottomSheet } from '@/components/MessagePresetBottomSheet';
import { EMOTION_DATA } from '@/constants/emotions';
import { useFeedStore, FeedItem, MessagePreset } from '@/store/feedStore';
import { theme } from '@/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
// 초기 카드 높이 (onLayout에서 실제 높이로 업데이트됨)
const INITIAL_CARD_HEIGHT = SCREEN_HEIGHT * 0.75;

/**
 * 누군가와 함께 화면 (피드)
 * - Wide View: 사이드바 제거, 텍스트 영역 최대화
 * - 일일 20개 제한
 * - 헤더에 남은 이야기 수 표시
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

  const [activeIndex, setActiveIndex] = useState(0);
  const [messageSheetVisible, setMessageSheetVisible] = useState(false);
  const [selectedFeedId, setSelectedFeedId] = useState<string | null>(null);
  const [cardHeight, setCardHeight] = useState(INITIAL_CARD_HEIGHT);

  const remainingCount = getRemainingCount();

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

  const handleEmpathyPress = (id: string, hasEmpathized: boolean) => {
    if (hasEmpathized) {
      removeEmpathy(id);
    } else {
      addEmpathy(id);
    }
  };

  const handleMessagePress = (id: string) => {
    setSelectedFeedId(id);
    setMessageSheetVisible(true);
  };

  const handleMessageSelect = (preset: MessagePreset) => {
    if (selectedFeedId) {
      sendMessage(selectedFeedId, preset);
    }
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
    </View>
  );
};

// ------------------------------------------------------------------
// 개별 카드 컴포넌트
// ------------------------------------------------------------------

interface FeedCardProps {
  record: FeedItem;
  isActive: boolean;
  onEmpathyPress: (id: string, hasEmpathized: boolean) => void;
  onMessagePress: (id: string) => void;
  cardHeight: number;
}

const FeedCard: React.FC<FeedCardProps> = ({
  record,
  isActive,
  onEmpathyPress,
  onMessagePress,
  cardHeight,
}) => {
  const emotionInfo = EMOTION_DATA[record.emotionLevel];
  const EmotionIcon = emotionInfo.icon;

  // Animation Refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    if (isActive) {
      fadeAnim.setValue(0);
      slideAnim.setValue(20);

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
          easing: Easing.out(Easing.quad),
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
          easing: Easing.out(Easing.quad),
        }),
      ]).start();
    }
  }, [isActive, fadeAnim, slideAnim]);

  const getRelativeTime = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    return `${Math.floor(diff / 86400000)}일 전`;
  };

  return (
    <View style={[styles.cardContainer, { height: cardHeight }]}>
      {/* 배경 */}
      <View
        style={[styles.cardBackground, { backgroundColor: `${emotionInfo.color}10` }]}
      />

      {/* 메인 콘텐츠 영역 */}
      <View style={styles.contentWrapper}>
        <Animated.View
          style={[
            styles.mainContent,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          {/* 상단: 날짜 및 감정 아이콘 */}
          <View style={styles.headerRow}>
            <View style={[styles.emotionBadge, { backgroundColor: emotionInfo.color }]}>
              <EmotionIcon size={24} color="#FFFFFF" strokeWidth={2} />
            </View>
            <Text style={styles.timeText}>{getRelativeTime(record.createdAt)}</Text>
          </View>

          {/* 중단: 텍스트 (최대 너비 사용) */}
          <View style={styles.textContainer}>
            <Text style={styles.contentText}>{record.content}</Text>
          </View>
        </Animated.View>
      </View>

      {/* 하단: 인터랙션 바 (고정) */}
      <View style={styles.bottomBar}>
        {/* 공감 버튼 (HeartButton 컴포넌트 사용) */}
        <View style={styles.heartButtonWrapper}>
          <HeartButton
            hasEmpathized={record.hasEmpathized}
            count={record.heartsCount}
            onPress={() => onEmpathyPress(record.id, record.hasEmpathized)}
            size="large"
            showCount={true}
          />
        </View>

        {/* 댓글 미리보기/입력 바 */}
        <TouchableOpacity
          style={styles.commentBar}
          onPress={() => onMessagePress(record.id)}
          activeOpacity={0.9}
        >
          {record.hasSentMessage ? (
            // 이미 메시지를 보낸 경우
            <View style={styles.commentSent}>
              <View style={styles.commentIconBadge}>
                <MessageCircle size={14} color="#FFF" fill="#FFF" />
              </View>
              <Text style={styles.commentSentText}>따뜻한 말을 전했어요</Text>
            </View>
          ) : record.messagesCount > 0 ? (
            // 댓글이 있을 때
            <View style={styles.commentPreview}>
              <View style={styles.commentIconBadge}>
                <MessageCircle size={14} color="#FFF" fill="#FFF" />
              </View>
              <Text style={styles.commentPreviewText} numberOfLines={1}>
                {record.messagesCount}개의 답장이 도착했어요
              </Text>
            </View>
          ) : (
            // 댓글이 없을 때
            <Text style={styles.placeholderText}>따뜻한 위로를 남겨주세요...</Text>
          )}
        </TouchableOpacity>
      </View>
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

  // Card Layout
  cardContainer: {
    width: SCREEN_WIDTH,
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'space-between',
  },
  cardBackground: {
    ...StyleSheet.absoluteFillObject,
  },

  // Content Area
  contentWrapper: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: 80,
  },
  mainContent: {
    width: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  emotionBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  timeText: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
  },
  textContainer: {
    width: '100%',
  },
  contentText: {
    ...theme.typography.h3,
    fontSize: 22,
    lineHeight: 34,
    color: theme.colors.text.primary,
    fontWeight: '500',
    letterSpacing: -0.5,
  },

  // Bottom Interaction Bar
  bottomBar: {
    position: 'absolute',
    bottom: 16,
    left: theme.spacing.md,
    right: theme.spacing.md,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
  },
  heartButtonWrapper: {
    width: 70,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
    backgroundColor: '#FFF',
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  commentBar: {
    flex: 1,
    height: 56,
    backgroundColor: '#FFF',
    borderRadius: 28,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  placeholderText: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    fontSize: 15,
  },
  commentPreview: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentIconBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  commentPreviewText: {
    ...theme.typography.body,
    fontSize: 15,
    color: theme.colors.text.primary,
    fontWeight: '500',
    flex: 1,
  },
  commentSent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentSentText: {
    ...theme.typography.body,
    fontSize: 15,
    color: theme.colors.semantic.success,
    fontWeight: '500',
  },
});
