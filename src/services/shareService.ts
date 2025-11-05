/**
 * Share Service (Native Version)
 *
 * 시스템 공유 시트를 사용한 일반 공유 서비스
 * - react-native-share가 있으면 사용
 * - 없으면 React Native 내장 Share API 사용 (Expo Go)
 */

import { ShareData } from '../types/share';
import { createShareMessage } from '../utils/shareTemplates';

/**
 * Optional react-native-share import with fallback
 *
 * react-native-share를 optional로 로드하여, Expo Go 환경에서
 * 네이티브 모듈이 없어도 오류가 발생하지 않도록 합니다.
 */
let Share: any = null;
let shareAvailable = false;

try {
  Share = require('react-native-share').default;
  shareAvailable = true;
  console.log('[ShareService] react-native-share loaded');
} catch (error) {
  console.log('[ShareService] Using fallback Share API');
  shareAvailable = false;
}

/**
 * 시스템 공유 시트 표시
 *
 * react-native-share가 있으면 사용하고, 없으면 React Native 내장 Share API로 폴백
 */
export const shareGeneral = async (data: ShareData): Promise<void> => {
  const { title, message, url } = createShareMessage(data);
  const fullMessage = `${message}\n\n${url}`;

  try {
    if (shareAvailable && Share) {
      // react-native-share 사용
      await Share.open({
        title,
        message: fullMessage,
        url,
      });
    } else {
      // 폴백: React Native 내장 Share API 사용
      const { Share: RNShare } = require('react-native');
      await RNShare.share(
        {
          title,
          message: fullMessage,
        },
        {
          dialogTitle: title,
        }
      );
    }
  } catch (error: any) {
    // 사용자가 취소한 경우는 조용히 무시
    if (error.message !== 'User did not share') {
      console.error('[shareGeneral] error:', error);
      throw error;
    }
  }
};
