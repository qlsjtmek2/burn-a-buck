/**
 * Share Types
 *
 * 시스템 공유 기능 관련 타입 정의
 */

export interface ShareData {
  nickname: string;
  rank?: number;
  totalAmount: number;
  donationCount?: number;
}

export interface ShareMessage {
  title: string;
  message: string;
  url: string;
}
