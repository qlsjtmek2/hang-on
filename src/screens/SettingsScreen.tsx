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
  Check,
  type LucideIcon,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Linking,
} from 'react-native';

import { BottomSheet } from '@/components/BottomSheet';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { useToast } from '@/contexts/ToastContext';
import { useAuthStore } from '@/store/authStore';
import { theme } from '@/theme';

// 언어 옵션
interface LanguageOption {
  code: string;
  label: string;
  nativeLabel: string;
}

const LANGUAGES: LanguageOption[] = [
  { code: 'ko', label: '한국어', nativeLabel: '한국어' },
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'ja', label: 'Japanese', nativeLabel: '日本語' },
];

// 외부 링크
const EXTERNAL_LINKS = {
  privacy: 'https://example.com/privacy',
  terms: 'https://example.com/terms',
  support: 'mailto:support@hangon.app',
};

interface SettingItemProps {
  icon: LucideIcon;
  title: string;
  onPress: () => void;
  danger?: boolean;
  rightElement?: React.ReactNode;
}

const SettingItem: React.FC<SettingItemProps> = ({
  icon: Icon,
  title,
  onPress,
  danger,
  rightElement,
}) => (
  <TouchableOpacity style={styles.settingItem} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.settingIconContainer}>
      <Icon
        size={20}
        color={danger ? theme.colors.semantic.error : theme.colors.text.secondary}
        strokeWidth={2}
      />
    </View>
    <Text style={[styles.settingTitle, danger && styles.dangerText]}>{title}</Text>
    {rightElement || (
      <ChevronRight size={20} color={theme.colors.text.secondary} strokeWidth={2} />
    )}
  </TouchableOpacity>
);

/**
 * 설정 화면
 *
 * 계정 및 앱 설정 관리
 * - 푸시 알림 토글
 * - 언어 변경 (UI만)
 * - 로그아웃 / 계정 삭제
 * - 개인정보 처리방침 / 이용약관
 * - 개발자에게 문의
 */
export const SettingsScreen: React.FC = () => {
  const { user, signOut } = useAuthStore();
  const { showToast } = useToast();

  // UI 상태
  const [pushEnabled, setPushEnabled] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('ko');
  const [showLanguageSheet, setShowLanguageSheet] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handlePushToggle = (value: boolean) => {
    setPushEnabled(value);
    // Mock: 실제 푸시 알림 설정은 구현하지 않음
  };

  const handleLanguageSelect = (code: string) => {
    setSelectedLanguage(code);
    setShowLanguageSheet(false);
    showToast('success', '언어가 변경되었어요', 2000);
    // Mock: 실제 언어 변경은 구현하지 않음
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await signOut();
    setIsLoggingOut(false);
    setShowLogoutDialog(false);
    showToast('success', '로그아웃되었어요', 2000);
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    // Mock: 실제 계정 삭제는 구현하지 않음
    await new Promise<void>(resolve => setTimeout(resolve, 1000));
    await signOut();
    setIsDeleting(false);
    setShowDeleteDialog(false);
    showToast('success', '계정이 삭제되었어요');
  };

  const handleOpenLink = (url: string) => {
    Linking.openURL(url).catch(err => {
      console.error('Failed to open URL:', err);
    });
  };

  const getCurrentLanguageLabel = () => {
    const lang = LANGUAGES.find(l => l.code === selectedLanguage);
    return lang?.nativeLabel ?? '한국어';
  };

  return (
    <View style={styles.container}>
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
          <SettingItem
            icon={Bell}
            title="푸시 알림"
            onPress={() => setPushEnabled(!pushEnabled)}
            rightElement={
              <Switch
                value={pushEnabled}
                onValueChange={handlePushToggle}
                trackColor={{
                  false: theme.colors.neutral.gray300,
                  true: theme.colors.primary.light,
                }}
                thumbColor={
                  pushEnabled ? theme.colors.primary.main : theme.colors.neutral.gray100
                }
              />
            }
          />
        </View>

        {/* 일반 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>일반</Text>
          <SettingItem
            icon={Globe}
            title="언어"
            onPress={() => setShowLanguageSheet(true)}
            rightElement={
              <View style={styles.languageValue}>
                <Text style={styles.languageText}>{getCurrentLanguageLabel()}</Text>
                <ChevronRight size={20} color={theme.colors.text.secondary} strokeWidth={2} />
              </View>
            }
          />
          <SettingItem
            icon={Mail}
            title="개발자에게 문의"
            onPress={() => handleOpenLink(EXTERNAL_LINKS.support)}
          />
        </View>

        {/* 정보 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>정보</Text>
          <SettingItem
            icon={FileText}
            title="개인정보 처리방침"
            onPress={() => handleOpenLink(EXTERNAL_LINKS.privacy)}
          />
          <SettingItem
            icon={ClipboardList}
            title="이용약관"
            onPress={() => handleOpenLink(EXTERNAL_LINKS.terms)}
          />
        </View>

        {/* 계정 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>계정</Text>
          <SettingItem
            icon={LogOut}
            title="로그아웃"
            onPress={() => setShowLogoutDialog(true)}
          />
          <SettingItem
            icon={Trash2}
            title="계정 삭제"
            onPress={() => setShowDeleteDialog(true)}
            danger
          />
        </View>

        {/* 버전 정보 */}
        <View style={styles.footer}>
          <Text style={styles.version}>Hang On v0.0.1</Text>
        </View>
      </ScrollView>

      {/* 언어 선택 바텀시트 */}
      <BottomSheet
        visible={showLanguageSheet}
        onClose={() => setShowLanguageSheet(false)}
        title="언어 선택"
        height="auto"
      >
        <View style={styles.languageList}>
          {LANGUAGES.map(lang => (
            <TouchableOpacity
              key={lang.code}
              style={[
                styles.languageItem,
                selectedLanguage === lang.code && styles.languageItemSelected,
              ]}
              onPress={() => handleLanguageSelect(lang.code)}
              activeOpacity={0.7}
            >
              <View style={styles.languageItemContent}>
                <Text
                  style={[
                    styles.languageItemLabel,
                    selectedLanguage === lang.code && styles.languageItemLabelSelected,
                  ]}
                >
                  {lang.nativeLabel}
                </Text>
                {lang.code !== 'ko' && (
                  <Text style={styles.languageItemSub}>{lang.label}</Text>
                )}
              </View>
              {selectedLanguage === lang.code && (
                <Check size={20} color={theme.colors.primary.main} strokeWidth={2.5} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </BottomSheet>

      {/* 로그아웃 확인 다이얼로그 */}
      <ConfirmDialog
        visible={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
        onConfirm={handleLogout}
        title="로그아웃"
        message="정말 로그아웃할까요?"
        confirmLabel="로그아웃"
        cancelLabel="취소"
        loading={isLoggingOut}
      />

      {/* 계정 삭제 확인 다이얼로그 */}
      <ConfirmDialog
        visible={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteAccount}
        title="계정 삭제"
        message="정말 계정을 삭제하시겠어요? 모든 기록이 영구적으로 삭제되며 복구할 수 없습니다."
        confirmLabel="삭제"
        cancelLabel="취소"
        variant="danger"
        loading={isDeleting}
      />
    </View>
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
  languageValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageText: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    marginRight: theme.spacing.xs,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  version: {
    ...theme.typography.caption,
    color: theme.colors.text.disabled,
  },

  // 언어 선택 바텀시트 스타일
  languageList: {
    paddingBottom: theme.spacing.md,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderRadius: 12,
    marginBottom: theme.spacing.xs,
  },
  languageItemSelected: {
    backgroundColor: `${theme.colors.primary.main}10`,
  },
  languageItemContent: {
    flex: 1,
  },
  languageItemLabel: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
    fontWeight: '500',
  },
  languageItemLabelSelected: {
    color: theme.colors.primary.main,
    fontWeight: '600',
  },
  languageItemSub: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
});
