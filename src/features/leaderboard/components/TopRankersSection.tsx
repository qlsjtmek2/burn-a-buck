/**
 * Top Rankers Section
 *
 * UX 최적화: 정보 밀도, 스캔 가능성, Recent Donations와 일관된 디자인
 */

import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTopRankers } from '../hooks/useLeaderboard';
import { colors, typography } from '../../../theme';
import { formatAmount } from '../../../utils/timeFormat';
import type { LeaderboardEntry } from '../../../types/database.types';

export const TopRankersSection: React.FC = () => {
  const { t } = useTranslation();
  const { data: topRankers, isLoading, isError } = useTopRankers(3);

  /**
   * 순위별 테두리 색상
   */
  const getBorderColor = (rank: number): string => {
    switch (rank) {
      case 1:
        return colors.gold;
      case 2:
        return colors.silver;
      case 3:
        return colors.bronze;
      default:
        return colors.border;
    }
  };

  /**
   * 순위별 배경 색상 (미묘한 강조)
   */
  const getBackgroundColor = (rank: number): string => {
    switch (rank) {
      case 1:
        return `${colors.gold}08`; // 3% opacity
      case 2:
        return `${colors.silver}08`;
      case 3:
        return `${colors.bronze}08`;
      default:
        return colors.surface;
    }
  };

  /**
   * 순위 이모지
   */
  const getRankEmoji = (rank: number): string => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return '';
    }
  };

  /**
   * 각 랭커 항목 렌더링
   */
  const renderRankerItem = ({ item, index }: { item: LeaderboardEntry; index: number }) => {
    const rank = index + 1;
    const borderColor = getBorderColor(rank);
    const backgroundColor = getBackgroundColor(rank);
    const emoji = getRankEmoji(rank);
    const isFirst = index === 0;
    const isLast = index === (topRankers?.length ?? 0) - 1;

    return (
      <View
        style={[
          styles.rankerItem,
          { borderColor, backgroundColor },
          isFirst && styles.firstItem,
          isLast && styles.lastItem,
        ]}
      >
        {/* 왼쪽: 순위 + 이모지 */}
        <View style={styles.rankSection}>
          <Text style={styles.rankEmoji}>{emoji}</Text>
          <Text style={[styles.rankText, { color: borderColor }]}>{rank}위</Text>
        </View>

        {/* 중앙: 닉네임 + 금액 */}
        <View style={styles.infoSection}>
          <Text style={styles.nickname} numberOfLines={1}>
            {item.nickname}
          </Text>
          <Text style={styles.amount}>₩{formatAmount(item.total_donated)}</Text>
        </View>

        {/* 오른쪽: 기부 횟수 */}
        <View style={styles.statsSection}>
          {item.donation_count > 1 && (
            <Text style={styles.donationCount}>
              {t('main.leaderboard.donationCount', { count: item.donation_count })}
            </Text>
          )}
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
        <Text style={styles.sectionTitle}>{t('main.leaderboard.topRanker')}</Text>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </View>
    );
  }

  if (isError || !topRankers || topRankers.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>{t('main.leaderboard.topRanker')}</Text>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{t('main.leaderboard.noData')}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{t('main.leaderboard.topRanker')}</Text>
      <View style={styles.listContainer}>
        <FlatList
          data={topRankers}
          renderItem={renderRankerItem}
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
    ...typography.sectionTitle,
    color: colors.text,
    marginBottom: 12,
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
    paddingVertical: 4,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  rankerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderLeftWidth: 4, // 왼쪽 테두리로 순위 강조
  },
  firstItem: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  lastItem: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  rankSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    width: 70,
  },
  rankEmoji: {
    ...typography.emoji,
  },
  rankText: {
    ...typography.leaderboardStats,
  },
  infoSection: {
    flex: 1,
    marginRight: 8,
  },
  nickname: {
    ...typography.rankerNickname,
    color: colors.text,
    marginBottom: 2,
  },
  amount: {
    ...typography.leaderboardAmount,
    color: colors.primary,
  },
  statsSection: {
    alignItems: 'flex-end',
    minWidth: 50,
  },
  donationCount: {
    ...typography.labelSmall,
    color: colors.textSecondary,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: 12,
  },
});

export default TopRankersSection;
