import { Check, Flag, Heart, MessageCircle } from 'lucide-react-native';
import React, { useEffect, useRef, memo } from 'react';
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
export const FeedCard = memo(({
  record,
  isActive,
  onEmpathyPress,
  onMessagePress,
  onMorePress,
  cardHeight,
}: FeedCardProps) => {
  const emotionInfo = EMOTION_DATA[record.emotionLevel];
  const EmotionIcon = emotionInfo.icon;

  // Reanimated 애니메이션 값
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (isActive && !hasAnimated.current) {
      // 처음 활성화될 때만 애니메이션 실행
      hasAnimated.current = true;

      opacity.value = withTiming(1, {
        duration: 225,
        easing: Easing.out(Easing.quad),
      });
      translateY.value = withTiming(0, {
        duration: 225,
        easing: Easing.out(Easing.quad),
      });
    } else if (isActive && hasAnimated.current) {
      // 이미 본 카드는 즉시 표시
      opacity.value = 1;
      translateY.value = 0;
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

      {/* 신고 버튼 (우측 상단) */}
      <TouchableOpacity
        style={styles.reportButton}
        onPress={() => onMorePress(record.id)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        accessibilityLabel="신고하기"
        accessibilityHint="이 게시물을 신고합니다"
      >
        <Flag size={18} color={theme.colors.text.secondary} strokeWidth={1.5} />
      </TouchableOpacity>

      {/* 메인 콘텐츠 영역 */}
      <View style={styles.contentWrapper}>
        <Animated.View style={[styles.mainContent, animatedStyle]}>
          {/* 상단: 날짜 및 감정 아이콘 */}
          <View style={styles.headerRow}>
            <View style={[styles.emotionBadge, { backgroundColor: emotionInfo.color }]}>
              <EmotionIcon size={24} color="#FFFFFF" strokeWidth={2.5} />
            </View>
            <Text style={styles.timeText}>{getRelativeTime(record.createdAt)}</Text>
          </View>

          {/* 중단: 텍스트 (최대 너비 사용) */}
          <View style={styles.textContainer}>
            <Text style={styles.contentText}>{record.content}</Text>
          </View>
        </Animated.View>
      </View>

      {/* 하단: 인터랙션 바 (틱톡/릴스 스타일) */}
      <View style={styles.bottomBar}>
        {/* 좌측: 공감 버튼 */}
        <TouchableOpacity
          style={styles.heartSection}
          onPress={() => onEmpathyPress(record.id, record.hasEmpathized)}
          activeOpacity={0.7}
          accessibilityLabel={record.hasEmpathized ? '공감 취소하기' : '공감하기'}
          accessibilityHint={
            record.hasEmpathized
              ? '탭하여 공감을 취소합니다'
              : '탭하여 공감을 표시합니다'
          }
        >
          <Heart
            size={22}
            color={
              record.hasEmpathized
                ? theme.colors.semantic.error
                : theme.colors.text.primary
            }
            fill={record.hasEmpathized ? theme.colors.semantic.error : 'transparent'}
            strokeWidth={record.hasEmpathized ? 0 : 2}
          />
          <Text
            style={[
              styles.heartCount,
              record.hasEmpathized && styles.heartCountActive,
            ]}
          >
            {record.heartsCount}
          </Text>
        </TouchableOpacity>

        {/* 구분선 */}
        <View style={styles.divider} />

        {/* 우측: 댓글 입력 유도 영역 */}
        <TouchableOpacity
          style={styles.commentSection}
          onPress={() => onMessagePress(record.id)}
          activeOpacity={0.8}
          accessibilityLabel={
            record.hasSentMessage
              ? '따뜻한 말 전달 완료'
              : `따뜻한 말 건네기, ${record.messagesCount}개의 메시지`
          }
          accessibilityHint="탭하여 따뜻한 말을 선택합니다"
        >
          <MessageCircle size={20} color={theme.colors.text.secondary} />
          <Text style={styles.commentPlaceholder}>
            {record.hasSentMessage ? '전달했어요' : '따뜻한 말을 건네보세요...'}
          </Text>

          {/* 우측: 댓글 수 뱃지 (미전송 + 댓글 있을 때) */}
          {record.messagesCount > 0 && !record.hasSentMessage && (
            <View style={styles.commentBadge}>
              <Text style={styles.commentBadgeText}>{record.messagesCount}</Text>
            </View>
          )}

          {/* 우측: 체크 아이콘 (전송 완료 시) */}
          {record.hasSentMessage && (
            <Check size={18} color={theme.colors.semantic.success} />
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

  // Report Button (top-right)
  reportButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    right: theme.spacing.md,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.sm,
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
    ...theme.shadows.sm,
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

  // Bottom Interaction Bar (틱톡/릴스 스타일)
  bottomBar: {
    position: 'absolute',
    bottom: 16,
    left: theme.spacing.md,
    right: theme.spacing.md,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: theme.colors.neutral.gray200,
  },
  heartSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingRight: 12,
    gap: 6,
  },
  heartCount: {
    ...theme.typography.body,
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  heartCountActive: {
    color: theme.colors.semantic.error,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: theme.colors.neutral.gray200,
    marginRight: 12,
  },
  commentSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  commentPlaceholder: {
    flex: 1,
    ...theme.typography.body,
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  commentBadge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: theme.colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  commentBadgeText: {
    ...theme.typography.caption,
    fontSize: 11,
    fontWeight: '700',
    color: '#FFF',
  },
});

export default FeedCard;
