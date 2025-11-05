/**
 * Share Types
 *
 * 공유 기능 관련 타입 정의
 */

export type SharePlatform =
  | 'kakao'
  | 'instagram'
  | 'facebook'
  | 'twitter'
  | 'sms'
  | 'copy_link'
  | 'more';

export interface SharePlatformOption {
  id: SharePlatform;
  label: string;
  icon: string; // Material Community Icons name
  color: string;
}

export interface ShareData {
  nickname: string;
  rank?: number;
  totalAmount: number;
  donationCount?: number;
}

export interface ShareResult {
  success: boolean;
  platform: SharePlatform;
  error?: string;
}

export interface ShareMessage {
  title: string;
  message: string;
  url: string;
}
