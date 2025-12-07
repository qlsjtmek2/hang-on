import { PenLine } from 'lucide-react-native';
import React from 'react';
import { Text, StyleSheet, ViewStyle, Pressable } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

import { theme } from '@/theme';

interface FloatingActionButtonProps {
  onPress: () => void;
  label?: string;
  icon?: React.ReactNode;
  style?: ViewStyle;
  disabled?: boolean;
  testID?: string;
}

/**
 * 플로팅 액션 버튼 컴포넌트
 *
 * 화면 우하단에 고정되어 주요 액션(털어놓기)을 트리거
 *
 * @example
 * <FloatingActionButton
 *   onPress={() => navigation.navigate('EmotionSelect')}
 *   icon={<PenLine size={24} color="#fff" />}
 *   label="털어놓기"
 * />
 */
export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onPress,
  label,
  icon,
  style,
  disabled = false,
  testID,
}) => {
  const scale = useSharedValue(1);

  // 기본 아이콘: PenLine (털어놓기)
  const defaultIcon = <PenLine size={24} color={theme.colors.text.inverse} strokeWidth={2.5} />;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withTiming(0.95, { duration: 150 });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 150 });
  };

  return (
    <Animated.View style={[styles.container, animatedStyle, disabled && styles.disabled, style]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        style={styles.button}
        testID={testID}
        accessibilityRole="button"
        accessibilityLabel={label || '털어놓기'}
        accessibilityHint="감정을 기록하는 화면으로 이동합니다"
        accessibilityState={{ disabled }}
      >
        {icon || defaultIcon}
        {label && <Text style={styles.label}>{label}</Text>}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    shadowColor: theme.colors.neutral.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary.main,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: 28,
    minWidth: 56,
    minHeight: 56,
  },
  label: {
    ...theme.typography.button,
    color: theme.colors.text.inverse,
    marginLeft: theme.spacing.sm,
  },
  disabled: {
    opacity: 0.5,
  },
});
