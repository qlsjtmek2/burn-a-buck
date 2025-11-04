/**
 * Payment Types
 *
 * Google Play In-App Purchase 관련 타입 정의
 */

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
 * 구매 정보
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
 * 영수증 검증 결과
 */
export interface ReceiptValidationResult {
  isValid: boolean;
  productId?: string;
  purchaseToken?: string;
  orderId?: string;
  purchaseTime?: number;
  error?: string;
}

/**
 * 결제 상태
 */
export enum PurchaseState {
  PENDING = 0,
  PURCHASED = 1,
  CANCELED = 2,
  REFUNDED = 3,
}

/**
 * 결제 에러 타입
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
export interface PurchaseError {
  code: PurchaseErrorCode;
  message: string;
  debugMessage?: string;
}

/**
 * 결제 결과
 */
export interface PurchaseResult {
  success: boolean;
  purchase?: Purchase;
  error?: PurchaseError;
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
