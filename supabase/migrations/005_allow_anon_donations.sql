-- ============================================
-- Migration: 005_allow_anon_donations
-- Description: 익명 사용자(anon)도 donations INSERT 가능하도록 정책 수정
-- Created: 2025-11-04
-- Reason: 앱에서 로그인 없이 기부 가능하도록
-- ============================================

-- 기존 정책 삭제
DROP POLICY IF EXISTS "Authenticated users can insert donations" ON donations;

-- 새 정책: 누구나 기부 가능 (anon + authenticated)
CREATE POLICY "Anyone can insert donations"
  ON donations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- anon 역할에게 INSERT 권한 명시적 부여 (이미 GRANT SELECT 있음)
GRANT INSERT ON donations TO anon;

-- 주석 업데이트
COMMENT ON POLICY "Anyone can insert donations" ON donations IS '누구나(익명 포함) 기부 내역 생성 가능';
