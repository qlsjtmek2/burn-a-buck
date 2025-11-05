/**
 * Share Templates
 *
 * 시스템 공유 메시지 템플릿 생성 함수
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
