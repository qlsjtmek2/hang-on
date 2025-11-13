import { theme } from '@/theme';

/**
 * 감정 수준 타입 정의
 * 1: 폭풍 (매우 나쁨)
 * 2: 비 (나쁨)
 * 3: 흐림 (보통)
 * 4: 구름 (좋음)
 * 5: 맑음 (매우 좋음)
 */
export type EmotionLevel = 1 | 2 | 3 | 4 | 5;

/**
 * 감정 데이터 인터페이스
 */
export interface EmotionData {
  emoji: string;
  label: string;
  color: string;
}

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
    emoji: '⛅',
    label: '구름',
    color: theme.colors.emotion.partly,
  },
  5: {
    emoji: '☀️',
    label: '맑음',
    color: theme.colors.emotion.sunny,
  },
};
