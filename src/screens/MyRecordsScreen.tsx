import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FileEdit } from 'lucide-react-native';
import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RecordCard } from '@/components/RecordCard';
import { RecordCardSkeletonList } from '@/components/SkeletonLoader';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { useRecordStore, Record } from '@/store/recordStore';
import { theme } from '@/theme';

type MyRecordsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

/**
 * 내 기록 화면
 *
 * 사용자가 작성한 감정 기록 목록을 시간순으로 표시
 * - 감정별/공개상태별 필터링 (추후 구현)
 * - 기록 카드 탭 시 상세 화면 이동 (추후 구현)
 */
export const MyRecordsScreen: React.FC = () => {
  const navigation = useNavigation<MyRecordsScreenNavigationProp>();
  const { getMyRecords } = useRecordStore();
  const records = getMyRecords();
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // 초기 로딩 시뮬레이션 (실제 데이터는 Supabase 연동 시 구현)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Mock: 새로고침 애니메이션만 표시 (실제 데이터는 Supabase 연동 시 구현)
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleRecordPress = useCallback(
    (id: string) => {
      navigation.navigate('Record', { recordId: id });
    },
    [navigation],
  );

  const handleEmpathyPress = useCallback((id: string) => {
    // TODO: 공감 기능
    console.log('Empathy pressed:', id);
  }, []);

  const handleMessagePress = useCallback((id: string) => {
    // TODO: 메시지 기능
    console.log('Message pressed:', id);
  }, []);

  const renderRecord = ({ item }: { item: Record }) => (
    <RecordCard
      id={item.id}
      emotionLevel={item.emotionLevel}
      content={item.content}
      createdAt={item.createdAt}
      empathyCount={item.heartsCount}
      messageCount={item.messagesCount}
      isShared={item.visibility === 'public'}
      onPress={handleRecordPress}
      onEmpathyPress={handleEmpathyPress}
      onMessagePress={handleMessagePress}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContent}>
      <View style={styles.iconContainer}>
        <FileEdit size={64} color={theme.colors.text.secondary} strokeWidth={1.5} />
      </View>
      <Text style={styles.emptyTitle}>아직 기록이 없어요</Text>
      <Text style={styles.emptyHint}>
        털어놓기 버튼을 눌러{'\n'}첫 번째 감정을 기록해보세요
      </Text>
    </View>
  );

  // 로딩 중일 때 스켈레톤 표시
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.listContent}>
          <RecordCardSkeletonList count={5} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {records.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={records}
          renderItem={renderRecord}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          // 성능 최적화 옵션
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews={true}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.colors.primary.main]}
              tintColor={theme.colors.primary.main}
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listContent: {
    padding: theme.spacing.md,
    paddingBottom: 100, // FAB 공간 확보
  },
  emptyContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  iconContainer: {
    marginBottom: theme.spacing.lg,
  },
  emptyTitle: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
  },
  emptyHint: {
    ...theme.typography.bodySmall,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});
