import { Bell, Heart, MessageCircle } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';

import { useNotificationStore, NotificationItem } from '@/store/notificationStore';
import { theme } from '@/theme';

/**
 * 알림 화면
 *
 * 공감, 메시지 알림 목록 표시
 */
export function NotificationsScreen() {
  const { notifications, markAsRead, markAllAsRead } = useNotificationStore();

  // 화면 진입 시 모든 알림 읽음 처리
  useEffect(() => {
    markAllAsRead();
  }, [markAllAsRead]);

  const getRelativeTime = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    return `${Math.floor(diff / 86400000)}일 전`;
  };

  const handleNotificationPress = (item: NotificationItem) => {
    markAsRead(item.id);
    // 해당 기록으로 이동 (TODO: 실제 연결 필요)
    // navigation.navigate('Record', { screen: 'RecordDetail', params: { recordId: item.recordId } });
  };

  const renderNotification = ({ item }: { item: NotificationItem }) => {
    const isEmpathy = item.type === 'empathy';

    return (
      <TouchableOpacity
        style={[styles.notificationItem, !item.isRead && styles.unreadItem]}
        onPress={() => handleNotificationPress(item)}
        activeOpacity={0.7}
      >
        <View style={[styles.iconContainer, isEmpathy ? styles.empathyIcon : styles.messageIcon]}>
          {isEmpathy ? (
            <Heart
              size={18}
              color={theme.colors.semantic.error}
              fill={theme.colors.semantic.error}
            />
          ) : (
            <MessageCircle size={18} color={theme.colors.primary.main} />
          )}
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.notificationText}>
            {isEmpathy ? '누군가 당신의 기록에 공감했어요' : '누군가 따뜻한 말을 건넸어요'}
          </Text>
          <Text style={styles.previewText} numberOfLines={1}>
            "{item.recordPreview}"
          </Text>
          <Text style={styles.timeText}>{getRelativeTime(item.createdAt)}</Text>
        </View>

        {!item.isRead && <View style={styles.unreadDot} />}
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Bell size={48} color={theme.colors.neutral.gray300} />
      <Text style={styles.emptyTitle}>알림이 없어요</Text>
      <Text style={styles.emptySubtitle}>
        누군가 공감하거나 메시지를 보내면{'\n'}여기에 표시돼요
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={item => item.id}
        contentContainerStyle={notifications.length === 0 ? styles.emptyList : styles.list}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  list: {
    paddingVertical: theme.spacing.sm,
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.background,
  },
  unreadItem: {
    backgroundColor: `${theme.colors.primary.main}05`,
  },
  iconContainer: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  empathyIcon: {},
  messageIcon: {},
  contentContainer: {
    flex: 1,
  },
  notificationText: {
    ...theme.typography.body,
    fontWeight: '500',
    color: theme.colors.text.primary,
    marginBottom: 2,
  },
  previewText: {
    ...theme.typography.bodySmall,
    color: theme.colors.text.secondary,
    marginBottom: 4,
  },
  timeText: {
    ...theme.typography.caption,
    color: theme.colors.neutral.gray400,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary.main,
    marginLeft: theme.spacing.sm,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  emptyTitle: {
    ...theme.typography.h3,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  emptySubtitle: {
    ...theme.typography.body,
    color: theme.colors.neutral.gray400,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default NotificationsScreen;
