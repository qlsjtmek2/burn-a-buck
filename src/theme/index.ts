/**
 * Theme Configuration
 *
 * React Native Paper 테마 설정
 * Material Design 3 기반
 */

import { MD3LightTheme, configureFonts } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';
import { colors } from './colors';

/**
 * 폰트 설정
 * Material Design 3 타이포그래피
 */
const fontConfig = {
  displayLarge: {
    fontFamily: 'System',
    fontSize: 57,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 64,
  },
  displayMedium: {
    fontFamily: 'System',
    fontSize: 45,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 52,
  },
  displaySmall: {
    fontFamily: 'System',
    fontSize: 36,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 44,
  },
  headlineLarge: {
    fontFamily: 'System',
    fontSize: 32,
    fontWeight: '700' as const,
    letterSpacing: 0,
    lineHeight: 40,
  },
  headlineMedium: {
    fontFamily: 'System',
    fontSize: 28,
    fontWeight: '600' as const,
    letterSpacing: 0,
    lineHeight: 36,
  },
  headlineSmall: {
    fontFamily: 'System',
    fontSize: 24,
    fontWeight: '600' as const,
    letterSpacing: 0,
    lineHeight: 32,
  },
  titleLarge: {
    fontFamily: 'System',
    fontSize: 22,
    fontWeight: '600' as const,
    letterSpacing: 0,
    lineHeight: 28,
  },
  titleMedium: {
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: '600' as const,
    letterSpacing: 0.15,
    lineHeight: 24,
  },
  titleSmall: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '600' as const,
    letterSpacing: 0.1,
    lineHeight: 20,
  },
  bodyLarge: {
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: '400' as const,
    letterSpacing: 0.5,
    lineHeight: 24,
  },
  bodyMedium: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '400' as const,
    letterSpacing: 0.25,
    lineHeight: 20,
  },
  bodySmall: {
    fontFamily: 'System',
    fontSize: 12,
    fontWeight: '400' as const,
    letterSpacing: 0.4,
    lineHeight: 16,
  },
  labelLarge: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '600' as const,
    letterSpacing: 0.1,
    lineHeight: 20,
  },
  labelMedium: {
    fontFamily: 'System',
    fontSize: 12,
    fontWeight: '600' as const,
    letterSpacing: 0.5,
    lineHeight: 16,
  },
  labelSmall: {
    fontFamily: 'System',
    fontSize: 11,
    fontWeight: '600' as const,
    letterSpacing: 0.5,
    lineHeight: 16,
  },
};

/**
 * 라이트 테마 (기본)
 */
export const theme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    // Primary colors
    primary: colors.primary,
    primaryContainer: colors.primaryVeryLight,
    onPrimary: '#FFFFFF',
    onPrimaryContainer: colors.primaryDark,

    // Secondary colors
    secondary: colors.secondary,
    secondaryContainer: colors.secondaryVeryLight,
    onSecondary: '#FFFFFF',
    onSecondaryContainer: colors.secondaryDark,

    // Tertiary colors (Accent)
    tertiary: colors.accent,
    tertiaryContainer: colors.accentLight,
    onTertiary: '#FFFFFF',
    onTertiaryContainer: colors.accentDark,

    // Error colors
    error: colors.error,
    errorContainer: '#FECACA', // red-200
    onError: '#FFFFFF',
    onErrorContainer: '#991B1B', // red-800

    // Background colors
    background: colors.background,
    onBackground: colors.text,

    // Surface colors
    surface: colors.surface,
    surfaceVariant: colors.surfaceVariant,
    onSurface: colors.text,
    onSurfaceVariant: colors.textSecondary,

    // Outline
    outline: colors.border,
    outlineVariant: colors.borderDark,

    // Other
    shadow: '#000000',
    scrim: '#000000',
    inverseSurface: colors.text,
    inverseOnSurface: colors.surface,
    inversePrimary: colors.primaryLight,
    elevation: {
      level0: 'transparent',
      level1: colors.surface,
      level2: colors.surfaceVariant,
      level3: '#F3F4F6',
      level4: '#E5E7EB',
      level5: '#D1D5DB',
    },
    surfaceDisabled: 'rgba(17, 24, 39, 0.12)',
    onSurfaceDisabled: 'rgba(17, 24, 39, 0.38)',
    backdrop: colors.overlay,
  },
  fonts: configureFonts({ config: fontConfig }),
};

/**
 * 다크 테마 (미래 확장용)
 * 현재는 라이트 테마만 사용
 */
export const darkTheme: MD3Theme = {
  ...theme,
  dark: true,
  // TODO: Phase 후반에 다크 모드 추가 시 구현
};

/**
 * 색상 팔레트 직접 접근
 * StyleSheet에서 사용할 때
 */
export { colors };

/**
 * 테마 타입
 */
export type AppTheme = typeof theme;
