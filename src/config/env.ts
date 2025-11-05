/**
 * 환경 설정
 */

/**
 * 개발 모드 여부
 * - __DEV__: React Native의 개발 모드 플래그
 */
export const IS_DEV = __DEV__;

/**
 * IAP 테스트 모드
 * - true: IAP를 시뮬레이션 (Google Play Services 없이도 동작)
 * - false: 실제 IAP 사용
 *
 * 개발 중에는 true로 설정하여 Google Play Console 등록 없이 테스트 가능
 * Development Build에서 실제 IAP 테스트: USE_REAL_IAP=true 설정
 */
export const IAP_TEST_MODE = IS_DEV && !process.env.USE_REAL_IAP;

/**
 * Share 테스트 모드
 * - true: Expo Go용 Mock Share (React Native 내장 Share API 사용)
 * - false: 실제 react-native-share 사용 (Development Build 필요)
 *
 * Expo Go에서는 true로 설정하여 네이티브 모듈 없이 테스트 가능
 * Development Build에서는 자동으로 false가 되어 플랫폼별 공유 지원
 */
export const SHARE_TEST_MODE = IS_DEV;

/**
 * 환경별 설정
 */
export const ENV_CONFIG = {
  /** 개발 모드 여부 */
  isDev: IS_DEV,
  /** IAP 테스트 모드 */
  iapTestMode: IAP_TEST_MODE,
  /** Share 테스트 모드 */
  shareTestMode: SHARE_TEST_MODE,
  /** 로그 활성화 */
  enableLogging: IS_DEV,
} as const;
