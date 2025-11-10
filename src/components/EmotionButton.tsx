import React, { useEffect, useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  View,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { theme } from '@/theme';

export type EmotionLevel = 1 | 2 | 3 | 4 | 5;

interface EmotionButtonProps {
  emotionLevel: EmotionLevel;
  isSelected?: boolean;
  onPress?: (level: EmotionLevel) => void;
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

// 감정 날씨 데이터 매핑
const emotionData: Record<EmotionLevel, { emoji: string; label: string; color: string }> = {
  1: {
    emoji: '⛈️',
    label: '폭풍',
    color: theme.colors.emotion.stormy,
  },
  2: {
    emoji: '🌧️',
    label: '비',
    color: theme.colors.emotion.rainy,
  },
  3: {
    emoji: '☁️',
    label: '흐림',
    color: theme.colors.emotion.cloudy,
  },
  4: {
    emoji: '⛅',
    label: '구름',
    color: theme.colors.emotion.partly,
  },
  5: {
    emoji: '☀️',
    label: '맑음',
    color: theme.colors.emotion.sunny,
  },
};

export function EmotionButton({
  emotionLevel,
  isSelected = false,
  onPress,
  size = 'medium',
  disabled = false,
  style,
}: EmotionButtonProps) {
  // 애니메이션 값
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(isSelected ? 1 : 0.7)).current;

  const emotionInfo = emotionData[emotionLevel];

  // 선택 상태 변경 시 애니메이션
  useEffect(() => {
    if (isSelected) {
      // 선택 애니메이션: 스케일 업 + 회전 + 페이드 인
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1.2,
          useNativeDriver: true,
          tension: 50,
          friction: 5,
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // 선택 해제 애니메이션: 원래 크기로 복귀
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 50,
          friction: 5,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.7,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isSelected, scaleAnim, rotateAnim, opacityAnim]);

  const handlePress = () => {
    if (!disabled && onPress) {
      // 탭 애니메이션
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 0.95,
          useNativeDriver: true,
          tension: 100,
          friction: 5,
        }),
        Animated.spring(scaleAnim, {
          toValue: isSelected ? 1.2 : 1,
          useNativeDriver: true,
          tension: 50,
          friction: 5,
        }),
      ]).start();

      onPress(emotionLevel);
    }
  };

  const containerSize = {
    small: 48,
    medium: 64,
    large: 80,
  }[size];

  const emojiSize = {
    small: 24,
    medium: 32,
    large: 40,
  }[size];

  const labelSize = {
    small: 10,
    medium: 12,
    large: 14,
  }[size];

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.9}
      style={style}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`감정 ${emotionInfo.label}`}
      accessibilityHint={`현재 ${isSelected ? '선택됨' : '선택 안 됨'}. 탭하여 ${emotionInfo.label} 감정을 선택하세요.`}
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
            transform: [{ scale: scaleAnim }, { rotate: rotation }],
            opacity: opacityAnim,
          },
          disabled && styles.disabled,
        ]}
      >
        <Text style={{ fontSize: emojiSize }}>{emotionInfo.emoji}</Text>
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
interface EmotionSelectorProps {
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
      {emotions.map((level) => (
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