/**
 * Payment Constants
 *
 * 결제 관련 상수 정의
 */

import { Platform } from 'react-native';

/**
 * IAP 상품 ID
 */
export const PRODUCT_IDS = {
  DONATION_1000: Platform.OS === 'android' ? 'donate_1000won' : 'donate_1000won_ios',
} as const;

/**
 * 결제 금액 (원화)
 */
export const PAYMENT_AMOUNTS = {
  DONATION: 1000,
} as const;
