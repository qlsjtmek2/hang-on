import { Heart, MessageCircle } from 'lucide-react-native';
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
} from 'react-native';

import { EMOTION_DATA } from '@/constants/emotions';
import { useRecordStore, Record } from '@/store/recordStore';
import { theme } from '@/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
// 상하단 안전 영역 확보
const TAB_BAR_HEIGHT = 80;
const CARD_HEIGHT = SCREEN_HEIGHT - TAB_BAR_HEIGHT;

/**
 * 누군가와 함께 화면 (피드)
 * - Wide View: 사이드바 제거, 텍스트 영역 최대화
 * - Comment Preview: 하단에 댓글 미리보기/입력 유도 바 배치
 */
export const FeedScreen: React.FC = () => {
  const { getPublicRecords } = useRecordStore();
  const records = getPublicRecords();
  const [activeIndex, setActiveIndex] = useState(0);

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setActiveIndex(viewableItems[0].index);
      }
    },
  ).current;

  const handleEmpathyPress = (id: string) => {
    console.log('Empathy pressed:', id);
    // TODO: 스토어 연동
  };

  const handleMessagePress = (id: string) => {
    console.log('Message pressed:', id);
  };

  const renderCard = ({ item, index }: { item: Record; index: number }) => (
    <FeedCard
      record={item}
      isActive={index === activeIndex}
      onEmpathyPress={handleEmpathyPress}
      onMessagePress={handleMessagePress}
    />
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

  if (records.length === 0) {
    return renderEmptyState();
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={records}
        renderItem={renderCard}
        keyExtractor={item => item.id}
        pagingEnabled
        snapToInterval={CARD_HEIGHT}
        snapToAlignment="start"
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={(_, index) => ({
          length: CARD_HEIGHT,
          offset: CARD_HEIGHT * index,
          index,
        })}
      />

      {/* 페이지 인디케이터 (상단) */}
      <View style={styles.pageIndicatorContainer}>
        <View style={styles.pageIndicator}>
          <Text style={styles.pageText}>
            {activeIndex + 1} / {records.length}
          </Text>
        </View>
      </View>
    </View>
  );
};

// ------------------------------------------------------------------
// 개별 카드 컴포넌트
// ------------------------------------------------------------------

interface FeedCardProps {
  record: Record;
  isActive: boolean;
  onEmpathyPress: (id: string) => void;
  onMessagePress: (id: string) => void;
}

const FeedCard: React.FC<FeedCardProps> = ({
  record,
  isActive,
  onEmpathyPress,
  onMessagePress,
}) => {
  const emotionInfo = EMOTION_DATA[record.emotionLevel];
  const EmotionIcon = emotionInfo.icon;

  // Animation Refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

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

  const handleHeartPress = () => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1.2,
        useNativeDriver: true,
        speed: 50,
      }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 50 }),
    ]).start();
    onEmpathyPress(record.id);
  };

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
    <View style={[styles.cardContainer, { height: CARD_HEIGHT }]}>
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
        {/* 공감 버튼 */}
        <TouchableOpacity
          style={styles.heartButton}
          onPress={handleHeartPress}
          activeOpacity={0.7}
        >
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Heart
              size={28}
              color={
                record.heartsCount > 0
                  ? theme.colors.semantic.error
                  : theme.colors.neutral.gray400
              }
              fill={record.heartsCount > 0 ? theme.colors.semantic.error : 'transparent'}
              strokeWidth={record.heartsCount > 0 ? 0 : 2}
            />
          </Animated.View>
          <Text
            style={[
              styles.heartCount,
              record.heartsCount > 0 && { color: theme.colors.semantic.error },
            ]}
          >
            {record.heartsCount > 0 ? record.heartsCount : ''}
          </Text>
        </TouchableOpacity>

        {/* 댓글 미리보기/입력 바 */}
        <TouchableOpacity
          style={styles.commentBar}
          onPress={() => onMessagePress(record.id)}
          activeOpacity={0.9}
        >
          {record.messagesCount > 0 ? (
            // 댓글이 있을 때: 베스트 댓글 미리보기 느낌
            <View style={styles.commentPreview}>
              <View style={styles.commentIconBadge}>
                <MessageCircle size={14} color="#FFF" fill="#FFF" />
              </View>
              <Text style={styles.commentPreviewText} numberOfLines={1}>
                {record.messagesCount}개의 답장이 도착했어요
              </Text>
            </View>
          ) : (
            // 댓글이 없을 때: 입력 유도
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
    justifyContent: 'space-between', // 상단 컨텐츠와 하단 바 분리
  },
  cardBackground: {
    ...StyleSheet.absoluteFillObject,
  },

  // Content Area
  contentWrapper: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: 80, // 하단 바 공간 확보
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
    ...theme.typography.h3, // 글자 크기 키움
    fontSize: 22,
    lineHeight: 34,
    color: theme.colors.text.primary,
    fontWeight: '500',
    letterSpacing: -0.5,
  },

  // Bottom Interaction Bar
  bottomBar: {
    position: 'absolute',
    bottom: 20, // 탭바 위로 띄움
    left: theme.spacing.md,
    right: theme.spacing.md,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
  },
  heartButton: {
    width: 60,
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
  heartCount: {
    position: 'absolute',
    bottom: 8,
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.text.secondary,
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

  // Indicator
  pageIndicatorContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    width: '100%',
    alignItems: 'center',
  },
  pageIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  pageText: {
    ...theme.typography.caption,
    fontSize: 12,
    color: theme.colors.text.secondary,
    fontWeight: '600',
  },
});
