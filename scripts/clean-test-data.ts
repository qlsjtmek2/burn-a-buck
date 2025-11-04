/**
 * Supabase 테스트 데이터 삭제 스크립트
 *
 * 실행 방법: npx tsx scripts/clean-test-data.ts
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

/**
 * 테스트 데이터 정리
 */
async function cleanTestData() {
  console.log('🧹 테스트 데이터 삭제 시작...\n');

  try {
    // 1. 현재 데이터 수 확인
    const { data: donationsCount } = await supabase
      .from('donations')
      .select('count')
      .single();

    const { data: usersCount } = await supabase.from('users').select('count').single();

    console.log(`📊 현재 데이터 현황:`);
    console.log(`  - 기부 내역: ${donationsCount?.count || 0}개`);
    console.log(`  - 사용자: ${usersCount?.count || 0}명\n`);

    if (donationsCount?.count === 0 && usersCount?.count === 0) {
      console.log('✅ 삭제할 데이터가 없습니다.\n');
      return;
    }

    // 2. 기부 내역 삭제
    console.log('🗑️  기부 내역 삭제 중...');
    const { error: donationsError } = await supabase.from('donations').delete().neq('id', '');

    if (donationsError) {
      throw donationsError;
    }
    console.log('✅ 기부 내역 삭제 완료\n');

    // 3. 사용자 삭제
    console.log('🗑️  사용자 삭제 중...');
    const { error: usersError } = await supabase.from('users').delete().neq('id', '');

    if (usersError) {
      throw usersError;
    }
    console.log('✅ 사용자 삭제 완료\n');

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 테스트 데이터 삭제 완료!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // 4. 삭제 확인
    const { data: leaderboard } = await supabase.from('leaderboard').select('count').single();

    console.log(`✅ 리더보드 항목: ${leaderboard?.count || 0}개\n`);

    if (leaderboard?.count === 0) {
      console.log('✅ 모든 데이터가 성공적으로 삭제되었습니다.\n');
    }
  } catch (error: any) {
    console.error('\n❌ 데이터 삭제 실패!');
    console.error('오류 내용:', error.message);

    if (error.details) {
      console.error('세부 정보:', error.details);
    }
    if (error.hint) {
      console.error('힌트:', error.hint);
    }

    console.error('\n🔧 해결 방법:');
    console.error('1. Supabase Dashboard → Table Editor에서 수동으로 삭제');
    console.error('2. RLS 정책이 삭제를 허용하는지 확인');
    console.error('3. 데이터베이스 연결 상태 확인\n');
    process.exit(1);
  }
}

// 스크립트 실행
cleanTestData();
