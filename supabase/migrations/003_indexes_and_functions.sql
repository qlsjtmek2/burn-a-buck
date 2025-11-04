-- ============================================
-- Migration: 003_indexes_and_functions
-- Description: 인덱스 및 헬퍼 함수 생성
-- Created: 2025-11-03
-- ============================================

-- ============================================
-- Indexes for performance optimization
-- ============================================

-- users 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_users_nickname ON users(nickname);
CREATE INDEX IF NOT EXISTS idx_users_total_donated ON users(total_donated DESC);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC);

-- donations 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_donations_user_id ON donations(user_id);
CREATE INDEX IF NOT EXISTS idx_donations_receipt_token ON donations(receipt_token);
CREATE INDEX IF NOT EXISTS idx_donations_created_at ON donations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_donations_nickname ON donations(nickname);

-- ============================================
-- Function: get_user_rank
-- Description: 특정 사용자의 현재 순위 조회
-- ============================================
CREATE OR REPLACE FUNCTION get_user_rank(p_user_id UUID)
RETURNS TABLE (
  rank BIGINT,
  total_donated INTEGER,
  nickname VARCHAR(12)
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    l.rank,
    l.total_donated,
    l.nickname
  FROM leaderboard l
  WHERE l.id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Function: get_top_rankers
-- Description: 상위 N명의 랭커 조회 (기본 10명)
-- ============================================
CREATE OR REPLACE FUNCTION get_top_rankers(p_limit INTEGER DEFAULT 10)
RETURNS TABLE (
  id UUID,
  nickname VARCHAR(12),
  total_donated INTEGER,
  rank BIGINT,
  last_donation_at TIMESTAMP WITH TIME ZONE,
  badge_earned BOOLEAN,
  donation_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    l.id,
    l.nickname,
    l.total_donated,
    l.rank,
    l.last_donation_at,
    l.badge_earned,
    l.donation_count
  FROM leaderboard l
  ORDER BY l.rank
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Function: get_recent_donations
-- Description: 최근 N개의 기부 내역 조회 (기본 10개)
-- ============================================
CREATE OR REPLACE FUNCTION get_recent_donations(p_limit INTEGER DEFAULT 10)
RETURNS TABLE (
  id UUID,
  nickname VARCHAR(12),
  amount INTEGER,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    d.id,
    d.nickname,
    d.amount,
    d.created_at
  FROM donations d
  ORDER BY d.created_at DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Function: check_nickname_available
-- Description: 닉네임 중복 체크
-- ============================================
CREATE OR REPLACE FUNCTION check_nickname_available(p_nickname VARCHAR(12))
RETURNS BOOLEAN AS $$
DECLARE
  nickname_exists BOOLEAN;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM users WHERE nickname = p_nickname
  ) INTO nickname_exists;

  RETURN NOT nickname_exists;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Function: get_leaderboard_stats
-- Description: 리더보드 전체 통계 조회
-- ============================================
CREATE OR REPLACE FUNCTION get_leaderboard_stats()
RETURNS TABLE (
  total_users BIGINT,
  total_donations_count BIGINT,
  total_amount_donated BIGINT,
  average_donation INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(DISTINCT u.id)::BIGINT as total_users,
    COUNT(d.id)::BIGINT as total_donations_count,
    COALESCE(SUM(u.total_donated), 0)::BIGINT as total_amount_donated,
    COALESCE(AVG(d.amount), 0)::INTEGER as average_donation
  FROM users u
  LEFT JOIN donations d ON u.id = d.user_id
  WHERE u.total_donated > 0;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Comments for functions
-- ============================================
COMMENT ON FUNCTION get_user_rank(UUID) IS '특정 사용자의 현재 순위 조회';
COMMENT ON FUNCTION get_top_rankers(INTEGER) IS '상위 N명의 랭커 조회';
COMMENT ON FUNCTION get_recent_donations(INTEGER) IS '최근 N개의 기부 내역 조회';
COMMENT ON FUNCTION check_nickname_available(VARCHAR) IS '닉네임 사용 가능 여부 확인';
COMMENT ON FUNCTION get_leaderboard_stats() IS '리더보드 전체 통계 조회';
