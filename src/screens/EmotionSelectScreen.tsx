import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { X } from 'lucide-react-native';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmotionButton } from '@/components/EmotionButton';
import { EMOTION_DATA } from '@/constants/emotions';
import type { CreateStackParamList } from '@/navigation/CreateStackNavigator';
import { theme } from '@/theme';
import type { EmotionLevel } from '@/types/emotion';

const BUTTON_GAP = 24;

type EmotionSelectScreenNavigationProp = NativeStackNavigationProp<
  CreateStackParamList,
  'EmotionSelect'
>;

/**
 * 감정 선택 화면
 *
 * 털어놓기 플로우의 첫 번째 단계
 * - 2x2 그리드 + 1 레이아웃으로 감정 선택
 * - 감정 키워드 표시로 직관성 향상
 * - 선택 시 피드백 메시지 표시
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

  // 선택된 감정 데이터
  const selectedData = selectedEmotion ? EMOTION_DATA[selectedEmotion] : null;

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

      {/* 메인 콘텐츠 */}
      <View style={styles.content}>
        {/* 타이틀 */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>지금 기분이 어때요?</Text>
          <Text style={styles.subtitle}>오늘의 감정을 날씨로 표현해보세요</Text>
        </View>

        {/* 감정 선택 그리드 (2x2 + 1) */}
        <View style={styles.gridContainer}>
          {/* 첫 번째 줄: 맑음, 구름 */}
          <View style={styles.gridRow}>
            <EmotionButton
              emotionLevel={5}
              isSelected={selectedEmotion === 5}
              onPress={handleEmotionSelect}
              size="large"
              style={styles.gridItem}
            />
            <EmotionButton
              emotionLevel={4}
              isSelected={selectedEmotion === 4}
              onPress={handleEmotionSelect}
              size="large"
              style={styles.gridItem}
            />
          </View>

          {/* 두 번째 줄: 흐림, 비 */}
          <View style={styles.gridRow}>
            <EmotionButton
              emotionLevel={3}
              isSelected={selectedEmotion === 3}
              onPress={handleEmotionSelect}
              size="large"
              style={styles.gridItem}
            />
            <EmotionButton
              emotionLevel={2}
              isSelected={selectedEmotion === 2}
              onPress={handleEmotionSelect}
              size="large"
              style={styles.gridItem}
            />
          </View>

          {/* 세 번째 줄: 폭풍 (중앙) */}
          <View style={styles.gridRowCenter}>
            <EmotionButton
              emotionLevel={1}
              isSelected={selectedEmotion === 1}
              onPress={handleEmotionSelect}
              size="large"
              style={styles.gridItem}
            />
          </View>
        </View>

        {/* 피드백 메시지 영역 (선택 시에만 표시) */}
        {selectedData && (
          <View style={styles.feedbackContainer}>
            <View
              style={[
                styles.messageBubble,
                { borderColor: selectedData.color },
              ]}
            >
              <Text style={styles.messageText}>
                {getEmotionDescription(selectedEmotion!)}
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* 하단 버튼 */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.nextButton,
            !selectedEmotion && styles.disabledButton,
            selectedEmotion && { backgroundColor: selectedData?.color },
          ]}
          onPress={handleNext}
          disabled={!selectedEmotion}
          accessibilityRole="button"
          accessibilityLabel="다음"
          accessibilityHint={
            selectedEmotion
              ? '글쓰기 화면으로 이동합니다'
              : '먼저 감정을 선택해주세요'
          }
          accessibilityState={{ disabled: !selectedEmotion }}
        >
          <Text style={styles.nextButtonText}>다음</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

/**
 * 감정 레벨별 설명 텍스트
 */
function getEmotionDescription(level: EmotionLevel): string {
  const descriptions: Record<EmotionLevel, string> = {
    1: '마음속에 폭풍우가 몰아치고 있군요. 어떤 일이 있었나요?',
    2: '마음에도 비가 내리는 날이 있죠. 잠시 쉬어가도 괜찮아요.',
    3: '구름이 낀 것처럼 답답한가요? 이야기를 털어놓아 보세요.',
    4: '나쁘지 않은 하루였군요. 소소한 즐거움이 있었나요?',
    5: '햇살처럼 밝은 하루셨군요! 어떤 좋은 일이 있었는지 궁금해요.',
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
  },
  closeButton: {
    padding: theme.spacing.xs,
  },
  headerTitle: {
    ...theme.typography.h3,
    color: theme.colors.text.primary,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.xl,
    alignItems: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xxl,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  gridContainer: {
    width: '100%',
    gap: theme.spacing.lg,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: BUTTON_GAP + 16,
  },
  gridRowCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  gridItem: {
    alignItems: 'center',
  },
  feedbackContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: theme.spacing.xxl,
    minHeight: 80,
  },
  messageBubble: {
    backgroundColor: theme.colors.neutral.gray100,
    padding: theme.spacing.lg,
    borderRadius: 20,
    width: '100%',
    borderWidth: 1,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    color: theme.colors.text.primary,
    fontWeight: '500',
  },
  footer: {
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
  },
  nextButton: {
    backgroundColor: theme.colors.primary.main,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledButton: {
    backgroundColor: theme.colors.neutral.gray300,
    shadowOpacity: 0,
    elevation: 0,
  },
  nextButtonText: {
    color: theme.colors.text.inverse,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
