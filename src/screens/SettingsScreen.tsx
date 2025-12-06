import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  User,
  Bell,
  Globe,
  Mail,
  FileText,
  ClipboardList,
  LogOut,
  Trash2,
  ChevronRight,
  type LucideIcon,
} from 'lucide-react-native';

import { useAuthStore } from '@/store/authStore';
import { theme } from '@/theme';

interface SettingItemProps {
  icon: LucideIcon;
  title: string;
  onPress: () => void;
  danger?: boolean;
}

const SettingItem: React.FC<SettingItemProps> = ({ icon: Icon, title, onPress, danger }) => (
  <TouchableOpacity style={styles.settingItem} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.settingIconContainer}>
      <Icon
        size={20}
        color={danger ? theme.colors.semantic.error : theme.colors.text.secondary}
        strokeWidth={2}
      />
    </View>
    <Text style={[styles.settingTitle, danger && styles.dangerText]}>{title}</Text>
    <ChevronRight size={20} color={theme.colors.text.secondary} strokeWidth={2} />
  </TouchableOpacity>
);

/**
 * 설정 화면
 *
 * 계정 및 앱 설정 관리
 * - 푸시 알림 토글
 * - 언어 변경
 * - 로그아웃 / 계정 삭제
 * - 개인정보 처리방침 / 이용약관
 */
export const SettingsScreen: React.FC = () => {
  const { user, signOut } = useAuthStore();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 프로필 섹션 */}
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <User size={40} color={theme.colors.text.secondary} strokeWidth={1.5} />
          </View>
          <Text style={styles.email}>{user?.email}</Text>
        </View>

        {/* 알림 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>알림</Text>
          <SettingItem icon={Bell} title="푸시 알림" onPress={() => {}} />
        </View>

        {/* 일반 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>일반</Text>
          <SettingItem icon={Globe} title="언어" onPress={() => {}} />
          <SettingItem icon={Mail} title="개발자에게 문의" onPress={() => {}} />
        </View>

        {/* 정보 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>정보</Text>
          <SettingItem icon={FileText} title="개인정보 처리방침" onPress={() => {}} />
          <SettingItem icon={ClipboardList} title="이용약관" onPress={() => {}} />
        </View>

        {/* 계정 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>계정</Text>
          <SettingItem icon={LogOut} title="로그아웃" onPress={handleSignOut} />
          <SettingItem icon={Trash2} title="계정 삭제" onPress={() => {}} danger />
        </View>

        {/* 버전 정보 */}
        <View style={styles.footer}>
          <Text style={styles.version}>Hang On v0.0.1</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  email: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
  },
  section: {
    paddingTop: theme.spacing.lg,
  },
  sectionTitle: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.sm,
    textTransform: 'uppercase',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  settingIconContainer: {
    marginRight: theme.spacing.md,
  },
  settingTitle: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
    flex: 1,
  },
  dangerText: {
    color: theme.colors.semantic.error,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  version: {
    ...theme.typography.caption,
    color: theme.colors.text.disabled,
  },
});
