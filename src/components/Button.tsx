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
    borderRadius: 8,
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
  },
  container_secondary: {
    backgroundColor: theme.colors.neutral.gray100,
    borderWidth: 1,
    borderColor: theme.colors.neutral.gray300,
  },
  container_ghost: {
    backgroundColor: 'transparent',
  },

  // Sizes
  container_small: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    minHeight: 32,
  },
  container_medium: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    minHeight: 44,
  },
  container_large: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    minHeight: 56,
  },

  // States
  container_disabled: {
    opacity: 0.5,
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
