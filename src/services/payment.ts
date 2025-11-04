/**
 * Payment Service
 *
 * Google Play 인앱 결제 처리 및 Supabase 통합
 */

import {
  initConnection,
  endConnection,
  getProducts,
  requestPurchase,
  finishTransaction,
  purchaseUpdatedListener,
  purchaseErrorListener,
  type Purchase,
  type PurchaseError,
  type ProductPurchase,
} from 'react-native-iap';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabase';
import {
  PRODUCT_IDS,
  PAYMENT_ERROR_CODES,
  PAYMENT_ERROR_MESSAGES,
  PAYMENT_RETRY_CONFIG,
} from '../constants/payment';
import type {
  IPaymentService,
  PaymentError,
  PaymentResult,
  ReceiptInfo,
  ReceiptValidationResult,
  DonationRecord,
  Platform as PlatformType,
} from '../types/payment';

/**
 * AsyncStorage 키
 */
const STORAGE_KEYS = {
  FIRST_DONATION: '@burn-a-buck:first-donation',
  PENDING_PURCHASE: '@burn-a-buck:pending-purchase',
} as const;

/**
 * Payment Service 구현
 */
class PaymentService implements IPaymentService {
  private isInitialized = false;
  private purchaseUpdateSubscription: any = null;
  private purchaseErrorSubscription: any = null;

  /**
   * 결제 시스템 초기화
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      console.log('[PaymentService] Already initialized');
      return;
    }

    try {
      console.log('[PaymentService] Initializing...');
      await initConnection();

      // 구매 업데이트 리스너 등록
      this.purchaseUpdateSubscription = purchaseUpdatedListener(
        async (purchase: Purchase) => {
          console.log('[PaymentService] Purchase updated:', purchase);
          // 구매 완료 처리는 purchaseDonation에서 처리
        }
      );

      // 구매 에러 리스너 등록
      this.purchaseErrorSubscription = purchaseErrorListener(
        (error: PurchaseError) => {
          console.error('[PaymentService] Purchase error:', error);
        }
      );

      this.isInitialized = true;
      console.log('[PaymentService] Initialization complete');
    } catch (error) {
      console.error('[PaymentService] Initialization failed:', error);
      throw this.createPaymentError(
        PAYMENT_ERROR_CODES.INIT_FAILED,
        error
      );
    }
  }

  /**
   * 결제 시스템 종료
   */
  async cleanup(): Promise<void> {
    console.log('[PaymentService] Cleaning up...');

    if (this.purchaseUpdateSubscription) {
      this.purchaseUpdateSubscription.remove();
      this.purchaseUpdateSubscription = null;
    }

    if (this.purchaseErrorSubscription) {
      this.purchaseErrorSubscription.remove();
      this.purchaseErrorSubscription = null;
    }

    try {
      await endConnection();
      this.isInitialized = false;
      console.log('[PaymentService] Cleanup complete');
    } catch (error) {
      console.error('[PaymentService] Cleanup error:', error);
    }
  }

  /**
   * 상품 정보 조회
   */
  async getProducts(): Promise<ProductPurchase[]> {
    await this.ensureInitialized();

    try {
      const productIds =
        Platform.OS === 'android' ? [PRODUCT_IDS.ANDROID] : [PRODUCT_IDS.IOS];

      console.log('[PaymentService] Fetching products:', productIds);
      const products = await getProducts({ skus: productIds });

      if (!products || products.length === 0) {
        throw this.createPaymentError(PAYMENT_ERROR_CODES.PRODUCT_NOT_FOUND);
      }

      console.log('[PaymentService] Products fetched:', products);
      return products;
    } catch (error) {
      console.error('[PaymentService] Failed to fetch products:', error);
      throw this.createPaymentError(
        PAYMENT_ERROR_CODES.PRODUCT_NOT_FOUND,
        error
      );
    }
  }

  /**
   * 기부 결제 시작
   */
  async purchaseDonation(nickname: string): Promise<PaymentResult> {
    await this.ensureInitialized();

    try {
      const productId =
        Platform.OS === 'android' ? PRODUCT_IDS.ANDROID : PRODUCT_IDS.IOS;

      console.log('[PaymentService] Requesting purchase:', productId);

      // 구매 요청
      const purchase = await requestPurchase({ sku: productId });

      if (!purchase) {
        throw this.createPaymentError(PAYMENT_ERROR_CODES.PURCHASE_FAILED);
      }

      console.log('[PaymentService] Purchase successful:', purchase);

      // 구매 완료 처리 (영수증 검증 및 Supabase 저장)
      const result = await this.finalizePurchase(purchase, nickname);

      // 거래 완료 처리
      await finishTransaction({ purchase, isConsumable: true });

      return result;
    } catch (error: any) {
      console.error('[PaymentService] Purchase failed:', error);

      // 사용자 취소 에러 처리
      if (
        error?.code === 'E_USER_CANCELLED' ||
        error?.message?.includes('cancelled')
      ) {
        throw this.createPaymentError(PAYMENT_ERROR_CODES.USER_CANCELLED, error);
      }

      throw this.createPaymentError(
        PAYMENT_ERROR_CODES.PURCHASE_FAILED,
        error
      );
    }
  }

  /**
   * 영수증 검증
   */
  async validateReceipt(purchase: Purchase): Promise<ReceiptValidationResult> {
    try {
      console.log('[PaymentService] Validating receipt:', purchase);

      // Android: transactionReceipt에서 영수증 토큰 추출
      // iOS: transactionReceipt를 그대로 사용
      const receiptData = purchase.transactionReceipt;

      if (!receiptData) {
        return {
          isValid: false,
          error: 'Missing receipt data',
        };
      }

      // Android는 JSON 파싱 필요
      let receiptToken: string;
      if (Platform.OS === 'android') {
        try {
          const parsedReceipt = JSON.parse(receiptData);
          receiptToken = parsedReceipt.purchaseToken || receiptData;
        } catch {
          receiptToken = receiptData;
        }
      } else {
        receiptToken = receiptData;
      }

      // 영수증 정보 구성
      const receiptInfo: ReceiptInfo = {
        token: receiptToken,
        productId: purchase.productId,
        transactionId: purchase.transactionId,
        purchaseTime: new Date(purchase.transactionDate).toISOString(),
        platform: Platform.OS as PlatformType,
        rawData: receiptData,
      };

      console.log('[PaymentService] Receipt validated:', receiptInfo);

      return {
        isValid: true,
        receiptInfo,
      };
    } catch (error) {
      console.error('[PaymentService] Receipt validation failed:', error);
      return {
        isValid: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * 미처리 구매 복구
   */
  async restorePurchases(): Promise<number> {
    await this.ensureInitialized();

    try {
      console.log('[PaymentService] Restoring purchases...');

      // TODO: 추후 구현 (복구 로직)
      // 현재는 consumable 상품이므로 복구가 필요없지만,
      // 미래에 non-consumable 상품 추가 시 필요

      return 0;
    } catch (error) {
      console.error('[PaymentService] Restore purchases failed:', error);
      return 0;
    }
  }

  /**
   * 구매 완료 처리 (영수증 검증 및 Supabase 저장)
   */
  async finalizePurchase(
    purchase: Purchase,
    nickname: string
  ): Promise<PaymentResult> {
    try {
      console.log('[PaymentService] Finalizing purchase...');

      // 1. 영수증 검증
      const validationResult = await this.validateReceipt(purchase);

      if (!validationResult.isValid || !validationResult.receiptInfo) {
        throw this.createPaymentError(
          PAYMENT_ERROR_CODES.RECEIPT_VALIDATION_FAILED
        );
      }

      const { receiptInfo } = validationResult;

      // 2. Supabase에 저장 (중복 방지 포함)
      const { donation, isFirstDonation } = await this.saveDonationToSupabase(
        receiptInfo,
        nickname
      );

      console.log('[PaymentService] Purchase finalized:', {
        donation,
        isFirstDonation,
      });

      return {
        success: true,
        donation,
        isFirstDonation,
      };
    } catch (error) {
      console.error('[PaymentService] Finalize purchase failed:', error);

      if (error instanceof Error && 'code' in error) {
        throw error; // PaymentError는 그대로 전달
      }

      throw this.createPaymentError(PAYMENT_ERROR_CODES.UNKNOWN_ERROR, error);
    }
  }

  /**
   * Supabase에 기부 저장 (중복 방지 포함)
   */
  private async saveDonationToSupabase(
    receiptInfo: ReceiptInfo,
    nickname: string
  ): Promise<{ donation: any; isFirstDonation: boolean }> {
    try {
      // 1. 중복 결제 확인
      const { data: existingDonation, error: checkError } = await supabase
        .from('donations')
        .select('*')
        .eq('receipt_token', receiptInfo.token)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        // PGRST116 = 결과 없음 (정상)
        throw checkError;
      }

      if (existingDonation) {
        console.warn('[PaymentService] Duplicate payment detected:', receiptInfo.token);
        throw this.createPaymentError(PAYMENT_ERROR_CODES.DUPLICATE_PAYMENT);
      }

      // 2. 현재 사용자 세션 가져오기 (없으면 null)
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // 3. 첫 기부 여부 확인
      const isFirstDonation = await this.checkFirstDonation();

      // 4. donations 테이블에 저장
      const donationData: Partial<DonationRecord> = {
        user_id: user?.id || null,
        nickname,
        amount: 1000,
        receipt_token: receiptInfo.token,
        transaction_id: receiptInfo.transactionId,
        platform: receiptInfo.platform,
      };

      const { data: donation, error: insertError } = await supabase
        .from('donations')
        .insert(donationData)
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      // 5. users 테이블 업데이트 (있으면 업데이트, 없으면 생성)
      if (user) {
        await this.updateUserDonationStats(user.id, nickname, isFirstDonation);
      }

      // 6. 첫 기부 플래그 업데이트
      if (isFirstDonation) {
        await AsyncStorage.setItem(
          STORAGE_KEYS.FIRST_DONATION,
          new Date().toISOString()
        );
      }

      console.log('[PaymentService] Donation saved to Supabase:', donation);

      return {
        donation,
        isFirstDonation,
      };
    } catch (error) {
      console.error('[PaymentService] Failed to save to Supabase:', error);

      if (error instanceof Error && 'code' in error) {
        throw error;
      }

      throw this.createPaymentError(PAYMENT_ERROR_CODES.NETWORK_ERROR, error);
    }
  }

  /**
   * 첫 기부 여부 확인
   */
  private async checkFirstDonation(): Promise<boolean> {
    const firstDonationDate = await AsyncStorage.getItem(
      STORAGE_KEYS.FIRST_DONATION
    );
    return !firstDonationDate;
  }

  /**
   * 사용자 기부 통계 업데이트
   */
  private async updateUserDonationStats(
    userId: string,
    nickname: string,
    isFirstDonation: boolean
  ): Promise<void> {
    try {
      // 사용자 정보 조회
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (existingUser) {
        // 기존 사용자 업데이트
        await supabase
          .from('users')
          .update({
            nickname,
            total_donated: existingUser.total_donated + 1000,
            last_donation_at: new Date().toISOString(),
            badge_earned: isFirstDonation ? true : existingUser.badge_earned,
          })
          .eq('id', userId);
      } else {
        // 새 사용자 생성
        await supabase.from('users').insert({
          id: userId,
          nickname,
          total_donated: 1000,
          first_donation_at: new Date().toISOString(),
          last_donation_at: new Date().toISOString(),
          badge_earned: isFirstDonation,
        });
      }
    } catch (error) {
      console.error('[PaymentService] Failed to update user stats:', error);
      // 사용자 통계 업데이트 실패는 치명적이지 않으므로 로그만 남김
    }
  }

  /**
   * 초기화 확인
   */
  private async ensureInitialized(): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }
  }

  /**
   * PaymentError 생성 헬퍼
   */
  private createPaymentError(
    code: string,
    originalError?: unknown
  ): PaymentError {
    const error: PaymentError = {
      code,
      message: PAYMENT_ERROR_MESSAGES[code] || PAYMENT_ERROR_MESSAGES[PAYMENT_ERROR_CODES.UNKNOWN_ERROR],
      originalError,
    };

    return Object.assign(new Error(error.message), error);
  }
}

/**
 * Payment Service 싱글톤 인스턴스
 */
export const paymentService = new PaymentService();

/**
 * 재시도 로직이 포함된 결제 함수
 */
export async function purchaseWithRetry(
  nickname: string,
  maxRetries: number = PAYMENT_RETRY_CONFIG.MAX_RETRIES
): Promise<PaymentResult> {
  let lastError: PaymentError | null = null;
  let delay = PAYMENT_RETRY_CONFIG.RETRY_DELAY;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`[purchaseWithRetry] Attempt ${attempt}/${maxRetries}`);
      const result = await paymentService.purchaseDonation(nickname);
      return result;
    } catch (error: any) {
      lastError = error;

      // 사용자 취소나 중복 결제는 재시도하지 않음
      if (
        error.code === PAYMENT_ERROR_CODES.USER_CANCELLED ||
        error.code === PAYMENT_ERROR_CODES.DUPLICATE_PAYMENT
      ) {
        throw error;
      }

      // 마지막 시도가 아니면 재시도
      if (attempt < maxRetries) {
        console.warn(
          `[purchaseWithRetry] Attempt ${attempt} failed, retrying in ${delay}ms...`,
          error
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= PAYMENT_RETRY_CONFIG.BACKOFF_MULTIPLIER;
      }
    }
  }

  // 모든 재시도 실패
  console.error('[purchaseWithRetry] All attempts failed');
  throw lastError;
}

/**
 * 결제 서비스 내보내기
 */
export default paymentService;
