/**
 * Toast Component
 *
 * 사용자 피드백을 위한 토스트 알림 컴포넌트
 * - 4가지 타입: success, error, warning, info
 * - 자동 사라짐 (기본 3초)
 * - 수동 닫기 지원
 * - Reanimated 애니메이션
 */

import { AlertCircle, CheckCircle, Info, X, XCircle } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { theme } from '@/theme';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
  onDismiss: (id: string) => void;
}

const TOAST_CONFIG = {
  success: {
    icon: CheckCircle,
    backgroundColor: theme.colors.semantic.success,
    iconColor: theme.colors.neutral.white,
  },
  error: {
    icon: XCircle,
    backgroundColor: theme.colors.semantic.error,
    iconColor: theme.colors.neutral.white,
  },
  warning: {
    icon: AlertCircle,
    backgroundColor: theme.colors.semantic.warning,
    iconColor: theme.colors.neutral.white,
  },
  info: {
    icon: Info,
    backgroundColor: theme.colors.semantic.info,
    iconColor: theme.colors.neutral.white,
  },
};

export const Toast: React.FC<ToastProps> = ({
  id,
  type,
  message,
  duration = 3000,
  onDismiss,
}) => {
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(100);
  const opacity = useSharedValue(0);

  const config = TOAST_CONFIG[type];
  const IconComponent = config.icon;

  // 입장 애니메이션
  useEffect(() => {
    translateY.value = withSpring(0, { damping: 15, stiffness: 150 });
    opacity.value = withTiming(1, { duration: 200 });

    // 자동 사라짐
    const timer = setTimeout(() => {
      handleDismiss();
    }, duration);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    translateY.value = withTiming(100, { duration: 200 });
    opacity.value = withTiming(0, { duration: 200 }, () => {
      runOnJS(onDismiss)(id);
    });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: config.backgroundColor, marginBottom: insets.bottom + 60 },
        animatedStyle,
      ]}
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
    >
      <View style={styles.content}>
        <IconComponent
          size={20}
          color={config.iconColor}
          strokeWidth={2}
          style={styles.icon}
        />
        <Text style={styles.message} numberOfLines={2}>
          {message}
        </Text>
      </View>
      <TouchableOpacity
        onPress={handleDismiss}
        style={styles.closeButton}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        accessibilityLabel="토스트 닫기"
        accessibilityHint="탭하여 알림을 닫습니다"
        accessibilityRole="button"
      >
        <X size={18} color={theme.colors.neutral.white} strokeWidth={2} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: theme.spacing.lg,
    right: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: theme.spacing.sm,
  },
  message: {
    ...theme.typography.body,
    color: theme.colors.neutral.white,
    flex: 1,
  },
  closeButton: {
    marginLeft: theme.spacing.sm,
    padding: theme.spacing.xs,
  },
});

export default Toast;
