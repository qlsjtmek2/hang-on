import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  View,
  Platform,
} from 'react-native';

import { theme } from '@/theme';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  accessibilityLabel,
  accessibilityHint,
}: ButtonProps) {
  const containerStyle = [
    styles.container,
    styles[`container_${variant}`],
    styles[`container_${size}`],
    disabled && styles.container_disabled,
    fullWidth && styles.container_fullWidth,
    style,
  ];

  const titleStyle = [
    styles.text,
    styles[`text_${variant}`],
    styles[`text_${size}`],
    disabled && styles.text_disabled,
    textStyle,
  ];

  const getActivityIndicatorColor = () => {
    switch (variant) {
      case 'primary':
        return theme.colors.neutral.white;
      case 'secondary':
        return theme.colors.primary.main;
      case 'ghost':
        return theme.colors.primary.main;
      default:
        return theme.colors.primary.main;
    }
  };

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint || '버튼을 눌러 작업을 수행합니다'}
      accessibilityState={{ disabled: disabled || loading }}
    >
      {loading ? (
        <ActivityIndicator color={getActivityIndicatorColor()} size="small" />
      ) : (
        <View style={styles.contentContainer}>
          {leftIcon && <View style={styles.leftIconContainer}>{leftIcon}</View>}
          <Text style={titleStyle}>{title}</Text>
          {rightIcon && <View style={styles.rightIconContainer}>{rightIcon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftIconContainer: {
    marginRight: theme.spacing.xs,
  },
  rightIconContainer: {
    marginLeft: theme.spacing.xs,
  },

  // Variants
  container_primary: {
    backgroundColor: theme.colors.primary.main,
    // 입체감 있는 그림자
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.primary.main,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 10,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  container_secondary: {
    backgroundColor: theme.colors.neutral.white,
    borderWidth: 1,
    borderColor: theme.colors.neutral.gray200,
    // 미세한 그림자
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  container_ghost: {
    backgroundColor: 'transparent',
  },

  // Sizes - 통통하고 부드러운 느낌
  container_small: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    minHeight: 40,
    borderRadius: 10,
  },
  container_medium: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: 12,
    minHeight: 52,
    borderRadius: 14,
  },
  container_large: {
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    minHeight: 60,
    borderRadius: 16,
  },

  // States - 비활성화 시 더 명확한 시각적 구분
  container_disabled: {
    opacity: 0.6,
    backgroundColor: theme.colors.neutral.gray300,
    // 그림자 제거
    ...Platform.select({
      ios: {
        shadowOpacity: 0,
      },
      android: {
        elevation: 0,
      },
    }),
  },
  container_fullWidth: {
    width: '100%',
  },

  // Text styles
  text: {
    textAlign: 'center',
  },
  text_primary: {
    ...theme.typography.button,
    color: theme.colors.neutral.white,
  },
  text_secondary: {
    ...theme.typography.button,
    color: theme.colors.neutral.gray900,
  },
  text_ghost: {
    ...theme.typography.button,
    color: theme.colors.primary.main,
  },
  text_small: {
    ...theme.typography.caption,
  },
  text_medium: {
    ...theme.typography.button,
  },
  text_large: {
    ...theme.typography.button,
    fontSize: 18,
  },
  text_disabled: {
    opacity: 0.7,
  },
});

export default Button;
