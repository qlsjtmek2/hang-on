/**
 * StepIndicator - 단계 표시기 컴포넌트
 *
 * 멀티스텝 플로우의 현재 진행 상황을 시각적으로 표시합니다.
 * 점(dot) 또는 바(bar) 형태를 지원합니다.
 *
 * 사용법:
 * <StepIndicator currentStep={1} totalSteps={3} />
 * <StepIndicator currentStep={2} totalSteps={3} variant="bar" />
 */

import React, { memo, useEffect } from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

import { theme } from '@/theme';

export interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  variant?: 'dot' | 'bar';
  labels?: string[];
  showLabels?: boolean;
  style?: StyleProp<ViewStyle>;
}

/**
 * StepIndicator
 *
 * 현재 단계를 표시하는 인디케이터 컴포넌트
 * - dot: 점 형태 (기본값)
 * - bar: 바/진행률 형태
 */
export const StepIndicator = memo(({
  currentStep,
  totalSteps,
  variant = 'dot',
  labels,
  showLabels = false,
  style,
}: StepIndicatorProps) => {
  if (variant === 'bar') {
    return (
      <BarIndicator
        currentStep={currentStep}
        totalSteps={totalSteps}
        labels={labels}
        showLabels={showLabels}
        style={style}
      />
    );
  }

  return (
    <DotIndicator
      currentStep={currentStep}
      totalSteps={totalSteps}
      labels={labels}
      showLabels={showLabels}
      style={style}
    />
  );
});

interface IndicatorInternalProps {
  currentStep: number;
  totalSteps: number;
  labels?: string[];
  showLabels: boolean;
  style?: StyleProp<ViewStyle>;
}

/**
 * DotIndicator - 점 형태 인디케이터
 */
const DotIndicator = memo(({
  currentStep,
  totalSteps,
  labels,
  showLabels,
  style,
}: IndicatorInternalProps) => {
  return (
    <View
      style={[styles.container, style]}
      accessible={true}
      accessibilityLabel={`${totalSteps}단계 중 ${currentStep}단계`}
      accessibilityRole="progressbar"
      accessibilityValue={{
        min: 1,
        max: totalSteps,
        now: currentStep,
      }}
    >
      <View style={styles.dotContainer}>
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;

          return (
            <AnimatedDot
              key={`dot-${index}`}
              isActive={isActive}
              isCompleted={isCompleted}
            />
          );
        })}
      </View>

      {showLabels && labels && labels[currentStep - 1] && (
        <Text style={styles.currentLabel}>{labels[currentStep - 1]}</Text>
      )}
    </View>
  );
});

interface AnimatedDotProps {
  isActive: boolean;
  isCompleted: boolean;
}

/**
 * AnimatedDot - 애니메이션이 적용된 단일 점
 */
const AnimatedDot = memo(({
  isActive,
  isCompleted,
}: AnimatedDotProps) => {
  const scale = useSharedValue(isActive ? 1.3 : 1);

  useEffect(() => {
    scale.value = withTiming(isActive ? 1.2 : 1, { duration: 225 });
  }, [isActive, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.dot,
        isActive && styles.dotActive,
        isCompleted && styles.dotCompleted,
        animatedStyle,
      ]}
    />
  );
});

/**
 * BarIndicator - 바 형태 인디케이터
 */
const BarIndicator = memo(({
  currentStep,
  totalSteps,
  labels,
  showLabels,
  style,
}: IndicatorInternalProps) => {
  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;
  const progressWidth = useSharedValue(progress);

  useEffect(() => {
    progressWidth.value = withTiming(progress, { duration: 300 });
  }, [progress, progressWidth]);

  const animatedProgressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  return (
    <View
      style={[styles.container, style]}
      accessible={true}
      accessibilityLabel={`${totalSteps}단계 중 ${currentStep}단계`}
      accessibilityRole="progressbar"
      accessibilityValue={{
        min: 1,
        max: totalSteps,
        now: currentStep,
      }}
    >
      {/* 단계 라벨 */}
      {showLabels && labels && (
        <View style={styles.barLabelsContainer}>
          {labels.map((label, index) => {
            const stepNumber = index + 1;
            const isActive = stepNumber === currentStep;
            const isCompleted = stepNumber < currentStep;

            return (
              <Text
                key={`label-${index}`}
                style={[
                  styles.barLabel,
                  isActive && styles.barLabelActive,
                  isCompleted && styles.barLabelCompleted,
                ]}
              >
                {label}
              </Text>
            );
          })}
        </View>
      )}

      {/* 진행 바 */}
      <View style={styles.barContainer}>
        {/* 배경 바 */}
        <View style={styles.barBackground} />

        {/* 진행 바 */}
        <Animated.View style={[styles.barProgress, animatedProgressStyle]} />

        {/* 단계 점들 */}
        <View style={styles.barDotsContainer}>
          {Array.from({ length: totalSteps }).map((_, index) => {
            const stepNumber = index + 1;
            const isActive = stepNumber === currentStep;
            const isCompleted = stepNumber < currentStep;

            return (
              <View
                key={`bar-dot-${index}`}
                style={[
                  styles.barDot,
                  isActive && styles.barDotActive,
                  isCompleted && styles.barDotCompleted,
                ]}
              >
                {(isActive || isCompleted) && (
                  <Text style={styles.barDotText}>{stepNumber}</Text>
                )}
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
});

const DOT_SIZE = 8;
const DOT_SIZE_ACTIVE = 10;
const BAR_DOT_SIZE = 24;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },

  // Dot Indicator Styles
  dotContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: theme.colors.neutral.gray300,
  },
  dotActive: {
    width: DOT_SIZE_ACTIVE,
    height: DOT_SIZE_ACTIVE,
    borderRadius: DOT_SIZE_ACTIVE / 2,
    backgroundColor: theme.colors.primary.main,
  },
  dotCompleted: {
    backgroundColor: theme.colors.primary.light,
  },
  currentLabel: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },

  // Bar Indicator Styles
  barLabelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: theme.spacing.sm,
  },
  barLabel: {
    ...theme.typography.caption,
    color: theme.colors.neutral.gray500,
    flex: 1,
    textAlign: 'center',
  },
  barLabelActive: {
    color: theme.colors.primary.main,
    fontWeight: '600',
  },
  barLabelCompleted: {
    color: theme.colors.primary.light,
  },
  barContainer: {
    width: '100%',
    height: BAR_DOT_SIZE,
    justifyContent: 'center',
    position: 'relative',
  },
  barBackground: {
    position: 'absolute',
    left: BAR_DOT_SIZE / 2,
    right: BAR_DOT_SIZE / 2,
    height: 4,
    backgroundColor: theme.colors.neutral.gray200,
    borderRadius: 2,
  },
  barProgress: {
    position: 'absolute',
    left: BAR_DOT_SIZE / 2,
    height: 4,
    backgroundColor: theme.colors.primary.main,
    borderRadius: 2,
  },
  barDotsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  barDot: {
    width: BAR_DOT_SIZE,
    height: BAR_DOT_SIZE,
    borderRadius: BAR_DOT_SIZE / 2,
    backgroundColor: theme.colors.neutral.gray200,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.neutral.white,
  },
  barDotActive: {
    backgroundColor: theme.colors.primary.main,
  },
  barDotCompleted: {
    backgroundColor: theme.colors.primary.light,
  },
  barDotText: {
    ...theme.typography.caption,
    color: theme.colors.neutral.white,
    fontWeight: '600',
    fontSize: 10,
  },
});

export default StepIndicator;
