/**
 * Leaderboard Hooks
 *
 * 리더보드 데이터를 조회하는 React Query hooks
 */

import { useQuery } from '@tanstack/react-query';
import { getTopRankers } from '../../../services/leaderboardService';
import { getRecentDonations } from '../../../services/donationService';
import type { LeaderboardEntry } from '../../../types/database.types';

/**
 * Top Rankers 조회 Hook (1~3등)
 *
 * @param limit - 조회할 랭커 수 (기본값: 3)
 * @returns React Query result
 */
export const useTopRankers = (limit: number = 3) => {
  return useQuery({
    queryKey: ['leaderboard', 'top', limit],
    queryFn: () => getTopRankers(limit),
    // 30초마다 자동 리프레시
    refetchInterval: 30000,
    // 에러 발생 시 자동 재시도 (3회)
    retry: 3,
    // 캐시 시간 5분
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Recent Donations 조회 Hook (최근 10명)
 *
 * @param limit - 조회할 기부 내역 수 (기본값: 10)
 * @returns React Query result
 */
export const useRecentDonations = (limit: number = 10) => {
  return useQuery({
    queryKey: ['donations', 'recent', limit],
    queryFn: () => getRecentDonations(limit),
    // 30초마다 자동 리프레시
    refetchInterval: 30000,
    // 에러 발생 시 자동 재시도 (3회)
    retry: 3,
    // 캐시 시간 5분
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Full Leaderboard 조회 Hook (전체 순위)
 *
 * @param limit - 조회할 랭커 수 (기본값: 100)
 * @returns React Query result
 */
export const useLeaderboard = (limit: number = 100) => {
  return useQuery({
    queryKey: ['leaderboard', 'full', limit],
    queryFn: () => getTopRankers(limit),
    // 1분마다 자동 리프레시
    refetchInterval: 60000,
    // 에러 발생 시 자동 재시도 (3회)
    retry: 3,
    // 캐시 시간 5분
    staleTime: 1000 * 60 * 5,
  });
};
