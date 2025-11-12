/**
 * Hang On - Color Palette
 *
 * 디자인 시스템 색상 정의
 *
 * 사용 예시:
 * import { colors } from '@/theme';
 * <View style={{ backgroundColor: colors.primary }} />
 *
 * 참조: docs/DESIGN_SYSTEM.md
 */

export const colors = {
  // Primary Colors (주요 색상)
  primary: {
    main: '#4A90E2', // 메인 블루 (CTA, 강조)
    light: '#7AB8FF', // 밝은 블루 (호버, 비활성화)
    dark: '#2E5C8A', // 어두운 블루 (눌림)
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
    info: '#2196F3', // 정보 (파랑)
  },

  // Neutral Colors (중립 색상)
  neutral: {
    white: '#FFFFFF', // 흰색
    gray100: '#F5F5F5', // 가장 밝은 회색
    gray200: '#EEEEEE', // 매우 밝은 회색
    gray300: '#E0E0E0', // 밝은 회색
    gray400: '#BDBDBD', // 중간 밝은 회색
    gray500: '#9E9E9E', // 중간 회색
    gray600: '#757575', // 중간 어두운 회색
    gray700: '#616161', // 어두운 회색
    gray800: '#424242', // 매우 어두운 회색
    gray900: '#212121', // 가장 어두운 회색
    black: '#000000', // 검정
  },

  // Background Colors
  background: '#FFFFFF', // 메인 배경
  surface: '#F5F5F5', // 카드 배경
  surfaceHover: '#EEEEEE', // 카드 호버
  border: '#E0E0E0', // 구분선
  overlay: 'rgba(0, 0, 0, 0.5)', // 다이얼로그 뒤 오버레이

  // Text Colors (텍스트 색상) - 호환성을 위해 유지
  text: {
    primary: '#212121', // 주요 텍스트 (검정)
    secondary: '#757575', // 보조 텍스트 (회색)
    disabled: '#BDBDBD', // 비활성화 텍스트 (연한 회색)
    inverse: '#FFFFFF', // 역전 텍스트 (흰색, Primary 버튼 위)
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
export const getEmotionColor = (level: 1 | 2 | 3 | 4 | 5): string => {
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
export const getEmotionColorWithOpacity = (
  level: 1 | 2 | 3 | 4 | 5,
  opacity: number = 0.1,
): string => {
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
export type EmotionLevel = 1 | 2 | 3 | 4 | 5;
