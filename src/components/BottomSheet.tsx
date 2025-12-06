import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  PanResponder,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  StyleProp,
  ViewStyle,
  LayoutChangeEvent,
} from 'react-native';
import { X } from 'lucide-react-native';

import { theme } from '@/theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  height?: number | 'auto';
  showHandle?: boolean;
  closeOnBackdrop?: boolean;
  closeOnSwipeDown?: boolean;
  snapPoints?: number[];
  style?: StyleProp<ViewStyle>;
  headerStyle?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
}

export function BottomSheet({
  visible,
  onClose,
  title,
  children,
  height = 'auto',
  showHandle = true,
  closeOnBackdrop = true,
  closeOnSwipeDown = true,
  style,
  headerStyle,
  contentStyle,
}: BottomSheetProps) {
  const [containerHeight, setContainerHeight] = useState(0);
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  // Calculate sheet height
  const sheetHeight = height === 'auto' ? containerHeight : height;

  // Pan responder for swipe gestures
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => closeOnSwipeDown,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return closeOnSwipeDown && gestureState.dy > 0;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 50 || gestureState.vy > 0.5) {
          closeSheet();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            tension: 50,
            friction: 8,
          }).start();
        }
      },
    }),
  ).current;

  // Open sheet animation
  const openSheet = () => {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Close sheet animation
  const closeSheet = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: SCREEN_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  // Handle visibility changes
  useEffect(() => {
    if (visible) {
      translateY.setValue(SCREEN_HEIGHT);
      openSheet();
    }
  }, [visible]);

  const handleBackdropPress = () => {
    if (closeOnBackdrop) {
      closeSheet();
    }
  };

  const handleLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setContainerHeight(height);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={closeSheet}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.modalContainer}
      >
        {/* Backdrop */}
        <TouchableWithoutFeedback onPress={handleBackdropPress}>
          <Animated.View
            style={[
              styles.backdrop,
              {
                opacity: backdropOpacity,
              },
            ]}
          />
        </TouchableWithoutFeedback>

        {/* Bottom Sheet */}
        <Animated.View
          style={[
            styles.sheetContainer,
            {
              transform: [{ translateY }],
              ...(height !== 'auto' && { height: sheetHeight }),
            },
            style,
          ]}
          onLayout={height === 'auto' ? handleLayout : undefined}
          {...panResponder.panHandlers}
        >
          {/* Handle */}
          {showHandle && (
            <View style={styles.handleContainer}>
              <View style={styles.handle} />
            </View>
          )}

          {/* Header */}
          {title && (
            <View style={[styles.header, headerStyle]}>
              <Text style={styles.title}>{title}</Text>
              <TouchableOpacity
                onPress={closeSheet}
                style={styles.closeButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                accessibilityLabel="닫기"
              >
                <X size={20} color={theme.colors.neutral.gray600} strokeWidth={2} />
              </TouchableOpacity>
            </View>
          )}

          {/* Content */}
          <ScrollView
            style={[styles.content, contentStyle]}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            {children}
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// Preset bottom sheet components for common use cases
export interface ActionSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  actions: Array<{
    label: string;
    onPress: () => void;
    destructive?: boolean;
    disabled?: boolean;
  }>;
  cancelLabel?: string;
}

export function ActionSheet({
  visible,
  onClose,
  title,
  actions,
  cancelLabel = '취소',
}: ActionSheetProps) {
  return (
    <BottomSheet visible={visible} onClose={onClose} title={title} height="auto" showHandle={false}>
      <View style={styles.actionContainer}>
        {actions.map((action, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.actionButton, action.disabled && styles.actionButtonDisabled]}
            onPress={() => {
              action.onPress();
              onClose();
            }}
            disabled={action.disabled}
          >
            <Text
              style={[
                styles.actionText,
                action.destructive && styles.actionTextDestructive,
                action.disabled && styles.actionTextDisabled,
              ]}
            >
              {action.label}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={[styles.actionButton, styles.cancelButton]} onPress={onClose}>
          <Text style={styles.cancelText}>{cancelLabel}</Text>
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sheetContainer: {
    backgroundColor: theme.colors.neutral.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 0,
    maxHeight: SCREEN_HEIGHT * 0.9,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.neutral.gray300,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral.gray200,
  },
  title: {
    ...theme.typography.h3,
    color: theme.colors.neutral.gray900,
  },
  closeButton: {
    padding: theme.spacing.xs,
  },
  content: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },

  // ActionSheet styles
  actionContainer: {
    paddingVertical: theme.spacing.sm,
  },
  actionButton: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    alignItems: 'center',
  },
  actionButtonDisabled: {
    opacity: 0.5,
  },
  actionText: {
    ...theme.typography.body,
    color: theme.colors.primary.main,
    fontWeight: '500',
  },
  actionTextDestructive: {
    color: theme.colors.semantic.error,
  },
  actionTextDisabled: {
    color: theme.colors.neutral.gray400,
  },
  cancelButton: {
    marginTop: theme.spacing.xs,
    borderTopWidth: 1,
    borderTopColor: theme.colors.neutral.gray200,
  },
  cancelText: {
    ...theme.typography.body,
    color: theme.colors.neutral.gray700,
    fontWeight: '600',
  },
});

export default BottomSheet;
