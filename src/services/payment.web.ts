/**
 * Payment Service (Web Version)
 *
 * 웹에서는 Google Play In-App Purchase를 사용할 수 없으므로
 * Mock 구현을 제공합니다.
 */

import type {
  IPaymentService,
  PaymentError,
  PaymentResult,
  ReceiptValidationResult,
} from '../types/payment';
import type { Purchase } from 'react-native-iap';
import { PAYMENT_ERROR_CODES } from '../constants/payment';

/**
 * Web Payment Service (Mock Implementation)
 *
 * 웹에서는 실제 결제가 불가능하므로 UI 테스트용 Mock을 제공합니다.
 */
class WebPaymentService implements IPaymentService {
  private isInitialized = false;

  async initialize(): Promise<void> {
    console.log('[WebPaymentService] Initialize called (mock)');
    this.isInitialized = true;
  }

  async cleanup(): Promise<void> {
    console.log('[WebPaymentService] Cleanup called (mock)');
    this.isInitialized = false;
  }

  async getProducts(): Promise<any[]> {
    console.log('[WebPaymentService] getProducts called (mock)');
    return [];
  }

  async purchaseDonation(nickname: string): Promise<PaymentResult> {
    console.warn('[WebPaymentService] 웹에서는 실제 결제를 사용할 수 없습니다.');

    const error: PaymentError = {
      code: PAYMENT_ERROR_CODES.INIT_FAILED,
      message: '웹에서는 Google Play 결제를 사용할 수 없습니다. Android/iOS 앱을 사용해주세요.',
    };

    return {
      success: false,
      error,
    };
  }

  async validateReceipt(purchase: Purchase): Promise<ReceiptValidationResult> {
    console.warn('[WebPaymentService] validateReceipt called on web (not supported)');
    return {
      isValid: false,
      error: 'Web platform does not support payment validation',
    };
  }

  async restorePurchases(): Promise<number> {
    console.warn('[WebPaymentService] restorePurchases called on web (not supported)');
    return 0;
  }

  async finalizePurchase(purchase: Purchase, nickname: string): Promise<PaymentResult> {
    console.warn('[WebPaymentService] finalizePurchase called on web (not supported)');
    return {
      success: false,
      error: {
        code: PAYMENT_ERROR_CODES.INIT_FAILED,
        message: 'Web platform does not support payments',
      },
    };
  }
}

/**
 * Payment Service 싱글톤 인스턴스 (Web)
 */
export const paymentService = new WebPaymentService();

/**
 * 재시도 로직이 포함된 결제 함수 (Web Mock)
 */
export async function purchaseWithRetry(nickname: string): Promise<PaymentResult> {
  console.warn('[WebPaymentService] purchaseWithRetry called on web (not supported)');
  return paymentService.purchaseDonation(nickname);
}

export default paymentService;
