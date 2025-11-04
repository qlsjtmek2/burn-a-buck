/**
 * Common TypeScript types for the application
 */

// User types
export interface User {
  id: string;
  nickname?: string;
  totalDonated: number;
  firstDonationAt?: string;
  lastDonationAt?: string;
  badgeEarned: boolean;
  createdAt: string;
}

// Donation types
export interface Donation {
  id: string;
  userId: string;
  nickname: string;
  amount: number;
  receiptToken: string;
  createdAt: string;
}

// Leaderboard types
export interface LeaderboardEntry {
  nickname: string;
  totalDonated: number;
  rank: number;
  lastDonationAt: string;
}

// Navigation types
export type RootStackParamList = {
  Onboarding: undefined;
  Main: undefined;
  Donation: undefined;
  ThankYou: { isFirstTime: boolean };
  Nickname: { donationId: string };
  DonationComplete: { nickname: string; rank: number; totalDonated: number };
};
