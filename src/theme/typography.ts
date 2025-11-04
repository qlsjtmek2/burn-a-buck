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
 * Material Design 3 + 한글 최적화 기준
 *
 * 참고:
 * - MD3: Label M/S는 0.1px
 * - 한글 폰트는 자간 증가 권장
 */
export const letterSpacing = {
  tight: 0,    // Display, Headline, Title Large
  normal: 0.1, // Title Medium/Small, Label
  wide: 0.15,  // Title Medium (강조)
  wider: 0.25, // (미사용)
  widest: 0.5, // Body Large (한글 가독성)
} as const;

/**
 * Line Heights
 * 한글 가독성 최적화 (CJK: 1.7 비율 권장, WCAG: 최소 1.5)
 *
 * 참고:
 * - Material Design 3 공식 스펙 적용
 * - 한글은 라틴 폰트보다 높은 행간 필요 (1.7 vs 1.2)
 * - 모바일 화면은 더 넓은 행간 권장
 */
export const lineHeights = {
  // Display
  xl3: 64,  // 57px → 64px (1.12 비율)
  xl2: 52,  // 45px → 52px (1.16 비율)
  xl: 44,   // 36px → 44px (1.22 비율)

  // Headline
  lg3: 40,  // 32px → 40px (1.25 비율)
  lg2: 36,  // 28px → 36px (1.29 비율)
  lg: 32,   // 24px → 32px (1.33 비율)

  // Title (MD3 기준 + 한글 최적화)
  md3: 30,  // 22px → 30px (1.36 비율) - MD3 공식
  md: 28,   // 18px → 28px (1.56 비율) - 한글 최적화
  md1: 24,  // 16px → 24px (1.5 비율) - Title Small 전용
  sm: 20,   // 14px → 20px (1.43 비율)

  // Body & Label (한글 1.7 비율 권장)
  base: 28, // 16px → 28px (1.75 비율) - WCAG 권장
  baseMd: 24, // 14px → 24px (1.71 비율)
  baseSm: 20, // 12px → 20px (1.67 비율)
  xs: 16,   // Label용
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
    lineHeight: lineHeights.md1,
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
    letterSpacing: letterSpacing.widest,
    lineHeight: lineHeights.baseMd,
  } as TextStyle,

  bodySmall: {
    fontFamily: fontFamilies.pretendard.regular,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.regular,
    letterSpacing: letterSpacing.widest,
    lineHeight: lineHeights.baseSm,
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
    letterSpacing: letterSpacing.normal, // MD3: 0.1px
    lineHeight: lineHeights.xs,
  } as TextStyle,

  labelSmall: {
    fontFamily: fontFamilies.pretendard.semibold,
    fontSize: fontSizes.xs2,
    fontWeight: fontWeights.semibold,
    letterSpacing: letterSpacing.normal, // MD3: 0.1px
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

  // 리더보드 통계 (12px, semibold)
  leaderboardStats: {
    fontFamily: fontFamilies.pretendard.semibold,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.semibold,
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

  // ========================================
  // Special Purpose (특수 목적)
  // ========================================

  // 디버그 정보 (Monospace, 12px)
  debugInfo: {
    fontFamily: 'monospace', // 시스템 monospace 폰트
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.regular,
    letterSpacing: letterSpacing.normal,
    lineHeight: lineHeights.xs,
  } as TextStyle,

  // 섹션 제목 (리더보드, 설정 등 - 18px, semibold)
  sectionTitle: {
    fontFamily: fontFamilies.pretendard.semibold,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold,
    letterSpacing: letterSpacing.wide,
    lineHeight: lineHeights.md,
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
