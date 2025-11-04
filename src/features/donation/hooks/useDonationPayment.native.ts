/**
 * Donation Payment Hook
 *
 * 기부 결제 플로우를 관리하는 커스텀 훅
 * - UI 상태 관리 (status, error, loading)
 * - Navigation 제어
 * - 비즈니스 로직은 paymentService와 donationStorage에 위임
 */

import { useState, useCallback, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { paymentService } from '../../../services/payment';
import { getSavedNickname } from '../../../utils/donationStorage';
import type { PaymentStatus, PaymentError, PaymentResult } from '../../../types/payment';
import type { RootStackParamList } from '../../../types/navigation';

type NavigationProp = StackNavigationProp<RootStackParamList>;

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
 * 기부 결제 플로우 관리 훅
 *
 * @returns 결제 상태 및 함수들
 */
export const useDonationPayment = (): UseDonationPaymentReturn => {
  const navigation = useNavigation<NavigationProp>();

  const [status, setStatus] = useState<PaymentStatus>('idle');
  const [error, setError] = useState<PaymentError | null>(null);
  const [isFirstDonation, setIsFirstDonation] = useState<boolean | null>(null);

  const isLoading = ['initializing', 'loading_products', 'purchasing', 'validating', 'saving'].includes(
    status
  );

  /**
   * 결제 시작
   */
  const startPayment = useCallback(
    async (nickname?: string) => {
      try {
        console.log('[useDonationPayment] Starting payment...');
        setError(null);

        // Step 1: 닉네임 확인 (제공되지 않은 경우)
        let finalNickname = nickname;

        if (!finalNickname) {
          finalNickname = await getSavedNickname();
        }

        // Step 2: 닉네임이 없으면 닉네임 입력 화면으로 이동
        if (!finalNickname) {
          console.log('[useDonationPayment] No nickname, navigating to nickname screen');
          navigation.navigate('Nickname', {});
          setStatus('idle');
          return;
        }

        // Step 3: 결제 시작 (비즈니스 로직은 paymentService에 위임)
        // 첫 기부 여부 판단은 paymentService가 담당 (DB 기반, Single Source of Truth)
        setStatus('purchasing');
        console.log('[useDonationPayment] Purchasing with nickname:', finalNickname);

        const result: PaymentResult = await paymentService.purchaseDonation(finalNickname);

        if (!result.success) {
          throw result.error || new Error('Payment failed');
        }

        // Step 4: 결제 성공
        setStatus('success');
        console.log('[useDonationPayment] Payment successful:', result);

        // PaymentService의 isFirstDonation 결과 신뢰 (DB 기반 판단)
        setIsFirstDonation(result.isFirstDonation || false);

        // Step 5: 감사 화면으로 이동
        if (!result.donation) {
          throw new Error('Donation data is missing');
        }

        navigation.navigate('DonationComplete', {
          donation: {
            ...result.donation,
            nickname: finalNickname,
            amount: 1000,
          },
          isFirstDonation: result.isFirstDonation || false,
        });

        // Step 6: 상태 초기화
        setTimeout(() => {
          setStatus('idle');
        }, 1000);
      } catch (err: any) {
        console.error('[useDonationPayment] Payment failed:', err);

        setStatus('error');

        const paymentError: PaymentError = {
          code: err.code || 'E_UNKNOWN_ERROR',
          message: err.message || '알 수 없는 오류가 발생했습니다.',
          originalError: err,
        };

        setError(paymentError);
      }
    },
    [navigation]
  );

  /**
   * 에러 초기화
   */
  const clearError = useCallback(() => {
    setError(null);
    setStatus('idle');
  }, []);

  /**
   * 컴포넌트 마운트 시 결제 서비스 초기화 확인
   */
  useEffect(() => {
    const ensureInitialized = async () => {
      try {
        await paymentService.initialize();
      } catch (err) {
        console.error('[useDonationPayment] Failed to initialize payment service:', err);
      }
    };

    ensureInitialized();
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
