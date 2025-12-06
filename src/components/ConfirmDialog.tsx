import { AlertTriangle } from 'lucide-react-native';
import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
} from 'react-native';

import { theme } from '@/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export interface ConfirmDialogProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'default' | 'danger';
  loading?: boolean;
}

/**
 * 확인 다이얼로그 컴포넌트
 *
 * 중요한 작업 전 사용자 확인을 받는 모달 다이얼로그
 * - 삭제 확인: "이 기록을 삭제할까요?"
 * - 로그아웃 확인: "정말 로그아웃할까요?"
 * - 계정 삭제 경고: "모든 기록이 삭제됩니다. 정말 삭제할까요?"
 */
export function ConfirmDialog({
  visible,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = '확인',
  cancelLabel = '취소',
  variant = 'default',
  loading = false,
}: ConfirmDialogProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.9);
    }
  }, [visible, fadeAnim, scaleAnim]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  const handleConfirm = () => {
    if (!loading) {
      onConfirm();
    }
  };

  const isDanger = variant === 'danger';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.overlay}>
          <Animated.View
            style={[
              styles.backdrop,
              { opacity: fadeAnim },
            ]}
          />
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.dialog,
                {
                  opacity: fadeAnim,
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            >
              {/* 경고 아이콘 (danger variant) */}
              {isDanger && (
                <View style={styles.iconContainer}>
                  <View style={styles.iconBackground}>
                    <AlertTriangle
                      size={24}
                      color={theme.colors.semantic.error}
                      strokeWidth={2}
                    />
                  </View>
                </View>
              )}

              {/* 제목 */}
              <Text style={[styles.title, isDanger && styles.dangerTitle]}>
                {title}
              </Text>

              {/* 메시지 */}
              <Text style={styles.message}>{message}</Text>

              {/* 버튼 영역 */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={handleClose}
                  activeOpacity={0.7}
                  disabled={loading}
                  accessibilityLabel={cancelLabel}
                  accessibilityRole="button"
                >
                  <Text style={styles.cancelButtonText}>{cancelLabel}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.confirmButton,
                    isDanger && styles.dangerButton,
                    loading && styles.disabledButton,
                  ]}
                  onPress={handleConfirm}
                  activeOpacity={0.7}
                  disabled={loading}
                  accessibilityLabel={confirmLabel}
                  accessibilityRole="button"
                >
                  <Text
                    style={[
                      styles.confirmButtonText,
                      isDanger && styles.dangerButtonText,
                    ]}
                  >
                    {loading ? '처리 중...' : confirmLabel}
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dialog: {
    width: SCREEN_WIDTH - 48,
    maxWidth: 320,
    backgroundColor: theme.colors.neutral.white,
    borderRadius: 16,
    paddingTop: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  iconBackground: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${theme.colors.semantic.error}15`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...theme.typography.h3,
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  dangerTitle: {
    color: theme.colors.semantic.error,
  },
  message: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: theme.spacing.xl,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  button: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: theme.colors.neutral.gray100,
  },
  cancelButtonText: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    fontWeight: '600',
  },
  confirmButton: {
    backgroundColor: theme.colors.primary.main,
  },
  confirmButtonText: {
    ...theme.typography.body,
    color: theme.colors.neutral.white,
    fontWeight: '600',
  },
  dangerButton: {
    backgroundColor: theme.colors.semantic.error,
  },
  dangerButtonText: {
    color: theme.colors.neutral.white,
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default ConfirmDialog;
