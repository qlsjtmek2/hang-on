import { Clock, Globe, Lock } from 'lucide-react-native';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { BottomSheet } from '@/components/BottomSheet';
import type { RecordVisibility } from '@/store/recordStore';
import { theme } from '@/theme';

interface ShareOption {
  value: RecordVisibility;
  label: string;
  description: string;
  icon: typeof Lock;
}

const SHARE_OPTIONS: ShareOption[] = [
  {
    value: 'private',
    label: '혼자 간직하기',
    description: '나만 볼 수 있어요',
    icon: Lock,
  },
  {
    value: 'scheduled',
    label: '내일 나누기',
    description: '24시간 후 자동 공개',
    icon: Clock,
  },
  {
    value: 'public',
    label: '지금 나누기',
    description: '바로 피드에 공유',
    icon: Globe,
  },
];

export interface ShareSettingsBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (visibility: RecordVisibility) => void;
}

/**
 * 공유 설정 바텀시트
 *
 * 글 작성 완료 후 공개 범위 선택
 * - 혼자 간직하기 (비공개)
 * - 내일 나누기 (예약 공개)
 * - 지금 나누기 (즉시 공개)
 */
export function ShareSettingsBottomSheet({
  visible,
  onClose,
  onSelect,
}: ShareSettingsBottomSheetProps) {
  const handleOptionPress = (visibility: RecordVisibility) => {
    onSelect(visibility);
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="공유 설정"
      height="auto"
      closeOnBackdrop={true}
      closeOnSwipeDown={true}
    >
      <View style={styles.container}>
        {/* 옵션 목록 */}
        <View style={styles.optionsContainer}>
          {SHARE_OPTIONS.map(option => {
            const IconComponent = option.icon;

            return (
              <TouchableOpacity
                key={option.value}
                style={styles.optionCard}
                onPress={() => handleOptionPress(option.value)}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={option.label}
                accessibilityHint={option.description}
              >
                <IconComponent
                  size={24}
                  color={theme.colors.primary.main}
                  strokeWidth={2}
                  style={styles.optionIcon}
                />
                <View style={styles.optionContent}>
                  <Text style={styles.optionLabel}>{option.label}</Text>
                  <Text style={styles.optionDescription}>{option.description}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: theme.spacing.md,
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
});

export default ShareSettingsBottomSheet;
