-- ============================================
-- Test Data Seed Script
-- Description: 리더보드 테스트를 위한 샘플 데이터
-- ============================================

-- 테스트 사용자 및 기부 내역 생성
-- 주의: 이 스크립트는 Supabase Dashboard의 SQL Editor에서 실행하세요

-- ============================================
-- 1. 천원왕 (10회 기부)
-- ============================================
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
      NOW() - (random() * INTERVAL '30 days')
    );
  END LOOP;
END $$;

-- ============================================
-- 2. 기부천사 (8회 기부)
-- ============================================
INSERT INTO users (nickname, total_donated, badge_earned)
VALUES ('기부천사', 0, false);

DO $$
DECLARE
  user_id UUID;
BEGIN
  SELECT id INTO user_id FROM users WHERE nickname = '기부천사';

  FOR i IN 1..8 LOOP
    INSERT INTO donations (user_id, nickname, amount, receipt_token, platform, created_at)
    VALUES (
      user_id,
      '기부천사',
      1000,
      'test_receipt_' || user_id || '_' || i,
      'google_play',
      NOW() - (random() * INTERVAL '30 days')
    );
  END LOOP;
END $$;

-- ============================================
-- 3. 선행러 (6회 기부)
-- ============================================
INSERT INTO users (nickname, total_donated, badge_earned)
VALUES ('선행러', 0, false);

DO $$
DECLARE
  user_id UUID;
BEGIN
  SELECT id INTO user_id FROM users WHERE nickname = '선행러';

  FOR i IN 1..6 LOOP
    INSERT INTO donations (user_id, nickname, amount, receipt_token, platform, created_at)
    VALUES (
      user_id,
      '선행러',
      1000,
      'test_receipt_' || user_id || '_' || i,
      'google_play',
      NOW() - (random() * INTERVAL '30 days')
    );
  END LOOP;
END $$;

-- ============================================
-- 4. 착한사람 (5회 기부)
-- ============================================
INSERT INTO users (nickname, total_donated, badge_earned)
VALUES ('착한사람', 0, false);

DO $$
DECLARE
  user_id UUID;
BEGIN
  SELECT id INTO user_id FROM users WHERE nickname = '착한사람';

  FOR i IN 1..5 LOOP
    INSERT INTO donations (user_id, nickname, amount, receipt_token, platform, created_at)
    VALUES (
      user_id,
      '착한사람',
      1000,
      'test_receipt_' || user_id || '_' || i,
      'google_play',
      NOW() - (random() * INTERVAL '30 days')
    );
  END LOOP;
END $$;

-- ============================================
-- 5. 익명의기부자 (4회 기부)
-- ============================================
INSERT INTO users (nickname, total_donated, badge_earned)
VALUES ('익명의기부자', 0, false);

DO $$
DECLARE
  user_id UUID;
BEGIN
  SELECT id INTO user_id FROM users WHERE nickname = '익명의기부자';

  FOR i IN 1..4 LOOP
    INSERT INTO donations (user_id, nickname, amount, receipt_token, platform, created_at)
    VALUES (
      user_id,
      '익명의기부자',
      1000,
      'test_receipt_' || user_id || '_' || i,
      'google_play',
      NOW() - (random() * INTERVAL '30 days')
    );
  END LOOP;
END $$;

-- ============================================
-- 6. 행복전도사 (3회 기부)
-- ============================================
INSERT INTO users (nickname, total_donated, badge_earned)
VALUES ('행복전도사', 0, false);

DO $$
DECLARE
  user_id UUID;
BEGIN
  SELECT id INTO user_id FROM users WHERE nickname = '행복전도사';

  FOR i IN 1..3 LOOP
    INSERT INTO donations (user_id, nickname, amount, receipt_token, platform, created_at)
    VALUES (
      user_id,
      '행복전도사',
      1000,
      'test_receipt_' || user_id || '_' || i,
      'google_play',
      NOW() - (random() * INTERVAL '30 days')
    );
  END LOOP;
END $$;

-- ============================================
-- 7. 나눔이 (3회 기부)
-- ============================================
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
      NOW() - (random() * INTERVAL '30 days')
    );
  END LOOP;
END $$;

-- ============================================
-- 8. 따뜻한마음 (2회 기부)
-- ============================================
INSERT INTO users (nickname, total_donated, badge_earned)
VALUES ('따뜻한마음', 0, false);

DO $$
DECLARE
  user_id UUID;
BEGIN
  SELECT id INTO user_id FROM users WHERE nickname = '따뜻한마음';

  FOR i IN 1..2 LOOP
    INSERT INTO donations (user_id, nickname, amount, receipt_token, platform, created_at)
    VALUES (
      user_id,
      '따뜻한마음',
      1000,
      'test_receipt_' || user_id || '_' || i,
      'google_play',
      NOW() - (random() * INTERVAL '30 days')
    );
  END LOOP;
END $$;

-- ============================================
-- 9. 감사합니다 (2회 기부)
-- ============================================
INSERT INTO users (nickname, total_donated, badge_earned)
VALUES ('감사합니다', 0, false);

DO $$
DECLARE
  user_id UUID;
BEGIN
  SELECT id INTO user_id FROM users WHERE nickname = '감사합니다';

  FOR i IN 1..2 LOOP
    INSERT INTO donations (user_id, nickname, amount, receipt_token, platform, created_at)
    VALUES (
      user_id,
      '감사합니다',
      1000,
      'test_receipt_' || user_id || '_' || i,
      'google_play',
      NOW() - (random() * INTERVAL '30 days')
    );
  END LOOP;
END $$;

-- ============================================
-- 10. 좋은하루 (1회 기부)
-- ============================================
INSERT INTO users (nickname, total_donated, badge_earned)
VALUES ('좋은하루', 0, false);

DO $$
DECLARE
  user_id UUID;
BEGIN
  SELECT id INTO user_id FROM users WHERE nickname = '좋은하루';

  INSERT INTO donations (user_id, nickname, amount, receipt_token, platform, created_at)
  VALUES (
    user_id,
    '좋은하루',
    1000,
    'test_receipt_' || user_id || '_1',
    'google_play',
    NOW() - (random() * INTERVAL '30 days')
  );
END $$;

-- ============================================
-- 11. 첫기부 (1회 기부)
-- ============================================
INSERT INTO users (nickname, total_donated, badge_earned)
VALUES ('첫기부', 0, false);

DO $$
DECLARE
  user_id UUID;
BEGIN
  SELECT id INTO user_id FROM users WHERE nickname = '첫기부';

  INSERT INTO donations (user_id, nickname, amount, receipt_token, platform, created_at)
  VALUES (
    user_id,
    '첫기부',
    1000,
    'test_receipt_' || user_id || '_1',
    'google_play',
    NOW() - (random() * INTERVAL '30 days')
  );
END $$;

-- ============================================
-- 12. 응원합니다 (1회 기부)
-- ============================================
INSERT INTO users (nickname, total_donated, badge_earned)
VALUES ('응원합니다', 0, false);

DO $$
DECLARE
  user_id UUID;
BEGIN
  SELECT id INTO user_id FROM users WHERE nickname = '응원합니다';

  INSERT INTO donations (user_id, nickname, amount, receipt_token, platform, created_at)
  VALUES (
    user_id,
    '응원합니다',
    1000,
    'test_receipt_' || user_id || '_1',
    'google_play',
    NOW() - (random() * INTERVAL '30 days')
  );
END $$;

-- ============================================
-- 결과 확인
-- ============================================

-- 리더보드 조회
SELECT * FROM leaderboard ORDER BY rank LIMIT 10;

-- 통계 조회
SELECT * FROM get_leaderboard_stats();
