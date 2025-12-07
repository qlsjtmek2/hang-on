import { Clock, Globe, Lock } from 'lucide-react-native';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { BottomSheet } from '@/components/BottomSheet';
import { EMOTION_DATA } from '@/constants/emotions';
import type { RecordVisibility } from '@/store/recordStore';
import { theme } from '@/theme';
import type { EmotionLevel } from '@/types/emotion';

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
    description: '나만 볼 수 있어요. 언제든 공개로 바꿀 수 있어요.',
    icon: Lock,
  },
  {
    value: 'scheduled',
    label: '내일 나누기',
    description: '내일 자동으로 공개돼요. 시간이 지나면 마음이 달라질 수 있으니까요.',
    icon: Clock,
  },
  {
    value: 'public',
    label: '지금 나누기',
    description: '바로 공개돼요. 다른 사람들이 공감하고 응원해줄 거예요.',
    icon: Globe,
  },
];

export interface ShareSettingsBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (visibility: RecordVisibility) => void;
  emotionLevel: EmotionLevel;
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
  emotionLevel,
}: ShareSettingsBottomSheetProps) {
  const emotionInfo = EMOTION_DATA[emotionLevel];

  const handleOptionPress = (visibility: RecordVisibility) => {
    onSelect(visibility);
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="어떻게 나눌까요?"
      height="auto"
      closeOnBackdrop={true}
      closeOnSwipeDown={true}
    >
      <View style={styles.container}>
        {/* 감정 요약 */}
        <View style={[styles.emotionSummary, { backgroundColor: `${emotionInfo.color}15` }]}>
          <View style={[styles.emotionIcon, { backgroundColor: emotionInfo.color }]}>
            <emotionInfo.icon size={20} color={theme.colors.neutral.white} strokeWidth={2.5} />
          </View>
          <Text style={[styles.emotionText, { color: emotionInfo.color }]}>
            오늘의 {emotionInfo.label} 기록
          </Text>
        </View>

        {/* 옵션 목록 */}
        <View style={styles.optionsContainer}>
          {SHARE_OPTIONS.map((option, index) => {
            const IconComponent = option.icon;
            const isLast = index === SHARE_OPTIONS.length - 1;

            return (
              <TouchableOpacity
                key={option.value}
                style={[styles.optionItem, !isLast && styles.optionItemBorder]}
                onPress={() => handleOptionPress(option.value)}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={option.label}
                accessibilityHint={option.description}
              >
                <View style={styles.optionIconContainer}>
                  <IconComponent
                    size={24}
                    color={theme.colors.primary.main}
                    strokeWidth={2}
                  />
                </View>
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
  emotionSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: 12,
    marginBottom: theme.spacing.lg,
  },
  emotionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emotionText: {
    ...theme.typography.body,
    fontWeight: '600',
    marginLeft: theme.spacing.sm,
  },
  optionsContainer: {
    backgroundColor: theme.colors.neutral.gray100,
    borderRadius: 12,
    overflow: 'hidden',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.neutral.white,
  },
  optionItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral.gray100,
  },
  optionIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primary.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  optionContent: {
    flex: 1,
  },
  optionLabel: {
    ...theme.typography.body,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: 2,
  },
  optionDescription: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    lineHeight: 18,
  },
});

export default ShareSettingsBottomSheet;
