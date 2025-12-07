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

/**
 * RecordCard - 기록 카드 컴포넌트
 *
 * HTML 목업 기반 레이아웃:
 * ┌─────────────────────────────────┐
 * │ 🌧️  5 minutes ago               │  ← 아이콘 + 시간
 * │                                 │
 * │ 오늘 하루가 정말 힘들었어...     │  ← 내용 (2줄)
 * │                                 │
 * │ ❤️ 12    💬 3                   │  ← 반응
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
      {/* Header: 아이콘 + 시간 */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <EmotionIcon size={24} color={emotionInfo.color} strokeWidth={2} />
          <Text style={styles.timeText}>{formatDateLabel(createdAt)}</Text>
        </View>
        {visibility !== 'private' && (
          <Text style={styles.visibilityText}>
            {VISIBILITY_LABELS[visibility]}
          </Text>
        )}
      </View>

      {/* Content Preview - 2줄 제한 */}
      <Text style={styles.content} numberOfLines={2}>
        {content}
      </Text>

      {/* Footer: 공감과 메시지 */}
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
          <Heart
            size={14}
            color={empathyCount > 0 ? theme.colors.primary.main : theme.colors.neutral.gray500}
            fill={empathyCount > 0 ? theme.colors.primary.main : 'transparent'}
          />
          <Text style={[styles.actionCount, empathyCount > 0 && styles.actionCountActive]}>
            {empathyCount}
          </Text>
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
    backgroundColor: theme.colors.surface, // card-light
    borderRadius: 12, // rounded-xl
    padding: 16, // p-4
    borderWidth: 1,
    borderColor: theme.colors.border, // border-light
    gap: 12, // gap-3 (섹션 간격)
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8, // gap-2
  },
  timeText: {
    fontSize: 12, // text-xs
    fontWeight: '500', // font-medium
    color: theme.colors.text.secondary, // text-muted-light
    letterSpacing: 0.01, // tracking
  },
  visibilityText: {
    fontSize: 12,
    fontWeight: '500',
    color: theme.colors.neutral.gray400,
  },
  content: {
    fontSize: 14, // text-sm
    fontWeight: '400', // font-normal
    lineHeight: 23, // leading-relaxed (14 * 1.625)
    color: theme.colors.text.primary, // text-light
    letterSpacing: 0.01,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16, // gap-4
    paddingTop: 8, // pt-2
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6, // gap-1.5
  },
  actionCount: {
    fontSize: 12, // text-xs
    fontWeight: '500', // font-medium
    color: theme.colors.text.secondary, // text-muted
  },
  actionCountActive: {
    color: theme.colors.primary.main,
  },
});

export default RecordCard;
