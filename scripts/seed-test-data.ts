/**
 * Supabase 테스트 데이터 생성 스크립트
 *
 * 실행 방법: npx tsx scripts/seed-test-data.ts
 */

import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

// 환경 변수 로딩
dotenv.config({ path: resolve(__dirname, '../.env') });

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ 환경 변수가 설정되지 않았습니다.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 테스트 사용자 데이터
const testUsers = [
  { nickname: '천원왕', donationCount: 10 },
  { nickname: '기부천사', donationCount: 8 },
  { nickname: '선행러', donationCount: 6 },
  { nickname: '착한사람', donationCount: 5 },
  { nickname: '익명의기부자', donationCount: 4 },
  { nickname: '행복전도사', donationCount: 3 },
  { nickname: '나눔이', donationCount: 3 },
  { nickname: '따뜻한마음', donationCount: 2 },
  { nickname: '감사합니다', donationCount: 2 },
  { nickname: '좋은하루', donationCount: 1 },
  { nickname: '첫기부', donationCount: 1 },
  { nickname: '응원합니다', donationCount: 1 },
];

/**
 * 랜덤 영수증 토큰 생성
 */
function generateReceiptToken(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `test_receipt_${timestamp}_${random}`;
}

/**
 * 랜덤 날짜 생성 (최근 30일 이내)
 */
function getRandomDate(): Date {
  const now = new Date();
  const daysAgo = Math.floor(Math.random() * 30);
  const hoursAgo = Math.floor(Math.random() * 24);
  const minutesAgo = Math.floor(Math.random() * 60);

  const date = new Date(now);
  date.setDate(date.getDate() - daysAgo);
  date.setHours(date.getHours() - hoursAgo);
  date.setMinutes(date.getMinutes() - minutesAgo);

  return date;
}

/**
 * 테스트 데이터 생성
 */
async function seedTestData() {
  console.log('🌱 테스트 데이터 생성 시작...\n');

  try {
    let totalUsers = 0;
    let totalDonations = 0;

    for (const testUser of testUsers) {
      console.log(`👤 사용자 생성: ${testUser.nickname} (${testUser.donationCount}회 기부)`);

      // 1. 사용자 생성
      const { data: user, error: userError } = await supabase
        .from('users')
        .insert({
          nickname: testUser.nickname,
          total_donated: 0, // 트리거가 자동 업데이트
          badge_earned: false,
        })
        .select()
        .single();

      if (userError) {
        console.error(`  ❌ 사용자 생성 실패:`, userError.message);
        continue;
      }

      console.log(`  ✅ 사용자 생성 완료: ${user.id}`);
      totalUsers++;

      // 2. 기부 내역 생성
      for (let i = 0; i < testUser.donationCount; i++) {
        const receiptToken = generateReceiptToken();
        const createdAt = getRandomDate();

        const { error: donationError } = await supabase.from('donations').insert({
          user_id: user.id,
          nickname: testUser.nickname,
          amount: 1000,
          receipt_token: receiptToken,
          platform: 'google_play',
          created_at: createdAt.toISOString(),
        });

        if (donationError) {
          console.error(`  ❌ 기부 내역 생성 실패:`, donationError.message);
          continue;
        }

        totalDonations++;
      }

      console.log(`  ✅ ${testUser.donationCount}개의 기부 내역 생성 완료\n`);

      // API 요청 제한을 피하기 위한 짧은 대기
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 테스트 데이터 생성 완료!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log(`✅ 총 ${totalUsers}명의 사용자 생성`);
    console.log(`✅ 총 ${totalDonations}개의 기부 내역 생성\n`);

    // 3. 리더보드 확인
    console.log('📊 리더보드 확인 중...\n');
    const { data: leaderboard, error: leaderboardError } = await supabase
      .from('leaderboard')
      .select('*')
      .order('rank', { ascending: true })
      .limit(10);

    if (leaderboardError) {
      throw leaderboardError;
    }

    console.log('🏆 상위 10명 리더보드:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('순위  닉네임           기부횟수  총액');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    leaderboard?.forEach((entry: any) => {
      const rank = String(entry.rank).padEnd(5);
      const nickname = entry.nickname.padEnd(15);
      const count = String(entry.donation_count).padEnd(9);
      const amount = `₩${entry.total_donated.toLocaleString()}`;

      console.log(`${rank} ${nickname} ${count} ${amount}`);
    });

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // 4. 통계 확인
    const { data: statsData, error: statsError } = await supabase.rpc('get_leaderboard_stats');

    if (statsError) {
      throw statsError;
    }

    const stats = statsData?.[0];

    console.log('📈 전체 통계:');
    console.log(`  - 전체 사용자: ${stats.total_users}명`);
    console.log(`  - 전체 기부 횟수: ${stats.total_donations_count}회`);
    console.log(`  - 전체 기부 금액: ₩${Number(stats.total_amount_donated).toLocaleString()}`);
    console.log(`  - 평균 기부 금액: ₩${Number(stats.average_donation).toLocaleString()}\n`);

    console.log('✅ 이제 앱에서 리더보드를 확인할 수 있습니다!\n');
  } catch (error: any) {
    console.error('\n❌ 테스트 데이터 생성 실패!');
    console.error('오류 내용:', error.message);

    if (error.details) {
      console.error('세부 정보:', error.details);
    }
    if (error.hint) {
      console.error('힌트:', error.hint);
    }

    console.error('\n🔧 해결 방법:');
    console.error('1. scripts/clean-test-data.ts를 실행하여 기존 데이터 정리');
    console.error('2. Supabase 마이그레이션이 정상 실행되었는지 확인');
    console.error('3. 닉네임 중복이 없는지 확인\n');
    process.exit(1);
  }
}

// 스크립트 실행
seedTestData();
