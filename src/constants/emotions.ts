import { Cloud, CloudLightning, CloudRain, CloudSun, Sun } from 'lucide-react-native';

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
    icon: CloudLightning,
    label: '폭풍',
    emotion: '불안/화남',
    color: theme.colors.emotion.stormy,
  },
  2: {
    icon: CloudRain,
    label: '비',
    emotion: '슬픔/우울',
    color: theme.colors.emotion.rainy,
  },
  3: {
    icon: Cloud,
    label: '흐림',
    emotion: '무기력/답답',
    color: theme.colors.emotion.cloudy,
  },
  4: {
    icon: CloudSun,
    label: '구름',
    emotion: '그저 그런',
    color: theme.colors.emotion.partly,
  },
  5: {
    icon: Sun,
    label: '맑음',
    emotion: '기쁨/행복',
    color: theme.colors.emotion.sunny,
  },
};
