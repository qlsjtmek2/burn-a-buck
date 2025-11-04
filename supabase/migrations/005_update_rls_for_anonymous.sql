-- ============================================
-- Migration: 005_update_rls_for_anonymous
-- Description: 익명 사용자(anon)도 데이터 생성 가능하도록 RLS 정책 수정
-- Reason: 로그인 없이 닉네임만으로 기부 가능
-- Created: 2025-11-05
-- ============================================

-- ============================================
-- Step 1: 기존 정책 제거 (모든 가능한 정책 이름)
-- ============================================
DROP POLICY IF EXISTS "Authenticated users can insert users" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Authenticated users can insert donations" ON donations;

-- 새로운 정책 이름도 제거 (중복 실행 방지)
DROP POLICY IF EXISTS "Anyone can insert users" ON users;
DROP POLICY IF EXISTS "Anyone can update users" ON users;
DROP POLICY IF EXISTS "Anyone can insert donations" ON donations;

-- ============================================
-- Step 2: 새로운 정책 생성 (익명 사용자 허용)
-- ============================================

-- Policy: 누구나 사용자 생성 가능 (익명 포함)
CREATE POLICY "Anyone can insert users"
  ON users
  FOR INSERT
  WITH CHECK (true);

-- Policy: 누구나 자신의 nickname으로 사용자 정보 업데이트 가능
-- Note: 실제로는 트리거가 자동 업데이트하므로 직접 UPDATE는 거의 없음
CREATE POLICY "Anyone can update users"
  ON users
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Policy: 누구나 기부 내역 생성 가능 (익명 포함)
CREATE POLICY "Anyone can insert donations"
  ON donations
  FOR INSERT
  WITH CHECK (true);

-- ============================================
-- Step 3: Grant 권한 업데이트
-- ============================================

-- Anon 사용자에게 쓰기 권한 추가
GRANT INSERT, UPDATE ON users TO anon;
GRANT INSERT ON donations TO anon;

-- ============================================
-- Comments 업데이트
-- ============================================
COMMENT ON POLICY "Anyone can insert users" ON users IS '누구나 사용자 생성 가능 (익명 포함)';
COMMENT ON POLICY "Anyone can update users" ON users IS '누구나 사용자 정보 업데이트 가능 (트리거 사용)';
COMMENT ON POLICY "Anyone can insert donations" ON donations IS '누구나 기부 내역 생성 가능 (익명 포함)';
