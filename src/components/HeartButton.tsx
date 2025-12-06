import { Heart } from 'lucide-react-native';
import React, { useRef } from 'react';
import {
  TouchableOpacity,
  Animated,
  StyleSheet,
  Text,
  View,
  StyleProp,
  ViewStyle,
} from 'react-native';

import { theme } from '@/theme';

export interface HeartButtonProps {
  /**
   * 공감 여부
   */
  hasEmpathized: boolean;
  /**
   * 공감 수
   */
  count?: number;
  /**
   * 공감 토글 콜백
   */
  onPress: () => void;
  /**
   * 비활성화 여부 (이미 공감한 기록)
   */
  disabled?: boolean;
  /**
   * 아이콘 크기
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * 카운트 표시 여부
   */
  showCount?: boolean;
  /**
   * 커스텀 스타일
   */
  style?: StyleProp<ViewStyle>;
}

const SIZES = {
  small: { icon: 16, container: 32 },
  medium: { icon: 24, container: 44 },
  large: { icon: 32, container: 56 },
};

/**
 * HeartButton - 공감 버튼 컴포넌트
 *
 * 탭 시 펄스 애니메이션과 함께 공감 상태가 토글됩니다.
 * 이미 공감한 경우 채워진 하트가 표시됩니다.
 */
export function HeartButton({
  hasEmpathized,
  count = 0,
  onPress,
  disabled = false,
  size = 'medium',
  showCount = true,
  style,
}: HeartButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const sizeConfig = SIZES[size];

  const handlePress = () => {
    if (disabled) return;

    // 펄스 애니메이션
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1.3,
        useNativeDriver: true,
        speed: 50,
        bounciness: 12,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 50,
        bounciness: 8,
      }),
    ]).start();

    onPress();
  };

  const heartColor = hasEmpathized
    ? theme.colors.semantic.error
    : theme.colors.neutral.gray400;

  const countColor = hasEmpathized
    ? theme.colors.semantic.error
    : theme.colors.neutral.gray600;

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={handlePress}
      activeOpacity={0.7}
      disabled={disabled}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={hasEmpathized ? '공감 취소하기' : '공감하기'}
      accessibilityState={{ disabled, selected: hasEmpathized }}
    >
      <Animated.View
        style={[
          styles.iconContainer,
          {
            width: sizeConfig.container,
            height: sizeConfig.container,
            borderRadius: sizeConfig.container / 2,
            transform: [{ scale: scaleAnim }],
          },
          hasEmpathized && styles.iconContainerActive,
        ]}
      >
        <Heart
          size={sizeConfig.icon}
          color={heartColor}
          fill={hasEmpathized ? heartColor : 'transparent'}
          strokeWidth={hasEmpathized ? 0 : 2}
        />
      </Animated.View>
      {showCount && count > 0 && (
        <View style={styles.countContainer}>
          <Text style={[styles.countText, { color: countColor }]}>{count}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.neutral.gray100,
  },
  iconContainerActive: {
    backgroundColor: `${theme.colors.semantic.error}15`,
  },
  countContainer: {
    marginLeft: theme.spacing.xs,
  },
  countText: {
    ...theme.typography.bodySmall,
    fontWeight: '600',
  },
});

export default HeartButton;
