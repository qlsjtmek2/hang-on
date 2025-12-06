import { MessageCircle, MoreHorizontal } from 'lucide-react-native';
import React, { useEffect, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

import { HeartButton } from '@/components/HeartButton';
import { EMOTION_DATA } from '@/constants/emotions';
import { FeedItem } from '@/store/feedStore';
import { theme } from '@/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export interface FeedCardProps {
  record: FeedItem;
  isActive: boolean;
  onEmpathyPress: (id: string, hasEmpathized: boolean) => void;
  onMessagePress: (id: string) => void;
  onMorePress: (id: string) => void;
  cardHeight: number;
}

/**
 * FeedCard - 피드 아이템 카드 컴포넌트
 *
 * React.memo로 최적화되어 불필요한 리렌더링을 방지합니다.
 * Reanimated를 사용한 부드러운 fade/slide 애니메이션을 제공합니다.
 */
export const FeedCard = memo(function FeedCard({
  record,
  isActive,
  onEmpathyPress,
  onMessagePress,
  onMorePress,
  cardHeight,
}: FeedCardProps) {
  const emotionInfo = EMOTION_DATA[record.emotionLevel];
  const EmotionIcon = emotionInfo.icon;

  // Reanimated 애니메이션 값
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    if (isActive) {
      opacity.value = 0;
      translateY.value = 20;

      opacity.value = withTiming(1, {
        duration: 600,
        easing: Easing.out(Easing.quad),
      });
      translateY.value = withTiming(0, {
        duration: 600,
        easing: Easing.out(Easing.quad),
      });
    }
  }, [isActive, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

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

      {/* 더보기 버튼 (우측 상단) */}
      <TouchableOpacity
        style={styles.moreButton}
        onPress={() => onMorePress(record.id)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        accessibilityLabel="더보기"
        accessibilityHint="신고하기 옵션을 엽니다"
      >
        <MoreHorizontal size={24} color={theme.colors.text.secondary} strokeWidth={2} />
      </TouchableOpacity>

      {/* 메인 콘텐츠 영역 */}
      <View style={styles.contentWrapper}>
        <Animated.View style={[styles.mainContent, animatedStyle]}>
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
});

const styles = StyleSheet.create({
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

  // More Button (top-right)
  moreButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    right: theme.spacing.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 10,
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

export default FeedCard;
