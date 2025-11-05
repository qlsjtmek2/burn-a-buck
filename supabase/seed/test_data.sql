-- ============================================
-- Test Data Seed Script for Phase 13 Animation Testing
-- Description: 리더보드 애니메이션 테스트를 위한 샘플 데이터
-- ============================================
--
-- 사용법:
-- 1. Supabase Dashboard → SQL Editor 열기
-- 2. 이 스크립트 전체를 붙여넣기
-- 3. RUN 버튼 클릭
--
-- 주의:
-- - user_id는 사용하지 않음 (nickname 기반 구조)
-- - donations INSERT 시 트리거가 자동으로 users 테이블 생성/업데이트
-- - 애니메이션 테스트를 위해 시간 간격을 둔 데이터 생성
-- ============================================

-- 기존 테스트 데이터 삭제 (선택사항)
-- DELETE FROM donations WHERE receipt_token LIKE 'test_%';
-- DELETE FROM users WHERE nickname IN ('천원왕', '기부천사', '선행러', '착한사람', '익명의기부자', '행복전도사', '나눔이', '따뜻한마음', '감사합니다', '좋은하루', '첫기부', '응원합니다', '사랑나눔', '희망이', '천사같은너');

-- ============================================
-- 1. Top Rankers 데이터 (1-3위)
-- ============================================

-- 1위: 천원왕 (10회 기부 = ₩10,000)
INSERT INTO donations (nickname, amount, receipt_token, platform, created_at) VALUES
  ('천원왕', 1000, 'test_cheonwonking_1', 'google_play', NOW() - INTERVAL '30 days'),
  ('천원왕', 1000, 'test_cheonwonking_2', 'google_play', NOW() - INTERVAL '28 days'),
  ('천원왕', 1000, 'test_cheonwonking_3', 'google_play', NOW() - INTERVAL '25 days'),
  ('천원왕', 1000, 'test_cheonwonking_4', 'google_play', NOW() - INTERVAL '22 days'),
  ('천원왕', 1000, 'test_cheonwonking_5', 'google_play', NOW() - INTERVAL '18 days'),
  ('천원왕', 1000, 'test_cheonwonking_6', 'google_play', NOW() - INTERVAL '15 days'),
  ('천원왕', 1000, 'test_cheonwonking_7', 'google_play', NOW() - INTERVAL '12 days'),
  ('천원왕', 1000, 'test_cheonwonking_8', 'google_play', NOW() - INTERVAL '8 days'),
  ('천원왕', 1000, 'test_cheonwonking_9', 'google_play', NOW() - INTERVAL '5 days'),
  ('천원왕', 1000, 'test_cheonwonking_10', 'google_play', NOW() - INTERVAL '2 days');

-- 2위: 기부천사 (8회 기부 = ₩8,000)
INSERT INTO donations (nickname, amount, receipt_token, platform, created_at) VALUES
  ('기부천사', 1000, 'test_angel_1', 'google_play', NOW() - INTERVAL '29 days'),
  ('기부천사', 1000, 'test_angel_2', 'google_play', NOW() - INTERVAL '26 days'),
  ('기부천사', 1000, 'test_angel_3', 'google_play', NOW() - INTERVAL '23 days'),
  ('기부천사', 1000, 'test_angel_4', 'google_play', NOW() - INTERVAL '19 days'),
  ('기부천사', 1000, 'test_angel_5', 'google_play', NOW() - INTERVAL '16 days'),
  ('기부천사', 1000, 'test_angel_6', 'google_play', NOW() - INTERVAL '11 days'),
  ('기부천사', 1000, 'test_angel_7', 'google_play', NOW() - INTERVAL '6 days'),
  ('기부천사', 1000, 'test_angel_8', 'google_play', NOW() - INTERVAL '3 days');

-- 3위: 선행러 (6회 기부 = ₩6,000)
INSERT INTO donations (nickname, amount, receipt_token, platform, created_at) VALUES
  ('선행러', 1000, 'test_gooddeed_1', 'google_play', NOW() - INTERVAL '27 days'),
  ('선행러', 1000, 'test_gooddeed_2', 'google_play', NOW() - INTERVAL '24 days'),
  ('선행러', 1000, 'test_gooddeed_3', 'google_play', NOW() - INTERVAL '20 days'),
  ('선행러', 1000, 'test_gooddeed_4', 'google_play', NOW() - INTERVAL '14 days'),
  ('선행러', 1000, 'test_gooddeed_5', 'google_play', NOW() - INTERVAL '9 days'),
  ('선행러', 1000, 'test_gooddeed_6', 'google_play', NOW() - INTERVAL '4 days');

-- ============================================
-- 2. 중간 순위 데이터 (4-9위)
-- ============================================

-- 4위: 착한사람 (5회 기부 = ₩5,000)
INSERT INTO donations (nickname, amount, receipt_token, platform, created_at) VALUES
  ('착한사람', 1000, 'test_goodperson_1', 'google_play', NOW() - INTERVAL '25 days'),
  ('착한사람', 1000, 'test_goodperson_2', 'google_play', NOW() - INTERVAL '21 days'),
  ('착한사람', 1000, 'test_goodperson_3', 'google_play', NOW() - INTERVAL '17 days'),
  ('착한사람', 1000, 'test_goodperson_4', 'google_play', NOW() - INTERVAL '10 days'),
  ('착한사람', 1000, 'test_goodperson_5', 'google_play', NOW() - INTERVAL '7 days');

-- 5위: 익명의기부자 (4회 기부 = ₩4,000)
INSERT INTO donations (nickname, amount, receipt_token, platform, created_at) VALUES
  ('익명의기부자', 1000, 'test_anonymous_1', 'google_play', NOW() - INTERVAL '26 days'),
  ('익명의기부자', 1000, 'test_anonymous_2', 'google_play', NOW() - INTERVAL '18 days'),
  ('익명의기부자', 1000, 'test_anonymous_3', 'google_play', NOW() - INTERVAL '13 days'),
  ('익명의기부자', 1000, 'test_anonymous_4', 'google_play', NOW() - INTERVAL '8 days');

-- 6위: 행복전도사 (3회 기부 = ₩3,000)
INSERT INTO donations (nickname, amount, receipt_token, platform, created_at) VALUES
  ('행복전도사', 1000, 'test_happiness_1', 'google_play', NOW() - INTERVAL '22 days'),
  ('행복전도사', 1000, 'test_happiness_2', 'google_play', NOW() - INTERVAL '15 days'),
  ('행복전도사', 1000, 'test_happiness_3', 'google_play', NOW() - INTERVAL '9 days');

-- 7위: 나눔이 (3회 기부 = ₩3,000)
INSERT INTO donations (nickname, amount, receipt_token, platform, created_at) VALUES
  ('나눔이', 1000, 'test_sharing_1', 'google_play', NOW() - INTERVAL '24 days'),
  ('나눔이', 1000, 'test_sharing_2', 'google_play', NOW() - INTERVAL '16 days'),
  ('나눔이', 1000, 'test_sharing_3', 'google_play', NOW() - INTERVAL '10 days');

-- 8위: 따뜻한마음 (2회 기부 = ₩2,000)
INSERT INTO donations (nickname, amount, receipt_token, platform, created_at) VALUES
  ('따뜻한마음', 1000, 'test_warmheart_1', 'google_play', NOW() - INTERVAL '20 days'),
  ('따뜻한마음', 1000, 'test_warmheart_2', 'google_play', NOW() - INTERVAL '12 days');

-- 9위: 감사합니다 (2회 기부 = ₩2,000)
INSERT INTO donations (nickname, amount, receipt_token, platform, created_at) VALUES
  ('감사합니다', 1000, 'test_thanks_1', 'google_play', NOW() - INTERVAL '19 days'),
  ('감사합니다', 1000, 'test_thanks_2', 'google_play', NOW() - INTERVAL '11 days');

-- ============================================
-- 3. Recent Donations 데이터 (최근 15개)
-- 시간 간격을 두고 생성하여 "N분 전", "N시간 전" 테스트
-- ============================================

-- 최근 1분 전
INSERT INTO donations (nickname, amount, receipt_token, platform, created_at) VALUES
  ('사랑나눔', 1000, 'test_recent_1', 'google_play', NOW() - INTERVAL '1 minute');

-- 최근 5분 전
INSERT INTO donations (nickname, amount, receipt_token, platform, created_at) VALUES
  ('희망이', 1000, 'test_recent_2', 'google_play', NOW() - INTERVAL '5 minutes');

-- 최근 15분 전
INSERT INTO donations (nickname, amount, receipt_token, platform, created_at) VALUES
  ('천사같은너', 1000, 'test_recent_3', 'google_play', NOW() - INTERVAL '15 minutes');

-- 최근 30분 전
INSERT INTO donations (nickname, amount, receipt_token, platform, created_at) VALUES
  ('좋은하루', 1000, 'test_recent_4', 'google_play', NOW() - INTERVAL '30 minutes');

-- 최근 1시간 전
INSERT INTO donations (nickname, amount, receipt_token, platform, created_at) VALUES
  ('첫기부', 1000, 'test_recent_5', 'google_play', NOW() - INTERVAL '1 hour');

-- 최근 2시간 전
INSERT INTO donations (nickname, amount, receipt_token, platform, created_at) VALUES
  ('응원합니다', 1000, 'test_recent_6', 'google_play', NOW() - INTERVAL '2 hours');

-- 최근 3시간 전
INSERT INTO donations (nickname, amount, receipt_token, platform, created_at) VALUES
  ('함께해요', 1000, 'test_recent_7', 'google_play', NOW() - INTERVAL '3 hours');

-- 최근 5시간 전
INSERT INTO donations (nickname, amount, receipt_token, platform, created_at) VALUES
  ('친절한사람', 1000, 'test_recent_8', 'google_play', NOW() - INTERVAL '5 hours');

-- 최근 8시간 전
INSERT INTO donations (nickname, amount, receipt_token, platform, created_at) VALUES
  ('베푸는마음', 1000, 'test_recent_9', 'google_play', NOW() - INTERVAL '8 hours');

-- 최근 12시간 전
INSERT INTO donations (nickname, amount, receipt_token, platform, created_at) VALUES
  ('행운가득', 1000, 'test_recent_10', 'google_play', NOW() - INTERVAL '12 hours');

-- 최근 1일 전
INSERT INTO donations (nickname, amount, receipt_token, platform, created_at) VALUES
  ('평화로운날', 1000, 'test_recent_11', 'google_play', NOW() - INTERVAL '1 day');

-- 최근 2일 전
INSERT INTO donations (nickname, amount, receipt_token, platform, created_at) VALUES
  ('빛나는별', 1000, 'test_recent_12', 'google_play', NOW() - INTERVAL '2 days');

-- 최근 3일 전
INSERT INTO donations (nickname, amount, receipt_token, platform, created_at) VALUES
  ('웃는얼굴', 1000, 'test_recent_13', 'google_play', NOW() - INTERVAL '3 days');

-- 최근 5일 전
INSERT INTO donations (nickname, amount, receipt_token, platform, created_at) VALUES
  ('기쁨전파', 1000, 'test_recent_14', 'google_play', NOW() - INTERVAL '5 days');

-- 최근 7일 전
INSERT INTO donations (nickname, amount, receipt_token, platform, created_at) VALUES
  ('소중한인연', 1000, 'test_recent_15', 'google_play', NOW() - INTERVAL '7 days');

-- ============================================
-- 4. 결과 확인 쿼리
-- ============================================

-- 리더보드 상위 10명 조회 (순위 카운팅 애니메이션 테스트)
SELECT
  rank,
  nickname,
  total_donated,
  donation_count,
  last_donation_at
FROM leaderboard
ORDER BY rank
LIMIT 10;

-- 최근 기부 내역 15개 조회 (Slide-in 애니메이션 테스트)
SELECT
  id,
  nickname,
  amount,
  created_at,
  CASE
    WHEN created_at > NOW() - INTERVAL '1 hour' THEN CONCAT(EXTRACT(MINUTE FROM NOW() - created_at)::INTEGER, '분 전')
    WHEN created_at > NOW() - INTERVAL '1 day' THEN CONCAT(EXTRACT(HOUR FROM NOW() - created_at)::INTEGER, '시간 전')
    ELSE CONCAT(EXTRACT(DAY FROM NOW() - created_at)::INTEGER, '일 전')
  END as time_ago
FROM donations
ORDER BY created_at DESC
LIMIT 15;

-- 전체 통계 조회
SELECT
  COUNT(DISTINCT nickname) as total_users,
  COUNT(*) as total_donations,
  SUM(amount) as total_amount
FROM donations;

-- ============================================
-- 애니메이션 테스트 가이드
-- ============================================
--
-- 1. Top-Down Fade-in 테스트:
--    - 앱 재시작 → MainScreen 진입
--    - Top Rankers (3개)와 Recent Donations (10개)가 순차적으로 fade-in
--    - 각 항목마다 120ms 간격으로 나타남
--
-- 2. 숫자 카운팅 테스트:
--    - 다른 기기나 Supabase Dashboard에서 기부 추가:
--      INSERT INTO donations (nickname, amount, receipt_token, platform)
--      VALUES ('천원왕', 1000, 'test_manual_' || gen_random_uuid(), 'google_play');
--    - 30초 대기 (React Query refetch interval)
--    - 순위 숫자가 카운팅되며 변경 (예: 1위 → 2위)
--
-- 3. Slide-in 애니메이션 테스트:
--    - Supabase Dashboard에서 새 기부 추가:
--      INSERT INTO donations (nickname, amount, receipt_token, platform)
--      VALUES ('신규후원자', 1000, 'test_new_' || gen_random_uuid(), 'google_play');
--    - 30초 대기
--    - Recent Donations 최상단에 새 항목이 slide-in
--    - 기존 항목들이 부드럽게 아래로 밀림
--
-- ============================================
