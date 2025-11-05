/**
 * Share Service (Native Version)
 *
 * Development Build 및 Production Build에서 사용하는 실제 공유 서비스
 * - react-native-share 패키지 사용 (네이티브 모듈)
 * - 플랫폼별 직접 공유 지원 (Instagram, Facebook, Twitter)
 * - SMS, 링크 복사, 일반 공유 모두 지원
 *
 * ⚠️ 주의: Expo Go에서는 작동하지 않습니다 (네이티브 모듈 필요)
 * ⚠️ env.ts의 SHARE_TEST_MODE=false일 때 자동으로 사용됩니다
 */

import Share from 'react-native-share';
import * as Clipboard from 'expo-clipboard';
import { Alert, Linking, Platform } from 'react-native';
import { ShareData, SharePlatform, ShareResult } from '../types/share';
import {
  createShareMessage,
  createSMSMessage,
  createKakaoMessage,
} from '../utils/shareTemplates';
import i18n from '../config/i18n';

/**
 * 소셜 미디어 공유 (Instagram, Facebook, Twitter 등)
 */
export const shareToSocial = async (
  platform: SharePlatform,
  data: ShareData
): Promise<ShareResult> => {
  try {
    const { title, message, url } = createShareMessage(data);

    const shareOptions: any = {
      title,
      message: `${message}\n\n${url}`,
      url, // iOS에서 URL 별도 전달
    };

    // 플랫폼별 소셜 앱 지정
    if (platform === 'instagram') {
      shareOptions.social = Share.Social.INSTAGRAM;
    } else if (platform === 'facebook') {
      shareOptions.social = Share.Social.FACEBOOK;
    } else if (platform === 'twitter') {
      shareOptions.social = Share.Social.TWITTER;
    }

    await Share.shareSingle(shareOptions);

    return {
      success: true,
      platform,
    };
  } catch (error: any) {
    // 사용자가 취소한 경우
    if (error.message === 'User did not share') {
      return {
        success: false,
        platform,
        error: 'cancelled',
      };
    }

    console.error(`[shareToSocial] ${platform} error:`, error);
    return {
      success: false,
      platform,
      error: error.message,
    };
  }
};

/**
 * 일반 공유 (시스템 공유 시트)
 */
export const shareGeneral = async (
  data: ShareData
): Promise<ShareResult> => {
  try {
    const { title, message, url } = createShareMessage(data);

    const result = await Share.open({
      title,
      message: `${message}\n\n${url}`,
      url, // iOS에서 URL 별도 전달
    });

    return {
      success: true,
      platform: 'more',
    };
  } catch (error: any) {
    // 사용자가 취소한 경우
    if (error.message === 'User did not share') {
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
 * SMS 공유
 */
export const shareToSMS = async (
  data: ShareData
): Promise<ShareResult> => {
  try {
    const message = createSMSMessage(data);

    const smsUrl = Platform.select({
      ios: `sms:&body=${encodeURIComponent(message)}`,
      android: `sms:?body=${encodeURIComponent(message)}`,
    });

    if (!smsUrl) {
      throw new Error('Unsupported platform');
    }

    const canOpen = await Linking.canOpenURL(smsUrl);
    if (!canOpen) {
      throw new Error('SMS not available');
    }

    await Linking.openURL(smsUrl);

    return {
      success: true,
      platform: 'sms',
    };
  } catch (error: any) {
    console.error('[shareToSMS] error:', error);
    return {
      success: false,
      platform: 'sms',
      error: error.message,
    };
  }
};

/**
 * 링크 복사
 */
export const copyLink = async (data: ShareData): Promise<ShareResult> => {
  try {
    const { url } = createShareMessage(data);
    await Clipboard.setStringAsync(url);

    // 복사 완료 알림
    Alert.alert(
      i18n.t('share.copyLink.success.title'),
      i18n.t('share.copyLink.success.message'),
      [{ text: i18n.t('common.ok') }]
    );

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
 * 카카오톡 공유
 *
 * ⚠️ 주의: Expo Go에서는 작동하지 않습니다.
 * Development Build 또는 Production Build에서만 사용 가능합니다.
 */
export const shareToKakao = async (
  data: ShareData
): Promise<ShareResult> => {
  try {
    // TODO: @react-native-kakao/share 패키지 설치 후 구현
    // import KakaoShare from '@react-native-kakao/share';
    //
    // const templateObject = createKakaoMessage(data);
    // await KakaoShare.sendFeed(templateObject);

    // 임시: 카카오톡이 설치되어 있으면 일반 공유로 폴백
    Alert.alert(
      i18n.t('share.kakao.notAvailable.title'),
      i18n.t('share.kakao.notAvailable.message'),
      [
        {
          text: i18n.t('common.cancel'),
          style: 'cancel',
        },
        {
          text: i18n.t('share.kakao.notAvailable.useGeneral'),
          onPress: async () => {
            await shareGeneral(data);
          },
        },
      ]
    );

    return {
      success: false,
      platform: 'kakao',
      error: 'not_implemented',
    };
  } catch (error: any) {
    console.error('[shareToKakao] error:', error);
    return {
      success: false,
      platform: 'kakao',
      error: error.message,
    };
  }
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
