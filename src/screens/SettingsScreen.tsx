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
  isFirst?: boolean;
  isLast?: boolean;
}

const SettingItem: React.FC<SettingItemProps> = ({
  icon: Icon,
  title,
  onPress,
  danger,
  rightElement,
  isFirst,
  isLast,
}) => (
  <TouchableOpacity
    style={[
      styles.settingItem,
      isFirst && styles.settingItemFirst,
      isLast && styles.settingItemLast,
    ]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={styles.iconContainer}>
      <Icon
        size={20}
        color={danger ? theme.colors.semantic.error : theme.colors.text.secondary}
        strokeWidth={1.8}
      />
    </View>
    <View style={[styles.settingContent, !isLast && styles.settingContentBorder]}>
      <Text style={[styles.settingTitle, danger && styles.dangerText]}>{title}</Text>
      {rightElement || (
        <ChevronRight size={20} color={theme.colors.text.disabled} strokeWidth={2} />
      )}
    </View>
  </TouchableOpacity>
);

/**
 * 설정 화면
 *
 * 계정 및 앱 설정 관리 (iOS 인셋 그룹 스타일)
 * - 프로필 카드
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

  // 사용자 이름 추출 (이메일에서)
  const getUserDisplayName = () => {
    if (!user?.email) return 'Hang On 유저';
    const name = user.email.split('@')[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 프로필 카드 */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <User size={32} color={theme.colors.text.secondary} strokeWidth={1.5} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{getUserDisplayName()}</Text>
            <Text style={styles.profileEmail}>{user?.email}</Text>
          </View>
        </View>

        {/* 앱 설정 섹션 */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>앱 설정</Text>
        </View>
        <View style={styles.groupCard}>
          <SettingItem
            icon={Bell}
            title="푸시 알림"
            onPress={() => setPushEnabled(!pushEnabled)}
            isFirst
            rightElement={
              <Switch
                value={pushEnabled}
                onValueChange={handlePushToggle}
                trackColor={{
                  false: theme.colors.neutral.gray300,
                  true: theme.colors.primary.light,
                }}
                thumbColor={pushEnabled ? theme.colors.primary.main : theme.colors.neutral.gray100}
              />
            }
          />
          <SettingItem
            icon={Globe}
            title="언어"
            onPress={() => setShowLanguageSheet(true)}
            isLast
            rightElement={
              <View style={styles.languageValue}>
                <Text style={styles.languageText}>{getCurrentLanguageLabel()}</Text>
                <ChevronRight size={20} color={theme.colors.text.disabled} strokeWidth={2} />
              </View>
            }
          />
        </View>

        {/* 지원 섹션 */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>지원</Text>
        </View>
        <View style={styles.groupCard}>
          <SettingItem
            icon={Mail}
            title="개발자에게 문의"
            onPress={() => handleOpenLink(EXTERNAL_LINKS.support)}
            isFirst
          />
          <SettingItem
            icon={FileText}
            title="개인정보 처리방침"
            onPress={() => handleOpenLink(EXTERNAL_LINKS.privacy)}
          />
          <SettingItem
            icon={ClipboardList}
            title="이용약관"
            onPress={() => handleOpenLink(EXTERNAL_LINKS.terms)}
            isLast
          />
        </View>

        {/* 계정 섹션 */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>계정</Text>
        </View>
        <View style={styles.groupCard}>
          <SettingItem
            icon={LogOut}
            title="로그아웃"
            onPress={() => setShowLogoutDialog(true)}
            danger
            isFirst
          />
          <SettingItem
            icon={Trash2}
            title="계정 삭제"
            onPress={() => setShowDeleteDialog(true)}
            danger
            isLast
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
                {lang.code !== 'ko' && <Text style={styles.languageItemSub}>{lang.label}</Text>}
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
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: 40,
  },

  // 프로필 카드
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: theme.spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.neutral.gray100,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    ...theme.typography.h3,
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  profileEmail: {
    ...theme.typography.bodySmall,
    color: theme.colors.text.secondary,
  },

  // 섹션 헤더
  sectionHeader: {
    marginBottom: theme.spacing.sm,
    marginLeft: theme.spacing.xs,
  },
  sectionTitle: {
    ...theme.typography.bodySmall,
    color: theme.colors.text.secondary,
    fontWeight: '500',
  },

  // 그룹 카드
  groupCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    marginBottom: theme.spacing.xl,
    overflow: 'hidden',
    ...theme.shadows.sm,
  },

  // 설정 아이템
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: theme.spacing.md,
    backgroundColor: theme.colors.surface,
  },
  settingItemFirst: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  settingItemLast: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  iconContainer: {
    width: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingRight: theme.spacing.md,
    marginLeft: theme.spacing.sm,
  },
  settingContentBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
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

  // 푸터
  footer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
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
