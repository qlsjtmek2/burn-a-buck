-- ============================================
-- Reset and Seed Database
-- Description: 데이터베이스 초기화 + 간단한 테스트 데이터 추가
-- ============================================
--
-- 사용 방법:
-- 1. Supabase Dashboard (https://supabase.com/dashboard) 접속
-- 2. 프로젝트 선택
-- 3. SQL Editor 메뉴 클릭
-- 4. 이 스크립트 전체를 복사하여 붙여넣기
-- 5. Run 버튼 클릭
--
-- ============================================

-- ============================================
-- STEP 1: 기존 데이터 전체 삭제
-- ============================================
DELETE FROM donations;
DELETE FROM users;

-- ============================================
-- STEP 2: 테스트 사용자 및 기부 데이터 추가
-- ============================================

-- 1등: 천원왕 (10,000원 = 10회 기부)
INSERT INTO users (nickname, total_donated, badge_earned)
VALUES ('천원왕', 0, false);

DO $$
DECLARE
  user_id UUID;
BEGIN
  SELECT id INTO user_id FROM users WHERE nickname = '천원왕';

  FOR i IN 1..10 LOOP
    INSERT INTO donations (user_id, nickname, amount, receipt_token, platform, created_at)
    VALUES (
      user_id,
      '천원왕',
      1000,
      'test_receipt_' || user_id || '_' || i,
      'google_play',
      NOW() - (i * INTERVAL '1 day')  -- 최근 10일간 매일 기부
    );
  END LOOP;
END $$;

-- 2등: 기부천사 (7,000원 = 7회 기부)
INSERT INTO users (nickname, total_donated, badge_earned)
VALUES ('기부천사', 0, false);

DO $$
DECLARE
  user_id UUID;
BEGIN
  SELECT id INTO user_id FROM users WHERE nickname = '기부천사';

  FOR i IN 1..7 LOOP
    INSERT INTO donations (user_id, nickname, amount, receipt_token, platform, created_at)
    VALUES (
      user_id,
      '기부천사',
      1000,
      'test_receipt_' || user_id || '_' || i,
      'google_play',
      NOW() - (i * INTERVAL '1 day')
    );
  END LOOP;
END $$;

-- 3등: 선행러 (5,000원 = 5회 기부)
INSERT INTO users (nickname, total_donated, badge_earned)
VALUES ('선행러', 0, false);

DO $$
DECLARE
  user_id UUID;
BEGIN
  SELECT id INTO user_id FROM users WHERE nickname = '선행러';

  FOR i IN 1..5 LOOP
    INSERT INTO donations (user_id, nickname, amount, receipt_token, platform, created_at)
    VALUES (
      user_id,
      '선행러',
      1000,
      'test_receipt_' || user_id || '_' || i,
      'google_play',
      NOW() - (i * INTERVAL '2 days')
    );
  END LOOP;
END $$;

-- 4등: 나눔이 (3,000원 = 3회 기부)
INSERT INTO users (nickname, total_donated, badge_earned)
VALUES ('나눔이', 0, false);

DO $$
DECLARE
  user_id UUID;
BEGIN
  SELECT id INTO user_id FROM users WHERE nickname = '나눔이';

  FOR i IN 1..3 LOOP
    INSERT INTO donations (user_id, nickname, amount, receipt_token, platform, created_at)
    VALUES (
      user_id,
      '나눔이',
      1000,
      'test_receipt_' || user_id || '_' || i,
      'google_play',
      NOW() - (i * INTERVAL '3 days')
    );
  END LOOP;
END $$;

-- 5등: 좋은하루 (2,000원 = 2회 기부)
INSERT INTO users (nickname, total_donated, badge_earned)
VALUES ('좋은하루', 0, false);

DO $$
DECLARE
  user_id UUID;
BEGIN
  SELECT id INTO user_id FROM users WHERE nickname = '좋은하루';

  FOR i IN 1..2 LOOP
    INSERT INTO donations (user_id, nickname, amount, receipt_token, platform, created_at)
    VALUES (
      user_id,
      '좋은하루',
      1000,
      'test_receipt_' || user_id || '_' || i,
      'google_play',
      NOW() - (i * INTERVAL '4 days')
    );
  END LOOP;
END $$;

-- ============================================
-- STEP 3: 결과 확인
-- ============================================

-- 리더보드 확인 (1~5등)
SELECT
  nickname,
  total_donated,
  RANK() OVER (ORDER BY total_donated DESC) as rank,
  last_donation_at
FROM users
WHERE total_donated > 0
ORDER BY total_donated DESC
LIMIT 5;

-- 최근 기부 내역 확인
SELECT
  nickname,
  amount,
  created_at,
  AGE(NOW(), created_at) as time_ago
FROM donations
ORDER BY created_at DESC
LIMIT 10;

-- 전체 통계
SELECT
  COUNT(DISTINCT user_id) as total_users,
  COUNT(*) as total_donations,
  SUM(amount) as total_amount
FROM donations;
