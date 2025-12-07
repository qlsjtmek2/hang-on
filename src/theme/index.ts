/**
 * Hang On - Theme System
 *
 * 중앙화된 테마 시스템
 * 모든 색상, 타이포그래피, 간격을 여기서 export
 *
 * 사용 예시:
 * import { colors, typography, spacing } from '@/theme';
 *
 * <View style={{
 *   backgroundColor: colors.primary,
 *   padding: spacing.md
 * }}>
 *   <Text style={[typography.h1, { color: colors.text.primary }]}>
 *     타이틀
 *   </Text>
 * </View>
 *
 * 참조: docs/DESIGN_SYSTEM.md
 */

export { colors, getEmotionColor, getEmotionColorWithOpacity } from './colors';
export type { Colors } from './colors';
export type { EmotionLevel } from '@/types/emotion';

export { typography, fontFamily, headerFontFamily, getScaledFontSize, withColor } from './typography';
export type { Typography, TypographyKey } from './typography';

export { spacing, getSpacing, getPadding, getDirectionalSpacing } from './spacing';
export type { Spacing, SpacingKey } from './spacing';

export { shadows } from './shadows';
export type { Shadows, ShadowKey } from './shadows';

/**
 * 전체 테마 객체
 *
 * 한 번에 모든 테마 요소를 가져올 때 사용
 */
import { colors } from './colors';
import { shadows } from './shadows';
import { spacing } from './spacing';
import { typography } from './typography';

export const theme = {
  colors,
  typography,
  spacing,
  shadows,
} as const;

export type Theme = typeof theme;

/**
 * 다크 모드 테마 (Phase 2)
 *
 * 현재는 라이트 모드만 지원
 * 추후 다크 모드 추가 시 여기에 정의
 */
// export const darkTheme = {
//   ...theme,
//   colors: {
//     ...colors,
//     background: '#121212',
//     surface: '#1E1E1E',
//     text: {
//       primary: '#FFFFFF',
//       secondary: '#B0B0B0',
//       disabled: '#707070',
//       inverse: '#212121',
//     },
//   },
// };
