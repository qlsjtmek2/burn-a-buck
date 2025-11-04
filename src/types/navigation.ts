/**
 * Navigation Types
 *
 * React Navigation 타입 정의
 */

import type { StackScreenProps } from '@react-navigation/stack';
import type { DonationInfo } from './payment';

/**
 * Root Stack Navigator 파라미터 타입
 */
export type RootStackParamList = {
  /** 온보딩 화면 (최초 실행 시) */
  Onboarding: undefined;

  /** 메인 화면 (기부 버튼) */
  Main: undefined;

  /** 기부 완료 화면 */
  DonationComplete: {
    /** 기부 정보 */
    donation: DonationInfo;
    /** 첫 기부 여부 */
    isFirstDonation: boolean;
    /** 사용자 순위 (선택사항) */
    rank?: number;
  };
};

/**
 * 화면별 Props 타입
 */
export type OnboardingScreenProps = StackScreenProps<
  RootStackParamList,
  'Onboarding'
>;

export type MainScreenProps = StackScreenProps<RootStackParamList, 'Main'>;

export type DonationCompleteScreenProps = StackScreenProps<
  RootStackParamList,
  'DonationComplete'
>;

/**
 * Navigation 타입 헬퍼
 */
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
