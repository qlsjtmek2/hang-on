import { Check, Flame, Heart, MessageCircle, Sun, Users, LucideIcon } from 'lucide-react-native';
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
 * ShareSettingsBottomSheet와 일관된 디자인
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
    <BottomSheet visible={visible} onClose={onClose} title="따뜻한 말 건네기" height="auto">
      <View style={styles.container}>
        {/* 이미 보낸 경우 안내 */}
        {hasSentMessage && (
          <View style={styles.sentContainer}>
            <View style={styles.sentIconContainer}>
              <Check size={24} color={theme.colors.semantic.success} />
            </View>
            <Text style={styles.sentText}>이미 따뜻한 말을 보냈어요</Text>
            <Text style={styles.sentSubtext}>상대방에게 당신의 마음이 전달되었어요</Text>
          </View>
        )}

        {/* 옵션 목록 (ShareSettings 스타일) */}
        {!hasSentMessage && (
          <View style={styles.optionsContainer}>
            {MESSAGE_PRESETS.map(preset => {
              const IconComponent = ICON_MAP[preset.iconName];
              const isSelected = selectedPreset === preset.type;

              return (
                <TouchableOpacity
                  key={preset.type}
                  style={[styles.optionCard, isSelected && styles.optionCardSelected]}
                  onPress={() => handleSelect(preset.type)}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel={preset.label}
                  accessibilityHint={preset.description}
                >
                  <IconComponent
                    size={24}
                    color={theme.colors.primary.main}
                    strokeWidth={2}
                    style={styles.optionIcon}
                  />
                  <View style={styles.optionContent}>
                    <Text style={styles.optionLabel}>{preset.label}</Text>
                    <Text style={styles.optionDescription}>{preset.description}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* 하단 안내 */}
        {!hasSentMessage && (
          <View style={styles.infoContainer}>
            <MessageCircle size={14} color={theme.colors.neutral.gray500} />
            <Text style={styles.infoText}>선택한 메시지가 익명으로 전달됩니다</Text>
          </View>
        )}
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: theme.spacing.md,
  },
  sentContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
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
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  sentSubtext: {
    ...theme.typography.bodySmall,
    color: theme.colors.text.secondary,
  },
  optionsContainer: {
    gap: 12,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.neutral.white,
    borderWidth: 1,
    borderColor: '#F2F2F2',
    borderRadius: 20,
    padding: 20,
  },
  optionCardSelected: {
    borderColor: theme.colors.primary.main,
    backgroundColor: `${theme.colors.primary.main}08`,
  },
  optionIcon: {
    marginRight: 16,
  },
  optionContent: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 13,
    color: theme.colors.text.secondary,
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
