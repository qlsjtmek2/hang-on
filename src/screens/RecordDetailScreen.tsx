import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ChevronLeft,
  MoreHorizontal,
  Eye,
  EyeOff,
  Heart,
  MessageCircle,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ActionSheet } from '@/components/BottomSheet';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { ReportBottomSheet } from '@/components/ReportBottomSheet';
import { EMOTION_DATA } from '@/constants/emotions';
import type { RecordStackParamList } from '@/navigation/RecordStackNavigator';
import { useRecordStore } from '@/store/recordStore';
import { theme } from '@/theme';
import { formatSmartTime } from '@/utils/dateFormatter';

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
      navigation.goBack();
    }
  };

  const handleToggleVisibility = async () => {
    const newVisibility = isPublic ? 'private' : 'public';
    await updateRecord(recordId, { visibility: newVisibility });
    setShowVisibilityDialog(false);
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
        {/* 감정 정보 */}
        <View style={styles.emotionSection}>
          <View style={[styles.emotionIconContainer, { backgroundColor: emotionInfo.color }]}>
            <EmotionIcon size={32} color={theme.colors.neutral.white} strokeWidth={2} />
          </View>
          <View style={styles.emotionInfo}>
            <Text style={[styles.emotionLabel, { color: emotionInfo.color }]}>
              {emotionInfo.label}
            </Text>
            <Text style={styles.timeText}>{formatSmartTime(record.createdAt)}</Text>
          </View>
          <View style={styles.visibilityBadge}>
            {isPublic ? (
              <Eye size={14} color={theme.colors.primary.main} strokeWidth={2} />
            ) : (
              <EyeOff size={14} color={theme.colors.text.secondary} strokeWidth={2} />
            )}
            <Text
              style={[
                styles.visibilityText,
                isPublic && styles.visibilityTextPublic,
              ]}
            >
              {getVisibilityLabel()}
            </Text>
          </View>
        </View>

        {/* 본문 */}
        <View style={styles.contentSection}>
          <Text style={styles.contentText}>{record.content}</Text>
        </View>

        {/* 통계 */}
        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <Heart size={18} color={theme.colors.semantic.error} strokeWidth={2} />
            <Text style={styles.statText}>공감 {record.heartsCount}개</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <MessageCircle size={18} color={theme.colors.primary.main} strokeWidth={2} />
            <Text style={styles.statText}>메시지 {record.messagesCount}개</Text>
          </View>
        </View>

        {/* 받은 메시지 목록 */}
        {record.messagesCount > 0 && (
          <View style={styles.messagesSection}>
            <Text style={styles.sectionTitle}>받은 메시지</Text>
            {MOCK_MESSAGES.slice(0, record.messagesCount).map(message => (
              <View key={message.id} style={styles.messageItem}>
                <View style={styles.messageIconContainer}>
                  <MessageCircle
                    size={14}
                    color={theme.colors.primary.main}
                    strokeWidth={2}
                  />
                </View>
                <View style={styles.messageContent}>
                  <Text style={styles.messageText}>{message.content}</Text>
                  <Text style={styles.messageTime}>
                    {formatSmartTime(message.createdAt)}
                  </Text>
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
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
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

  // 감정 섹션
  emotionSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  emotionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emotionInfo: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  emotionLabel: {
    ...theme.typography.h3,
    fontWeight: '600',
    marginBottom: 4,
  },
  timeText: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
  },
  visibilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    backgroundColor: theme.colors.neutral.gray100,
    borderRadius: 16,
  },
  visibilityText: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    marginLeft: 4,
  },
  visibilityTextPublic: {
    color: theme.colors.primary.main,
  },

  // 본문 섹션
  contentSection: {
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  contentText: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
    lineHeight: 26,
  },

  // 통계 섹션
  statsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  statText: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.sm,
  },
  statDivider: {
    width: 1,
    height: 20,
    backgroundColor: theme.colors.border,
  },

  // 메시지 섹션
  messagesSection: {
    padding: theme.spacing.lg,
  },
  sectionTitle: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
    fontWeight: '600',
    marginBottom: theme.spacing.md,
  },
  messageItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.neutral.gray100,
    borderRadius: 12,
    marginBottom: theme.spacing.sm,
  },
  messageIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: `${theme.colors.primary.main}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  messageContent: {
    flex: 1,
  },
  messageText: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
    marginBottom: 2,
  },
  messageTime: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
  },
});
