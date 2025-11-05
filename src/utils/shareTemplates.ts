/**
 * Share Templates
 *
 * 공유 메시지 템플릿 생성 함수
 */

import { ShareData, ShareMessage } from '../types/share';
import i18n from '../config/i18n';

const APP_LINK = 'https://burn-a-buck.app'; // TODO: Replace with actual app link

/**
 * 공유 메시지 템플릿 생성
 */
export const createShareMessage = (data: ShareData): ShareMessage => {
  const { nickname, rank, totalAmount, donationCount } = data;

  // 순위 텍스트
  const rankText = rank
    ? i18n.t('share.template.withRank', { rank })
    : '';

  // 후원 횟수 텍스트
  const countText = donationCount
    ? i18n.t('share.template.withCount', { count: donationCount })
    : '';

  // 메시지 구성
  const message = i18n.t('share.template.message', {
    nickname,
    rankText,
    amount: totalAmount.toLocaleString('ko-KR'),
    countText,
    link: APP_LINK,
  });

  return {
    title: i18n.t('share.template.title'),
    message,
    url: APP_LINK,
  };
};

/**
 * SMS용 짧은 메시지 생성
 */
export const createSMSMessage = (data: ShareData): string => {
  const { nickname, totalAmount } = data;

  return i18n.t('share.template.sms', {
    nickname,
    amount: totalAmount.toLocaleString('ko-KR'),
    link: APP_LINK,
  });
};

/**
 * 카카오톡용 메시지 생성 (구조화된 데이터)
 */
export const createKakaoMessage = (data: ShareData) => {
  const { nickname, rank, totalAmount } = data;

  const rankText = rank ? `${rank}위` : '';
  const description = rank
    ? `현재 ${rankText}로 등극! 총 ${totalAmount.toLocaleString('ko-KR')}원`
    : `총 ${totalAmount.toLocaleString('ko-KR')}원 버림`;

  return {
    objectType: 'feed' as const,
    content: {
      title: i18n.t('share.template.kakao.title', { nickname }),
      description,
      imageUrl: 'https://burn-a-buck.app/images/share-image.png', // TODO: Replace with actual image
      link: {
        mobileWebUrl: APP_LINK,
        webUrl: APP_LINK,
      },
    },
    buttons: [
      {
        title: i18n.t('share.template.kakao.button'),
        link: {
          mobileWebUrl: APP_LINK,
          webUrl: APP_LINK,
        },
      },
    ],
  };
};
