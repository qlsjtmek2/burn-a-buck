/**
 * User Service
 *
 * 사용자 관련 API 서비스 레이어
 */

import { supabase } from './supabase';
import type { User, UserInsert, UserUpdate } from '@/types/database.types';

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
 * 사용자 정보 업데이트
 */
export const updateUser = async (userId: string, updates: UserUpdate): Promise<User> => {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
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
 * 사용자의 현재 순위 조회
 */
export const getUserRank = async (
  userId: string
): Promise<{ rank: number; total_donated: number; nickname: string } | null> => {
  const { data, error } = await supabase.rpc('get_user_rank', {
    p_user_id: userId,
  });

  if (error) {
    throw error;
  }

  if (!data || data.length === 0) {
    return null;
  }

  return data[0];
};
