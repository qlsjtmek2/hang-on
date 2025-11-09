/**
 * Hang On - Typography System
 *
 * 타이포그래피 정의 (폰트 크기, 굵기, 행간, 자간)
 *
 * 사용 예시:
 * import { typography } from '@/theme';
 * <Text style={typography.h1}>타이틀</Text>
 *
 * 참조: docs/DESIGN_SYSTEM.md
 */

import { TextStyle } from 'react-native';

/**
 * 폰트 패밀리 (시스템 기본 폰트)
 */
export const fontFamily = {
  ios: 'SF Pro Text',
  android: 'Roboto',
  fallback: 'sans-serif',
} as const;

/**
 * Typography Scale
 * 8pt Grid System에 맞춰 정의
 */
export const typography: Record<string, TextStyle> = {
  /**
   * Heading 1 - 화면 타이틀
   * 예: 메인 화면 헤더 "Hang On"
   */
  h1: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 36,
    letterSpacing: -0.5,
  },

  /**
   * Heading 2 - 섹션 제목
   * 예: "털어놓기", "누군가와 함께"
   */
  h2: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
    letterSpacing: -0.3,
  },

  /**
   * Heading 3 - 카드 제목
   * 예: 바텀시트 제목 "어떻게 나눌까요?"
   */
  h3: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
    letterSpacing: 0,
  },

  /**
   * Body - 본문 텍스트
   * 예: 기록 내용, 일반 텍스트
   */
  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    letterSpacing: 0,
  },

  /**
   * Body Bold - 강조 본문
   * 예: 중요한 정보, 강조 텍스트
   */
  bodyBold: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 24,
    letterSpacing: 0,
  },

  /**
   * Caption - 보조 정보
   * 예: 작성 시간, 글자 수, 설명 텍스트
   */
  caption: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    letterSpacing: 0,
  },

  /**
   * Button - 버튼 텍스트
   * 예: "다 썼어요! 💙", "공감하기"
   */
  button: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 20,
    letterSpacing: 0,
  },
} as const;

/**
 * 시스템 폰트 크기 설정 반영을 위한 헬퍼 함수
 *
 * @param baseSize - 기본 폰트 크기 (pt)
 * @param fontScale - 시스템 폰트 배율 (PixelRatio.getFontScale())
 * @returns 조정된 폰트 크기
 *
 * @example
 * import { PixelRatio } from 'react-native';
 * const fontScale = PixelRatio.getFontScale();
 * const adjustedSize = getScaledFontSize(16, fontScale);
 */
export const getScaledFontSize = (
  baseSize: number,
  fontScale: number
): number => {
  return baseSize * fontScale;
};

/**
 * Typography 스타일에 색상을 추가하는 헬퍼 함수
 *
 * @param typographyStyle - typography 객체의 스타일
 * @param color - 텍스트 색상
 * @returns 색상이 추가된 TextStyle
 *
 * @example
 * import { colors } from './colors';
 * const style = withColor(typography.h1, colors.text.primary);
 */
export const withColor = (
  typographyStyle: TextStyle,
  color: string
): TextStyle => {
  return {
    ...typographyStyle,
    color,
  };
};

// Type export for TypeScript
export type Typography = typeof typography;
export type TypographyKey = keyof typeof typography;
