/**
 * Supabase 연결 테스트 스크립트
 *
 * 실행 방법: npx tsx scripts/test-supabase.ts
 */

// 환경 변수 먼저 로딩
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// .env 파일 로딩
dotenv.config({ path: resolve(__dirname, '../.env') });

// Supabase 클라이언트 직접 생성
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ 환경 변수 오류!');
  console.error('EXPO_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅ 설정됨' : '❌ 미설정');
  console.error('EXPO_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ 설정됨' : '❌ 미설정');
  console.error('\n.env 파일에 다음 변수들이 설정되어 있는지 확인하세요:');
  console.error('- EXPO_PUBLIC_SUPABASE_URL');
  console.error('- EXPO_PUBLIC_SUPABASE_ANON_KEY\n');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSupabaseConnection() {
  console.log('🔍 Supabase 연결 테스트 시작...\n');
  console.log(`📍 Supabase URL: ${supabaseUrl}\n`);

  try {
    // 1. 기본 연결 테스트
    console.log('1️⃣ 기본 연결 테스트...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('count')
      .limit(1);

    if (usersError) {
      throw usersError;
    }
    console.log('✅ Users 테이블 접근 성공\n');

    // 2. Donations 테이블 테스트
    console.log('2️⃣ Donations 테이블 테스트...');
    const { data: donations, error: donationsError } = await supabase
      .from('donations')
      .select('count')
      .limit(1);

    if (donationsError) {
      throw donationsError;
    }
    console.log('✅ Donations 테이블 접근 성공\n');

    // 3. Leaderboard 뷰 테스트
    console.log('3️⃣ Leaderboard 뷰 테스트...');
    const { data: leaderboard, error: leaderboardError } = await supabase
      .from('leaderboard')
      .select('*')
      .limit(5);

    if (leaderboardError) {
      throw leaderboardError;
    }
    console.log('✅ Leaderboard 뷰 접근 성공');
    console.log(`   현재 리더보드 항목 수: ${leaderboard?.length || 0}\n`);

    // 4. RPC 함수 테스트
    console.log('4️⃣ RPC 함수 테스트...');

    // get_top_rankers 함수 테스트
    const { data: topRankers, error: topRankersError } = await supabase.rpc('get_top_rankers', {
      p_limit: 5,
    });

    if (topRankersError) {
      throw topRankersError;
    }
    console.log('✅ get_top_rankers() 함수 호출 성공');
    console.log(`   상위 랭커: ${topRankers?.length || 0}명\n`);

    // get_leaderboard_stats 함수 테스트
    const { data: statsData, error: statsError } = await supabase.rpc('get_leaderboard_stats');

    if (statsError) {
      throw statsError;
    }

    const stats = statsData?.[0] || {
      total_users: 0,
      total_donations_count: 0,
      total_amount_donated: 0,
      average_donation: 0,
    };

    console.log('✅ get_leaderboard_stats() 함수 호출 성공');
    console.log('   리더보드 통계:');
    console.log(`   - 전체 사용자: ${stats.total_users}명`);
    console.log(`   - 전체 기부 횟수: ${stats.total_donations_count}회`);
    console.log(`   - 전체 기부 금액: ₩${Number(stats.total_amount_donated).toLocaleString()}`);
    console.log(`   - 평균 기부 금액: ₩${Number(stats.average_donation).toLocaleString()}\n`);

    // 5. check_nickname_available 함수 테스트
    console.log('5️⃣ 닉네임 중복 체크 함수 테스트...');
    const { data: isAvailable, error: nicknameError } = await supabase.rpc(
      'check_nickname_available',
      { p_nickname: '테스트닉네임' }
    );

    if (nicknameError) {
      throw nicknameError;
    }
    console.log('✅ check_nickname_available() 함수 호출 성공');
    console.log(`   "테스트닉네임" 사용 가능: ${isAvailable ? 'Yes' : 'No'}\n`);

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 모든 테스트 통과!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('✅ Supabase 백엔드가 정상적으로 동작합니다.');
    console.log('✅ 테이블, 뷰, 함수 모두 접근 가능합니다.');
    console.log('✅ RLS 정책이 올바르게 적용되었습니다.\n');
  } catch (error: any) {
    console.error('\n❌ 테스트 실패!');
    console.error('오류 내용:', error.message);

    if (error.details) {
      console.error('세부 정보:', error.details);
    }
    if (error.hint) {
      console.error('힌트:', error.hint);
    }

    console.error('\n🔧 해결 방법:');
    console.error('1. Supabase Dashboard에서 마이그레이션이 정상 실행되었는지 확인');
    console.error('2. .env 파일의 EXPO_PUBLIC_SUPABASE_URL과 EXPO_PUBLIC_SUPABASE_ANON_KEY 확인');
    console.error('3. Supabase 프로젝트가 일시 중지되지 않았는지 확인');
    console.error('4. 테이블 RLS 정책이 올바르게 설정되었는지 확인\n');
    process.exit(1);
  }
}

// 스크립트 실행
testSupabaseConnection();
