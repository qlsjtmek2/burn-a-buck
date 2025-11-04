-- ============================================
-- Reset and Seed Database
-- Description: 데이터베이스 초기화 + 간단한 테스트 데이터 추가
-- Updated: 2025-11-05 (user_id 제거, nickname 기반)
-- ============================================
--
-- 사용 방법:
-- 1. Supabase Dashboard (https://supabase.com/dashboard) 접속
-- 2. 프로젝트 선택
-- 3. SQL Editor 메뉴 클릭
-- 4. 이 스크립트 전체를 복사하여 붙여넣기
-- 5. Run 버튼 클릭
--
-- ⚠️ 주의: 기존 데이터가 모두 삭제됩니다!
-- ============================================

-- ============================================
-- STEP 1: 기존 데이터 전체 삭제
-- ============================================
DELETE FROM donations;
DELETE FROM users;

-- ============================================
-- STEP 2: 테스트 데이터 추가 (트리거 활용)
-- ============================================
-- donations 테이블에 INSERT하면 트리거가 자동으로 users 생성/업데이트

-- 1등: 천원왕 (10,000원 = 10회 기부)
DO $$
BEGIN
  FOR i IN 1..10 LOOP
    INSERT INTO donations (nickname, amount, receipt_token, platform, created_at)
    VALUES (
      '천원왕',
      1000,
      'test_receipt_천원왕_' || i || '_' || extract(epoch from now())::bigint,
      'google_play',
      NOW() - (i * INTERVAL '1 day')  -- 최근 10일간 매일 기부
    );
  END LOOP;
END $$;

-- 2등: 기부천사 (7,000원 = 7회 기부)
DO $$
BEGIN
  FOR i IN 1..7 LOOP
    INSERT INTO donations (nickname, amount, receipt_token, platform, created_at)
    VALUES (
      '기부천사',
      1000,
      'test_receipt_기부천사_' || i || '_' || extract(epoch from now())::bigint,
      'google_play',
      NOW() - (i * INTERVAL '1 day')
    );
  END LOOP;
END $$;

-- 3등: 선행러 (5,000원 = 5회 기부)
DO $$
BEGIN
  FOR i IN 1..5 LOOP
    INSERT INTO donations (nickname, amount, receipt_token, platform, created_at)
    VALUES (
      '선행러',
      1000,
      'test_receipt_선행러_' || i || '_' || extract(epoch from now())::bigint,
      'google_play',
      NOW() - (i * INTERVAL '2 days')
    );
  END LOOP;
END $$;

-- 4등: 나눔이 (3,000원 = 3회 기부)
DO $$
BEGIN
  FOR i IN 1..3 LOOP
    INSERT INTO donations (nickname, amount, receipt_token, platform, created_at)
    VALUES (
      '나눔이',
      1000,
      'test_receipt_나눔이_' || i || '_' || extract(epoch from now())::bigint,
      'google_play',
      NOW() - (i * INTERVAL '3 days')
    );
  END LOOP;
END $$;

-- 5등: 좋은하루 (2,000원 = 2회 기부)
DO $$
BEGIN
  FOR i IN 1..2 LOOP
    INSERT INTO donations (nickname, amount, receipt_token, platform, created_at)
    VALUES (
      '좋은하루',
      1000,
      'test_receipt_좋은하루_' || i || '_' || extract(epoch from now())::bigint,
      'google_play',
      NOW() - (i * INTERVAL '4 days')
    );
  END LOOP;
END $$;

-- 최근 기부자들 (최근 10명)
DO $$
DECLARE
  nicknames TEXT[] := ARRAY['행복전도사', '미소천사', '온정이', '따뜻함', '희망이',
                            '사랑해요', '고마워요', '감사합니다', '축복', '평화'];
  nick TEXT;
  idx INT;
BEGIN
  idx := 1;
  FOREACH nick IN ARRAY nicknames
  LOOP
    INSERT INTO donations (nickname, amount, receipt_token, platform, created_at)
    VALUES (
      nick,
      1000,
      'test_receipt_' || nick || '_' || extract(epoch from now())::bigint,
      'google_play',
      NOW() - (idx * INTERVAL '1 hour')  -- 최근 10시간 동안 1시간 간격
    );
    idx := idx + 1;
  END LOOP;
END $$;

-- ============================================
-- STEP 3: 결과 확인
-- ============================================

SELECT '=== 리더보드 (Top 5) ===' as section;

-- 리더보드 확인 (1~5등)
SELECT
  nickname,
  total_donated,
  rank,
  last_donation_at,
  badge_earned,
  donation_count
FROM leaderboard
LIMIT 5;

SELECT '=== 최근 기부 내역 (최근 10건) ===' as section;

-- 최근 기부 내역 확인
SELECT
  nickname,
  amount,
  created_at,
  AGE(NOW(), created_at) as time_ago
FROM donations
ORDER BY created_at DESC
LIMIT 10;

SELECT '=== 전체 통계 ===' as section;

-- 전체 통계 (nickname 기반)
SELECT
  COUNT(DISTINCT nickname) as total_users,
  COUNT(*) as total_donations,
  SUM(amount) as total_amount
FROM donations;

SELECT '=== Users 테이블 확인 ===' as section;

-- Users 테이블 확인 (트리거로 자동 생성됨)
SELECT
  nickname,
  total_donated,
  first_donation_at,
  last_donation_at,
  badge_earned
FROM users
ORDER BY total_donated DESC
LIMIT 10;
