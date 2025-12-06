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
import { ShareSettingsBottomSheet } from '@/components/ShareSettingsBottomSheet';
import { EMOTION_DATA } from '@/constants/emotions';
import type { CreateStackParamList } from '@/navigation/CreateStackNavigator';
import { useRecordStore, RecordVisibility } from '@/store/recordStore';
import { theme } from '@/theme';

type WriteScreenNavigationProp = NativeStackNavigationProp<CreateStackParamList, 'Write'>;
type WriteScreenRouteProp = RouteProp<CreateStackParamList, 'Write'>;

const MAX_CONTENT_LENGTH = 500;

/**
 * 글쓰기 화면
 *
 * 털어놓기 플로우의 두 번째 단계
 * - 상단: 선택한 감정 표시 (읽기 전용)
 * - 텍스트 입력: 최대 500자
 * - 실시간 글자 수 카운터
 * - "다 썼어요!" 버튼 → 공유 설정 바텀시트
 */
export const WriteScreen: React.FC = () => {
  const navigation = useNavigation<WriteScreenNavigationProp>();
  const route = useRoute<WriteScreenRouteProp>();
  const { emotionLevel } = route.params;

  const [content, setContent] = useState('');
  const [showShareSheet, setShowShareSheet] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { addRecord } = useRecordStore();
  const emotionInfo = EMOTION_DATA[emotionLevel];
  const IconComponent = emotionInfo.icon;

  const charCount = content.length;
  const isOverLimit = charCount > MAX_CONTENT_LENGTH;
  const isContentEmpty = content.trim().length === 0;

  const handleBack = () => {
    navigation.goBack();
  };

  const handleComplete = () => {
    if (!isContentEmpty && !isOverLimit) {
      setShowShareSheet(true);
    }
  };

  const handleShare = async (visibility: RecordVisibility) => {
    setIsSubmitting(true);
    setShowShareSheet(false);

    try {
      await addRecord({
        emotionLevel,
        content: content.trim(),
        visibility,
      });

      // 성공 시 전체 플로우 종료
      navigation.getParent()?.goBack();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseShareSheet = () => {
    setShowShareSheet(false);
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
          <Text style={styles.headerTitle}>털어놓기</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* 선택된 감정 표시 */}
          <View style={styles.emotionDisplay}>
            <View style={[styles.emotionIconContainer, { backgroundColor: emotionInfo.color }]}>
              <IconComponent
                size={28}
                color={theme.colors.neutral.white}
                strokeWidth={2}
              />
            </View>
            <Text style={[styles.emotionLabel, { color: emotionInfo.color }]}>
              {emotionInfo.label}
            </Text>
          </View>

          {/* 텍스트 입력 */}
          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.textInput,
                isOverLimit && styles.textInputError,
              ]}
              placeholder="지금 느끼는 기분을 자유롭게 표현해보세요"
              placeholderTextColor={theme.colors.neutral.gray400}
              value={content}
              onChangeText={setContent}
              multiline
              maxLength={MAX_CONTENT_LENGTH + 50} // 초과 입력 허용 (경고 표시)
              textAlignVertical="top"
              editable={!isSubmitting}
              accessibilityLabel="감정 기록 입력"
              accessibilityHint="최대 500자까지 입력할 수 있습니다"
            />

            {/* 글자 수 카운터 */}
            <View style={styles.counterContainer}>
              <Text
                style={[
                  styles.counterText,
                  isOverLimit && styles.counterTextError,
                ]}
              >
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
            title="다 썼어요!"
            onPress={handleComplete}
            variant="primary"
            size="large"
            disabled={isContentEmpty || isOverLimit || isSubmitting}
            loading={isSubmitting}
            fullWidth
            accessibilityHint={
              isContentEmpty
                ? '먼저 내용을 입력해주세요'
                : isOverLimit
                  ? '글자 수를 줄여주세요'
                  : '공유 설정을 선택합니다'
            }
          />
        </View>
      </KeyboardAvoidingView>

      {/* 공유 설정 바텀시트 */}
      <ShareSettingsBottomSheet
        visible={showShareSheet}
        onClose={handleCloseShareSheet}
        onSelect={handleShare}
        emotionLevel={emotionLevel}
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
  emotionLabel: {
    ...theme.typography.h3,
    marginLeft: theme.spacing.md,
    fontWeight: '600',
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
