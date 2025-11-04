/**
 * Leaderboard Service
 *
 * 리더보드 관련 API 서비스 레이어
 */

import { supabase } from './supabase';
import type { LeaderboardEntry, LeaderboardStats } from '@/types/database.types';

/**
 * 상위 랭커 조회
 */
export const getTopRankers = async (limit: number = 10): Promise<LeaderboardEntry[]> => {
  const { data, error } = await supabase.rpc('get_top_rankers', {
    p_limit: limit,
  });

  if (error) {
    throw error;
  }

  return data || [];
};

/**
 * 전체 리더보드 조회
 */
export const getLeaderboard = async (
  limit: number = 100,
  offset: number = 0
): Promise<LeaderboardEntry[]> => {
  const { data, error } = await supabase
    .from('leaderboard')
    .select('*')
    .range(offset, offset + limit - 1);

  if (error) {
    throw error;
  }

  return data || [];
};

/**
 * 리더보드 전체 통계 조회
 */
export const getLeaderboardStats = async (): Promise<LeaderboardStats> => {
  const { data, error } = await supabase.rpc('get_leaderboard_stats');

  if (error) {
    throw error;
  }

  return (
    data[0] || {
      total_users: 0,
      total_donations_count: 0,
      total_amount_donated: 0,
      average_donation: 0,
    }
  );
};

/**
 * 특정 사용자 주변 순위 조회
 * (해당 사용자 위아래 N명씩)
 */
export const getRankingsAroundUser = async (
  userId: string,
  range: number = 5
): Promise<LeaderboardEntry[]> => {
  // 1. 사용자의 현재 순위 조회
  const { data: userData, error: userError } = await supabase
    .from('leaderboard')
    .select('rank')
    .eq('id', userId)
    .single();

  if (userError || !userData) {
    throw userError || new Error('User not found in leaderboard');
  }

  const userRank = userData.rank as number;

  // 2. 순위 범위 계산
  const startRank = Math.max(1, userRank - range);
  const endRank = userRank + range;

  // 3. 해당 범위의 순위 조회
  const { data, error } = await supabase
    .from('leaderboard')
    .select('*')
    .gte('rank', startRank)
    .lte('rank', endRank)
    .order('rank', { ascending: true });

  if (error) {
    throw error;
  }

  return data || [];
};

/**
 * 리더보드 실시간 구독
 *
 * @param callback - 리더보드 변경 시 호출될 콜백 함수
 * @returns Unsubscribe 함수
 */
export const subscribeToLeaderboard = (
  callback: (payload: LeaderboardEntry[]) => void
): (() => void) => {
  // donations 테이블 변경 감지
  const subscription = supabase
    .channel('leaderboard-changes')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'donations',
      },
      async () => {
        // 기부가 발생하면 리더보드 재조회
        const updatedLeaderboard = await getTopRankers(10);
        callback(updatedLeaderboard);
      }
    )
    .subscribe();

  // Unsubscribe 함수 반환
  return () => {
    subscription.unsubscribe();
  };
};
