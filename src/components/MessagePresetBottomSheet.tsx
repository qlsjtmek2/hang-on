import {
  Check,
  Flame,
  Heart,
  MessageCircle,
  Sun,
  Users,
  LucideIcon,
} from 'lucide-react-native';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import { MESSAGE_PRESETS, MessagePreset } from '@/store/feedStore';
import { theme } from '@/theme';

import { BottomSheet } from './BottomSheet';

// 아이콘 이름 → Lucide 컴포넌트 매핑
const ICON_MAP: Record<string, LucideIcon> = {
  flame: Flame,
  heart: Heart,
  sun: Sun,
  users: Users,
};

export interface MessagePresetBottomSheetProps {
  /**
   * 바텀시트 표시 여부
   */
  visible: boolean;
  /**
   * 닫기 콜백
   */
  onClose: () => void;
  /**
   * 메시지 선택 콜백
   */
  onSelect: (preset: MessagePreset) => void;
  /**
   * 이미 메시지를 보냈는지 여부
   */
  hasSentMessage?: boolean;
  /**
   * 선택된 프리셋 (이미 보낸 경우)
   */
  selectedPreset?: MessagePreset | null;
}

/**
 * MessagePresetBottomSheet - 메시지 프리셋 선택 바텀시트
 *
 * 4가지 프리셋 메시지 중 하나를 선택하여 전송합니다.
 * - 힘내세요 (Flame)
 * - 저도 그래요 (Heart)
 * - 괜찮을 거예요 (Sun)
 * - 함께해요 (Users)
 */
export function MessagePresetBottomSheet({
  visible,
  onClose,
  onSelect,
  hasSentMessage = false,
  selectedPreset = null,
}: MessagePresetBottomSheetProps) {
  const handleSelect = (preset: MessagePreset) => {
    if (hasSentMessage) return;
    onSelect(preset);
    onClose();
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="따뜻한 말 건네기"
      height="auto"
    >
      <View style={styles.container}>
        {/* 안내 메시지 */}
        {hasSentMessage ? (
          <View style={styles.sentContainer}>
            <View style={styles.sentIconContainer}>
              <Check size={24} color={theme.colors.semantic.success} />
            </View>
            <Text style={styles.sentText}>이미 따뜻한 말을 보냈어요</Text>
            <Text style={styles.sentSubtext}>
              상대방에게 당신의 마음이 전달되었어요
            </Text>
          </View>
        ) : (
          <Text style={styles.description}>
            어떤 말을 건네고 싶으신가요?
          </Text>
        )}

        {/* 프리셋 버튼들 */}
        <View style={styles.presetsContainer}>
          {MESSAGE_PRESETS.map(preset => {
            const isSelected = selectedPreset === preset.type;
            const isDisabled = hasSentMessage && !isSelected;
            const IconComponent = ICON_MAP[preset.iconName];

            return (
              <TouchableOpacity
                key={preset.type}
                style={[
                  styles.presetButton,
                  isSelected && styles.presetButtonSelected,
                  isDisabled && styles.presetButtonDisabled,
                ]}
                onPress={() => handleSelect(preset.type)}
                disabled={hasSentMessage}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={preset.label}
                accessibilityState={{ selected: isSelected, disabled: isDisabled }}
              >
                <View style={styles.presetIconContainer}>
                  <IconComponent
                    size={20}
                    color={
                      isSelected
                        ? theme.colors.primary.main
                        : isDisabled
                          ? theme.colors.neutral.gray400
                          : theme.colors.neutral.gray700
                    }
                  />
                </View>
                <Text
                  style={[
                    styles.presetLabel,
                    isSelected && styles.presetLabelSelected,
                    isDisabled && styles.presetLabelDisabled,
                  ]}
                >
                  {preset.label}
                </Text>
                {isSelected && (
                  <View style={styles.checkIcon}>
                    <Check size={16} color={theme.colors.primary.main} />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 하단 안내 */}
        {!hasSentMessage && (
          <View style={styles.infoContainer}>
            <MessageCircle size={14} color={theme.colors.neutral.gray500} />
            <Text style={styles.infoText}>
              선택한 메시지가 익명으로 전달됩니다
            </Text>
          </View>
        )}
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: theme.spacing.sm,
  },
  description: {
    ...theme.typography.body,
    color: theme.colors.neutral.gray700,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  sentContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  sentIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${theme.colors.semantic.success}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  sentText: {
    ...theme.typography.body,
    fontWeight: '600',
    color: theme.colors.neutral.gray900,
    marginBottom: theme.spacing.xs,
  },
  sentSubtext: {
    ...theme.typography.bodySmall,
    color: theme.colors.neutral.gray600,
  },
  presetsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
  },
  presetButton: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.neutral.gray100,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  presetButtonSelected: {
    backgroundColor: `${theme.colors.primary.main}10`,
    borderColor: theme.colors.primary.main,
  },
  presetButtonDisabled: {
    opacity: 0.4,
  },
  presetIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: theme.colors.neutral.gray200,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  presetLabel: {
    ...theme.typography.body,
    color: theme.colors.neutral.gray800,
    fontWeight: '500',
    flex: 1,
  },
  presetLabelSelected: {
    color: theme.colors.primary.main,
    fontWeight: '600',
  },
  presetLabelDisabled: {
    color: theme.colors.neutral.gray500,
  },
  checkIcon: {
    marginLeft: theme.spacing.xs,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.neutral.gray200,
  },
  infoText: {
    ...theme.typography.caption,
    color: theme.colors.neutral.gray500,
    marginLeft: theme.spacing.xs,
  },
});

export default MessagePresetBottomSheet;
