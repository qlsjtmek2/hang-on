import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FileEdit } from 'lucide-react-native';

import { theme } from '@/theme';

/**
 * 내 기록 화면
 *
 * 사용자가 작성한 감정 기록 목록을 시간순으로 표시
 * - 감정별/공개상태별 필터링
 * - 기록 카드 탭 시 상세 화면 이동
 */
export const MyRecordsScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <FileEdit size={64} color={theme.colors.text.secondary} strokeWidth={1.5} />
        </View>
        <Text style={styles.title}>내 기록</Text>
        <Text style={styles.subtitle}>아직 기록이 없어요</Text>
        <Text style={styles.hint}>털어놓기 버튼을 눌러{'\n'}첫 번째 감정을 기록해보세요</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  iconContainer: {
    marginBottom: theme.spacing.lg,
  },
  title: {
    ...theme.typography.h2,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
  },
  hint: {
    ...theme.typography.bodySmall,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});
