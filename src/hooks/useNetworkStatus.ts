import { useEffect, useState } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

export interface NetworkStatus {
  isConnected: boolean | null;
  isInternetReachable: boolean | null;
  type: string | null;
}

/**
 * 네트워크 상태를 감지하는 훅
 * @react-native-community/netinfo를 사용하여 온라인/오프라인 상태를 추적합니다.
 *
 * @returns NetworkStatus 객체 (isConnected, isInternetReachable, type)
 *
 * @example
 * ```tsx
 * const { isConnected, isInternetReachable } = useNetworkStatus();
 *
 * if (!isConnected) {
 *   return <OfflineBanner />;
 * }
 * ```
 */
export const useNetworkStatus = (): NetworkStatus => {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isConnected: null,
    isInternetReachable: null,
    type: null,
  });

  useEffect(() => {
    // 초기 네트워크 상태 가져오기
    const fetchInitialNetworkState = async () => {
      const state = await NetInfo.fetch();
      setNetworkStatus({
        isConnected: state.isConnected,
        isInternetReachable: state.isInternetReachable,
        type: state.type,
      });
    };

    fetchInitialNetworkState();

    // 네트워크 상태 변경 감지
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      setNetworkStatus({
        isConnected: state.isConnected,
        isInternetReachable: state.isInternetReachable,
        type: state.type,
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return networkStatus;
};
