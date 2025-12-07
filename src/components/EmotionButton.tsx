import React, { useEffect } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  StyleProp,
  ViewStyle,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
} from 'react-native-reanimated';

import { EmotionLevel, EMOTION_DATA } from '@/constants/emotions';
import { theme } from '@/theme';

export interface EmotionButtonProps {
  emotionLevel: EmotionLevel;
  isSelected?: boolean;
  onPress?: (level: EmotionLevel) => void;
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function EmotionButton({
  emotionLevel,
  isSelected = false,
  onPress,
  size = 'medium',
  disabled = false,
  style,
}: EmotionButtonProps) {
  // Reanimated 애니메이션 값
  const scale = useSharedValue(1);
  const opacity = useSharedValue(isSelected ? 1 : 0.7);

  const emotionInfo = EMOTION_DATA[emotionLevel];

  // 선택 상태 변경 시 애니메이션
  useEffect(() => {
    if (isSelected) {
      scale.value = withTiming(1.1, { duration: 225 });
      opacity.value = withTiming(1, { duration: 150 });
    } else {
      scale.value = withTiming(1, { duration: 225 });
      opacity.value = withTiming(0.7, { duration: 150 });
    }
  }, [isSelected, scale, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePress = () => {
    if (!disabled && onPress) {
      // 탭 애니메이션
      scale.value = withSequence(
        withTiming(0.95, { duration: 120 }),
        withTiming(isSelected ? 1.1 : 1, { duration: 120 }),
      );

      onPress(emotionLevel);
    }
  };

  const containerSize = {
    small: 48,
    medium: 64,
    large: 80,
  }[size];

  const iconSize = {
    small: 24,
    medium: 32,
    large: 40,
  }[size];

  const IconComponent = emotionInfo.icon;

  const labelSize = {
    small: 10,
    medium: 12,
    large: 14,
  }[size];

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.9}
      style={style}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`감정 ${emotionInfo.label}`}
      accessibilityHint={`현재 ${isSelected ? '선택됨' : '선택 안 됨'}. 탭하여 ${
        emotionInfo.label
      } 감정을 선택하세요.`}
      accessibilityState={{
        selected: isSelected,
        disabled,
      }}
    >
      <Animated.View
        style={[
          styles.container,
          {
            width: containerSize,
            height: containerSize,
            backgroundColor: isSelected ? emotionInfo.color : 'transparent',
            borderColor: emotionInfo.color,
          },
          animatedStyle,
          disabled && styles.disabled,
        ]}
      >
        <IconComponent
          size={iconSize}
          color={isSelected ? theme.colors.neutral.white : emotionInfo.color}
          strokeWidth={2.5}
        />
      </Animated.View>
      <Text
        style={[
          styles.label,
          {
            fontSize: labelSize,
            color: isSelected ? emotionInfo.color : theme.colors.neutral.gray600,
          },
        ]}
      >
        {emotionInfo.label}
      </Text>
    </TouchableOpacity>
  );
}

// 여러 개의 EmotionButton을 그룹으로 관리하는 컴포넌트
export interface EmotionSelectorProps {
  selectedLevel?: EmotionLevel | null;
  onSelect?: (level: EmotionLevel) => void;
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function EmotionSelector({
  selectedLevel,
  onSelect,
  size = 'medium',
  disabled = false,
  style,
}: EmotionSelectorProps) {
  const emotions: EmotionLevel[] = [1, 2, 3, 4, 5];

  return (
    <View style={[styles.selectorContainer, style]}>
      {emotions.map(level => (
        <EmotionButton
          key={level}
          emotionLevel={level}
          isSelected={selectedLevel === level}
          onPress={onSelect}
          size={size}
          disabled={disabled}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    borderWidth: 2,
    borderColor: theme.colors.neutral.gray300,
  },
  label: {
    marginTop: theme.spacing.xs,
    textAlign: 'center',
    ...theme.typography.caption,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.4,
  },
  selectorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
});

export default EmotionButton;
