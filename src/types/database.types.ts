/**
 * Database Types
 *
 * Supabase 데이터베이스 타입 정의
 */

export interface User {
  id: string;
  nickname: string | null;
  total_donated: number;
  first_donation_at: string | null;
  last_donation_at: string | null;
  badge_earned: boolean;
  created_at: string;
  updated_at: string;
}

export interface Donation {
  id: string;
  nickname: string;
  amount: number;
  receipt_token: string;
  platform: 'google_play' | 'app_store';
  transaction_id?: string;
  created_at: string;
}

export interface LeaderboardEntry {
  id: string;
  nickname: string;
  total_donated: number;
  rank: number;
  last_donation_at: string | null;
  badge_earned: boolean;
  donation_count: number;
}

export interface LeaderboardStats {
  total_users: number;
  total_donations_count: number;
  total_amount_donated: number;
  average_donation: number;
}

// Insert types (for creating new records)
export type UserInsert = Omit<User, 'id' | 'created_at' | 'updated_at'>;
export type DonationInsert = Omit<Donation, 'id' | 'created_at'>;

// Update types (for updating existing records)
export type UserUpdate = Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>;
export type DonationUpdate = Partial<Omit<Donation, 'id' | 'created_at'>>;
