/**
 * Donation Flow Service
 *
 * 기부 플로우 통합 서비스
 * (결제 → 영수증 검증 → Supabase 저장 → 사용자 통계 업데이트)
 */

import { Platform } from 'react-native';
import {
  purchaseProduct,
  finalizePurchase,
  validateReceiptClient,
  extractPurchaseToken,
  PRODUCT_IDS,
} from './payment/index';
import { createDonation, getDonationByReceipt } from './donationService';
import { getUserById, createUser } from './userService';
import type { Purchase, PurchaseResult, CreateDonationInput } from '../types/payment';
import type { User } from '../types/database.types';

/**
 * 기부 플로우 결과
 */
export interface DonationFlowResult {
  success: boolean;
  isFirstDonation?: boolean;
  user?: User;
  donationId?: string;
  error?: string;
}

/**
 * 기부 플로우 실행
 *
 * @param userId - 사용자 ID (Supabase Auth)
 * @param nickname - 사용자 닉네임
 * @returns 기부 플로우 결과
 */
export const executeDonationFlow = async (
  userId: string,
  nickname: string
): Promise<DonationFlowResult> => {
  let purchase: Purchase | undefined;

  try {
    // Step 1: 구매 시작
    console.log('[Donation Flow] Starting purchase...');
    const purchaseResult: PurchaseResult = await purchaseProduct(PRODUCT_IDS.DONATION_1000);

    if (!purchaseResult.success || !purchaseResult.purchase) {
      return {
        success: false,
        error: purchaseResult.error?.message || 'Purchase failed',
      };
    }

    purchase = purchaseResult.purchase;

    // Step 2: 영수증 클라이언트 검증
    console.log('[Donation Flow] Validating receipt...');
    const validationResult = validateReceiptClient(purchase);

    if (!validationResult.isValid) {
      throw new Error(validationResult.error || 'Invalid receipt');
    }

    // Step 3: 중복 결제 확인
    console.log('[Donation Flow] Checking for duplicate...');
    const receiptToken = extractPurchaseToken(purchase);
    const existingDonation = await getDonationByReceipt(receiptToken);

    if (existingDonation) {
      console.warn('[Donation Flow] Duplicate donation detected:', receiptToken);
      // 중복이지만 구매는 완료 처리
      await finalizePurchase(purchase);

      return {
        success: false,
        error: 'This donation has already been processed',
      };
    }

    // Step 4: 사용자 조회 또는 생성
    console.log('[Donation Flow] Getting or creating user...');
    let user = await getUserById(userId);
    const isFirstDonation = !user || user.total_donated === 0;

    if (!user) {
      user = await createUser({
        nickname,
        total_donated: 0,
        first_donation_at: null,
        last_donation_at: null,
        badge_earned: false,
      });
    }

    // Step 5: 기부 내역 저장 (Supabase)
    console.log('[Donation Flow] Creating donation record...');
    const donationInput = {
      user_id: user.id,
      nickname: user.nickname || nickname,
      amount: 1000, // ₩1,000 고정
      receipt_token: receiptToken,
      platform: (Platform.OS === 'android' ? 'google_play' : 'app_store') as
        | 'google_play'
        | 'app_store',
    };

    const donation = await createDonation(donationInput);

    // Step 6: 구매 완료 처리 (영수증 소비)
    console.log('[Donation Flow] Finalizing purchase...');
    await finalizePurchase(purchase);

    // Step 7: 사용자 정보 다시 조회 (트리거로 업데이트된 통계)
    const updatedUser = await getUserById(userId);

    console.log('[Donation Flow] Donation flow completed successfully');

    return {
      success: true,
      isFirstDonation,
      user: updatedUser || user,
      donationId: donation.id,
    };
  } catch (err) {
    console.error('[Donation Flow] Error:', err);

    // 구매는 했지만 저장에 실패한 경우, 영수증 소비
    if (purchase) {
      try {
        await finalizePurchase(purchase);
      } catch (finalizeErr) {
        console.error('[Donation Flow] Failed to finalize purchase:', finalizeErr);
      }
    }

    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
};

/**
 * 사용자의 첫 기부 여부 확인
 *
 * @param userId - 사용자 ID
 * @returns 첫 기부 여부
 */
export const checkIfFirstDonation = async (userId: string): Promise<boolean> => {
  const user = await getUserById(userId);
  return !user || user.total_donated === 0;
};

/**
 * 기부 완료 후 처리
 * (감사 메시지, 순위 조회 등)
 *
 * @param userId - 사용자 ID
 * @returns 사용자 정보 및 순위
 */
export const getPostDonationData = async (
  userId: string
): Promise<{
  user: User;
  rank: number | null;
} | null> => {
  try {
    const user = await getUserById(userId);

    if (!user) {
      return null;
    }

    // 순위 조회 (간단하게 leaderboard 뷰에서 조회)
    const { getUserRank } = await import('./userService');
    const rankData = await getUserRank(userId);

    return {
      user,
      rank: rankData?.rank || null,
    };
  } catch (err) {
    console.error('[Post Donation] Error:', err);
    return null;
  }
};
