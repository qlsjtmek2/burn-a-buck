-- ============================================
-- Migration: 001_initial_schema
-- Description: 초기 데이터베이스 스키마 생성
-- Created: 2025-11-03
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Table: users
-- Description: 사용자 프로필 및 기부 통계
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nickname VARCHAR(12) UNIQUE,
  total_donated INTEGER DEFAULT 0 CHECK (total_donated >= 0),
  first_donation_at TIMESTAMP WITH TIME ZONE,
  last_donation_at TIMESTAMP WITH TIME ZONE,
  badge_earned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Table: donations
-- Description: 기부 내역 (영수증 기반)
-- ============================================
CREATE TABLE IF NOT EXISTS donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  nickname VARCHAR(12) NOT NULL,
  amount INTEGER DEFAULT 1000 CHECK (amount > 0),
  receipt_token TEXT UNIQUE NOT NULL,
  platform VARCHAR(20) DEFAULT 'google_play' CHECK (platform IN ('google_play', 'app_store')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- View: leaderboard
-- Description: 순위표 (총 기부 금액 기준 랭킹)
-- ============================================
CREATE OR REPLACE VIEW leaderboard AS
SELECT
  u.id,
  u.nickname,
  u.total_donated,
  RANK() OVER (ORDER BY u.total_donated DESC, u.first_donation_at ASC) as rank,
  u.last_donation_at,
  u.badge_earned,
  COUNT(d.id) as donation_count
FROM users u
LEFT JOIN donations d ON u.id = d.user_id
WHERE u.total_donated > 0
GROUP BY u.id, u.nickname, u.total_donated, u.first_donation_at, u.last_donation_at, u.badge_earned
ORDER BY rank;

-- ============================================
-- Trigger: update_updated_at
-- Description: updated_at 자동 업데이트
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Function: update_user_donation_stats
-- Description: 기부 발생 시 사용자 통계 자동 업데이트
-- ============================================
CREATE OR REPLACE FUNCTION update_user_donation_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE users
  SET
    total_donated = total_donated + NEW.amount,
    last_donation_at = NEW.created_at,
    first_donation_at = COALESCE(first_donation_at, NEW.created_at),
    badge_earned = CASE
      WHEN first_donation_at IS NULL THEN TRUE  -- 첫 기부 시 배지 획득
      ELSE badge_earned
    END
  WHERE id = NEW.user_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_user_donation_stats
  AFTER INSERT ON donations
  FOR EACH ROW
  EXECUTE FUNCTION update_user_donation_stats();

-- ============================================
-- Comments for documentation
-- ============================================
COMMENT ON TABLE users IS '사용자 프로필 및 기부 통계';
COMMENT ON TABLE donations IS '기부 내역 (Google Play/App Store 영수증 기반)';
COMMENT ON VIEW leaderboard IS '리더보드 뷰 (총 기부 금액 기준 순위)';

COMMENT ON COLUMN users.nickname IS '사용자 닉네임 (2-12자, 고유값)';
COMMENT ON COLUMN users.total_donated IS '총 기부 금액 (₩)';
COMMENT ON COLUMN users.badge_earned IS '첫 기부 배지 획득 여부';
COMMENT ON COLUMN donations.receipt_token IS 'Google Play/App Store 영수증 토큰 (고유값)';
COMMENT ON COLUMN donations.platform IS '결제 플랫폼 (google_play 또는 app_store)';
