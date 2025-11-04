/**
 * AsyncStorage Keys
 *
 * 앱 전체에서 사용하는 AsyncStorage 키 상수
 */

/**
 * AsyncStorage 키 상수
 */
export const STORAGE_KEYS = {
  /** 온보딩 완료 여부 */
  ONBOARDING_COMPLETED: '@burn-a-buck:onboarding-completed',

  /** 저장된 닉네임 */
  SAVED_NICKNAME: '@burn-a-buck:saved-nickname',

  /** 첫 기부 날짜 (ISO 8601 문자열) */
  FIRST_DONATION: '@burn-a-buck:first-donation',

  /** 대기 중인 구매 정보 (결제 복구용) */
  PENDING_PURCHASE: '@burn-a-buck:pending-purchase',

  /** 앱 언어 설정 (ko | en) */
  APP_LANGUAGE: '@burn-a-buck:app-language',
} as const;

/**
 * Storage 값 타입
 */
export type StorageValues = {
  [STORAGE_KEYS.ONBOARDING_COMPLETED]: 'true' | null;
  [STORAGE_KEYS.SAVED_NICKNAME]: string | null;
  [STORAGE_KEYS.FIRST_DONATION]: string | null;
  [STORAGE_KEYS.PENDING_PURCHASE]: string | null;
  [STORAGE_KEYS.APP_LANGUAGE]: 'ko' | 'en' | null;
};
