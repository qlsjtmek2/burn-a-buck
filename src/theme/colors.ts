/**
 * Color Palette
 *
 * "천원 쓰레기통" 앱의 색상 팔레트
 * 앰버 단일 테마: 따뜻함 + 돈/가치 표현
 *
 * 접근성: WCAG 기준 준수 (최소 4.5:1 대비)
 * 원칙: 60-30-10 규칙 적용
 */

export const colors = {
  // ========================================
  // Primary Colors (60%) - 앰버: 따뜻함, 돈/가치
  // ========================================
  primary: '#F59E0B', // amber-500
  primaryLight: '#FCD34D', // amber-300
  primaryDark: '#D97706', // amber-600
  primaryVeryLight: '#FEF3C7', // amber-100

  // ========================================
  // Secondary Colors (30%) - 다크 앰버
  // ========================================
  secondary: '#D97706', // amber-600
  secondaryLight: '#F59E0B', // amber-500
  secondaryDark: '#B45309', // amber-700
  secondaryVeryLight: '#FDE68A', // amber-200

  // ========================================
  // Accent Colors (10%) - 밝은 앰버 (CTA 버튼)
  // ========================================
  accent: '#FBBF24', // amber-400
  accentLight: '#FCD34D', // amber-300
  accentDark: '#F59E0B', // amber-500

  // ========================================
  // Semantic Colors
  // ========================================
  success: '#10B981', // emerald-500 (그린 유지)
  error: '#EF4444', // red-500 (레드 유지)
  warning: '#F59E0B', // amber-500
  info: '#F59E0B', // amber-500

  // ========================================
  // Ranking Colors (리더보드 전용)
  // ========================================
  gold: '#FFD700', // 1위 금색
  silver: '#C0C0C0', // 2위 은색
  bronze: '#CD7F32', // 3위 동색

  // ========================================
  // Neutral Colors (배경, 텍스트, 테두리)
  // ========================================
  background: '#F9FAFB', // gray-50
  surface: '#FFFFFF', // white
  surfaceVariant: '#F3F4F6', // gray-100

  text: '#111827', // gray-900
  textSecondary: '#6B7280', // gray-500
  textDisabled: '#9CA3AF', // gray-400
  textOnPrimary: '#FFFFFF', // 버튼 위의 흰색 텍스트

  border: '#E5E7EB', // gray-200
  borderDark: '#D1D5DB', // gray-300

  // ========================================
  // Overlay Colors
  // ========================================
  overlay: 'rgba(0, 0, 0, 0.5)', // 모달 배경
  overlayLight: 'rgba(0, 0, 0, 0.3)', // 가벼운 오버레이

  // ========================================
  // Transparent Colors (투명도 포함)
  // ========================================
  primaryAlpha: {
    10: 'rgba(245, 158, 11, 0.1)',
    20: 'rgba(245, 158, 11, 0.2)',
    30: 'rgba(245, 158, 11, 0.3)',
    50: 'rgba(245, 158, 11, 0.5)',
  },
  secondaryAlpha: {
    10: 'rgba(217, 119, 6, 0.1)',
    20: 'rgba(217, 119, 6, 0.2)',
    30: 'rgba(217, 119, 6, 0.3)',
    50: 'rgba(217, 119, 6, 0.5)',
  },
} as const;

/**
 * 색상 사용 가이드
 *
 * Primary (앰버):
 * - 주요 네비게이션, 탭 바
 * - 제목, 헤더
 * - 중요한 정보 강조
 * - 페이지 인디케이터
 *
 * Secondary (다크 앰버):
 * - 보조 버튼
 * - 부제목
 * - 아이콘
 *
 * Accent (밝은 앰버):
 * - CTA 버튼 ("여기에 천원 버리기")
 * - 행동 유도 요소
 * - 강조가 필요한 버튼
 *
 * Ranking Colors:
 * - gold: 1위 테두리/배경
 * - silver: 2위 테두리/배경
 * - bronze: 3위 테두리/배경
 */

export type ColorPalette = typeof colors;
