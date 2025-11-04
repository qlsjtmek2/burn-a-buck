-- ============================================
-- Migration: 002_rls_policies
-- Description: Row Level Security (RLS) 정책 설정
-- Created: 2025-11-03
-- ============================================

-- ============================================
-- Enable RLS on tables
-- ============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS Policies for 'users' table
-- ============================================

-- Policy: 누구나 사용자 정보를 읽을 수 있음 (리더보드 조회용)
CREATE POLICY "Anyone can read users"
  ON users
  FOR SELECT
  USING (true);

-- Policy: 인증된 사용자는 새 사용자 생성 가능
CREATE POLICY "Authenticated users can insert users"
  ON users
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Policy: 사용자는 자신의 정보만 업데이트 가능
-- Note: 기부 통계는 트리거로 자동 업데이트되므로 일반적으로 직접 업데이트 불필요
CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  USING (auth.uid()::text = id::text)
  WITH CHECK (auth.uid()::text = id::text);

-- ============================================
-- RLS Policies for 'donations' table
-- ============================================

-- Policy: 누구나 기부 내역을 읽을 수 있음 (리더보드 및 최근 기부자 조회용)
CREATE POLICY "Anyone can read donations"
  ON donations
  FOR SELECT
  USING (true);

-- Policy: 인증된 사용자는 기부 내역 생성 가능
CREATE POLICY "Authenticated users can insert donations"
  ON donations
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Policy: 기부 내역 수정/삭제 금지 (데이터 무결성 보장)
-- Note: 기부는 불변 데이터로 취급하며, 수정이나 삭제를 허용하지 않음

-- ============================================
-- Grant permissions
-- ============================================

-- Anon 사용자에게 읽기 권한 부여
GRANT SELECT ON users TO anon;
GRANT SELECT ON donations TO anon;
GRANT SELECT ON leaderboard TO anon;

-- Authenticated 사용자에게 읽기/쓰기 권한 부여
GRANT SELECT, INSERT, UPDATE ON users TO authenticated;
GRANT SELECT, INSERT ON donations TO authenticated;
GRANT SELECT ON leaderboard TO authenticated;

-- ============================================
-- Comments for policies
-- ============================================
COMMENT ON POLICY "Anyone can read users" ON users IS '누구나 사용자 정보 조회 가능 (리더보드)';
COMMENT ON POLICY "Authenticated users can insert users" ON users IS '인증된 사용자만 새 사용자 생성 가능';
COMMENT ON POLICY "Users can update own data" ON users IS '사용자는 자신의 정보만 업데이트 가능';
COMMENT ON POLICY "Anyone can read donations" ON donations IS '누구나 기부 내역 조회 가능';
COMMENT ON POLICY "Authenticated users can insert donations" ON donations IS '인증된 사용자만 기부 내역 생성 가능';
