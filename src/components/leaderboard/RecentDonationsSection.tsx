/**
 * Recent Donations Section
 *
 * 최근 기부 내역을 표시하는 섹션 (시간 포함)
 */

import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRecentDonations } from '../../hooks/useLeaderboard';
import { colors, typography } from '../../theme';
import { formatAmount, getTimeAgo } from '../../utils/timeFormat';

interface RecentDonation {
  id: string;
  nickname: string;
  amount: number;
  created_at: string;
}

export const RecentDonationsSection: React.FC = () => {
  const { t } = useTranslation();
  const { data: recentDonations, isLoading, isError } = useRecentDonations(10);

  /**
   * 각 기부 항목 렌더링
   */
  const renderDonationItem = ({ item, index }: { item: RecentDonation; index: number }) => {
    const isFirst = index === 0;
    const isLast = index === (recentDonations?.length ?? 0) - 1;

    return (
      <View
        style={[
          styles.donationItem,
          isFirst && styles.firstItem,
          isLast && styles.lastItem,
        ]}
      >
        {/* 왼쪽: 닉네임 + 금액 */}
        <View style={styles.donationInfo}>
          <Text style={styles.nickname} numberOfLines={1}>
            {item.nickname}
          </Text>
          <Text style={styles.amount}>₩{formatAmount(item.amount)}</Text>
        </View>

        {/* 오른쪽: 시간 */}
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{getTimeAgo(item.created_at)}</Text>
        </View>
      </View>
    );
  };

  /**
   * 구분선 렌더링
   */
  const renderSeparator = () => {
    return <View style={styles.separator} />;
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>{t('main.leaderboard.recentDonations')}</Text>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </View>
    );
  }

  if (isError || !recentDonations || recentDonations.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>{t('main.leaderboard.recentDonations')}</Text>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{t('main.leaderboard.noData')}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{t('main.leaderboard.recentDonations')}</Text>
      <View style={styles.listContainer}>
        <FlatList
          data={recentDonations}
          renderItem={renderDonationItem}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={renderSeparator}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  sectionTitle: {
    ...typography.leaderboardName,
    color: colors.text,
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
  },
  listContainer: {
    backgroundColor: colors.surface,
    marginHorizontal: 24,
    borderRadius: 12,
    paddingVertical: 8,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  donationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  firstItem: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  lastItem: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  donationInfo: {
    flex: 1,
    marginRight: 16,
  },
  nickname: {
    ...typography.titleSmall,
    color: colors.text,
    marginBottom: 4,
  },
  amount: {
    ...typography.labelLarge,
    color: colors.primary,
  },
  timeContainer: {
    alignItems: 'flex-end',
  },
  timeText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: 16,
  },
});

export default RecentDonationsSection;
