/**
 * Recent Donations Section
 *
 * 최근 기부 내역을 표시하는 섹션 (시간 포함)
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';
import Animated, { SlideInUp, Layout } from 'react-native-reanimated';
import { useRecentDonations } from '../hooks/useLeaderboard';
import { colors, typography } from '../../../theme';
import { formatAmount, getTimeAgo } from '../../../utils/timeFormat';
import { usePrevious } from '../../../utils/hooks/usePrevious';
import { LastUpdateIndicator } from '../../../components/leaderboard/LastUpdateIndicator';
import { EmptyState } from '../../../components/common/EmptyState';

interface RecentDonation {
  id: string;
  nickname: string;
  amount: number;
  created_at: string;
}

export const RecentDonationsSection: React.FC = () => {
  const { t } = useTranslation();
  const { data: recentDonations, isLoading, isError, dataUpdatedAt } = useRecentDonations(10);

  // 새로 추가된 항목 추적
  const previousData = usePrevious(recentDonations);
  const [newItemIds, setNewItemIds] = useState<Set<string>>(new Set());

  // 데이터 변경 감지
  useEffect(() => {
    if (!previousData || !recentDonations) return;

    const prevIds = new Set(previousData.map((d) => d.id));
    const newIds = recentDonations.filter((d) => !prevIds.has(d.id)).map((d) => d.id);

    if (newIds.length > 0) {
      setNewItemIds(new Set(newIds));

      // 1초 후 new flag 제거 (애니메이션 완료 후)
      setTimeout(() => {
        setNewItemIds(new Set());
      }, 1000);
    }
  }, [recentDonations, previousData]);

  /**
   * 각 기부 항목 렌더링
   */
  const renderDonationItem = ({ item, index }: { item: RecentDonation; index: number }) => {
    const isFirst = index === 0;
    const isLast = index === (recentDonations?.length ?? 0) - 1;
    const isNewItem = newItemIds.has(item.id);

    const contentView = (
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

    // 새 항목: slide-in 애니메이션
    if (isNewItem) {
      return (
        <Animated.View entering={SlideInUp.duration(500)} layout={Layout.springify()}>
          {contentView}
        </Animated.View>
      );
    }

    // 일반 항목: 애니메이션 없음
    return contentView;
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
        <View style={styles.titleContainer}>
          <Text style={styles.sectionTitle}>{t('main.leaderboard.recentDonations')}</Text>
        </View>
        <EmptyState
          icon="💸"
          title={t('main.leaderboard.emptyState.recentDonations.title')}
          message={t('main.leaderboard.emptyState.recentDonations.message')}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.sectionTitle}>{t('main.leaderboard.recentDonations')}</Text>
        <LastUpdateIndicator timestamp={dataUpdatedAt} />
      </View>
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
  titleContainer: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    ...typography.sectionTitle,
    color: colors.text,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
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
