import { Heart, MessageCircle } from 'lucide-react-native';
import React, { memo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
  Platform,
  GestureResponderEvent,
} from 'react-native';

import { EmotionLevel, EMOTION_DATA } from '@/constants/emotions';
import { RecordVisibility } from '@/store/recordStore';
import { theme } from '@/theme';
import { formatDateLabel } from '@/utils/dateFormatter';

// visibility 라벨 매핑
const VISIBILITY_LABELS: Record<RecordVisibility, string> = {
  public: '공개',
  private: '비공개',
  scheduled: '예약공개',
};

export interface RecordCardProps {
  id: string;
  emotionLevel: EmotionLevel;
  content: string;
  createdAt: Date | string;
  empathyCount?: number;
  messageCount?: number;
  visibility?: RecordVisibility;
  onPress?: (id: string) => void;
  onEmpathyPress?: (id: string) => void;
  onMessagePress?: (id: string) => void;
  style?: StyleProp<ViewStyle>;
}

// 텍스트 미리보기 생성
const getPreviewText = (text: string, maxLength: number = 100): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * RecordCard - 기록 카드 컴포넌트
 *
 * React.memo로 최적화되어 props가 변경되지 않으면 리렌더링을 방지합니다.
 *
 * 레이아웃:
 * ┌─────────────────────────────────┐
 * │ 오늘                      🌐 🌧️ │  ← 날짜 + 공유아이콘 + 감정아이콘
 * │                                 │
 * │ 오늘 하루가 정말 힘들었어...     │  ← 내용 미리보기
 * │                                 │
 * │ ❤️ 5     💬 3                   │  ← 반응 (구분선 없음)
 * └─────────────────────────────────┘
 */
export const RecordCard = memo(function RecordCard({
  id,
  emotionLevel,
  content,
  createdAt,
  empathyCount = 0,
  messageCount = 0,
  visibility = 'private',
  onPress,
  onEmpathyPress,
  onMessagePress,
  style,
}: RecordCardProps) {
  const emotionInfo = EMOTION_DATA[emotionLevel];
  const EmotionIcon = emotionInfo.icon;

  const handlePress = () => {
    onPress?.(id);
  };

  const handleEmpathyPress = (e?: GestureResponderEvent) => {
    e?.stopPropagation();
    onEmpathyPress?.(id);
  };

  const handleMessagePress = (e?: GestureResponderEvent) => {
    e?.stopPropagation();
    onMessagePress?.(id);
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={handlePress}
      activeOpacity={0.9}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`${emotionInfo.label} 감정 기록, ${formatDateLabel(createdAt)}`}
      accessibilityHint="탭하여 상세 내용 보기"
    >
      {/* Header: 날짜+감정(왼쪽) / 공개상태(오른쪽) */}
      <View style={styles.header}>
        <View style={styles.dateGroup}>
          <View style={[styles.emotionBadge, { backgroundColor: emotionInfo.color + '20' }]}>
            <EmotionIcon size={18} color={emotionInfo.color} strokeWidth={2} />
          </View>
          <Text style={styles.dateText}>{formatDateLabel(createdAt)}</Text>
        </View>
        <Text style={styles.visibilityText}>
          {VISIBILITY_LABELS[visibility]}
        </Text>
      </View>

      {/* Content Preview */}
      <Text style={styles.content} numberOfLines={3}>
        {getPreviewText(content, 120)}
      </Text>

      {/* Footer: 공감과 메시지 카운트 (구분선 없음) */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleEmpathyPress}
          activeOpacity={0.7}
          hitSlop={{ top: 12, bottom: 12, left: 8, right: 8 }}
          accessibilityLabel={`공감 ${empathyCount}개`}
          accessibilityHint="탭하여 공감 목록을 확인합니다"
          accessibilityRole="button"
        >
          <Heart size={14} color={theme.colors.neutral.gray500} />
          <Text style={styles.actionCount}>{empathyCount}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleMessagePress}
          activeOpacity={0.7}
          hitSlop={{ top: 12, bottom: 12, left: 8, right: 8 }}
          accessibilityLabel={`메시지 ${messageCount}개`}
          accessibilityHint="탭하여 메시지 목록을 확인합니다"
          accessibilityRole="button"
        >
          <MessageCircle size={14} color={theme.colors.neutral.gray500} />
          <Text style={styles.actionCount}>{messageCount}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.neutral.white,
    borderRadius: 16,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md, // sm → md로 카드 사이 여백 확대
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  dateGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm, // xs → sm으로 여백 확대
  },
  dateText: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.neutral.gray900,
  },
  visibilityText: {
    fontSize: 12,
    color: theme.colors.neutral.gray400,
  },
  emotionBadge: {
    width: 32, // 28 → 32로 키움
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    fontSize: 14, // body(16) → 14로 줄임
    color: theme.colors.neutral.gray700,
    lineHeight: 21,
    marginBottom: theme.spacing.md,
  },
  footer: {
    flexDirection: 'row',
    // borderTop 제거
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 48, // 고정 최소 너비로 간격 일관성
    marginRight: theme.spacing.md,
  },
  actionCount: {
    ...theme.typography.caption,
    color: theme.colors.neutral.gray500, // gray700 → gray500으로 약화
    marginLeft: theme.spacing.xs,
    minWidth: 16, // 숫자 영역 고정
  },
});

export default RecordCard;
