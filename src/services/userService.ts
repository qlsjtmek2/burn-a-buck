/**
 * User Service
 *
 * 사용자 관련 API 서비스 레이어
 */

import { supabase } from './supabase';
import type { User, UserInsert, UserUpdate } from '../types/database.types';

/**
 * 닉네임으로 사용자 조회
 */
export const getUserByNickname = async (nickname: string): Promise<User | null> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('nickname', nickname)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      return null;
    }
    throw error;
  }

  return data;
};

/**
 * ID로 사용자 조회
 * @deprecated user_id 제거로 인해 getUserByNickname() 사용 권장
 */
export const getUserById = async (userId: string): Promise<User | null> => {
  const { data, error } = await supabase.from('users').select('*').eq('id', userId).single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw error;
  }

  return data;
};

/**
 * 새 사용자 생성
 */
export const createUser = async (user: UserInsert): Promise<User> => {
  const { data, error } = await supabase.from('users').insert(user).select().single();

  if (error) {
    throw error;
  }

  return data;
};

/**
 * 사용자 정보 업데이트 (nickname 기반)
 */
export const updateUser = async (nickname: string, updates: UserUpdate): Promise<User> => {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('nickname', nickname)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

/**
 * 닉네임 사용 가능 여부 확인
 */
export const checkNicknameAvailable = async (nickname: string): Promise<boolean> => {
  const { data, error } = await supabase.rpc('check_nickname_available', {
    p_nickname: nickname,
  });

  if (error) {
    throw error;
  }

  return data as boolean;
};

/**
 * 사용자의 현재 순위 조회 (nickname 기반)
 */
export const getUserRank = async (
  nickname: string
): Promise<{ rank: number; total_donated: number; nickname: string } | null> => {
  // RPC 함수 대신 leaderboard 뷰에서 직접 조회
  const { data, error } = await supabase
    .from('leaderboard')
    .select('rank, total_donated, nickname')
    .eq('nickname', nickname)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw error;
  }

  return data;
};
