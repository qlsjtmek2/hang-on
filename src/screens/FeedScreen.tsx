import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart } from 'lucide-react-native';

import { theme } from '@/theme';

/**
 * 누군가와 함께 화면 (피드)
 *
 * 다른 사용자들의 공개된 감정 기록을 표시
 * - 감정 유사도 기반 매칭
 * - 하루 20개 조회 제한
 * - 공감/메시지 전송 기능
 */
export const FeedScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Heart size={64} color={theme.colors.text.secondary} strokeWidth={1.5} />
        </View>
        <Text style={styles.title}>누군가와 함께</Text>
        <Text style={styles.subtitle}>도착한 이야기가 없어요</Text>
        <Text style={styles.hint}>비슷한 감정을 가진 사람들의{'\n'}이야기가 곧 도착할 거예요</Text>
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
