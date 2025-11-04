/**
 * 결제 관련 타입 정의
 */

import type { Purchase, ProductPurchase } from 'react-native-iap';

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
 * 결제 에러
 */
export interface PaymentError {
  /** 에러 코드 */
  code: string;
  /** 에러 메시지 */
  message: string;
  /** 원본 에러 객체 (선택사항) */
  originalError?: unknown;
}

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
  /** 검증 성공 여부 */
  isValid: boolean;
  /** 검증 실패 시 에러 메시지 */
  error?: string;
  /** 영수증 정보 */
  receiptInfo?: ReceiptInfo;
}

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
 * 결제 결과
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
  validateReceipt(purchase: Purchase): Promise<ReceiptValidationResult>;

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
  finalizePurchase(purchase: Purchase, nickname: string): Promise<PaymentResult>;
}

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
