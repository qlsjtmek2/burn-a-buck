-- ============================================
-- Migration: 004_remove_user_id
-- Description: user_id 제거 및 nickname 기반 구조로 전환
-- Reason: 로그인 기능이 없으므로 user_id 불필요
-- Created: 2025-11-05
-- ============================================

-- ============================================
-- Step 1: 트리거 제거 (user_id 의존)
-- ============================================
DROP TRIGGER IF EXISTS trigger_update_user_donation_stats ON donations;
DROP FUNCTION IF EXISTS update_user_donation_stats();

-- ============================================
-- Step 2: 뷰 제거 (재생성 필요)
-- ============================================
DROP VIEW IF EXISTS leaderboard;

-- ============================================
-- Step 3: donations 테이블에서 user_id 제거
-- ============================================
ALTER TABLE donations DROP COLUMN IF EXISTS user_id;

-- ============================================
-- Step 4: leaderboard 뷰 재생성 (nickname 기반)
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
LEFT JOIN donations d ON u.nickname = d.nickname  -- user_id 대신 nickname으로 조인
WHERE u.total_donated > 0
GROUP BY u.id, u.nickname, u.total_donated, u.first_donation_at, u.last_donation_at, u.badge_earned
ORDER BY rank;

-- ============================================
-- Step 5: 트리거 재생성 (nickname 기반)
-- ============================================
CREATE OR REPLACE FUNCTION update_user_donation_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- nickname으로 users 테이블 업데이트
  UPDATE users
  SET
    total_donated = total_donated + NEW.amount,
    last_donation_at = NEW.created_at,
    first_donation_at = COALESCE(first_donation_at, NEW.created_at),
    badge_earned = CASE
      WHEN first_donation_at IS NULL THEN TRUE  -- 첫 기부 시 배지 획득
      ELSE badge_earned
    END
  WHERE nickname = NEW.nickname;

  -- users 테이블에 해당 nickname이 없으면 새로 생성
  IF NOT FOUND THEN
    INSERT INTO users (nickname, total_donated, first_donation_at, last_donation_at, badge_earned)
    VALUES (NEW.nickname, NEW.amount, NEW.created_at, NEW.created_at, TRUE);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_user_donation_stats
  AFTER INSERT ON donations
  FOR EACH ROW
  EXECUTE FUNCTION update_user_donation_stats();

-- ============================================
-- Step 6: 인덱스 추가 (성능 최적화)
-- ============================================
-- donations.nickname에 인덱스 추가 (JOIN 성능 향상)
CREATE INDEX IF NOT EXISTS idx_donations_nickname ON donations(nickname);

-- ============================================
-- Comments 업데이트
-- ============================================
COMMENT ON COLUMN donations.nickname IS '사용자 닉네임 (users 테이블과 연결)';
COMMENT ON VIEW leaderboard IS '리더보드 뷰 (nickname 기반, 총 기부 금액 순위)';
COMMENT ON FUNCTION update_user_donation_stats() IS '기부 발생 시 nickname으로 users 테이블 자동 업데이트';
