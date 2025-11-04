/**
 * Payment Types
 *
 * 결제 관련 모든 타입 정의 (통합 버전)
 * - IAP 관련 타입
 * - 비즈니스 로직 타입
 * - 서비스 인터페이스
 */

import type { Purchase as IAPPurchase, ProductPurchase } from 'react-native-iap';

// ============================================================================
// Platform & Status Types
// ============================================================================

/**
 * 플랫폼 타입
 */
export type Platform = 'android' | 'ios';

/**
 * 결제 상태
 */
export type PaymentStatus =
  | 'idle'
  | 'initializing'
  | 'loading_products'
  | 'purchasing'
  | 'validating'
  | 'saving'
  | 'success'
  | 'error';

/**
 * 구매 상태 (Google Play 기준)
 */
export enum PurchaseState {
  PENDING = 0,
  PURCHASED = 1,
  CANCELED = 2,
  REFUNDED = 3,
}

// ============================================================================
// Error Types
// ============================================================================

/**
 * 결제 에러 코드
 */
export enum PurchaseErrorCode {
  E_USER_CANCELLED = 'E_USER_CANCELLED',
  E_ALREADY_OWNED = 'E_ALREADY_OWNED',
  E_NETWORK_ERROR = 'E_NETWORK_ERROR',
  E_RECEIPT_VALIDATION_FAILED = 'E_RECEIPT_VALIDATION_FAILED',
  E_UNKNOWN = 'E_UNKNOWN',
}

/**
 * 결제 에러
 */
export interface PaymentError {
  /** 에러 코드 */
  code: PurchaseErrorCode | string;
  /** 사용자에게 표시할 메시지 */
  message: string;
  /** 디버그용 메시지 */
  debugMessage?: string;
  /** 원본 에러 객체 */
  originalError?: unknown;
}

// ============================================================================
// Product & Purchase Types
// ============================================================================

/**
 * 상품 정보
 */
export interface Product {
  productId: string;
  type: 'inapp' | 'subs';
  title: string;
  description: string;
  price: string;
  currency: string;
  localizedPrice: string;
}

/**
 * 구매 정보 (react-native-iap Purchase 확장)
 */
export interface Purchase {
  productId: string;
  transactionId: string;
  transactionDate: number;
  transactionReceipt: string;
  purchaseToken: string;
  dataAndroid?: string;
  signatureAndroid?: string;
  purchaseStateAndroid?: number;
  originalTransactionDateIOS?: string;
  originalTransactionIdentifierIOS?: string;
}

/**
 * 결제 결과 (IAP 레벨)
 */
export interface PurchaseResult {
  success: boolean;
  purchase?: Purchase;
  error?: PaymentError;
}

// ============================================================================
// Receipt & Validation Types
// ============================================================================

/**
 * 영수증 정보
 */
export interface ReceiptInfo {
  /** 영수증 토큰 (Android) 또는 transactionReceipt (iOS) */
  token: string;
  /** 제품 ID */
  productId: string;
  /** 거래 ID */
  transactionId: string;
  /** 구매 시간 (ISO 8601) */
  purchaseTime: string;
  /** 플랫폼 */
  platform: Platform;
  /** 원본 영수증 데이터 (JSON 문자열) */
  rawData: string;
}

/**
 * 영수증 검증 결과
 */
export interface ReceiptValidationResult {
  isValid: boolean;
  productId?: string;
  purchaseToken?: string;
  orderId?: string;
  purchaseTime?: number;
  error?: string;
  receiptInfo?: ReceiptInfo;
}

// ============================================================================
// Business Logic Types
// ============================================================================

/**
 * 기부 정보
 */
export interface DonationInfo {
  /** 기부 ID (Supabase에서 생성) */
  id?: string;
  /** 사용자 ID */
  userId?: string;
  /** 닉네임 */
  nickname: string;
  /** 기부 금액 */
  amount: number;
  /** 영수증 토큰 */
  receiptToken: string;
  /** 거래 ID */
  transactionId: string;
  /** 플랫폼 */
  platform: Platform;
  /** 생성 시간 */
  createdAt?: string;
}

/**
 * 기부 생성 입력
 */
export interface CreateDonationInput {
  userId: string;
  nickname: string;
  amount: number;
  receiptToken: string;
  platform: 'google_play' | 'app_store';
}

/**
 * 결제 결과 (비즈니스 레벨)
 */
export interface PaymentResult {
  /** 결제 성공 여부 */
  success: boolean;
  /** 기부 정보 (성공 시) */
  donation?: DonationInfo;
  /** 첫 기부 여부 */
  isFirstDonation?: boolean;
  /** 에러 정보 (실패 시) */
  error?: PaymentError;
}

// ============================================================================
// Database Types
// ============================================================================

/**
 * Supabase donations 테이블 타입
 */
export interface DonationRecord {
  id: string;
  user_id: string | null;
  nickname: string;
  amount: number;
  receipt_token: string;
  transaction_id: string;
  platform: Platform;
  created_at: string;
}

/**
 * Supabase users 테이블 타입
 */
export interface UserRecord {
  id: string;
  nickname: string | null;
  total_donated: number;
  first_donation_at: string | null;
  last_donation_at: string | null;
  badge_earned: boolean;
  created_at: string;
}

// ============================================================================
// Service Interface
// ============================================================================

/**
 * 결제 서비스 인터페이스
 */
export interface IPaymentService {
  /**
   * 결제 시스템 초기화
   * @throws {PaymentError} 초기화 실패 시
   */
  initialize(): Promise<void>;

  /**
   * 결제 시스템 종료 및 리소스 정리
   */
  cleanup(): Promise<void>;

  /**
   * 상품 정보 조회
   * @returns 상품 정보 배열
   * @throws {PaymentError} 상품 조회 실패 시
   */
  getProducts(): Promise<ProductPurchase[]>;

  /**
   * 기부 결제 시작
   * @param nickname 기부자 닉네임
   * @returns 결제 결과
   * @throws {PaymentError} 결제 실패 시
   */
  purchaseDonation(nickname: string): Promise<PaymentResult>;

  /**
   * 영수증 검증
   * @param purchase 구매 정보
   * @returns 검증 결과
   * @throws {PaymentError} 검증 실패 시
   */
  validateReceipt(purchase: IAPPurchase): Promise<ReceiptValidationResult>;

  /**
   * 미처리 구매 내역 복구
   * @returns 복구된 구매 건수
   */
  restorePurchases(): Promise<number>;

  /**
   * 구매 완료 처리 (영수증 검증 및 Supabase 저장)
   * @param purchase 구매 정보
   * @param nickname 기부자 닉네임
   * @returns 처리 결과
   * @throws {PaymentError} 처리 실패 시
   */
  finalizePurchase(purchase: IAPPurchase, nickname: string): Promise<PaymentResult>;
}
