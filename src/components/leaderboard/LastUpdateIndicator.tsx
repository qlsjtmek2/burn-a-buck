import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { getTimeAgo } from '../../utils/timeFormat';

interface LastUpdateIndicatorProps {
  /** 마지막 업데이트 시간 (timestamp) */
  timestamp: number;
}

/**
 * 리더보드의 마지막 업데이트 시간을 표시하는 컴포넌트
 *
 * @example
 * ```tsx
 * const { data, dataUpdatedAt } = useQuery(...);
 *
 * <LastUpdateIndicator timestamp={dataUpdatedAt} />
 * ```
 */
export const LastUpdateIndicator: React.FC<LastUpdateIndicatorProps> = ({ timestamp }) => {
  const { t } = useTranslation();

  const timeAgo = getTimeAgo(timestamp);

  return (
    <Text style={styles.text}>
      {t('main.leaderboard.lastUpdated', { time: timeAgo })}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },
});
