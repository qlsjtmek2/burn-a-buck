/**
 * Share Service (Expo Go Mock Version)
 *
 * Expo Go 환경에서 사용하는 Mock 공유 서비스
 * - react-native-share 대신 React Native 내장 Share API 사용
 * - 플랫폼별 직접 공유는 일반 공유로 폴백
 * - SMS, 링크 복사는 정상 작동
 *
 * ⚠️ 주의: Development Build로 전환 시 shareService.native.ts가 자동으로 사용됩니다
 */

import { Share, Alert, Linking, Platform } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { ShareData, SharePlatform, ShareResult } from '../types/share';
import {
  createShareMessage,
  createSMSMessage,
} from '../utils/shareTemplates';
import i18n from '../config/i18n';

/**
 * 소셜 미디어 공유 (Expo Go에서는 일반 공유로 폴백)
 *
 * Instagram, Facebook, Twitter 등 플랫폼별 직접 공유는
 * Expo Go에서 지원되지 않으므로 일반 공유 시트를 표시합니다.
 */
export const shareToSocial = async (
  platform: SharePlatform,
  data: ShareData
): Promise<ShareResult> => {
  try {
    // 사용자에게 폴백 안내
    const platformName = i18n.t(`share.platform.${platform}`);

    Alert.alert(
      i18n.t('share.expoGoMode.title'),
      i18n.t('share.expoGoMode.message', { platform: platformName }),
      [
        {
          text: i18n.t('common.cancel'),
          style: 'cancel',
          onPress: () => {
            // 취소 시 아무것도 하지 않음
          },
        },
        {
          text: i18n.t('share.expoGoMode.useGeneral'),
          onPress: async () => {
            // 일반 공유로 폴백
            await shareGeneral(data);
          },
        },
      ]
    );

    return {
      success: false,
      platform,
      error: 'expo_go_fallback',
    };
  } catch (error: any) {
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
 *
 * React Native 내장 Share API 사용
 */
export const shareGeneral = async (
  data: ShareData
): Promise<ShareResult> => {
  try {
    const { title, message, url } = createShareMessage(data);

    const result = await Share.share(
      {
        title,
        message: `${message}\n\n${url}`,
      },
      {
        // Android에서 대화상자 제목
        dialogTitle: title,
      }
    );

    // 사용자가 공유를 완료하거나 취소한 경우
    if (result.action === Share.sharedAction) {
      // 공유 성공
      return {
        success: true,
        platform: 'more',
      };
    } else if (result.action === Share.dismissedAction) {
      // 사용자가 취소
      return {
        success: false,
        platform: 'more',
        error: 'cancelled',
      };
    }

    // 기본값 (Android에서 result.action이 undefined일 수 있음)
    return {
      success: true,
      platform: 'more',
    };
  } catch (error: any) {
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
 *
 * Linking API 사용 (플랫폼 독립적)
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
 *
 * expo-clipboard 사용 (플랫폼 독립적)
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
 * Expo Go 및 Development Build 모두에서 일반 공유로 폴백
 * (KakaoTalk SDK는 별도 설치 필요)
 */
export const shareToKakao = async (
  data: ShareData
): Promise<ShareResult> => {
  try {
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
