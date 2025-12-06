import { Heart, MessageCircle, Share2 } from 'lucide-react-native';
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
const TAB_BAR_HEIGHT = 66;
const HEADER_HEIGHT = 0; // 헤더 없이 풀스크린 느낌
const CARD_HEIGHT = SCREEN_HEIGHT - TAB_BAR_HEIGHT - HEADER_HEIGHT;

/**
 * 누군가와 함께 화면 (피드)
 *
 * 몰입형 '레터 뷰(Letter View)' UI
 * - 글래스모피즘 & 젠틀 모션 애니메이션
 * - '소비'가 아닌 '교감'에 초점
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

  const handleSharePress = (id: string) => {
    console.log('Share pressed:', id);
  };

  const renderCard = ({ item, index }: { item: Record; index: number }) => (
    <FeedCard
      record={item}
      isActive={index === activeIndex}
      onEmpathyPress={handleEmpathyPress}
      onMessagePress={handleMessagePress}
      onSharePress={handleSharePress}
    />
  );

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

      {/* 페이지 인디케이터 (상단 중앙) */}
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
  onSharePress: (id: string) => void;
}

const FeedCard: React.FC<FeedCardProps> = ({
  record,
  isActive,
  onEmpathyPress,
  onMessagePress,
  onSharePress,
}) => {
  const emotionInfo = EMOTION_DATA[record.emotionLevel];
  const EmotionIcon = emotionInfo.icon;

  // Animation Refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  // 화면에 나타날 때 실행되는 애니메이션
  useEffect(() => {
    if (isActive) {
      // 1. 진입 애니메이션 (페이드 + 슬라이드 업)
      fadeAnim.setValue(0);
      slideAnim.setValue(30);

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
      ]).start();

      // 2. 아이콘 둥둥 떠다니는 애니메이션 (무한 반복)
      Animated.loop(
        Animated.sequence([
          Animated.timing(floatAnim, {
            toValue: -10,
            duration: 2000,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.sin),
          }),
          Animated.timing(floatAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.sin),
          }),
        ]),
      ).start();
    } else {
      // 화면에서 사라질 때 초기화
      fadeAnim.setValue(0);
      slideAnim.setValue(30);
      floatAnim.setValue(0);
    }
  }, [isActive, fadeAnim, slideAnim, floatAnim]);

  const handleHeartPress = () => {
    // 하트 펄스 애니메이션
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1.3,
        useNativeDriver: true,
        speed: 50,
        bounciness: 10,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 50,
        bounciness: 10,
      }),
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

  // 글자 수에 따른 정렬 스타일 결정
  const isShortText = record.content.length < 80;

  return (
    <View style={[styles.cardContainer, { height: CARD_HEIGHT }]}>
      {/* 1. 배경 레이어 */}
      <View style={[styles.cardBackground, { backgroundColor: `${emotionInfo.color}15` }]} />

      {/* 2. 메인 콘텐츠 (애니메이션 적용) */}
      <Animated.View
        style={[
          styles.cardContent,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* 감정 아이콘 (둥둥 떠다님) */}
        <Animated.View style={{ transform: [{ translateY: floatAnim }] }}>
          <View style={[styles.emotionBadge, { backgroundColor: emotionInfo.color }]}>
            <EmotionIcon size={36} color="#FFFFFF" strokeWidth={2} />
          </View>
        </Animated.View>

        <Text style={[styles.emotionLabel, { color: emotionInfo.color }]}>
          {emotionInfo.label}
        </Text>

        {/* 텍스트 컨테이너 (글래스모피즘 느낌) */}
        <View style={styles.glassContainer}>
          <Text
            style={[styles.contentText, isShortText ? styles.textCenter : styles.textLeft]}
          >
            {record.content}
          </Text>
        </View>

        <Text style={styles.timeText}>{getRelativeTime(record.createdAt)}</Text>
      </Animated.View>

      {/* 3. 우측 액션 버튼 */}
      <View style={styles.actionBar}>
        {/* 공감 */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleHeartPress}
          activeOpacity={0.8}
        >
          <View style={styles.iconBackdrop}>
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <Heart
                size={28}
                color={
                  record.heartsCount > 0
                    ? theme.colors.semantic.error
                    : theme.colors.neutral.gray600
                }
                fill={record.heartsCount > 0 ? theme.colors.semantic.error : 'transparent'}
                strokeWidth={record.heartsCount > 0 ? 0 : 2}
              />
            </Animated.View>
          </View>
          <Text style={styles.actionCount}>{record.heartsCount || '공감'}</Text>
        </TouchableOpacity>

        {/* 댓글 */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onMessagePress(record.id)}
          activeOpacity={0.8}
        >
          <View style={styles.iconBackdrop}>
            <MessageCircle size={26} color={theme.colors.neutral.gray600} strokeWidth={2} />
          </View>
          <Text style={styles.actionCount}>{record.messagesCount || '댓글'}</Text>
        </TouchableOpacity>

        {/* 공유 */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onSharePress(record.id)}
          activeOpacity={0.8}
        >
          <View style={styles.iconBackdrop}>
            <Share2 size={24} color={theme.colors.neutral.gray600} strokeWidth={2} />
          </View>
          <Text style={styles.actionCount}>공유</Text>
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
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContent: {
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyTitle: {
    ...theme.typography.body,
    fontSize: 18,
    fontWeight: '600',
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

  // Card Structure
  cardContainer: {
    width: SCREEN_WIDTH,
    position: 'relative',
    overflow: 'hidden',
  },
  cardBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingRight: 80, // 액션 버튼 공간 확보
  },

  // Elements
  emotionBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  emotionLabel: {
    ...theme.typography.h3,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: theme.spacing.xl,
    letterSpacing: 0.5,
  },

  // Text Container (Glassmorphism look)
  glassContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 24,
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
    width: '100%',
    minHeight: 200,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
  },
  contentText: {
    ...theme.typography.body,
    fontSize: 17,
    color: theme.colors.text.primary,
    lineHeight: 28,
  },
  textCenter: {
    textAlign: 'center',
  },
  textLeft: {
    textAlign: 'left',
  },
  timeText: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.lg,
  },

  // Action Bar
  actionBar: {
    position: 'absolute',
    right: 16,
    bottom: 80,
    alignItems: 'center',
    zIndex: 10,
  },
  actionButton: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconBackdrop: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionCount: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    fontWeight: '600',
    fontSize: 12,
  },

  // Page Indicator
  pageIndicatorContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 100,
  },
  pageIndicator: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  pageText: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    fontWeight: '600',
  },
});
