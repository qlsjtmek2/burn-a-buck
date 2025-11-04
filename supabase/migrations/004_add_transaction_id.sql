-- ============================================
-- Migration: 004_add_transaction_id
-- Description: donations 테이블에 transaction_id 컬럼 추가
-- Created: 2025-11-04
-- ============================================

-- transaction_id 컬럼 추가 (Google Play/App Store 거래 ID)
ALTER TABLE donations
ADD COLUMN IF NOT EXISTS transaction_id TEXT;

-- 인덱스 추가 (중복 거래 방지 및 조회 성능 향상)
CREATE INDEX IF NOT EXISTS idx_donations_transaction_id
  ON donations(transaction_id);

-- 주석 추가
COMMENT ON COLUMN donations.transaction_id IS 'Google Play/App Store 거래 ID (Transaction ID)';
