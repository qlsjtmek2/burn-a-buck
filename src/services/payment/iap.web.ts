/**
 * IAP Service (Web)
 *
 * 웹 플랫폼 stub - IAP는 네이티브 플랫폼에서만 작동
 */

import type {
  Product,
  Purchase,
  PurchaseResult,
  PaymentError,
} from '../../types/payment';

/**
 * IAP 연결 초기화
 */
export const initializeIAP = async (): Promise<boolean> => {
  console.warn('IAP not supported on web platform');
  return false;
};

/**
 * IAP 연결 종료
 */
export const terminateIAP = async (): Promise<void> => {
  // No-op on web
};

/**
 * 상품 정보 조회
 */
export const getProductInfo = async (productId: string): Promise<Product | null> => {
  console.warn('IAP not supported on web platform');
  return null;
};

/**
 * 구매 시작
 */
export const purchaseProduct = async (productId: string): Promise<PurchaseResult> => {
  return {
    success: false,
    error: {
      code: 'E_UNKNOWN',
      message: 'In-app purchases are not supported on web platform',
    },
  };
};

/**
 * 구매 완료 처리
 */
export const finalizePurchase = async (purchase: Purchase): Promise<void> => {
  console.warn('IAP not supported on web platform');
};

/**
 * 구매 리스너 등록
 */
export const setupPurchaseListeners = (
  onPurchaseUpdate: (purchase: Purchase) => void,
  onPurchaseError: (error: PaymentError) => void
): (() => void) => {
  console.warn('IAP not supported on web platform');
  return () => {};
};
