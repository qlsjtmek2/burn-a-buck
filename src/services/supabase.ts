/**
 * Supabase Client Configuration
 *
 * React Native용 Supabase 클라이언트 초기화 및 설정
 */

import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 환경 변수 확인
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Supabase URL and Anon Key must be set in .env file.\n' +
      'Please check .env.example for reference.'
  );
}

/**
 * Supabase Client Instance
 *
 * React Native에 최적화된 설정:
 * - AsyncStorage를 사용한 세션 영속성
 * - 자동 토큰 갱신
 * - URL 감지 비활성화 (웹이 아니므로)
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

/**
 * Supabase 연결 테스트
 *
 * @returns Promise<boolean> - 연결 성공 여부
 */
export const testSupabaseConnection = async (): Promise<boolean> => {
  try {
    const { error } = await supabase.from('users').select('count').limit(1);

    if (error) {
      console.error('Supabase connection test failed:', error);
      return false;
    }

    console.log('Supabase connection successful');
    return true;
  } catch (err) {
    console.error('Supabase connection test error:', err);
    return false;
  }
};
