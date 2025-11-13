import { theme } from '@/theme';
import type { EmotionLevel, EmotionData } from '@/types/emotion';

// Re-export types for convenience
export type { EmotionLevel, EmotionData };

/**
 * 감정 수준별 날씨 데이터 매핑
 * 앱 전체에서 감정을 시각적으로 표현할 때 사용
 */
export const EMOTION_DATA: Record<EmotionLevel, EmotionData> = {
  1: {
    emoji: '⛈️',
    label: '폭풍',
    color: theme.colors.emotion.stormy,
  },
  2: {
    emoji: '🌧️',
    label: '비',
    color: theme.colors.emotion.rainy,
  },
  3: {
    emoji: '☁️',
    label: '흐림',
    color: theme.colors.emotion.cloudy,
  },
  4: {
    emoji: '🌤️',
    label: '구름',
    color: theme.colors.emotion.partly,
  },
  5: {
    emoji: '☀️',
    label: '맑음',
    color: theme.colors.emotion.sunny,
  },
};
