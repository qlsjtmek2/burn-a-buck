/**
 * Share Service (Platform Router)
 *
 * 플랫폼과 환경에 따라 적절한 공유 서비스 구현을 선택합니다.
 *
 * - Expo Go (SHARE_TEST_MODE=true): shareService.expogo.ts (Mock)
 * - Development Build (SHARE_TEST_MODE=false): shareService.native.ts (Real)
 * - Web: shareService.web.ts (Web Share API)
 *
 * React Native의 Platform-specific extensions를 사용하여
 * 빌드 시점에 적절한 파일이 자동으로 선택됩니다.
 */

import { SHARE_TEST_MODE } from '../config/env';

/**
 * 플랫폼별 구현 선택
 *
 * React Native는 다음 순서로 파일을 찾습니다:
 * 1. .native.ts (Android/iOS)
 * 2. .ios.ts / .android.ts (플랫폼별)
 * 3. .web.ts (Web)
 * 4. .ts (기본)
 *
 * 하지만 Expo Go 환경에서는 네이티브 모듈이 없으므로
 * SHARE_TEST_MODE로 런타임에 선택합니다.
 */

let shareServiceImpl: any;

if (SHARE_TEST_MODE) {
  // Expo Go 환경: Mock 버전 사용
  console.log('[ShareService] Using Expo Go Mock implementation');
  shareServiceImpl = require('./shareService.expogo');
} else {
  // Development Build / Production: Real 버전 사용
  console.log('[ShareService] Using Native implementation');
  shareServiceImpl = require('./shareService.native');
}

// Export all functions from selected implementation
export const {
  shareToSocial,
  shareGeneral,
  shareToSMS,
  copyLink,
  shareToKakao,
  shareToPlatform,
} = shareServiceImpl;
