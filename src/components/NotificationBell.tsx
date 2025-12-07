import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Bell } from 'lucide-react-native';
import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';

import type { RootStackParamList } from '@/navigation/RootNavigator';
import { useNotificationStore } from '@/store/notificationStore';
import { theme } from '@/theme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

/**
 * 알림 벨 아이콘 (헤더용)
 *
 * 읽지 않은 알림이 있으면 빨간 뱃지 표시
 */
export function NotificationBell() {
  const navigation = useNavigation<NavigationProp>();
  const unreadCount = useNotificationStore(state => state.unreadCount);

  const handlePress = () => {
    navigation.navigate('Notifications');
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      accessibilityLabel={`알림 ${unreadCount > 0 ? `${unreadCount}개의 새 알림` : ''}`}
      accessibilityRole="button"
    >
      <Bell size={26} color={theme.colors.text.primary} strokeWidth={1.8} />
      {unreadCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: theme.colors.semantic.error,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default NotificationBell;
