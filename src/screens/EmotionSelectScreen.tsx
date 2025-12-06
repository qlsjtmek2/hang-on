import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { X } from 'lucide-react-native';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { EmotionSelector } from '@/components/EmotionButton';
import { StepIndicator } from '@/components/StepIndicator';
import type { CreateStackParamList } from '@/navigation/CreateStackNavigator';
import { theme } from '@/theme';
import type { EmotionLevel } from '@/types/emotion';

const STEP_LABELS = ['감정 선택', '글쓰기', '공유 설정'];

type EmotionSelectScreenNavigationProp = NativeStackNavigationProp<
  CreateStackParamList,
  'EmotionSelect'
>;

/**
 * 감정 선택 화면
 *
 * 털어놓기 플로우의 첫 번째 단계
 * - 5단계 날씨 아이콘으로 현재 감정 선택
 * - 선택 시 확대 + 색상 강조 애니메이션
 * - "다음" 버튼으로 글쓰기 화면 이동
 */
export const EmotionSelectScreen: React.FC = () => {
  const navigation = useNavigation<EmotionSelectScreenNavigationProp>();
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionLevel | null>(null);

  const handleEmotionSelect = (level: EmotionLevel) => {
    setSelectedEmotion(level);
  };

  const handleNext = () => {
    if (selectedEmotion) {
      navigation.navigate('Write', { emotionLevel: selectedEmotion });
    }
  };

  const handleClose = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleClose}
          style={styles.closeButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel="닫기"
          accessibilityRole="button"
        >
          <X size={24} color={theme.colors.neutral.gray600} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>털어놓기</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* 단계 표시 */}
      <View style={styles.stepContainer}>
        <StepIndicator
          currentStep={1}
          totalSteps={3}
          variant="dot"
          labels={STEP_LABELS}
          showLabels
        />
      </View>

      {/* 메인 콘텐츠 */}
      <View style={styles.content}>
        <Text style={styles.title}>지금 기분이 어때요?</Text>
        <Text style={styles.subtitle}>오늘의 감정을 날씨로 표현해보세요</Text>

        {/* 감정 선택 */}
        <View style={styles.emotionContainer}>
          <EmotionSelector
            selectedLevel={selectedEmotion}
            onSelect={handleEmotionSelect}
            size="large"
            style={styles.emotionSelector}
          />
        </View>

        {/* 선택된 감정 설명 */}
        {selectedEmotion && (
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionText}>
              {getEmotionDescription(selectedEmotion)}
            </Text>
          </View>
        )}
      </View>

      {/* 하단 버튼 */}
      <View style={styles.footer}>
        <Button
          title="다음"
          onPress={handleNext}
          variant="primary"
          size="large"
          disabled={!selectedEmotion}
          fullWidth
          accessibilityHint={
            selectedEmotion
              ? '글쓰기 화면으로 이동합니다'
              : '먼저 감정을 선택해주세요'
          }
        />
      </View>
    </SafeAreaView>
  );
};

/**
 * 감정 레벨별 설명 텍스트
 */
function getEmotionDescription(level: EmotionLevel): string {
  const descriptions: Record<EmotionLevel, string> = {
    1: '많이 힘든 하루였나요. 괜찮아요, 여기서 털어놓아도 돼요.',
    2: '기분이 좋지 않은 날이네요. 당신의 이야기를 들려주세요.',
    3: '평범한 하루를 보내고 계시군요. 오늘 있었던 일을 나눠볼까요?',
    4: '기분 좋은 일이 있었나 봐요. 그 이야기가 궁금해요.',
    5: '정말 좋은 하루네요! 그 기쁨을 나눠주세요.',
  };
  return descriptions[level];
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
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
  closeButton: {
    padding: theme.spacing.xs,
  },
  headerTitle: {
    ...theme.typography.h3,
    color: theme.colors.text.primary,
  },
  headerSpacer: {
    width: 40, // closeButton과 같은 너비로 중앙 정렬
  },
  stepContainer: {
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.xxxl,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xxxl,
  },
  emotionContainer: {
    alignItems: 'center',
  },
  emotionSelector: {
    paddingVertical: theme.spacing.xl,
  },
  descriptionContainer: {
    marginTop: theme.spacing.xxl,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.neutral.gray100,
    borderRadius: 12,
  },
  descriptionText: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
});
