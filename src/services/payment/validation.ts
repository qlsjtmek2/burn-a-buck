/**
 * Receipt Validation
 *
 * 영수증 검증 로직
 */

import { Platform } from 'react-native';
import type { Purchase, ReceiptValidationResult } from '../../types/payment';

/**
 * 영수증 기본 검증 (클라이언트 측)
 *
 * ⚠️ 주의: 실제 서비스에서는 서버에서 Google Play Developer API를 통해 검증해야 합니다.
 * 클라이언트 검증은 기본적인 무결성 체크만 수행합니다.
 */
export const validateReceiptClient = (purchase: Purchase): ReceiptValidationResult => {
  try {
    // Android: purchaseToken 및 signature 확인
    if (Platform.OS === 'android') {
      if (!purchase.purchaseToken || !purchase.signatureAndroid) {
        return {
          isValid: false,
          error: 'Missing purchase token or signature',
        };
      }

      // 기본 검증 (실제로는 서버에서 서명 검증 필요)
      return {
        isValid: true,
        productId: purchase.productId,
        purchaseToken: purchase.purchaseToken,
        purchaseTime: purchase.transactionDate,
      };
    }

    // iOS: transactionReceipt 확인
    if (Platform.OS === 'ios') {
      if (!purchase.transactionReceipt) {
        return {
          isValid: false,
          error: 'Missing transaction receipt',
        };
      }

      return {
        isValid: true,
        productId: purchase.productId,
        purchaseToken: purchase.transactionReceipt,
        purchaseTime: purchase.transactionDate,
      };
    }

    return {
      isValid: false,
      error: 'Unsupported platform',
    };
  } catch (err) {
    console.error('Receipt validation failed:', err);
    return {
      isValid: false,
      error: err instanceof Error ? err.message : 'Unknown validation error',
    };
  }
};

/**
 * 구매 토큰 추출
 * (Supabase에 저장할 고유 식별자)
 */
export const extractPurchaseToken = (purchase: Purchase): string => {
  if (Platform.OS === 'android') {
    return purchase.purchaseToken;
  }
  // iOS는 transactionId를 사용
  return purchase.transactionId;
};
