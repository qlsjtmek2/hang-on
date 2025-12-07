import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ChevronLeft,
  MoreHorizontal,
  Eye,
  EyeOff,
  Heart,
  MessageCircle,
  User,
} from 'lucide-react-native';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ActionSheet } from '@/components/BottomSheet';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { ReportBottomSheet } from '@/components/ReportBottomSheet';
import { EMOTION_DATA } from '@/constants/emotions';
import { useToast } from '@/contexts/ToastContext';
import type { RecordStackParamList } from '@/navigation/RecordStackNavigator';
import { useRecordStore } from '@/store/recordStore';
import { theme } from '@/theme';
import { formatSmartTime, formatDateWithDay, formatTime } from '@/utils/dateFormatter';

type RecordDetailScreenNavigationProp = NativeStackNavigationProp<
  RecordStackParamList,
  'RecordDetail'
>;
type RecordDetailScreenRouteProp = RouteProp<RecordStackParamList, 'RecordDetail'>;

// Mock 받은 메시지 데이터
interface ReceivedMessage {
  id: string;
  content: string;
  createdAt: Date;
}

const MOCK_MESSAGES: ReceivedMessage[] = [
  { id: '1', content: '힘내세요!', createdAt: new Date(Date.now() - 30 * 60000) },
  { id: '2', content: '저도 그래요', createdAt: new Date(Date.now() - 2 * 3600000) },
  { id: '3', content: '괜찮을 거예요', createdAt: new Date(Date.now() - 5 * 3600000) },
  { id: '4', content: '함께해요', createdAt: new Date(Date.now() - 8 * 3600000) },
  { id: '5', content: '응원합니다!', createdAt: new Date(Date.now() - 12 * 3600000) },
  { id: '6', content: '좋은 하루 되세요', createdAt: new Date(Date.now() - 24 * 3600000) },
  { id: '7', content: '마음이 따뜻해지네요', createdAt: new Date(Date.now() - 36 * 3600000) },
];

/**
 * 기록 상세 화면
 *
 * 감정 기록의 전체 내용을 표시
 * - 감정 아이콘 + 작성 시간
 * - 전체 내용 표시
 * - 받은 공감/메시지 목록
 * - 더보기 메뉴: 수정 / 삭제 / 공유 설정 변경
 */
export const RecordDetailScreen: React.FC = () => {
  const navigation = useNavigation<RecordDetailScreenNavigationProp>();
  const route = useRoute<RecordDetailScreenRouteProp>();
  const { recordId } = route.params;
  const { showToast } = useToast();

  const { getRecordById, deleteRecord, updateRecord } = useRecordStore();
  const record = getRecordById(recordId);

  const [showActionSheet, setShowActionSheet] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showVisibilityDialog, setShowVisibilityDialog] = useState(false);
  const [showReportSheet, setShowReportSheet] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // 기록이 없는 경우
  if (!record) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>기록을 찾을 수 없습니다</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.errorLink}>돌아가기</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const emotionInfo = EMOTION_DATA[record.emotionLevel];
  const EmotionIcon = emotionInfo.icon;
  const isPublic = record.visibility === 'public';
  const isScheduled = record.visibility === 'scheduled';

  const handleBack = () => {
    navigation.goBack();
  };

  const handleEdit = () => {
    setShowActionSheet(false);
    navigation.navigate('EditRecord', { recordId });
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    const success = await deleteRecord(recordId);
    setIsDeleting(false);
    setShowDeleteDialog(false);

    if (success) {
      showToast('success', '기록이 삭제되었어요');
      navigation.goBack();
    } else {
      showToast('error', '삭제에 실패했어요. 다시 시도해주세요', 4000);
    }
  };

  const handleToggleVisibility = async () => {
    const newVisibility = isPublic ? 'private' : 'public';
    const success = await updateRecord(recordId, { visibility: newVisibility });
    setShowVisibilityDialog(false);

    if (success) {
      showToast('success', '공개 설정이 변경되었어요');
    } else {
      showToast('error', '변경에 실패했어요. 다시 시도해주세요', 4000);
    }
  };

  const handleReport = (reason: string, detail?: string) => {
    // Mock: 신고 처리
    console.log('Report submitted:', { recordId, reason, detail });
  };

  const getVisibilityLabel = () => {
    if (isScheduled) return '예약 공개';
    return isPublic ? '공개됨' : '비공개';
  };

  const actionSheetActions = [
    {
      label: '수정하기',
      onPress: handleEdit,
    },
    {
      label: isPublic ? '비공개로 전환' : '공개하기',
      onPress: () => {
        setShowActionSheet(false);
        setShowVisibilityDialog(true);
      },
    },
    {
      label: '삭제하기',
      onPress: () => {
        setShowActionSheet(false);
        setShowDeleteDialog(true);
      },
      destructive: true,
    },
  ];

  // 공개된 글에만 신고 옵션 추가 (자신의 글이 아닌 경우를 위해)
  // 현재는 내 기록이므로 신고 기능은 숨김

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.headerButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel="뒤로 가기"
          accessibilityRole="button"
        >
          <ChevronLeft size={24} color={theme.colors.neutral.gray600} strokeWidth={2} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>기록 상세</Text>

        <TouchableOpacity
          onPress={() => setShowActionSheet(true)}
          style={styles.headerButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel="더보기 메뉴"
          accessibilityRole="button"
        >
          <MoreHorizontal size={24} color={theme.colors.neutral.gray600} strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 감정 정보 (재설계: 날짜 주인공, 감정 보조) */}
        <View style={styles.emotionSection}>
          <View>
            <Text style={styles.dateTitle}>{formatDateWithDay(record.createdAt, false)}</Text>
            <View style={styles.metaInfoRow}>
              <EmotionIcon size={16} color={emotionInfo.color} strokeWidth={2} />
              <Text style={styles.emotionText}>{emotionInfo.label}</Text>
              <Text style={styles.dot}>•</Text>
              <Text style={styles.timeText}>
                {formatTime(record.createdAt.getHours(), record.createdAt.getMinutes())}
              </Text>
            </View>
          </View>
          <View style={styles.visibilityBadge}>
            {isPublic ? (
              <Eye size={14} color={theme.colors.primary.main} strokeWidth={2} />
            ) : (
              <EyeOff size={14} color={theme.colors.text.secondary} strokeWidth={2} />
            )}
            <Text style={[styles.visibilityText, isPublic && styles.visibilityTextPublic]}>
              {getVisibilityLabel()}
            </Text>
          </View>
        </View>

        {/* 본문 */}
        <View style={styles.contentSection}>
          <Text style={styles.contentText}>{record.content}</Text>
        </View>

        {/* 통계 (Chip 스타일) */}
        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <Heart
              size={16}
              color={theme.colors.semantic.error}
              strokeWidth={2}
              style={styles.statIcon}
            />
            <Text style={styles.statText}>공감 {record.heartsCount}</Text>
          </View>
          <View style={styles.statItem}>
            <MessageCircle
              size={16}
              color={theme.colors.primary.main}
              strokeWidth={2}
              style={styles.statIcon}
            />
            <Text style={styles.statText}>댓글 {record.messagesCount}</Text>
          </View>
        </View>

        {/* 받은 메시지 목록 (말풍선 스타일) */}
        {record.messagesCount > 0 && (
          <View style={styles.messagesSection}>
            <Text style={styles.sectionTitle}>받은 메시지</Text>
            {MOCK_MESSAGES.slice(0, record.messagesCount).map(message => (
              <View key={message.id} style={styles.messageItem}>
                <View style={styles.avatarContainer}>
                  <User size={16} color={theme.colors.neutral.gray400} strokeWidth={2} />
                </View>
                <View style={styles.messageBubble}>
                  <View style={styles.messageHeader}>
                    <Text style={styles.messageAuthor}>익명</Text>
                    <Text style={styles.messageDot}>•</Text>
                    <Text style={styles.messageTime}>{formatSmartTime(message.createdAt)}</Text>
                  </View>
                  <Text style={styles.messageText}>{message.content}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* 액션 시트 */}
      <ActionSheet
        visible={showActionSheet}
        onClose={() => setShowActionSheet(false)}
        title="기록 관리"
        actions={actionSheetActions}
      />

      {/* 삭제 확인 다이얼로그 */}
      <ConfirmDialog
        visible={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="기록 삭제"
        message="이 기록을 삭제할까요? 삭제된 기록은 복구할 수 없습니다."
        confirmLabel="삭제"
        cancelLabel="취소"
        variant="danger"
        loading={isDeleting}
      />

      {/* 공개 설정 변경 다이얼로그 */}
      <ConfirmDialog
        visible={showVisibilityDialog}
        onClose={() => setShowVisibilityDialog(false)}
        onConfirm={handleToggleVisibility}
        title={isPublic ? '비공개로 전환' : '공개하기'}
        message={
          isPublic
            ? '이 기록을 비공개로 전환하면 다른 사람들에게 더 이상 보이지 않습니다.'
            : '이 기록을 공개하면 다른 사람들이 볼 수 있습니다.'
        }
        confirmLabel={isPublic ? '비공개로 전환' : '공개하기'}
        cancelLabel="취소"
      />

      {/* 신고 바텀시트 (타인의 글 상세에서 사용) */}
      <ReportBottomSheet
        visible={showReportSheet}
        onClose={() => setShowReportSheet(false)}
        onSubmit={handleReport}
        recordId={recordId}
      />
    </SafeAreaView>
  );
};

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
  headerButton: {
    padding: theme.spacing.xs,
  },
  headerTitle: {
    ...theme.typography.h3,
    color: theme.colors.text.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
  },
  errorLink: {
    ...theme.typography.body,
    color: theme.colors.primary.main,
    fontWeight: '600',
  },

  // 감정 섹션 (재설계: 날짜 주인공, 감정은 보조)
  emotionSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.xl,
  },
  dateTitle: {
    ...theme.typography.h2,
    color: theme.colors.text.primary,
    marginBottom: 6,
  },
  metaInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emotionText: {
    ...theme.typography.bodySmall,
    color: theme.colors.text.secondary,
    marginLeft: 6,
  },
  dot: {
    marginHorizontal: 6,
    color: theme.colors.neutral.gray300,
  },
  timeText: {
    ...theme.typography.bodySmall,
    color: theme.colors.text.secondary,
  },
  visibilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: theme.colors.neutral.gray100,
    borderRadius: 20,
  },
  visibilityText: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    marginLeft: 4,
    fontWeight: '600',
  },
  visibilityTextPublic: {
    color: theme.colors.primary.main,
  },

  // 본문 섹션
  contentSection: {
    marginBottom: 40,
  },
  contentText: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
    lineHeight: 28,
  },

  // 통계 섹션 (Chip 스타일)
  statsSection: {
    flexDirection: 'row',
    marginBottom: 40,
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.neutral.gray100,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  statIcon: {
    marginRight: 6,
  },
  statText: {
    ...theme.typography.bodySmall,
    fontWeight: '600',
    color: theme.colors.text.secondary,
  },

  // 메시지 섹션 (채팅 스타일)
  messagesSection: {
    marginTop: 10,
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
  },
  messageItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.neutral.gray100,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageBubble: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderTopLeftRadius: 4, // 말꼬리 효과
    maxWidth: '85%',
    ...theme.shadows.sm,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  messageAuthor: {
    ...theme.typography.caption,
    fontWeight: '600',
    color: theme.colors.text.secondary,
  },
  messageDot: {
    marginHorizontal: 6,
    color: theme.colors.neutral.gray300,
    fontSize: 10,
  },
  messageTime: {
    ...theme.typography.caption,
    color: theme.colors.text.disabled,
    fontSize: 11,
  },
  messageText: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
    lineHeight: 22,
  },
});
