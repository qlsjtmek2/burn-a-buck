/**
 * Typography System
 *
 * 앱 전체에서 사용되는 타이포그래피 스타일 중앙화
 * Material Design 3 기반
 *
 * 사용법:
 * import { typography } from '../theme/typography';
 *
 * const styles = StyleSheet.create({
 *   title: {
 *     ...typography.headlineMedium,
 *   },
 * });
 */

import { TextStyle } from 'react-native';

/**
 * Font Weights
 * React Native에서 사용 가능한 폰트 굵기
 */
export const fontWeights = {
  regular: '400' as TextStyle['fontWeight'],
  medium: '500' as TextStyle['fontWeight'],
  semibold: '600' as TextStyle['fontWeight'],
  bold: '700' as TextStyle['fontWeight'],
} as const;

/**
 * Font Sizes
 * 앱에서 사용되는 주요 폰트 크기들
 */
export const fontSizes = {
  // Display sizes (매우 큰 제목, 온보딩 등)
  xl4: 80, // 온보딩 이모지
  xl3: 57, // Display Large
  xl2: 45, // Display Medium
  xl: 36, // Display Small

  // Headline sizes (제목)
  lg3: 32, // Headline Large
  lg2: 28, // Headline Medium
  lg: 24, // Headline Small

  // Title sizes (부제목)
  md3: 22, // Title Large
  md2: 20, // 리더보드 닉네임 등
  md: 18, // Title Medium
  md1: 16, // Title Small

  // Body sizes (본문)
  base: 16, // Body Large
  sm: 14, // Body Medium
  xs: 12, // Body Small

  // Label sizes (라벨, 캡션)
  xs2: 11, // Label Small
} as const;

/**
 * Letter Spacing
 * Material Design 3 기준 자간
 */
export const letterSpacing = {
  tight: 0, // Display, Headline
  normal: 0.1, // Title Medium/Small
  wide: 0.15, // Title Medium
  wider: 0.25, // Body Medium
  widest: 0.5, // Body Large, Label
} as const;

/**
 * Line Heights
 * 가독성을 위한 행간 설정
 */
export const lineHeights = {
  // Display
  xl3: 64,
  xl2: 52,
  xl: 44,

  // Headline
  lg3: 40,
  lg2: 36,
  lg: 32,

  // Title
  md3: 28,
  md: 24,
  sm: 20,

  // Body & Label
  base: 24,
  xs: 16,
} as const;

/**
 * Font Families
 * Pretendard: 한국어 최적화 폰트
 */
export const fontFamilies = {
  pretendard: {
    regular: 'Pretendard-Regular',
    medium: 'Pretendard-Medium',
    semibold: 'Pretendard-SemiBold',
    bold: 'Pretendard-Bold',
  },
} as const;

/**
 * Typography Styles
 * Material Design 3 타이포그래피 스케일
 * StyleSheet에서 spread operator로 사용
 */
export const typography = {
  // ========================================
  // Display (매우 큰 제목)
  // ========================================
  displayLarge: {
    fontFamily: fontFamilies.pretendard.regular,
    fontSize: fontSizes.xl3,
    fontWeight: fontWeights.regular,
    letterSpacing: letterSpacing.tight,
    lineHeight: lineHeights.xl3,
  } as TextStyle,

  displayMedium: {
    fontFamily: fontFamilies.pretendard.regular,
    fontSize: fontSizes.xl2,
    fontWeight: fontWeights.regular,
    letterSpacing: letterSpacing.tight,
    lineHeight: lineHeights.xl2,
  } as TextStyle,

  displaySmall: {
    fontFamily: fontFamilies.pretendard.regular,
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.regular,
    letterSpacing: letterSpacing.tight,
    lineHeight: lineHeights.xl,
  } as TextStyle,

  // ========================================
  // Headline (제목)
  // ========================================
  headlineLarge: {
    fontFamily: fontFamilies.pretendard.bold,
    fontSize: fontSizes.lg3,
    fontWeight: fontWeights.bold,
    letterSpacing: letterSpacing.tight,
    lineHeight: lineHeights.lg3,
  } as TextStyle,

  headlineMedium: {
    fontFamily: fontFamilies.pretendard.semibold,
    fontSize: fontSizes.lg2,
    fontWeight: fontWeights.semibold,
    letterSpacing: letterSpacing.tight,
    lineHeight: lineHeights.lg2,
  } as TextStyle,

  headlineSmall: {
    fontFamily: fontFamilies.pretendard.semibold,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    letterSpacing: letterSpacing.tight,
    lineHeight: lineHeights.lg,
  } as TextStyle,

  // ========================================
  // Title (부제목)
  // ========================================
  titleLarge: {
    fontFamily: fontFamilies.pretendard.semibold,
    fontSize: fontSizes.md3,
    fontWeight: fontWeights.semibold,
    letterSpacing: letterSpacing.tight,
    lineHeight: lineHeights.md3,
  } as TextStyle,

  titleMedium: {
    fontFamily: fontFamilies.pretendard.semibold,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold,
    letterSpacing: letterSpacing.wide,
    lineHeight: lineHeights.md,
  } as TextStyle,

  titleSmall: {
    fontFamily: fontFamilies.pretendard.semibold,
    fontSize: fontSizes.md1,
    fontWeight: fontWeights.semibold,
    letterSpacing: letterSpacing.normal,
    lineHeight: lineHeights.md,
  } as TextStyle,

  // ========================================
  // Body (본문)
  // ========================================
  bodyLarge: {
    fontFamily: fontFamilies.pretendard.regular,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.regular,
    letterSpacing: letterSpacing.widest,
    lineHeight: lineHeights.base,
  } as TextStyle,

  bodyMedium: {
    fontFamily: fontFamilies.pretendard.regular,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.regular,
    letterSpacing: letterSpacing.wider,
    lineHeight: lineHeights.sm,
  } as TextStyle,

  bodySmall: {
    fontFamily: fontFamilies.pretendard.regular,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.regular,
    letterSpacing: letterSpacing.widest,
    lineHeight: lineHeights.xs,
  } as TextStyle,

  // ========================================
  // Label (라벨, 버튼 텍스트)
  // ========================================
  labelLarge: {
    fontFamily: fontFamilies.pretendard.semibold,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    letterSpacing: letterSpacing.normal,
    lineHeight: lineHeights.sm,
  } as TextStyle,

  labelMedium: {
    fontFamily: fontFamilies.pretendard.semibold,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.semibold,
    letterSpacing: letterSpacing.widest,
    lineHeight: lineHeights.xs,
  } as TextStyle,

  labelSmall: {
    fontFamily: fontFamilies.pretendard.semibold,
    fontSize: fontSizes.xs2,
    fontWeight: fontWeights.semibold,
    letterSpacing: letterSpacing.widest,
    lineHeight: lineHeights.xs,
  } as TextStyle,

  // ========================================
  // Custom Styles (프로젝트 특화)
  // ========================================

  // 온보딩 이모지 (80px)
  onboardingEmoji: {
    fontSize: fontSizes.xl4,
    lineHeight: 96,
  } as TextStyle,

  // 리더보드 닉네임 (20px, bold)
  leaderboardName: {
    fontFamily: fontFamilies.pretendard.bold,
    fontSize: fontSizes.md2,
    fontWeight: fontWeights.bold,
    letterSpacing: letterSpacing.tight,
  } as TextStyle,

  // 리더보드 금액 (16px, bold)
  leaderboardAmount: {
    fontFamily: fontFamilies.pretendard.bold,
    fontSize: fontSizes.md1,
    fontWeight: fontWeights.bold,
    letterSpacing: letterSpacing.tight,
  } as TextStyle,

  // 리더보드 통계 (13-15px, medium-semibold)
  leaderboardStats: {
    fontFamily: fontFamilies.pretendard.bold,
    fontSize: 13,
    fontWeight: fontWeights.medium,
    letterSpacing: letterSpacing.tight,
  } as TextStyle,

  // 버튼 텍스트 (18px, semibold)
  button: {
    fontFamily: fontFamilies.pretendard.semibold,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold,
    letterSpacing: letterSpacing.normal,
  } as TextStyle,

  // 온보딩 부제목 (20px, semibold)
  onboardingSubtitle: {
    fontFamily: fontFamilies.pretendard.semibold,
    fontSize: fontSizes.md2,
    fontWeight: fontWeights.semibold,
    letterSpacing: letterSpacing.tight,
  } as TextStyle,

  // 온보딩 스킵 버튼 (16px, medium)
  onboardingSkip: {
    fontFamily: fontFamilies.pretendard.medium,
    fontSize: fontSizes.md1,
    fontWeight: fontWeights.medium,
    letterSpacing: letterSpacing.normal,
  } as TextStyle,

  // 랭커 닉네임 (15px, semibold) - TopRankers 전용
  rankerNickname: {
    fontFamily: fontFamilies.pretendard.semibold,
    fontSize: 15,
    fontWeight: fontWeights.semibold,
    letterSpacing: letterSpacing.tight,
  } as TextStyle,

  // 이모지 (20px)
  emoji: {
    fontSize: fontSizes.md2,
  } as TextStyle,
} as const;

/**
 * Typography Scale (크기별 분류)
 * 특정 크기가 필요할 때 빠르게 찾기 위한 헬퍼
 */
export const typographyBySize = {
  11: typography.labelSmall,
  12: typography.bodySmall,
  13: typography.leaderboardStats,
  14: typography.bodyMedium,
  16: typography.bodyLarge,
  18: typography.titleMedium,
  20: typography.leaderboardName,
  22: typography.titleLarge,
  24: typography.headlineSmall,
  28: typography.headlineMedium,
  32: typography.headlineLarge,
  36: typography.displaySmall,
  45: typography.displayMedium,
  57: typography.displayLarge,
  80: typography.onboardingEmoji,
} as const;

/**
 * Typography 타입
 */
export type Typography = typeof typography;
export type FontSize = keyof typeof fontSizes;
export type FontWeight = keyof typeof fontWeights;
