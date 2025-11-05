/**
 * Share Service (Web Version)
 *
 * Web 브라우저에서 사용하는 공유 서비스
 * - Web Share API 사용 (지원하는 브라우저만)
 * - 링크 복사는 Clipboard API 사용
 * - 플랫폼별 직접 공유는 지원하지 않음
 *
 * ⚠️ 주의: Web Share API는 HTTPS 환경에서만 작동합니다
 */

import * as Clipboard from 'expo-clipboard';
import { ShareData, SharePlatform, ShareResult } from '../types/share';
import {
  createShareMessage,
  createSMSMessage,
} from '../utils/shareTemplates';
import i18n from '../config/i18n';

/**
 * Web Share API 지원 여부 확인
 */
const isWebShareSupported = (): boolean => {
  return typeof navigator !== 'undefined' && 'share' in navigator;
};

/**
 * 소셜 미디어 공유 (Web에서는 지원하지 않음)
 */
export const shareToSocial = async (
  platform: SharePlatform,
  data: ShareData
): Promise<ShareResult> => {
  console.warn(`[shareToSocial] ${platform} sharing not supported on web`);

  // Web에서는 일반 공유로 폴백
  return shareGeneral(data);
};

/**
 * 일반 공유 (Web Share API 사용)
 */
export const shareGeneral = async (
  data: ShareData
): Promise<ShareResult> => {
  try {
    if (!isWebShareSupported()) {
      // Web Share API를 지원하지 않는 브라우저
      // 링크 복사로 폴백
      console.warn('[shareGeneral] Web Share API not supported, fallback to copy link');
      return copyLink(data);
    }

    const { title, message, url } = createShareMessage(data);

    await navigator.share({
      title,
      text: message,
      url,
    });

    return {
      success: true,
      platform: 'more',
    };
  } catch (error: any) {
    // 사용자가 취소한 경우
    if (error.name === 'AbortError') {
      return {
        success: false,
        platform: 'more',
        error: 'cancelled',
      };
    }

    console.error('[shareGeneral] error:', error);
    return {
      success: false,
      platform: 'more',
      error: error.message,
    };
  }
};

/**
 * SMS 공유 (Web에서는 지원하지 않음)
 */
export const shareToSMS = async (
  data: ShareData
): Promise<ShareResult> => {
  console.warn('[shareToSMS] SMS sharing not supported on web');

  return {
    success: false,
    platform: 'sms',
    error: 'not_supported_on_web',
  };
};

/**
 * 링크 복사 (Clipboard API 사용)
 */
export const copyLink = async (data: ShareData): Promise<ShareResult> => {
  try {
    const { url } = createShareMessage(data);
    await Clipboard.setStringAsync(url);

    // Web에서는 alert 대신 console.log 사용
    console.log('[copyLink] Link copied to clipboard:', url);

    return {
      success: true,
      platform: 'copy_link',
    };
  } catch (error: any) {
    console.error('[copyLink] error:', error);
    return {
      success: false,
      platform: 'copy_link',
      error: error.message,
    };
  }
};

/**
 * 카카오톡 공유 (Web에서는 지원하지 않음)
 */
export const shareToKakao = async (
  data: ShareData
): Promise<ShareResult> => {
  console.warn('[shareToKakao] KakaoTalk sharing not supported on web');

  // Web에서는 일반 공유로 폴백
  return shareGeneral(data);
};

/**
 * 플랫폼별 공유 함수 라우터
 */
export const shareToPlatform = async (
  platform: SharePlatform,
  data: ShareData
): Promise<ShareResult> => {
  switch (platform) {
    case 'kakao':
      return shareToKakao(data);
    case 'instagram':
    case 'facebook':
    case 'twitter':
      return shareToSocial(platform, data);
    case 'sms':
      return shareToSMS(data);
    case 'copy_link':
      return copyLink(data);
    case 'more':
      return shareGeneral(data);
    default:
      return {
        success: false,
        platform,
        error: 'unsupported_platform',
      };
  }
};
