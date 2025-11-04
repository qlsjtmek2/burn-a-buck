/**
 * Donation Payment Hook (Web Version)
 *
 * 웹에서는 결제가 불가능하므로 Mock 구현을 제공합니다.
 */

import { useState, useCallback } from 'react';
import type { PaymentStatus, PaymentError } from '../types/payment';

/**
 * 기부 결제 훅 반환 타입
 */
export interface UseDonationPaymentReturn {
  /** 현재 결제 상태 */
  status: PaymentStatus;
  /** 로딩 중 여부 */
  isLoading: boolean;
  /** 에러 정보 */
  error: PaymentError | null;
  /** 결제 시작 함수 */
  startPayment: (nickname?: string) => Promise<void>;
  /** 에러 초기화 함수 */
  clearError: () => void;
  /** 첫 기부 여부 */
  isFirstDonation: boolean | null;
}

/**
 * 기부 결제 플로우 관리 훅 (Web Mock)
 *
 * @returns 결제 상태 및 함수들
 */
export const useDonationPayment = (): UseDonationPaymentReturn => {
  const [status, setStatus] = useState<PaymentStatus>('idle');
  const [error, setError] = useState<PaymentError | null>(null);
  const [isFirstDonation] = useState<boolean | null>(null);

  const isLoading = false;

  /**
   * 결제 시작 (웹에서는 에러만 표시)
   */
  const startPayment = useCallback(async (nickname?: string) => {
    console.warn('[useDonationPayment Web] Payment not supported on web platform');

    setStatus('error');

    const paymentError: PaymentError = {
      code: 'E_WEB_NOT_SUPPORTED',
      message: '웹에서는 Google Play 결제를 사용할 수 없습니다.\n\nAndroid 또는 iOS 앱을 사용해주세요.',
    };

    setError(paymentError);
  }, []);

  /**
   * 에러 초기화
   */
  const clearError = useCallback(() => {
    setError(null);
    setStatus('idle');
  }, []);

  return {
    status,
    isLoading,
    error,
    startPayment,
    clearError,
    isFirstDonation,
  };
};
