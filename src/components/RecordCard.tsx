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
import { theme } from '@/theme';

export interface RecordCardProps {
  id: string;
  emotionLevel: EmotionLevel;
  content: string;
  createdAt: Date | string;
  empathyCount?: number;
  messageCount?: number;
  isShared?: boolean;
  onPress?: (id: string) => void;
  onEmpathyPress?: (id: string) => void;
  onMessagePress?: (id: string) => void;
  style?: StyleProp<ViewStyle>;
  formatTime?: (date: Date | string) => string;
}

// 기본 시간 포맷터 (나중에 dateFormatter 유틸리티로 대체)
const defaultFormatTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return '방금 전';
  if (minutes < 60) return `${minutes}분 전`;
  if (hours < 24) return `${hours}시간 전`;
  if (days < 7) return `${days}일 전`;

  // 일주일 이상인 경우 날짜 표시
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const hour = d.getHours();
  const minute = d.getMinutes();
  const ampm = hour >= 12 ? '오후' : '오전';
  const displayHour = hour % 12 || 12;

  if (d.getFullYear() === now.getFullYear()) {
    return `${month}월 ${day}일 ${ampm} ${displayHour}:${minute.toString().padStart(2, '0')}`;
  }

  return `${d.getFullYear()}.${month}.${day}`;
};

// 텍스트 미리보기 생성
const getPreviewText = (text: string, maxLength: number = 100): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * RecordCard - 기록 카드 컴포넌트
 *
 * React.memo로 최적화되어 props가 변경되지 않으면 리렌더링을 방지합니다.
 */
export const RecordCard = memo(function RecordCard({
  id,
  emotionLevel,
  content,
  createdAt,
  empathyCount = 0,
  messageCount = 0,
  isShared = false,
  onPress,
  onEmpathyPress,
  onMessagePress,
  style,
  formatTime = defaultFormatTime,
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
      accessibilityLabel={`${emotionInfo.label} 감정 기록`}
      accessibilityHint="탭하여 상세 내용 보기"
    >
      {/* Header: 감정 아이콘과 시간 */}
      <View style={styles.header}>
        <View style={styles.emotionContainer}>
          <View style={[styles.emotionIcon, { backgroundColor: emotionInfo.color + '20' }]}>
            <EmotionIcon size={18} color={emotionInfo.color} strokeWidth={2} />
          </View>
          <Text style={[styles.emotionLabel, { color: emotionInfo.color }]}>
            {emotionInfo.label}
          </Text>
        </View>
        <View style={styles.timeContainer}>
          {isShared && (
            <View style={styles.sharedBadge}>
              <Text style={styles.sharedText}>공유됨</Text>
            </View>
          )}
          <Text style={styles.timeText}>{formatTime(createdAt)}</Text>
        </View>
      </View>

      {/* Content Preview */}
      <Text style={styles.content} numberOfLines={3}>
        {getPreviewText(content, 120)}
      </Text>

      {/* Footer: 공감과 메시지 카운트 */}
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
          <Heart size={16} color={theme.colors.neutral.gray600} />
          {empathyCount > 0 && <Text style={styles.actionCount}>{empathyCount}</Text>}
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
          <MessageCircle size={16} color={theme.colors.neutral.gray600} />
          {messageCount > 0 && <Text style={styles.actionCount}>{messageCount}</Text>}
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.neutral.white,
    borderRadius: 12,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
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
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  emotionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emotionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emotionLabel: {
    ...theme.typography.caption,
    fontWeight: '600',
    marginLeft: theme.spacing.xs,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sharedBadge: {
    backgroundColor: theme.colors.primary.light,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: theme.spacing.xs,
  },
  sharedText: {
    ...theme.typography.caption,
    color: theme.colors.primary.dark,
    fontSize: 10,
    fontWeight: '600',
  },
  timeText: {
    ...theme.typography.caption,
    color: theme.colors.neutral.gray600,
  },
  content: {
    ...theme.typography.body,
    color: theme.colors.neutral.gray900,
    lineHeight: 22,
    marginBottom: theme.spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.neutral.gray200,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  actionCount: {
    ...theme.typography.caption,
    color: theme.colors.neutral.gray700,
    marginLeft: theme.spacing.xs,
    fontWeight: '500',
  },
});

export default RecordCard;
