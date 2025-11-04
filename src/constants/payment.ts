/**
 * 결제 관련 상수 정의
 */

/**
 * 인앱 상품 ID
 */
export const PRODUCT_IDS = {
  /** Android Google Play 인앱 상품 ID */
  ANDROID: 'donate_1000won',
  /** iOS App Store 인앱 상품 ID (추후 추가 예정) */
  IOS: 'com.yourcompany.burnabuck.donate_1000won',
} as const;

/**
 * 기부 금액 (원화)
 */
export const DONATION_AMOUNT = 1000;

/**
 * 결제 재시도 설정
 */
export const PAYMENT_RETRY_CONFIG = {
  /** 최대 재시도 횟수 */
  MAX_RETRIES: 3,
  /** 재시도 간격 (밀리초) */
  RETRY_DELAY: 1000,
  /** 재시도 간격 증가 배수 (exponential backoff) */
  BACKOFF_MULTIPLIER: 2,
} as const;

/**
 * 영수증 검증 타임아웃 (밀리초)
 */
export const RECEIPT_VALIDATION_TIMEOUT = 10000;

/**
 * 결제 에러 코드
 */
export const PAYMENT_ERROR_CODES = {
  /** 사용자가 결제를 취소함 */
  USER_CANCELLED: 'E_USER_CANCELLED',
  /** 결제 초기화 실패 */
  INIT_FAILED: 'E_INIT_FAILED',
  /** 상품 조회 실패 */
  PRODUCT_NOT_FOUND: 'E_PRODUCT_NOT_FOUND',
  /** 구매 프로세스 실패 */
  PURCHASE_FAILED: 'E_PURCHASE_FAILED',
  /** 영수증 검증 실패 */
  RECEIPT_VALIDATION_FAILED: 'E_RECEIPT_VALIDATION_FAILED',
  /** 네트워크 오류 */
  NETWORK_ERROR: 'E_NETWORK_ERROR',
  /** 중복 결제 */
  DUPLICATE_PAYMENT: 'E_DUPLICATE_PAYMENT',
  /** 알 수 없는 오류 */
  UNKNOWN_ERROR: 'E_UNKNOWN_ERROR',
} as const;

/**
 * 결제 에러 메시지 (한국어)
 */
export const PAYMENT_ERROR_MESSAGES = {
  [PAYMENT_ERROR_CODES.USER_CANCELLED]: '결제가 취소되었습니다.',
  [PAYMENT_ERROR_CODES.INIT_FAILED]: '결제 시스템 초기화에 실패했습니다.',
  [PAYMENT_ERROR_CODES.PRODUCT_NOT_FOUND]: '결제 상품을 찾을 수 없습니다.',
  [PAYMENT_ERROR_CODES.PURCHASE_FAILED]: '결제 처리 중 오류가 발생했습니다.',
  [PAYMENT_ERROR_CODES.RECEIPT_VALIDATION_FAILED]: '영수증 검증에 실패했습니다.',
  [PAYMENT_ERROR_CODES.NETWORK_ERROR]: '네트워크 오류가 발생했습니다. 다시 시도해주세요.',
  [PAYMENT_ERROR_CODES.DUPLICATE_PAYMENT]: '이미 처리된 결제입니다.',
  [PAYMENT_ERROR_CODES.UNKNOWN_ERROR]: '알 수 없는 오류가 발생했습니다.',
} as const;
