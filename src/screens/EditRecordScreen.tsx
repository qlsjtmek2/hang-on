import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ChevronLeft } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { EMOTION_DATA } from '@/constants/emotions';
import { useToast } from '@/contexts/ToastContext';
import type { RecordStackParamList } from '@/navigation/RecordStackNavigator';
import { useRecordStore } from '@/store/recordStore';
import { theme } from '@/theme';

type EditRecordScreenNavigationProp = NativeStackNavigationProp<RecordStackParamList, 'EditRecord'>;
type EditRecordScreenRouteProp = RouteProp<RecordStackParamList, 'EditRecord'>;

const MAX_CONTENT_LENGTH = 500;

/**
 * 기록 수정 화면
 *
 * 기존 기록의 내용을 수정
 * - 기존 내용 불러오기
 * - WriteScreen과 유사한 UI
 * - 저장 시 recordStore 업데이트
 */
export const EditRecordScreen: React.FC = () => {
  const navigation = useNavigation<EditRecordScreenNavigationProp>();
  const route = useRoute<EditRecordScreenRouteProp>();
  const { recordId } = route.params;
  const { showToast } = useToast();

  const { getRecordById, updateRecord } = useRecordStore();
  const record = getRecordById(recordId);

  const [content, setContent] = useState(record?.content ?? '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);

  // 기록이 없는 경우
  if (!record) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>기록을 찾을 수 없습니다</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.errorLink}>돌아가기</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const emotionInfo = EMOTION_DATA[record.emotionLevel];
  const IconComponent = emotionInfo.icon;

  const charCount = content.length;
  const isOverLimit = charCount > MAX_CONTENT_LENGTH;
  const isContentEmpty = content.trim().length === 0;
  const hasChanges = content !== record.content;

  const handleBack = () => {
    if (hasChanges) {
      setShowDiscardDialog(true);
    } else {
      navigation.goBack();
    }
  };

  const handleDiscard = () => {
    setShowDiscardDialog(false);
    navigation.goBack();
  };

  const handleSave = async () => {
    if (isContentEmpty || isOverLimit || !hasChanges) return;

    setIsSubmitting(true);

    const success = await updateRecord(recordId, {
      content: content.trim(),
    });

    setIsSubmitting(false);

    if (success) {
      showToast('success', '기록이 수정되었어요');
      navigation.goBack();
    } else {
      showToast('error', '수정에 실패했어요. 다시 시도해주세요', 4000);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleBack}
            style={styles.backButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityLabel="뒤로 가기"
            accessibilityRole="button"
          >
            <ChevronLeft size={24} color={theme.colors.neutral.gray600} strokeWidth={2} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>기록 수정</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* 선택된 감정 표시 (읽기 전용) */}
          <View style={styles.emotionDisplay}>
            <View style={[styles.emotionIconContainer, { backgroundColor: emotionInfo.color }]}>
              <IconComponent size={28} color={theme.colors.neutral.white} strokeWidth={2} />
            </View>
            <View style={styles.emotionInfo}>
              <Text style={[styles.emotionLabel, { color: emotionInfo.color }]}>
                {emotionInfo.label}
              </Text>
              <Text style={styles.emotionHint}>감정은 수정할 수 없습니다</Text>
            </View>
          </View>

          {/* 텍스트 입력 */}
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.textInput, isOverLimit && styles.textInputError]}
              placeholder="지금 느끼는 기분을 자유롭게 표현해보세요"
              placeholderTextColor={theme.colors.neutral.gray400}
              value={content}
              onChangeText={setContent}
              multiline
              maxLength={MAX_CONTENT_LENGTH + 50}
              textAlignVertical="top"
              editable={!isSubmitting}
              accessibilityLabel="감정 기록 입력"
              accessibilityHint="최대 500자까지 입력할 수 있습니다"
            />

            {/* 글자 수 카운터 */}
            <View style={styles.counterContainer}>
              <Text style={[styles.counterText, isOverLimit && styles.counterTextError]}>
                {charCount}/{MAX_CONTENT_LENGTH}
              </Text>
            </View>

            {/* 초과 경고 */}
            {isOverLimit && (
              <Text style={styles.warningText}>
                글자 수를 초과했어요. {charCount - MAX_CONTENT_LENGTH}자를 줄여주세요.
              </Text>
            )}
          </View>
        </ScrollView>

        {/* 하단 버튼 */}
        <View style={styles.footer}>
          <Button
            title="저장하기"
            onPress={handleSave}
            variant="primary"
            size="large"
            disabled={isContentEmpty || isOverLimit || !hasChanges || isSubmitting}
            loading={isSubmitting}
            fullWidth
            accessibilityHint={
              isContentEmpty
                ? '먼저 내용을 입력해주세요'
                : isOverLimit
                ? '글자 수를 줄여주세요'
                : !hasChanges
                ? '변경된 내용이 없습니다'
                : '수정된 내용을 저장합니다'
            }
          />
        </View>
      </KeyboardAvoidingView>

      {/* 변경사항 취소 확인 다이얼로그 */}
      <ConfirmDialog
        visible={showDiscardDialog}
        onClose={() => setShowDiscardDialog(false)}
        onConfirm={handleDiscard}
        title="수정 취소"
        message="변경된 내용이 있습니다. 저장하지 않고 나가시겠어요?"
        confirmLabel="나가기"
        cancelLabel="계속 수정"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    padding: theme.spacing.xs,
  },
  headerTitle: {
    ...theme.typography.h3,
    color: theme.colors.text.primary,
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.md,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
  },
  errorLink: {
    ...theme.typography.body,
    color: theme.colors.primary.main,
    fontWeight: '600',
  },
  emotionDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  emotionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emotionInfo: {
    marginLeft: theme.spacing.md,
  },
  emotionLabel: {
    ...theme.typography.h3,
    fontWeight: '600',
  },
  emotionHint: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  inputContainer: {
    flex: 1,
  },
  textInput: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
    backgroundColor: theme.colors.neutral.gray100,
    borderWidth: 1,
    borderColor: theme.colors.neutral.gray200,
    borderRadius: 12,
    padding: theme.spacing.md,
    minHeight: 200,
    lineHeight: 24,
  },
  textInputError: {
    borderColor: theme.colors.semantic.error,
  },
  counterContainer: {
    alignItems: 'flex-end',
    marginTop: theme.spacing.sm,
  },
  counterText: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
  },
  counterTextError: {
    color: theme.colors.semantic.error,
    fontWeight: '600',
  },
  warningText: {
    ...theme.typography.caption,
    color: theme.colors.semantic.error,
    marginTop: theme.spacing.xs,
  },
  footer: {
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
});
