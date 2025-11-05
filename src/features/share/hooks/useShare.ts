/**
 * useShare Hook
 *
 * 공유 기능 관리 훅
 */

import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ShareData, SharePlatform, ShareResult } from '../../../types/share';
import { shareToPlatform } from '../../../services/shareService';

interface UseShareReturn {
  isBottomSheetVisible: boolean;
  showBottomSheet: () => void;
  hideBottomSheet: () => void;
  handleShare: (platform: SharePlatform, data: ShareData) => Promise<void>;
  isSharing: boolean;
}

/**
 * 공유 기능 훅
 *
 * @example
 * const { isBottomSheetVisible, showBottomSheet, handleShare, isSharing } = useShare();
 *
 * <Button onPress={showBottomSheet}>공유하기</Button>
 *
 * <ShareBottomSheet
 *   visible={isBottomSheetVisible}
 *   onDismiss={hideBottomSheet}
 *   onSelectPlatform={(platform) => handleShare(platform, shareData)}
 * />
 */
export const useShare = (): UseShareReturn => {
  const { t } = useTranslation();
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const showBottomSheet = useCallback(() => {
    setIsBottomSheetVisible(true);
  }, []);

  const hideBottomSheet = useCallback(() => {
    setIsBottomSheetVisible(false);
  }, []);

  const handleShare = useCallback(
    async (platform: SharePlatform, data: ShareData) => {
      if (isSharing) return;

      setIsSharing(true);

      try {
        const result: ShareResult = await shareToPlatform(platform, data);

        if (result.success) {
          // 성공 - 조용히 성공 (링크 복사는 이미 알림 표시됨)
          console.log(`[useShare] Shared to ${platform} successfully`);
        } else if (result.error === 'cancelled') {
          // 사용자가 취소 - 아무것도 하지 않음
          console.log(`[useShare] User cancelled sharing to ${platform}`);
        } else if (result.error === 'not_implemented') {
          // 구현되지 않음 (카카오톡) - 이미 알림 표시됨
          console.log(`[useShare] ${platform} not implemented yet`);
        } else {
          // 에러 - 에러 알림 표시
          console.error(`[useShare] Error sharing to ${platform}:`, result.error);
          Alert.alert(
            t('share.error.title'),
            t('share.error.message', { platform: t(`share.platform.${platform}`) }),
            [{ text: t('common.ok') }]
          );
        }
      } catch (error: any) {
        console.error('[useShare] Unexpected error:', error);
        Alert.alert(
          t('share.error.title'),
          t('share.error.unknown'),
          [{ text: t('common.ok') }]
        );
      } finally {
        setIsSharing(false);
      }
    },
    [isSharing, t]
  );

  return {
    isBottomSheetVisible,
    showBottomSheet,
    hideBottomSheet,
    handleShare,
    isSharing,
  };
};
