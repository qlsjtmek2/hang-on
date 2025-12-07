/**
 * SkeletonLoader - 스켈레톤 로딩 컴포넌트
 *
 * 콘텐츠 로딩 중 레이아웃 자리 표시자를 제공합니다.
 * Reanimated shimmer 애니메이션을 사용합니다.
 *
 * 사용법:
 * <RecordCardSkeleton />
 * <SkeletonLoader width={100} height={20} />
 */

import React, { useEffect, memo } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  Dimensions,
  StyleProp,
  ViewStyle,
  DimensionValue,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
  Easing,
} from 'react-native-reanimated';

import { theme } from '@/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface SkeletonProps {
  width?: DimensionValue;
  height?: number;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * 기본 스켈레톤 컴포넌트
 *
 * shimmer 애니메이션이 적용된 자리 표시자입니다.
 */
export const Skeleton = memo(({
  width = '100%',
  height = 16,
  borderRadius = 4,
  style,
}: SkeletonProps) => {
  const shimmerProgress = useSharedValue(0);

  useEffect(() => {
    shimmerProgress.value = withRepeat(
      withTiming(1, {
        duration: 1500,
        easing: Easing.linear,
      }),
      -1, // 무한 반복
      false, // 역방향 없음
    );
  }, [shimmerProgress]);

  const animatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      shimmerProgress.value,
      [0, 1],
      [-100, 100],
    );

    return {
      transform: [{ translateX: `${translateX}%` as unknown as number }],
    };
  });

  return (
    <View
      style={[
        styles.skeletonBase,
        {
          width: typeof width === 'number' ? width : width,
          height,
          borderRadius,
        },
        style,
      ]}
      accessibilityLabel="로딩 중"
      accessibilityRole="progressbar"
    >
      <Animated.View style={[styles.shimmer, animatedStyle]} />
    </View>
  );
});

/**
 * RecordCard 스켈레톤
 *
 * RecordCard 레이아웃과 동일한 구조의 스켈레톤입니다.
 * 내 기록 목록에서 로딩 시 표시됩니다.
 */
export const RecordCardSkeleton = memo(() => {
  return (
    <View
      style={styles.recordCardContainer}
      accessible={true}
      accessibilityLabel="기록 로딩 중"
    >
      {/* Header: 감정 아이콘과 시간 */}
      <View style={styles.recordCardHeader}>
        <View style={styles.recordCardEmotionContainer}>
          <Skeleton width={32} height={32} borderRadius={16} />
          <View style={{ marginLeft: theme.spacing.xs }}>
            <Skeleton width={50} height={14} />
          </View>
        </View>
        <Skeleton width={60} height={14} />
      </View>

      {/* Content: 3줄 텍스트 */}
      <View style={styles.recordCardContent}>
        <Skeleton width="100%" height={16} style={{ marginBottom: 8 }} />
        <Skeleton width="90%" height={16} style={{ marginBottom: 8 }} />
        <Skeleton width="70%" height={16} />
      </View>

      {/* Footer: 공감과 메시지 */}
      <View style={styles.recordCardFooter}>
        <View style={styles.recordCardAction}>
          <Skeleton width={16} height={16} borderRadius={8} />
          <View style={{ marginLeft: theme.spacing.xs }}>
            <Skeleton width={20} height={14} />
          </View>
        </View>
        <View style={styles.recordCardAction}>
          <Skeleton width={16} height={16} borderRadius={8} />
          <View style={{ marginLeft: theme.spacing.xs }}>
            <Skeleton width={20} height={14} />
          </View>
        </View>
      </View>
    </View>
  );
});

interface RecordCardSkeletonListProps {
  count?: number;
}

/**
 * RecordCard 스켈레톤 리스트
 *
 * 여러 개의 RecordCardSkeleton을 렌더링합니다.
 */
export const RecordCardSkeletonList = memo(({
  count = 3,
}: RecordCardSkeletonListProps) => {
  return (
    <View>
      {Array.from({ length: count }).map((_, index) => (
        <RecordCardSkeleton key={`skeleton-${index}`} />
      ))}
    </View>
  );
});

/**
 * FeedCard 스켈레톤
 *
 * FeedCard 레이아웃과 유사한 구조의 스켈레톤입니다.
 * 피드 화면 초기 로딩 시 표시됩니다.
 */
interface FeedCardSkeletonProps {
  cardHeight: number;
}

export const FeedCardSkeleton = memo(({
  cardHeight,
}: FeedCardSkeletonProps) => {
  return (
    <View
      style={[styles.feedCardContainer, { height: cardHeight }]}
      accessible={true}
      accessibilityLabel="피드 로딩 중"
    >
      {/* 더보기 버튼 자리 */}
      <View style={styles.feedCardMoreButton}>
        <Skeleton width={24} height={24} borderRadius={12} />
      </View>

      {/* 콘텐츠 영역 */}
      <View style={styles.feedCardContent}>
        {/* 헤더: 감정 아이콘 + 시간 */}
        <View style={styles.feedCardHeader}>
          <Skeleton width={40} height={40} borderRadius={20} />
          <View style={{ marginLeft: theme.spacing.sm }}>
            <Skeleton width={60} height={14} />
          </View>
        </View>

        {/* 텍스트 콘텐츠 */}
        <View style={styles.feedCardText}>
          <Skeleton width="100%" height={22} style={{ marginBottom: 12 }} />
          <Skeleton width="85%" height={22} style={{ marginBottom: 12 }} />
          <Skeleton width="60%" height={22} />
        </View>
      </View>

      {/* 하단 바 */}
      <View style={styles.feedCardBottomBar}>
        <View style={styles.feedCardHeartWrapper}>
          <Skeleton width={40} height={40} borderRadius={20} />
        </View>
        <View style={styles.feedCardCommentBar}>
          <Skeleton width="80%" height={20} />
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  // 기본 스켈레톤 스타일
  skeletonBase: {
    backgroundColor: theme.colors.neutral.gray200,
    overflow: 'hidden',
  },
  shimmer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.neutral.gray100,
    opacity: 0.5,
  },

  // RecordCard 스켈레톤 스타일
  recordCardContainer: {
    backgroundColor: theme.colors.neutral.white,
    borderRadius: 12,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  recordCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  recordCardEmotionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recordCardContent: {
    marginBottom: theme.spacing.sm,
  },
  recordCardFooter: {
    flexDirection: 'row',
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.neutral.gray200,
  },
  recordCardAction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },

  // FeedCard 스켈레톤 스타일
  feedCardContainer: {
    width: SCREEN_WIDTH,
    backgroundColor: theme.colors.neutral.gray100,
  },
  feedCardMoreButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    right: theme.spacing.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  feedCardContent: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: 80,
  },
  feedCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  feedCardText: {
    width: '100%',
  },
  feedCardBottomBar: {
    position: 'absolute',
    bottom: 16,
    left: theme.spacing.md,
    right: theme.spacing.md,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
  },
  feedCardHeartWrapper: {
    width: 70,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
    backgroundColor: '#FFF',
    borderRadius: 30,
  },
  feedCardCommentBar: {
    flex: 1,
    height: 56,
    backgroundColor: '#FFF',
    borderRadius: 28,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
});

export default Skeleton;
