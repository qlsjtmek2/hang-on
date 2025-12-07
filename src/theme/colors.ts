/**
 * Hang On - Color Palette
 *
 * 보라색 기반의 부드럽고 따뜻한 디자인 시스템
 *
 * 사용 예시:
 * import { colors } from '@/theme';
 * <View style={{ backgroundColor: colors.primary.main }} />
 *
 * 참조: docs/DESIGN_SYSTEM.md
 */

import type { EmotionLevel } from '@/types/emotion';

export const colors = {
  // Primary Colors (보라색 계열)
  primary: {
    main: '#8f4ae3', // 메인 보라 (CTA, 강조)
    light: '#a875e8', // 밝은 보라 (호버, 비활성화)
    dark: '#7a3bc7', // 어두운 보라 (눌림)
  },

  // Emotion Weather Colors (감정 날씨 색상)
  emotion: {
    sunny: '#FFD700', // 맑음 (최상) - Gold
    partly: '#87CEEB', // 구름 조금 (상) - Sky Blue
    cloudy: '#A9A9A9', // 흐림 (중) - Dark Gray
    rainy: '#708090', // 비 (하) - Slate Gray
    stormy: '#483D8B', // 폭풍 (최하) - Dark Slate Blue
  },

  // Semantic Colors (의미 색상)
  semantic: {
    success: '#4CAF50', // 성공 (초록)
    warning: '#FF9800', // 경고 (주황)
    error: '#F44336', // 에러 (빨강)
    info: '#8f4ae3', // 정보 (보라 - primary와 통일)
  },

  // Neutral Colors (보라빛 warm gray)
  neutral: {
    white: '#FFFFFF',
    gray100: '#faf8fb', // 가장 밝은 (배경과 동일)
    gray200: '#ede8f2', // 테두리
    gray300: '#d9d1e3',
    gray400: '#a495b7', // disabled
    gray500: '#6f5194', // muted text
    gray600: '#5a4279',
    gray700: '#453261',
    gray800: '#2d1f42',
    gray900: '#140e1a', // 거의 검정
    black: '#000000',
    // 아이콘용 순수 gray (보라빛 없음) - Tailwind Gray 기반
    iconDefault: '#9CA3AF', // 비활성 아이콘 (gray-400)
    iconMuted: '#6B7280', // 약간 진한 비활성 (gray-500)
    iconActive: '#374151', // 활성 아이콘 (gray-700)
  },

  // Background Colors
  background: '#faf8fb', // 메인 배경 (연한 라벤더 크림)
  surface: '#ffffff', // 카드 배경 (순백)
  surfaceHover: '#ede8f2', // 카드 호버
  border: '#ede8f2', // 구분선 (연한 보라)
  overlay: 'rgba(20, 14, 26, 0.5)', // 다이얼로그 뒤 오버레이

  // Text Colors (텍스트 색상)
  text: {
    primary: '#140e1a', // 주요 텍스트 (거의 검정)
    secondary: '#6f5194', // 보조 텍스트 (보라빛 회색)
    disabled: '#a495b7', // 비활성화 텍스트
    inverse: '#FFFFFF', // 역전 텍스트 (Primary 버튼 위)
  },
} as const;

/**
 * Emotion Level을 색상으로 변환하는 헬퍼 함수
 *
 * @param level - 감정 레벨 (1-5)
 * @returns 감정 레벨에 해당하는 색상 코드
 *
 * @example
 * const color = getEmotionColor(5); // '#FFD700' (맑음)
 */
export const getEmotionColor = (level: EmotionLevel): string => {
  const emotionColorMap = {
    5: colors.emotion.sunny,
    4: colors.emotion.partly,
    3: colors.emotion.cloudy,
    2: colors.emotion.rainy,
    1: colors.emotion.stormy,
  };

  return emotionColorMap[level];
};

/**
 * Emotion Level을 투명도가 적용된 색상으로 변환하는 헬퍼 함수
 *
 * @param level - 감정 레벨 (1-5)
 * @param opacity - 투명도 (0-1, 기본값: 0.1)
 * @returns rgba 형식의 색상 코드
 *
 * @example
 * const color = getEmotionColorWithOpacity(5, 0.1); // 'rgba(255, 215, 0, 0.1)'
 */
export const getEmotionColorWithOpacity = (level: EmotionLevel, opacity: number = 0.1): string => {
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 };
  };

  const color = getEmotionColor(level);
  const rgb = hexToRgb(color);

  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
};

// Type export for TypeScript
export type Colors = typeof colors;
