/**
 * Hang On - Shadow System
 *
 * 상용 앱 수준의 깊이감을 위한 그림자 시스템
 * Material Design 3 elevation 개념 참고
 *
 * 사용 예시:
 * import { theme } from '@/theme';
 * <View style={[styles.card, theme.shadows.sm]} />
 */
import { Platform } from 'react-native';

export const shadows = {
  /**
   * Small - 카드, 표면 요소용
   * 용도: RecordCard, 일반 카드
   */
  sm: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.04,
      shadowRadius: 2,
    },
    android: {
      elevation: 1,
    },
  }),

  /**
   * Medium - 호버/활성화된 카드, 드롭다운
   * 용도: 카드 hover 상태, Select 드롭다운
   */
  md: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 4,
    },
    android: {
      elevation: 2,
    },
  }),

  /**
   * Large - 모달, 바텀시트
   * 용도: BottomSheet, ConfirmDialog
   */
  lg: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
    },
    android: {
      elevation: 4,
    },
  }),

  /**
   * Extra Large - FAB, 플로팅 요소
   * 용도: FloatingActionButton
   */
  xl: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
    },
    android: {
      elevation: 6,
    },
  }),
} as const;

export type Shadows = typeof shadows;
export type ShadowKey = keyof typeof shadows;
