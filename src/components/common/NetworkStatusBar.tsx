import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

/**
 * 네트워크 오프라인 상태를 표시하는 배너 컴포넌트
 * 화면 상단에 고정되며, 오프라인 상태일 때만 표시됩니다.
 *
 * @example
 * ```tsx
 * // App.tsx에서 사용
 * <NetworkStatusBar />
 * <RootNavigator />
 * ```
 */
export const NetworkStatusBar: React.FC = () => {
  const { t } = useTranslation();
  const { isConnected, isInternetReachable } = useNetworkStatus();

  // 연결되어 있고 인터넷 접근 가능하면 배너를 표시하지 않음
  if (isConnected && isInternetReachable !== false) {
    return null;
  }

  // 초기 로딩 중 (null 상태)에는 배너를 표시하지 않음
  if (isConnected === null) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{t('network.offline')}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.warning, // Amber-based warning color
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    ...typography.bodySmall,
    color: colors.surface, // White text on amber background
    fontWeight: '600',
  },
});
