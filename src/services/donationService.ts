/**
 * Donation Service
 *
 * 기부 관련 API 서비스 레이어
 */

import { supabase } from './supabase';
import type { Donation, DonationInsert } from '@/types/database.types';

/**
 * 새 기부 내역 생성
 */
export const createDonation = async (donation: DonationInsert): Promise<Donation> => {
  const { data, error } = await supabase.from('donations').insert(donation).select().single();

  if (error) {
    throw error;
  }

  return data;
};

/**
 * 영수증 토큰으로 기부 내역 조회
 */
export const getDonationByReceipt = async (receiptToken: string): Promise<Donation | null> => {
  const { data, error } = await supabase
    .from('donations')
    .select('*')
    .eq('receipt_token', receiptToken)
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
 * 사용자의 기부 내역 조회
 */
export const getUserDonations = async (userId: string): Promise<Donation[]> => {
  const { data, error } = await supabase
    .from('donations')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data || [];
};

/**
 * 최근 기부 내역 조회
 */
export const getRecentDonations = async (
  limit: number = 10
): Promise<
  Array<{
    id: string;
    nickname: string;
    amount: number;
    created_at: string;
  }>
> => {
  const { data, error } = await supabase.rpc('get_recent_donations', {
    p_limit: limit,
  });

  if (error) {
    throw error;
  }

  return data || [];
};

/**
 * 사용자의 첫 기부인지 확인
 */
export const isFirstDonation = async (userId: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('donations')
    .select('id')
    .eq('user_id', userId)
    .limit(1);

  if (error) {
    throw error;
  }

  return !data || data.length === 0;
};
