import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ChevronLeft, Save } from 'lucide-react-native';
import React, { useState, useEffect, useRef } from 'react';
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
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { ShareSettingsBottomSheet } from '@/components/ShareSettingsBottomSheet';
import { StepIndicator } from '@/components/StepIndicator';
import { EMOTION_DATA } from '@/constants/emotions';
import { useDraft } from '@/hooks/useDraft';
import type { CreateStackParamList } from '@/navigation/CreateStackNavigator';
import { useRecordStore, RecordVisibility } from '@/store/recordStore';
import { theme } from '@/theme';

const STEP_LABELS = ['감정 선택', '글쓰기', '공유 설정'];

/**
 * 감정 레벨별 설명 텍스트
 */
function getEmotionDescription(level: number): string {
  const descriptions: Record<number, string> = {
    1: '마음속에 폭풍우가 몰아치고 있군요. 어떤 일이 있었나요?',
    2: '마음에도 비가 내리는 날이 있죠. 잠시 쉬어가도 괜찮아요.',
    3: '구름이 낀 것처럼 답답한가요? 이야기를 털어놓아 보세요.',
    4: '나쁘지 않은 하루였군요. 소소한 즐거움이 있었나요?',
    5: '햇살처럼 밝은 하루셨군요! 어떤 좋은 일이 있었는지 궁금해요.',
  };
  return descriptions[level] || '';
}

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
  const [showSavedIndicator, setShowSavedIndicator] = useState(false);

  const { addRecord } = useRecordStore();
  const emotionInfo = EMOTION_DATA[emotionLevel];
  const IconComponent = emotionInfo.icon;

  // 자동 임시 저장
  const { savedDraft, clearDraft } = useDraft(emotionLevel, content);
  const lastSavedRef = useRef<number>(0);

  // 저장 인디케이터 애니메이션
  const savedOpacity = useSharedValue(0);
  const savedAnimatedStyle = useAnimatedStyle(() => ({
    opacity: savedOpacity.value,
  }));

  // savedDraft 변경 시 인디케이터 표시
  useEffect(() => {
    if (savedDraft && savedDraft.lastSavedAt > lastSavedRef.current) {
      lastSavedRef.current = savedDraft.lastSavedAt;
      setShowSavedIndicator(true);
      savedOpacity.value = withSequence(
        withTiming(1, { duration: 200 }),
        withTiming(1, { duration: 2000 }),
        withTiming(0, { duration: 300 }),
      );
      setTimeout(() => setShowSavedIndicator(false), 2500);
    }
  }, [savedDraft, savedOpacity]);

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

      // 저장 성공 시 임시 저장 삭제
      clearDraft();

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

        {/* 단계 표시 */}
        <View style={styles.stepContainer}>
          <StepIndicator
            currentStep={2}
            totalSteps={3}
            variant="bar"
            labels={STEP_LABELS}
            showLabels
          />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* 일기장 종이 컨테이너 */}
          <View
            style={[
              styles.writingPaper,
              isOverLimit && styles.writingPaperError,
            ]}
          >
            {/* 종이 상단: 감정 아이콘 + 라벨 */}
            <View style={styles.paperHeader}>
              <View style={[styles.emotionIconContainer, { backgroundColor: emotionInfo.color }]}>
                <IconComponent
                  size={24}
                  color={theme.colors.neutral.white}
                  strokeWidth={2}
                />
              </View>
              <Text style={[styles.emotionLabel, { color: emotionInfo.color }]}>
                {emotionInfo.label}
              </Text>
            </View>

            {/* 상단 구분선 */}
            <View style={styles.paperDivider} />

            {/* 감정 설명 메시지 */}
            <Text style={styles.emotionMessage}>
              {getEmotionDescription(emotionLevel)}
            </Text>

            {/* 텍스트 입력 */}
            <TextInput
              style={styles.textInput}
              placeholder="오늘 하루, 마음이 어땠나요?"
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

            {/* 하단 구분선 */}
            <View style={styles.bottomDivider} />

            {/* 종이 하단: 글자 수 카운터 + 자동 저장 표시 */}
            <View style={styles.paperFooter}>
              {showSavedIndicator ? (
                <Animated.View style={[styles.savedIndicator, savedAnimatedStyle]}>
                  <Save size={12} color={theme.colors.semantic.success} strokeWidth={2} />
                  <Text style={styles.savedText}>자동 저장됨</Text>
                </Animated.View>
              ) : (
                <View />
              )}
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
  stepContainer: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
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
  writingPaper: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    paddingTop: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    minHeight: 320,
    ...theme.shadows.sm,
  },
  writingPaperError: {
    borderWidth: 1,
    borderColor: theme.colors.semantic.error,
  },
  paperHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  emotionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emotionLabel: {
    ...theme.typography.bodyBold,
    marginLeft: theme.spacing.sm,
    fontWeight: '600',
  },
  paperDivider: {
    height: 1,
    backgroundColor: theme.colors.neutral.gray200,
    marginBottom: theme.spacing.md,
  },
  emotionMessage: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.lg,
    lineHeight: 22,
  },
  textInput: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
    flex: 1,
    lineHeight: 26,
    textAlignVertical: 'top',
  },
  bottomDivider: {
    height: 1,
    backgroundColor: theme.colors.neutral.gray200,
    marginTop: theme.spacing.md,
  },
  paperFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  savedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  savedText: {
    ...theme.typography.caption,
    color: theme.colors.semantic.success,
    marginLeft: 4,
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
