import {
  AlertOctagon,
  Megaphone,
  HeartCrack,
  UserX,
  CircleDot,
  Check,
} from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';

import { BottomSheet } from '@/components/BottomSheet';
import { Button } from '@/components/Button';
import { theme } from '@/theme';

export type ReportReason =
  | 'hate_speech'
  | 'spam'
  | 'self_harm'
  | 'privacy'
  | 'other';

interface ReportOption {
  id: ReportReason;
  icon: LucideIcon;
  label: string;
  description: string;
}

const REPORT_OPTIONS: ReportOption[] = [
  {
    id: 'hate_speech',
    icon: AlertOctagon,
    label: '욕설/혐오 표현',
    description: '비방, 차별, 혐오 발언이 포함되어 있어요',
  },
  {
    id: 'spam',
    icon: Megaphone,
    label: '스팸/광고',
    description: '홍보 목적의 내용이에요',
  },
  {
    id: 'self_harm',
    icon: HeartCrack,
    label: '자해/자살 암시',
    description: '위험한 내용이 포함되어 있어요',
  },
  {
    id: 'privacy',
    icon: UserX,
    label: '개인정보 노출',
    description: '개인을 식별할 수 있는 정보가 있어요',
  },
  {
    id: 'other',
    icon: CircleDot,
    label: '기타',
    description: '위 사유에 해당하지 않는 경우',
  },
];

export interface ReportBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (reason: ReportReason, detail?: string) => void;
  /** recordId는 추후 서버 API 연동 시 사용 */
  recordId: string;
}

/**
 * 신고 바텀시트 컴포넌트
 *
 * 부적절한 콘텐츠 신고 UI
 * - 5가지 신고 사유 선택
 * - '기타' 선택 시 직접 입력
 * - 제출 완료 시 확인 메시지
 */
export function ReportBottomSheet({
  visible,
  onClose,
  onSubmit,
  recordId: _recordId,
}: ReportBottomSheetProps) {
  // _recordId는 추후 서버 API 연동 시 사용
  const [selectedReason, setSelectedReason] = useState<ReportReason | null>(null);
  const [otherDetail, setOtherDetail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    // 상태 초기화
    setSelectedReason(null);
    setOtherDetail('');
    setIsSubmitted(false);
    setIsSubmitting(false);
    onClose();
  };

  const handleSubmit = async () => {
    if (!selectedReason) return;

    setIsSubmitting(true);

    // Mock: 신고 처리 시뮬레이션
    await new Promise<void>(resolve => setTimeout(resolve, 500));

    onSubmit(selectedReason, selectedReason === 'other' ? otherDetail : undefined);
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const canSubmit =
    selectedReason !== null &&
    (selectedReason !== 'other' || otherDetail.trim().length > 0);

  // 제출 완료 화면
  if (isSubmitted) {
    return (
      <BottomSheet
        visible={visible}
        onClose={handleClose}
        title="신고 완료"
        height="auto"
      >
        <View style={styles.successContainer}>
          <View style={styles.successIconContainer}>
            <Check size={32} color={theme.colors.semantic.success} strokeWidth={2.5} />
          </View>
          <Text style={styles.successTitle}>신고가 접수되었습니다</Text>
          <Text style={styles.successMessage}>
            검토 후 적절한 조치를 취하겠습니다.{'\n'}
            더 나은 커뮤니티를 위해 노력하겠습니다.
          </Text>
          <Button
            title="닫기"
            onPress={handleClose}
            variant="primary"
            fullWidth
            style={styles.successButton}
          />
        </View>
      </BottomSheet>
    );
  }

  return (
    <BottomSheet
      visible={visible}
      onClose={handleClose}
      title="신고하기"
      height="auto"
    >
      <View style={styles.container}>
        <Text style={styles.subtitle}>
          이 기록에서 어떤 문제를 발견하셨나요?
        </Text>

        {/* 신고 사유 목록 */}
        <View style={styles.optionList}>
          {REPORT_OPTIONS.map(option => {
            const isSelected = selectedReason === option.id;
            const IconComponent = option.icon;

            return (
              <TouchableOpacity
                key={option.id}
                style={[styles.optionItem, isSelected && styles.optionItemSelected]}
                onPress={() => setSelectedReason(option.id)}
                activeOpacity={0.7}
                accessibilityLabel={option.label}
                accessibilityRole="radio"
                accessibilityState={{ selected: isSelected }}
              >
                <View
                  style={[
                    styles.optionIcon,
                    isSelected && styles.optionIconSelected,
                  ]}
                >
                  <IconComponent
                    size={20}
                    color={
                      isSelected
                        ? theme.colors.semantic.error
                        : theme.colors.text.secondary
                    }
                    strokeWidth={2}
                  />
                </View>
                <View style={styles.optionContent}>
                  <Text
                    style={[
                      styles.optionLabel,
                      isSelected && styles.optionLabelSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                  <Text style={styles.optionDescription}>{option.description}</Text>
                </View>
                {isSelected && (
                  <View style={styles.checkMark}>
                    <Check size={16} color={theme.colors.semantic.error} strokeWidth={2.5} />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 기타 사유 입력 */}
        {selectedReason === 'other' && (
          <View style={styles.otherInputContainer}>
            <TextInput
              style={styles.otherInput}
              placeholder="신고 사유를 입력해주세요"
              placeholderTextColor={theme.colors.text.disabled}
              value={otherDetail}
              onChangeText={setOtherDetail}
              multiline
              maxLength={200}
              textAlignVertical="top"
            />
            <Text style={styles.charCount}>{otherDetail.length}/200</Text>
          </View>
        )}

        {/* 제출 버튼 */}
        <Button
          title="신고하기"
          onPress={handleSubmit}
          variant="secondary"
          fullWidth
          disabled={!canSubmit}
          loading={isSubmitting}
          style={styles.submitButton}
        />

        <Text style={styles.disclaimer}>
          허위 신고는 서비스 이용에 제한이 있을 수 있습니다.
        </Text>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: theme.spacing.md,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.lg,
  },
  optionList: {
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.neutral.gray100,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionItemSelected: {
    borderColor: theme.colors.semantic.error,
    backgroundColor: `${theme.colors.semantic.error}08`,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.neutral.gray200,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  optionIconSelected: {
    backgroundColor: `${theme.colors.semantic.error}15`,
  },
  optionContent: {
    flex: 1,
  },
  optionLabel: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
    fontWeight: '600',
    marginBottom: 2,
  },
  optionLabelSelected: {
    color: theme.colors.semantic.error,
  },
  optionDescription: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
  },
  checkMark: {
    marginLeft: theme.spacing.sm,
  },
  otherInputContainer: {
    marginBottom: theme.spacing.lg,
  },
  otherInput: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
    backgroundColor: theme.colors.neutral.gray100,
    borderRadius: 12,
    padding: theme.spacing.md,
    minHeight: 80,
    borderWidth: 1,
    borderColor: theme.colors.neutral.gray200,
  },
  charCount: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    textAlign: 'right',
    marginTop: theme.spacing.xs,
  },
  submitButton: {
    marginBottom: theme.spacing.md,
  },
  disclaimer: {
    ...theme.typography.caption,
    color: theme.colors.text.disabled,
    textAlign: 'center',
  },
  // 성공 화면 스타일
  successContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  successIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: `${theme.colors.semantic.success}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  successTitle: {
    ...theme.typography.h3,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  successMessage: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: theme.spacing.xl,
  },
  successButton: {
    marginTop: theme.spacing.md,
  },
});

export default ReportBottomSheet;
