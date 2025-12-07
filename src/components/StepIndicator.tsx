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
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

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
export const StepIndicator = memo(
  ({
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
  },
);

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
const DotIndicator = memo(
  ({ currentStep, totalSteps, labels, showLabels, style }: IndicatorInternalProps) => {
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
              <AnimatedDot key={`dot-${index}`} isActive={isActive} isCompleted={isCompleted} />
            );
          })}
        </View>

        {showLabels && labels && labels[currentStep - 1] && (
          <Text style={styles.currentLabel}>{labels[currentStep - 1]}</Text>
        )}
      </View>
    );
  },
);

interface AnimatedDotProps {
  isActive: boolean;
  isCompleted: boolean;
}

/**
 * AnimatedDot - 애니메이션이 적용된 단일 점
 */
const AnimatedDot = memo(({ isActive, isCompleted }: AnimatedDotProps) => {
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
const BarIndicator = memo(
  ({ currentStep, totalSteps, labels, showLabels, style }: IndicatorInternalProps) => {
    // 각 원의 중심 위치 계산 (flex: 1 균등 배분 기준)
    const getStepPosition = (step: number) => ((2 * step - 1) / (2 * totalSteps)) * 100;
    const startPosition = getStepPosition(1);
    const currentPosition = getStepPosition(currentStep);
    const progressPercent = currentPosition - startPosition;

    const progressWidth = useSharedValue(progressPercent);

    useEffect(() => {
      progressWidth.value = withTiming(progressPercent, { duration: 300 });
    }, [progressPercent, progressWidth]);

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
        {/* 진행 바 (배경 + 진행) */}
        <View style={styles.barTrack}>
          <View style={styles.barBackground} />
          <Animated.View style={[styles.barProgress, animatedProgressStyle]} />
        </View>

        {/* 단계별 원 + 라벨 (정렬된 구조) */}
        <View style={styles.barStepsContainer}>
          {Array.from({ length: totalSteps }).map((_, index) => {
            const stepNumber = index + 1;
            const isActive = stepNumber === currentStep;
            const isCompleted = stepNumber < currentStep;

            return (
              <View key={`step-${index}`} style={styles.barStepItem}>
                <View
                  style={[
                    styles.barDot,
                    isActive && styles.barDotActive,
                    isCompleted && styles.barDotCompleted,
                  ]}
                >
                  {(isActive || isCompleted) && <Text style={styles.barDotText}>{stepNumber}</Text>}
                </View>
                {showLabels && labels && labels[index] && (
                  <Text
                    style={[
                      styles.barLabel,
                      isActive && styles.barLabelActive,
                      isCompleted && styles.barLabelCompleted,
                    ]}
                  >
                    {labels[index]}
                  </Text>
                )}
              </View>
            );
          })}
        </View>
      </View>
    );
  },
);

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
  barTrack: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: BAR_DOT_SIZE / 2 - 2,
    height: 4,
  },
  barBackground: {
    position: 'absolute',
    left: '16.67%',
    right: '16.67%',
    height: 4,
    backgroundColor: theme.colors.neutral.gray200,
    borderRadius: 2,
  },
  barProgress: {
    position: 'absolute',
    left: '16.67%',
    height: 4,
    backgroundColor: theme.colors.primary.main,
    borderRadius: 2,
  },
  barStepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  barStepItem: {
    alignItems: 'center',
    flex: 1,
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
  barLabel: {
    ...theme.typography.caption,
    color: theme.colors.neutral.gray500,
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  },
  barLabelActive: {
    color: theme.colors.primary.main,
    fontWeight: '600',
  },
  barLabelCompleted: {
    color: theme.colors.primary.light,
  },
});

export default StepIndicator;
