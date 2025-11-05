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
import { useQueryClient } from '@tanstack/react-query';
import type { StackNavigationProp } from '@react-navigation/stack';
import { paymentService } from '../../../services/payment';
import { getPostDonationData } from '../../../services/donationFlowService';
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
  const queryClient = useQueryClient();

  const [status, setStatus] = useState<PaymentStatus>('idle');
  const [error, setError] = useState<PaymentError | null>(null);
  const [isFirstDonation, setIsFirstDonation] = useState<boolean | null>(null);

  const isLoading = ['initializing', 'loading_products', 'purchasing', 'validating', 'saving'].includes(
    status
  );

  /**
   * 결제 시작
   *
   * ⚠️ 닉네임은 온보딩에서 입력되므로 항상 존재한다고 가정
   * 닉네임이 없는 경우는 비정상 상황 (온보딩 완료했는데 닉네임 없음)
   */
  const startPayment = useCallback(
    async (nickname?: string) => {
      try {
        console.log('[useDonationPayment] Starting payment...');
        setError(null);

        // Step 1: 닉네임 확인 (제공되지 않은 경우 AsyncStorage에서 로드)
        let finalNickname = nickname;

        if (!finalNickname) {
          finalNickname = await getSavedNickname();
        }

        // Step 2: 닉네임이 없으면 에러 (온보딩 완료 후 닉네임은 항상 있어야 함)
        if (!finalNickname) {
          console.error('[useDonationPayment] Nickname not found - onboarding incomplete?');
          throw new Error('닉네임이 설정되지 않았습니다. 앱을 다시 시작해주세요.');
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

        // Step 5: 순위 및 총 후원금액 조회
        console.log('[useDonationPayment] Fetching post-donation data...');
        const postDonationData = await getPostDonationData(finalNickname);

        const rank = postDonationData?.rank || undefined;
        const totalDonated = postDonationData?.user?.total_donated || undefined;

        console.log('[useDonationPayment] Post-donation data:', { rank, totalDonated });

        // Step 6: 감사 화면으로 이동
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
          rank,
          totalDonated,
        });

        // Step 7: React Query 캐시 무효화 (메인 화면 즉시 업데이트)
        console.log('[useDonationPayment] Invalidating React Query cache...');
        await queryClient.invalidateQueries({ queryKey: ['leaderboard', 'top'] });
        await queryClient.invalidateQueries({ queryKey: ['donations', 'recent'] });
        await queryClient.invalidateQueries({ queryKey: ['leaderboard', 'full'] });

        // Step 8: 상태 초기화
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
