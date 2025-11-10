/**
 * Hang On - Spacing System
 *
 * 8pt Grid System 기반 간격 정의
 *
 * 사용 예시:
 * import { spacing } from '@/theme';
 * <View style={{ padding: spacing.md }} />
 *
 * 참조: docs/DESIGN_SYSTEM.md
 */

/**
 * Spacing Scale (8pt Grid)
 * 모든 간격은 8의 배수 사용
 */
export const spacing = {
  /**
   * Extra Small (4pt)
   * 예외적으로 사용, 일반적으로 피함
   */
  xs: 4,

  /**
   * Small (8pt)
   * 예: 컴포넌트 내부 패딩, 아이콘 간격
   */
  sm: 8,

  /**
   * Medium (16pt) - 기본값
   * 예: 카드 패딩, 화면 좌우 패딩, 컴포넌트 간 간격
   */
  md: 16,

  /**
   * Large (24pt)
   * 예: 섹션 간 간격, 카드 간 간격 (넓게)
   */
  lg: 24,

  /**
   * Extra Large (32pt)
   * 예: 섹션 상하 패딩
   */
  xl: 32,

  /**
   * 2X Large (40pt)
   * 예: 큰 섹션 간격
   */
  xxl: 40,

  /**
   * 3X Large (48pt)
   * 예: 매우 큰 섹션 간격
   */
  xxxl: 48,
} as const;

/**
 * 사용 가이드
 *
 * | 용도                     | 간격 | 값 (pt) |
 * |--------------------------|------|---------|
 * | 컴포넌트 내부 패딩       | sm   | 8       |
 * | 카드 패딩                | md   | 16      |
 * | 화면 좌우 패딩           | md   | 16      |
 * | 컴포넌트 간 간격         | md   | 16      |
 * | 카드 간 간격             | md   | 16      |
 * | 섹션 간 간격             | lg   | 24      |
 * | 섹션 상하 패딩           | xl   | 32      |
 */

/**
 * 간격 배수 계산 헬퍼 함수
 *
 * @param multiplier - 배수 (기본 8pt의 몇 배)
 * @returns 계산된 간격 값
 *
 * @example
 * const customSpacing = getSpacing(3); // 24pt (8 * 3)
 */
export const getSpacing = (multiplier: number): number => {
  return 8 * multiplier;
};

/**
 * 수평/수직 간격을 동시에 적용하는 헬퍼 함수
 *
 * @param horizontal - 수평 간격 키
 * @param vertical - 수직 간격 키
 * @returns padding 스타일 객체
 *
 * @example
 * const padding = getPadding('md', 'lg');
 * // { paddingHorizontal: 16, paddingVertical: 24 }
 */
export const getPadding = (
  horizontal: keyof typeof spacing,
  vertical: keyof typeof spacing,
) => {
  return {
    paddingHorizontal: spacing[horizontal],
    paddingVertical: spacing[vertical],
  };
};

/**
 * 특정 방향에만 간격을 적용하는 헬퍼 함수
 *
 * @param direction - 방향 ('top' | 'right' | 'bottom' | 'left')
 * @param value - 간격 키
 * @returns 해당 방향의 padding/margin 스타일 객체
 *
 * @example
 * const margin = getDirectionalSpacing('top', 'lg');
 * // { marginTop: 24 }
 */
export const getDirectionalSpacing = (
  direction: 'top' | 'right' | 'bottom' | 'left',
  value: keyof typeof spacing,
  type: 'padding' | 'margin' = 'padding',
) => {
  const property = `${type}${direction.charAt(0).toUpperCase()}${direction.slice(1)}`;
  return {
    [property]: spacing[value],
  };
};

// Type export for TypeScript
export type Spacing = typeof spacing;
export type SpacingKey = keyof typeof spacing;
