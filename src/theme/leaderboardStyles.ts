/**
 * Leaderboard Common Styles
 *
 * TopRankersSection과 RecentDonationsSection에서 공유하는 스타일
 */

import { StyleSheet } from 'react-native';
import { colors, typography } from './index';

/**
 * 공통 리더보드 스타일
 */
export const leaderboardCommonStyles = StyleSheet.create({
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
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: 12,
  },
  firstItem: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  lastItem: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
});

/**
 * 순위 관련 스타일 (TopRankersSection 전용)
 */
export const rankingStyles = StyleSheet.create({
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
});

/**
 * 순위별 테두리 색상
 */
export const getRankBorderColor = (rank: number): string => {
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
export const getRankBackgroundColor = (rank: number): string => {
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
export const getRankEmoji = (rank: number): string => {
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
