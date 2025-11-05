# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**"천원 쓰레기통" (Burn a Buck)** - A donation-based mobile app where users pay ₩1,000 to receive a thank you message and get registered on a leaderboard. Users compete for rankings based on total donations and can share their achievements with friends.

**Current Status**:
- Phase 7 ✅ Complete (Main Screen UI + Leaderboard)
- Phase 8 ✅ Complete (Payment Flow with Mock IAP)
- Phase 9 ✅ Complete (Thank You Screen with Animations)
- Phase 12 ✅ Complete (Social Sharing Feature)
- Phase 13 ✅ Complete (Leaderboard Animations)
- Phase 14 ✅ Complete (Error Handling & Edge Cases)
- **⚠️ Using Mock IAP**: Currently using simulated payments for Expo Go testing
- **Next Milestone**: Phase 17.5 - Migrate to real IAP with Development Build

**Tech Stack**:
- **Frontend**: React Native 0.81.5 + Expo SDK 54
- **UI Framework**: React Native Paper 5.14 (Material Design 3)
- **Navigation**: React Navigation 7 (Stack Navigator)
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Realtime)
- **State Management**: Zustand (client) + React Query (server state)
- **Payment**: react-native-iap v13 (⚠️ Mock mode - see `src/config/env.ts`)
  - Mock IAP for Expo Go development
  - Will upgrade to v14 + real IAP in Phase 17.5
- **Internationalization**: i18next + expo-localization
- **Animations**: React Native Reanimated 4.1
- **Sharing**: react-native-share (social media) + expo-clipboard (link copy)
- **Network Detection**: @react-native-community/netinfo (Expo Go compatible)

## Development Commands

### Core Commands
```bash
# Development
npm start                # Start Expo dev server (default: LAN mode)
npm run android          # Run on Android device/emulator
npm run ios              # Run on iOS (macOS only)
npm run web              # Run in browser

# Development with clean cache
npm run dev              # fresh-android with full cache clear
npm run fresh-android    # Kill Metro, clean cache, start Android
npm run fresh-start      # Kill Metro, clean cache, start dev server

# Debugging
npm run clean            # Clear Metro cache and temp files
npm run kill-metro       # Kill Metro bundler on port 8081
```

### Code Quality
```bash
npm run lint             # Run ESLint
npm run lint:fix         # Auto-fix ESLint issues
npm run format           # Format with Prettier
npm run format:check     # Check formatting without changes
npm run type-check       # TypeScript type checking (no emit)
```

### Expo-Specific Commands
```bash
# Install packages (use instead of npm install for Expo packages)
npx expo install <package-name>

# Check package compatibility
npx expo install --check
npx expo install --fix

# Run with tunnel (useful for network issues)
npx expo start --tunnel --clear

# Expo Doctor (diagnose issues)
npx expo-doctor
```

## Architecture & Design Patterns

### Code Quality Guidelines

**CRITICAL RULES**:
1. **Colors & Fonts**: ALWAYS use centralized values from `src/theme/`
   - Colors: `import { colors } from '../theme'`
   - Typography: `import { typography } from '../theme'`
   - ❌ NEVER hardcode: `color: '#F59E0B'` or `fontSize: 18`
2. **Error Handling**: ALWAYS use `src/utils/errorHandler.ts`
   - `showPaymentErrorAlert()` for payment errors
   - `showErrorAlert()` for general errors
   - `logError()` for error logging (prepares for Sentry)
3. **Type Safety**: Run `npm run type-check` before committing
   - All code must pass TypeScript compilation
   - Use proper type conversions for platform-specific APIs
   - Import types from `src/types/` for consistency

### Theme System (src/theme/)

**Implementation**: All colors and fonts must use the centralized theme system. Never hardcode values.

```typescript
// ✅ Correct
import { colors } from '../theme/colors';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
  },
  title: {
    color: colors.primary,
  },
});

// ❌ Wrong - Do not hardcode colors
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F9FAFB',  // Never do this!
  },
});
```

**Color Palette** (Amber single theme):
- `primary`: #F59E0B (amber-500) - Headers, titles, indicators
- `secondary`: #D97706 (amber-600) - Dark amber for secondary elements
- `accent`: #FBBF24 (amber-400) - CTA buttons ("여기에 천원 버리기")
- `success`: #10B981 (emerald-500) - Success messages
- `error`: #EF4444 (red-500) - Error messages
- Ranking colors: `gold`, `silver`, `bronze` (1st, 2nd, 3rd place)

**Theme Integration**:
- App wrapped with `PaperProvider` from React Native Paper
- Theme defined in `src/theme/index.ts` using Material Design 3
- Colors exported from `src/theme/colors.ts`

### State Management Strategy

**Three-layer approach**:
1. **Zustand** (`src/store/`): Client-side UI state, preferences, flags
2. **React Query** (`@tanstack/react-query`): Server state, caching, auto-refetch
3. **AsyncStorage**: Persistence (nickname, onboarding completion)

React Query configuration (App.tsx):
- Retry: 3 times for queries, 1 time for mutations
- Stale time: 5 minutes
- Cache time: 10 minutes

### Navigation Structure

**Stack Navigator** (`src/navigation/RootNavigator.tsx`):
- Initial route determined by onboarding completion check
- Screens: Onboarding → Main → Nickname → DonationComplete
- All screens use `headerShown: false` (custom headers)
- Background color controlled by theme (`colors.background`)

**Flow**:
1. First launch → Onboarding (2 slides)
2. After onboarding → Main screen
3. Donation → Nickname (if new) → DonationComplete

### Internationalization (i18n)

**Setup** (`src/config/i18n.ts`):
- Automatic language detection via `expo-localization`
- Fallback: Korean (ko)
- Supported: Korean (ko), English (en)
- Translation files: `src/locales/{ko,en}/translation.json`
- Language preference persisted in AsyncStorage

**Usage**:
```typescript
import { useTranslation } from 'react-i18next';

const { t } = useTranslation();
t('main.button.donate')  // Returns translated string
```

### Feature-Based Organization

**Current State**: ✅ **Feature-Based Migration Complete** (2025-11-04)

```
src/
├── features/              # ✅ Feature-based architecture (fully migrated)
│   ├── onboarding/        # Onboarding feature module
│   │   ├── screens/OnboardingScreen.tsx
│   │   ├── components/
│   │   │   ├── OnboardingSlide.tsx
│   │   │   ├── OnboardingPagination.tsx
│   │   │   └── OnboardingActions.tsx
│   │   └── hooks/useOnboarding.ts
│   ├── donation/          # Donation & payment feature module
│   │   ├── screens/DonationCompleteScreen.tsx
│   │   ├── components/
│   │   │   ├── PaymentErrorDialog.tsx
│   │   │   └── PaymentLoadingDialog.tsx
│   │   └── hooks/
│   │       ├── useDonationPayment.ts          # Platform router
│   │       ├── useDonationPayment.native.ts   # Android IAP
│   │       └── useDonationPayment.web.ts      # Web stub
│   ├── leaderboard/       # Leaderboard & main screen feature module
│   │   ├── screens/MainScreen.tsx
│   │   ├── components/
│   │   │   ├── TopRankersSection.tsx
│   │   │   └── RecentDonationsSection.tsx
│   │   └── hooks/useLeaderboard.ts
│   ├── nickname/          # Nickname input feature module
│   │   └── screens/NicknameScreen.tsx
├── components/            # ✨ NEW: Common reusable components
│   └── common/
│       ├── NetworkStatusBar.tsx  # Offline banner (Phase 14)
│       └── EmptyState.tsx        # Empty state UI (Phase 14)
├── hooks/                 # ✨ NEW: Global custom hooks
│   └── useNetworkStatus.ts       # Network state detection (Phase 14)
├── services/              # API clients (platform-specific when needed)
│   ├── payment/           # ✨ NEW: Modular payment service
│   │   ├── index.ts       # Platform router
│   │   ├── iap.native.ts  # IAP implementation
│   │   ├── iap.web.ts     # Web stub
│   │   ├── constants.ts   # Product IDs
│   │   └── validation.ts  # Receipt validation
│   ├── supabase.ts        # Supabase client initialization
│   ├── userService.ts     # User CRUD
│   ├── donationService.ts # Donation CRUD
│   ├── donationFlowService.ts  # Donation flow orchestration
│   ├── leaderboardService.ts
│   └── shareService.ts    # System share sheet (단일 shareGeneral 함수)
├── theme/                 # Theme system
│   ├── colors.ts          # Color palette (single source of truth)
│   ├── typography.ts      # Typography system
│   ├── leaderboardStyles.ts  # ✨ NEW: Common leaderboard styles
│   └── index.ts           # React Native Paper theme
├── navigation/            # Navigation config
├── locales/               # i18n translations (✅ updated with error keys)
│   ├── ko/
│   └── en/
├── config/                # App configuration
├── constants/             # App constants
│   ├── payment.ts         # Payment-related constants
│   └── storage.ts         # AsyncStorage keys
├── types/                 # TypeScript types
│   ├── navigation.ts      # Navigation params
│   ├── payment.ts         # ✨ UNIFIED: All payment types (merged from payment.types.ts)
│   ├── share.ts           # Share types (ShareData, ShareMessage)
│   └── database.types.ts  # Supabase types
└── utils/                 # Utilities
    ├── errorHandler.ts    # ✨ NEW: Centralized error handling
    ├── donationStorage.ts # ✨ NEW: AsyncStorage utilities for donations
    ├── onboarding.ts      # Onboarding helpers
    ├── shareTemplates.ts  # Share message template (createShareMessage)
    └── timeFormat.ts      # Time formatting
```

**✨ Recent Development (2025-11-05)**:

### Phase 14: 에러 처리 및 엣지 케이스 (2025-11-05)

**구현 내용**: 네트워크 오프라인 모드, 빈 상태 UI 개선

1. **Phase 14.1: 네트워크 상태 감지**:
   - ✅ @react-native-community/netinfo 패키지 추가 (Expo Go 호환 확인)
   - ✅ `useNetworkStatus` 훅 구현 (온라인/오프라인 감지)
   - ✅ `NetworkStatusBar` 컴포넌트 (오프라인 시 상단 배너 표시)
   - ✅ App.tsx에 통합

2. **Phase 14.2: 빈 상태 UI 개선**:
   - ✅ `EmptyState` 재사용 가능 컴포넌트 (이모지 + 제목 + 메시지)
   - ✅ TopRankersSection, RecentDonationsSection 빈 상태 개선
   - ✅ i18n 키 추가: `emptyState.topRanker`, `emptyState.recentDonations`
   - ❌ 인라인 빈 상태 코드 제거 (~20줄)

3. **타입 수정**:
   - ✅ `timeFormat.ts` getTimeAgo 시그니처 변경 (number 지원)

**결과**:
- **새 파일**: 3개 (2 컴포넌트 + 1 훅)
- **수정 파일**: 6개
- **추가 코드**: ~120줄
- **제거 코드**: ~20줄 (인라인 빈 상태)
- **순증가**: +100줄

**✅ 이미 구현된 기능** (추가 작업 불필요):
- **자동 재시도 로직**: React Query 설정 완료 (retry: 3)
- **결제 실패 다이얼로그**: PaymentErrorDialog 구현 완료
- **마지막 업데이트 시간**: 30초 자동 refetch로 불필요 (제거됨)

**핵심 설계 원칙**:
1. **기존 인프라 활용**: React Query의 retry, cache, staleTime 사용
2. **최소한의 코드**: Phase 12 교훈 적용 (단순함의 가치)
3. **재사용성**: EmptyState는 다른 화면에서도 사용 가능
4. **성능**: 추가 네트워크 요청 없음, React Query 캐시 활용
5. **불필요한 정보 제거**: 자동 업데이트 환경에서 "N초 전" 표시는 무의미

### Phase 12: 공유 기능 단순화 (2025-11-05)

**문제**: 복잡한 플랫폼 선택 UI (ShareBottomSheet)가 오히려 사용자 경험을 저해

**해결책**: 시스템 공유 시트 직접 사용으로 대폭 단순화

1. **UI 단순화**:
   - ❌ ShareBottomSheet 컴포넌트 삭제 (226줄)
   - ❌ useShare 훅 삭제 (96줄)
   - ❌ share feature 모듈 전체 삭제
   - ✅ 공유 버튼 클릭 → 시스템 공유 시트 바로 표시

2. **서비스 통합**:
   - ❌ shareService.expogo.ts, shareService.native.ts, shareService.web.ts 삭제
   - ✅ shareService.ts 단일 파일로 통합 (68줄)
   - ✅ `shareGeneral()` 함수 하나로 모든 공유 처리
   - ✅ Optional react-native-share with fallback to RN Share API

3. **타입 정리**:
   - ❌ SharePlatform, SharePlatformOption, ShareResult 제거
   - ✅ ShareData, ShareMessage 타입만 유지 (18줄)

4. **템플릿 단순화**:
   - ❌ createSMSMessage, createKakaoMessage 삭제
   - ✅ createShareMessage() 함수만 유지 (43줄)

5. **번역 키 정리**:
   - ❌ share.platform.*, share.copyLink.*, share.expoGoMode.*, share.kakao.*, share.error.* 삭제
   - ✅ share.template.* 키만 유지

**결과**:
- **코드 감소**: 1,218줄 삭제 (82% 감소)
- **파일 감소**: 6개 파일 삭제
- **최종 구조**: 3개 파일, 총 129줄
  - `shareService.ts` (68줄)
  - `shareTemplates.ts` (43줄)
  - `share.ts` (18줄)
- **UX 개선**: 복잡한 선택 UI 제거 → 직관적인 시스템 공유 시트

### Previous Refactoring (2025-11-04):
1. **Type Consolidation**: Merged `payment.types.ts` into `payment.ts` (single source of truth)
2. **Payment Service Reorganization**: Split into modular `src/services/payment/` directory
3. **Error Handler**: Created `src/utils/errorHandler.ts` with i18n support
4. **Component Extraction**: OnboardingScreen now uses 3 extracted components + custom hook
5. **Common Styles**: Created `leaderboardStyles.ts` for shared styling patterns
6. **TODO Cleanup**: Converted all TODO comments to placeholder references
7. **✅ TypeScript Errors Fixed**: All 18 type errors resolved
   - `ProductPurchase` ↔ `Purchase` type conversion implemented
   - `payment/index.ts` exports completed
   - Platform-specific type handling (React Navigation 7, i18n v3)
   - `npm run type-check` now passes without errors
8. **✅ Hook Simplification**: `useDonationPayment` refactored (186→164 lines)
   - AsyncStorage logic → `donationStorage.ts` utility
   - Hook now handles only UI state + Navigation
   - Improved separation of concerns
9. **✅ Feature-Based Architecture Migration** (Phase 2.1 완료):
   - All screens migrated: `src/screens/` → `src/features/*/screens/`
   - All components migrated: `src/components/` → `src/features/*/components/`
   - All hooks migrated: `src/hooks/` → `src/features/*/hooks/`
   - Import paths updated across entire codebase
   - TypeScript type-check passes: ✅
   - Old directories removed: `src/screens/`, `src/components/`, `src/hooks/`

**Architecture Benefits**:
- **Improved Modularity**: Each feature is self-contained (screens + components + hooks)
- **Better Scalability**: Easy to add new features without cross-contamination
- **Enhanced Maintainability**: Related code grouped together by business domain
- **Clearer Dependencies**: Import paths reflect feature relationships

## Database Schema (Supabase)

**⚠️ Updated 2025-11-05**: user_id 제거, nickname 기반 구조로 전환

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nickname VARCHAR(12) UNIQUE,
  total_donated INTEGER DEFAULT 0,
  first_donation_at TIMESTAMP,
  last_donation_at TIMESTAMP,
  badge_earned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Donations Table
```sql
CREATE TABLE donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nickname VARCHAR(12) NOT NULL,  -- ✅ No user_id (anonymous users)
  amount INTEGER DEFAULT 1000,
  receipt_token TEXT UNIQUE NOT NULL,
  platform VARCHAR(20) DEFAULT 'google_play',
  transaction_id TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index for performance
CREATE INDEX idx_donations_nickname ON donations(nickname);
```

### Leaderboard View
```sql
CREATE VIEW leaderboard AS
SELECT
  u.id,
  u.nickname,
  u.total_donated,
  RANK() OVER (ORDER BY u.total_donated DESC, u.first_donation_at ASC) as rank,
  u.last_donation_at,
  u.badge_earned,
  COUNT(d.id) as donation_count
FROM users u
LEFT JOIN donations d ON u.nickname = d.nickname  -- ✅ nickname-based join
WHERE u.total_donated > 0
GROUP BY u.id, u.nickname, u.total_donated, u.first_donation_at, u.last_donation_at, u.badge_earned
ORDER BY rank;
```

**Key Changes**:
- ❌ `user_id` removed (no authentication required)
- ✅ `nickname` is the sole identifier
- ✅ Trigger auto-creates/updates `users` table from `donations`
- ✅ RLS policies allow anonymous inserts

**Service Layer**: All database operations go through service files in `src/services/`. Never write raw SQL in components.

## Critical Implementation Patterns

### Payment Flow (Implemented - Platform-specific with Mock IAP)

**⚠️ Current Mode: Mock IAP for Expo Go Development**
- **Status**: Using simulated payments to test full flow without real IAP
- **Configuration**: `src/config/env.ts` - `IAP_TEST_MODE = __DEV__`
- **Benefits**:
  - ✅ Test in Expo Go without Development Build
  - ✅ Supabase integration works with real data
  - ✅ Complete payment flow validation
  - ✅ Faster development iteration
- **Migration Plan**: Phase 17.5 - Switch to real IAP with Development Build

**Architecture**:
- Platform abstraction via `payment.ts` → `payment.native.ts` / `payment.web.ts`
- Custom hook: `useDonationPayment` manages entire flow
- Error/Loading states via dedicated dialog components
- **Mock/Real IAP toggled by `IAP_TEST_MODE`** (see `src/config/env.ts`)

**Flow** (implemented in `useDonationPayment.native.ts`):
1. Initialize payment service on mount
   - **Mock mode**: Skip IAP connection
   - **Real mode**: Connect to Google Play Billing
2. Get saved nickname or navigate to Nickname screen
3. Purchase via `paymentService.purchaseDonation(nickname)`
   - **Mock mode**: Generate fake Purchase object (0.5s delay)
   - **Real mode**: Request purchase from Google Play
   - Load product: `donate_1000won`
   - **First donation check**: PaymentService checks database (Single Source of Truth)
   - Validate receipt (mock receipts always valid)
4. Save to Supabase (donations + users tables) - **Always real**
5. Navigate to DonationComplete screen with params:
   - `nickname`: string
   - `amount`: 1000
   - `isFirstDonation`: boolean (from PaymentService result)

**Key Files**:
- `src/config/env.ts` - **⚠️ IAP mode configuration**
- `src/services/payment.ts` - Platform routing
- `src/services/payment.native.ts` - Android IAP with Mock/Real mode
- `src/services/payment.web.ts` - Web placeholder
- `src/hooks/useDonationPayment.native.ts` - Payment flow hook
- `src/components/PaymentErrorDialog.tsx` - Error handling UI
- `src/components/PaymentLoadingDialog.tsx` - Loading UI

**Status Types** (see `src/types/payment.ts`):
```typescript
type PaymentStatus =
  | 'idle'
  | 'initializing'
  | 'loading_products'
  | 'purchasing'
  | 'validating'
  | 'saving'
  | 'success'
  | 'error';
```

**Error Codes**:
- `E_USER_CANCELLED` - User cancelled payment
- `E_NETWORK_ERROR` - Network connection issue
- `E_VALIDATION_ERROR` - Receipt validation failed
- `E_UNKNOWN_ERROR` - Unexpected error

Product ID: `donate_1000won` (₩1,000)

### Share Flow (Simplified - System Share Sheet)

**Current Implementation**: 단순 시스템 공유 시트 사용 (2025-11-05)

**Architecture**:
- **Single File**: `src/services/shareService.ts` (68줄)
- **Single Function**: `shareGeneral(data: ShareData)` - 시스템 공유 시트 표시
- **Optional Dependency Pattern**: react-native-share를 optional로 로드, 실패 시 React Native 내장 Share API로 자동 폴백

**Implementation**:
```typescript
// shareService.ts
let Share: any = null;
let shareAvailable = false;

try {
  Share = require('react-native-share').default;
  shareAvailable = true;
} catch (error) {
  shareAvailable = false;
}

export const shareGeneral = async (data: ShareData): Promise<void> => {
  const { title, message, url } = createShareMessage(data);
  const fullMessage = `${message}\n\n${url}`;

  if (shareAvailable && Share) {
    // react-native-share 사용 (Development Build)
    await Share.open({ title, message: fullMessage, url });
  } else {
    // React Native 내장 Share API 사용 (Expo Go)
    const { Share: RNShare } = require('react-native');
    await RNShare.share({ title, message: fullMessage }, { dialogTitle: title });
  }
};
```

**Usage in DonationCompleteScreen**:
```typescript
import { shareGeneral } from '../../../services/shareService';

const handleShareButtonPress = async () => {
  await shareGeneral(shareData);
};
```

**Key Files**:
- `src/services/shareService.ts` - 시스템 공유 시트 서비스
- `src/utils/shareTemplates.ts` - 공유 메시지 템플릿 생성
- `src/types/share.ts` - ShareData, ShareMessage 타입

**Benefits**:
- ✅ **단순성**: 복잡한 플랫폼 선택 UI 제거
- ✅ **호환성**: Expo Go와 Development Build 모두 지원
- ✅ **직관성**: 사용자가 익숙한 시스템 공유 시트 사용
- ✅ **유지보수성**: 1,218줄 감소 (82% 코드 감소)

### First Donation Detection (Updated 2025-11-05)

**⚠️ Major Refactoring**: user_id 제거, nickname 기반 구조로 전환

**Previous Problem**:
- 익명 사용자의 첫 후원 시 배지와 감사 메시지가 두 번째 후원에 표시되는 문제
- 원인: `user_id`가 null이므로 DB에서 이전 기부를 찾지 못함

**Solution**: nickname 기반 첫 기부 체크
1. **DB 스키마 변경**: `donations.user_id` 컬럼 제거
2. **checkFirstDonation() 수정**: nickname 파라미터 추가, nickname으로 donations 테이블 조회
3. **트리거 업데이트**: nickname 기반으로 users 테이블 자동 생성/업데이트
4. **RLS 정책**: 익명 사용자도 INSERT 가능

**Implementation** (`src/services/payment.native.ts` Line 516-556):
```typescript
private async checkFirstDonation(nickname: string): Promise<boolean> {
  // nickname으로 기부 내역 조회 (인증 불필요)
  const { data: donations, error } = await supabase
    .from('donations')
    .select('id')
    .eq('nickname', nickname)  // ✅ nickname 기반 체크
    .limit(1);

  if (error) {
    // 에러 시 AsyncStorage fallback
    const firstDonationDate = await AsyncStorage.getItem(STORAGE_KEYS.FIRST_DONATION);
    return !firstDonationDate;
  }

  // 기부 내역이 없으면 첫 기부
  return !donations || donations.length === 0;
}
```

**Key Changes**:
- ❌ **user_id 제거**: 로그인 없이 nickname만으로 식별
- ✅ **nickname 기반**: 모든 쿼리가 nickname 사용
- ✅ **트리거 자동화**: donations INSERT 시 users 자동 생성/업데이트
- ✅ **익명 지원**: RLS 정책으로 anon 사용자 INSERT 허용

**Files Modified** (2025-11-05):
- **DB Migrations**: `004_remove_user_id.sql`, `005_update_rls_for_anonymous.sql`
- **Services**: `userService.ts`, `donationService.ts`, `donationFlowService.ts`
- **PaymentService**: `payment.native.ts` (checkFirstDonation, saveDonationToSupabase)
- **Types**: `database.types.ts` (Donation interface)
- **Documentation**: `supabase/MIGRATION_GUIDE.md`

### Leaderboard Updates
- Polling: React Query with `refetchInterval: 30000` (30s)
- Alternative: Supabase Realtime subscriptions for instant updates
- Caching: Offline mode with "Last updated" timestamp

### Error Handling Strategy
- Network errors: Offline mode with cached data
- Payment failures: Retry dialog with clear messages
- Nickname conflicts: Confirmation dialog
- Network requests: 3 automatic retries (React Query default)

### Nickname Validation
- Length: 2-12 characters
- Duplicate detection: Check Supabase before saving
- Storage: AsyncStorage for persistence
- Key: `STORAGE_KEYS.NICKNAME` from `src/constants/storage.ts`

## Development Guidelines

### Platform-Specific Implementation Pattern

**When to use**:
- Features requiring native APIs (payments, camera, location, etc.)
- Web fallback needed for testing in browser

**Pattern**:
1. Create base service: `src/services/feature.ts` (exports common interface)
2. Native implementation: `src/services/feature.native.ts`
3. Web stub: `src/services/feature.web.ts`
4. React Native auto-resolves `.native.ts` on mobile, `.web.ts` on web

**Example** (Payment Service):
```typescript
// payment.ts - Export interface
export { paymentService } from './payment.native';

// payment.native.ts - Android implementation
import { initConnection, requestPurchase } from 'react-native-iap';

export const paymentService = {
  async purchaseDonation(nickname: string) {
    // Real IAP implementation
  }
};

// payment.web.ts - Web stub
export const paymentService = {
  async purchaseDonation(nickname: string) {
    throw new Error('Payment not supported on web');
  }
};
```

**Usage in Components**:
```typescript
// Import from base file - platform resolution automatic
import { paymentService } from '../services/payment';

// Works on both platforms
await paymentService.purchaseDonation('nickname');
```

### Onboarding Pattern
Onboarding completion tracked via AsyncStorage:
- Key: `STORAGE_KEYS.ONBOARDING_COMPLETED`
- Checked in `RootNavigator.tsx` on app start
- Functions: `checkOnboardingCompleted()`, `setOnboardingCompleted()` in `src/utils/onboarding.ts`

### Expo Updates Configuration
**IMPORTANT**: OTA updates are disabled in development (`app.json`):
```json
{
  "updates": {
    "enabled": false,
    "checkAutomatically": "NEVER"
  }
}
```

This prevents "Failed to download remote update" errors during development. Re-enable for production.

### Common Troubleshooting

**Android "Failed to download remote update" error**:
1. Ensure `updates.enabled: false` in app.json
2. Clear app data: `adb uninstall host.exp.exponent`
3. Clean cache: `npm run clean`
4. Restart with tunnel: `npx expo start --tunnel --clear`

**Metro bundler issues**:
```bash
npm run kill-metro      # Kill port 8081
npm run clean           # Clear cache
npm run fresh-start     # Full restart
```

**Package version conflicts**:
```bash
npx expo install --check    # Check compatibility
npx expo install --fix      # Auto-fix versions
```

## Refactoring Insights

### Lessons Learned (2025-11-04 Refactoring)

**작업 내용**: Phase 1-3 완료 + Phase 2.1 Feature-Based 아키텍처 마이그레이션 (총 7시간)

#### 잘한 점 (Best Practices)

1. **점진적 접근 (Incremental Approach)**
   - 작은 단위로 리팩토링하여 리스크 최소화
   - 각 단계마다 TypeScript 타입 체크로 검증
   - 문제 발생 시 롤백 가능한 구조 유지

2. **타입 안정성 우선 (Type Safety First)**
   - 단일 소스 타입 정의: `payment.types.ts` 제거 → `payment.ts` 통합
   - 모든 변경 후 `npm run type-check` 실행
   - Platform-specific 타입 처리 (React Navigation 7, i18n v3)

3. **명확한 책임 분리 (Clear Separation of Concerns)**
   - Hook: UI 상태 + Navigation만 담당
   - Service: 비즈니스 로직
   - Util: 재사용 가능한 유틸리티
   - AsyncStorage 로직 → `donationStorage.ts` 분리

4. **컴포넌트 분해 (Component Extraction)**
   - OnboardingScreen: 285 lines → 98 lines (65% 감소)
   - 3개의 재사용 가능한 컴포넌트 추출
   - Custom hook으로 로직 분리 (`useOnboarding.ts`)

5. **Feature 모듈화 (Feature-Based Architecture)**
   - 16개 파일 이동 (screens: 4, components: 7, hooks: 5)
   - Business domain 기준으로 코드 그룹화
   - 각 feature가 독립적으로 관리됨 (screens + components + hooks)

6. **문서화 (Documentation)**
   - CLAUDE.md 즉시 업데이트
   - 변경사항 상세 기록
   - 아키텍처 다이어그램 최신 상태 유지

#### Feature-Based 구조의 장점

1. **모듈성 (Modularity)**
   - 각 feature가 독립적으로 관리됨
   - 관련 코드가 한곳에 모여 있어 찾기 쉬움

2. **확장성 (Scalability)**
   - 새 feature 추가 시 다른 코드에 영향 없음
   - Feature 단위로 팀 협업 가능

3. **유지보수성 (Maintainability)**
   - Business domain 기준으로 코드 검색
   - 기능 제거 시 feature 디렉토리만 삭제

4. **의존성 명확화 (Clear Dependencies)**
   - Import 경로로 feature 간 관계 파악
   - 순환 의존성 감지 용이

#### 개선이 필요한 점

1. **테스트 커버리지 부재**
   - 리팩토링 전 테스트 작성 필요
   - 회귀 테스트로 안전성 확보
   - 향후 E2E 테스트 추가 계획

2. **점진적 마이그레이션 전략**
   - 한 번에 모든 파일 이동보다는 feature 단위로 점진적 이동 고려
   - 하이브리드 구조 (old + new) 일시적 허용

#### 핵심 인사이트

1. **TypeScript는 리팩토링의 든든한 보험**
   - 타입 체크로 대부분의 실수를 사전에 방지
   - Import 경로 변경 시 컴파일 에러로 누락 감지

2. **작은 단계로 자주 검증**
   - 큰 변경을 작은 단계로 분해
   - 각 단계마다 컴파일 + 실행 확인

3. **문서화는 미래의 나를 위한 투자**
   - 리팩토링 이유와 과정 기록
   - 다음 리팩토링 시 참고 자료로 활용

4. **Feature-Based는 확장 가능한 구조**
   - 초기 설정 비용은 있지만 장기적으로 유리
   - 팀 규모가 커질수록 더 큰 효과

### Lessons Learned (2025-11-05 공유 기능 단순화)

**작업 내용**: 복잡한 공유 UI 제거, 시스템 공유 시트 직접 사용 (1,218줄 감소, 82%)

#### 핵심 인사이트

1. **단순함의 가치 (Value of Simplicity)**
   - 복잡한 플랫폼 선택 UI (ShareBottomSheet)가 오히려 사용자 경험 저해
   - 사용자가 익숙한 시스템 공유 시트가 더 직관적
   - "기능이 많다 = 좋다"는 착각에서 벗어나기

2. **코드 감소 = 유지보수 향상 (Less Code = Better Maintenance)**
   - 1,218줄 감소로 버그 발생 가능성 대폭 감소
   - 읽어야 할 코드가 적을수록 이해하기 쉬움
   - 6개 파일 삭제로 파일 탐색 시간 절약

3. **Optional Dependency Pattern**
   - `try-catch`로 네이티브 모듈을 optional로 처리
   - Expo Go 호환성 확보 (fallback to RN Share API)
   - 런타임에 환경에 맞는 구현 자동 선택
   ```typescript
   try {
     Share = require('react-native-share').default;
     shareAvailable = true;
   } catch (error) {
     shareAvailable = false; // Fallback to RN Share
   }
   ```

4. **"사용자가 원하는 것"을 정확히 파악**
   - 처음 요구사항: "공유 기능 추가"
   - 초기 구현: 7개 플랫폼 선택 UI + 복잡한 라우팅
   - 실제 필요: 시스템 공유 시트로 간단히 공유
   - **교훈**: 요구사항의 본질을 파악하고 최소한으로 구현

5. **리팩토링은 "빼기"의 예술**
   - 기능을 추가하는 것보다 제거하는 것이 더 어려움
   - 하지만 제거할 때 가장 큰 가치가 생김
   - 정기적으로 "이 코드가 정말 필요한가?" 질문하기

### Lessons Learned (2025-11-05 Phase 13 애니메이션 최적화)

**작업 내용**: Top-Down Fade-in 애니메이션 제거, 핵심 애니메이션만 유지 (52줄 감소)

#### 핵심 인사이트

1. **장식적 vs 기능적 애니메이션 구분**
   - **장식적**: Top-Down Fade-in (제거됨)
     - 목적: "예쁘게 보이기"
     - 문제: 앱 열 때마다 실행 → 반복 피로감
     - 비용: 콘텐츠 접근 지연 (10번째 항목: 1초+)
   - **기능적**: 순위 카운팅 + 새 후원자 Slide-in (유지됨)
     - 목적: 정보 전달 (순위 변화, 실시간 업데이트)
     - 효과: 사용자 인게이지먼트 향상
     - 비용: 필요한 순간에만 실행

2. **반복 사용 패턴 고려**
   ```
   Day 1: "와 애니메이션 멋지네!" ✅
   Day 2: "음, 괜찮네" ✅
   Day 3: "..." 😐
   Day 7: "이거 건너뛸 수 없나?" 😤
   ```
   - 첫 인상보다 장기 사용성이 중요
   - 소셜 미디어 앱(Instagram, Twitter)이 초기 애니메이션 없는 이유

3. **앱의 핵심 가치 우선순위**
   - 천원 쓰레기통의 목표: "빨리 내 순위 확인"
   - 애니메이션이 목표 달성을 방해하면 안 됨
   - 프리미엄 느낌 < 빠른 접근성

4. **객관적 분석의 중요성**
   - 구현 완료 후에도 "필요한가?" 질문
   - 비용-효과 분석:
     - 비용: 복잡도(52줄), 지연(1초+), 반복 피로감
     - 효과: 첫 인상 개선 (1-2일만 유효)
   - 결론: 비용 > 효과 → 제거

5. **성능 최적화의 부수 효과**
   - 13개 동시 애니메이션 제거
   - 저사양 기기 성능 향상
   - 배터리 소모 감소
   - 코드 가독성 향상

#### 결정 기준

**애니메이션을 추가/유지할 때 질문:**
1. 정보를 전달하는가? (기능적 목적)
2. 사용자 행동을 유도하는가?
3. 반복 노출 시에도 가치가 있는가?
4. 콘텐츠 접근을 방해하지 않는가?

**4가지 모두 Yes → 유지, 하나라도 No → 제거 고려**

## Deployment (Future - Phase 18)

### EAS Build Setup
```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Configure
eas build:configure

# Build Android
eas build --platform android --profile preview

# Submit to Google Play
eas submit --platform android
```

### Prerequisites
- Privacy policy URL: https://qlsjtmek2.github.io/portfolio-site/projects/burn-a-buck/privacy
- Google Play Console account
- In-app product registered: `donate_1000won` (₩1,000)
- App icon (512x512)
- Splash screen
- Store graphics (1024x500)

## Project Documentation

- **Development Plan**: `claudedocs/burn-a-buck-plan.md` (72 tasks, 18 phases)
- **Supabase Setup**: `supabase/SETUP_GUIDE.md`
- **Database Schema**: `supabase/README.md`
- **Dev Docs Pattern**: `dev/README.md` (for complex, multi-session tasks)

## Available Claude Code Skills

Use these skills proactively when working on relevant tasks:

- **react-native-guidelines**: Modern React Native patterns, Suspense, performance
- **firebase-supabase-integration**: Supabase setup, RLS policies, security
- **state-management-mobile**: Zustand + React Query patterns
- **mobile-ui-components**: UI components with Magic MCP, styling, accessibility
- **app-deployment**: EAS Build, App Store/Google Play deployment
- **web-research**: Up-to-date library documentation, best practices
- **app-todolist-generator**: Generate comprehensive task lists
- **error-tracking**: Sentry integration (future)

Invoke skills when implementing features in their domain without waiting for user requests.

## Key Decisions Log

1. **Platform**: Android-first (Google Play), iOS later
2. **Backend**: Supabase (RLS, PostgreSQL) over Firebase
3. **State**: Zustand + React Query (not Redux)
4. **Payment**: react-native-iap (not expo-in-app-purchases)
5. **Theme**: Amber single color (changed from red-blue to amber)
6. **i18n**: Korean primary, English secondary
7. **UI Library**: React Native Paper (Material Design 3)
8. **Onboarding**: 2 slides (reduced from 3)

## Current Project State

- **Phase 1**: ✅ Project setup complete
- **Phase 2**: ✅ Supabase backend setup complete
  - Database schema (users, donations, leaderboard view)
  - Service layer (userService, donationService, leaderboardService)
- **Phase 2+**: ✅ Theme system implemented (amber palette)
- **Phase 2+**: ✅ Onboarding screens (2 slides)
- **Phase 2+**: ✅ Basic navigation structure (Stack Navigator)
- **Phase 3**: ✅ Payment service architecture implemented
  - Platform-specific payment files (`payment.native.ts`, `payment.web.ts`)
  - `useDonationPayment` hook with full flow management
  - Payment error/loading dialogs
  - Product ID: `donate_1000won` configured
- **Phase 7**: ✅ Main Screen Implementation Complete
  - ✅ Basic layout complete (header + donation button)
  - ✅ Top Rankers leaderboard section (1-3등 with gold/silver/bronze borders)
  - ✅ Recent donations leaderboard section (최근 10명 with time ago)
  - ✅ React Query integration for real-time updates (30s refetch interval)
  - ✅ Internationalization support (ko/en)
  - ✅ UX-optimized design (information density, scannability, consistency)
- **Phase 8**: ✅ Payment flow integration with Mock IAP Complete
  - ✅ Mock IAP implementation (`src/config/env.ts` - `IAP_TEST_MODE`)
  - ✅ Mock payment objects with fake receipts
  - ✅ Supabase integration working with mock payments
  - ✅ Full payment flow testable in Expo Go
  - ✅ TypeScript type safety (18 errors resolved)
  - ⏳ Pending: Real IAP migration (Phase 17.5)
- **Phase 9**: ✅ Thank You Screen Implementation Complete
  - ✅ `ThankYouMessage` component with fade-in + scale animations
  - ✅ `FirstDonorBadge` component with bounce + rotate animations
  - ✅ `CelebrationAnimation` component (20 particle stars)
  - ✅ Conditional rendering for first-time donors
  - ✅ ScrollView support for flexible content
  - ✅ TypeScript type safety verified
- **Phase 12**: ✅ Social Sharing Feature Complete
  - ✅ Share Bottom Sheet with 7 platform options (Kakao, Instagram, Facebook, Twitter, SMS, Copy Link, More)
  - ✅ Platform-specific share service (`shareService.ts`)
  - ✅ Share message templates with dynamic data (`shareTemplates.ts`)
  - ✅ `useShare` hook for state management
  - ✅ Integration with DonationCompleteScreen
  - ✅ i18n support (ko/en) for all share-related strings
  - ✅ TypeScript type safety verified
  - ⏳ Pending: KakaoTalk SDK integration (requires Development Build)
- **Phase 13**: ✅ Leaderboard Animations Complete
  - ❌ ~~**AnimatedListItem** (Top-down fade-in)~~ - **Removed**
    - **Reason**: Repetitive viewing causes fatigue (app opens = animation plays)
    - **Alternative**: Instant content display for faster access
    - **Decision**: Prioritize quick content access over decorative animation
  - ✅ **AnimatedNumber** component: Number counting animation
    - Uses Reanimated `useAnimatedReaction` + `runOnJS`
    - Smooth counting effect (700ms duration, Easing.out)
    - Applied to rank numbers in TopRankersSection
  - ✅ **usePrevious** hook: Data change detection
    - Generic utility hook for tracking previous render values
    - Essential for React Query data change detection
  - ✅ **Slide-in animation** for new donations (RecentDonationsSection):
    - Real-time feedback when new donors appear
    - Uses `SlideInUp` (500ms) + `Layout.springify()` for smooth insertion
    - Previous items slide down gracefully
  - ✅ TypeScript type safety verified
  - ✅ Performance optimized: Only 2 core animations (counting + slide-in)
- **Refactoring Status**:
  - ✅ Type consolidation complete
  - ✅ Payment service modularization
  - ✅ Component extraction (OnboardingScreen, DonationCompleteScreen)
  - ✅ Error handling centralization
  - ✅ Feature-based architecture migration (Phase 2.1)
- **Next Steps**:
  - Phase 10-11: Implement settings and profile screens
  - Phase 13-16: Additional features (notifications, analytics, etc.)
  - Phase 17.5: Migrate to real IAP with Development Build + KakaoTalk SDK
  - Phase 18: Production deployment

## Critical Type Definitions

**Payment Status Flow** (`src/types/payment.ts`):
```typescript
type PaymentStatus =
  | 'idle'              // Initial state
  | 'initializing'      // Checking first donation
  | 'loading_products'  // Loading IAP products
  | 'purchasing'        // User in payment flow
  | 'validating'        // Verifying receipt
  | 'saving'           // Saving to Supabase
  | 'success'          // Complete
  | 'error';           // Failed

interface PaymentError {
  code: PaymentErrorCode;
  message: string;
  originalError?: any;
}
```

**Navigation Params** (`src/types/navigation.ts`):
```typescript
type RootStackParamList = {
  Onboarding: undefined;
  Main: undefined;
  Nickname: {};
  DonationComplete: {
    nickname: string;
    amount: number;
    isFirstDonation: boolean;
  };
};
```

**Database Types** (`src/types/database.types.ts`):
- Auto-generated from Supabase schema
- Used in service layer for type safety
- Updated via `supabase gen types typescript`

## UX Design Principles (Phase 7 Implementation)

**Leaderboard Components** (`src/components/leaderboard/`):

1. **Information Density**: Compact layout for maximum content visibility
   - Top Rankers: ~50px per item (3 items visible without scroll)
   - Recent Donations: ~50px per item (10 items visible with scroll)

2. **Scannability**: F-pattern reading flow
   - Left: Rank + emoji (visual anchor)
   - Center: Name + amount (primary info)
   - Right: Stats (secondary info)

3. **Visual Hierarchy**:
   - Primary info: Larger, bold fonts (nickname, amount)
   - Secondary info: Smaller, lighter fonts (donation count, time)
   - Rank differentiation: Gold/silver/bronze left border (4px)

4. **Consistency**:
   - Both sections use identical list structure
   - Same padding (12px vertical, 12-16px horizontal)
   - Same border radius (12px with proper corner handling)
   - Shared separator pattern

5. **Border Radius Handling**:
   - Container: `borderRadius: 12`
   - First item: `borderTopLeftRadius: 12`, `borderTopRightRadius: 12`
   - Last item: `borderBottomLeftRadius: 12`, `borderBottomRightRadius: 12`
   - Prevents corners from protruding outside container

**Translation Keys** (`src/locales/{ko,en}/translation.json`):
```typescript
t('main.leaderboard.topRanker')         // "명예의 전당" / "Hall of Fame"
t('main.leaderboard.recentDonations')   // "최근 기부" / "Recent Donations"
t('main.leaderboard.donationCount', { count: 5 })  // "5회 기부" / "5 donations"
```

**React Query Hooks** (`src/hooks/useLeaderboard.ts`):
- `useTopRankers(3)`: Fetches top 3 rankers with 30s auto-refresh
- `useRecentDonations(10)`: Fetches recent 10 donations with 30s auto-refresh
- `useLeaderboard(100)`: Fetches full leaderboard (future use)
- 후원, 기부, 버리다 세 용어가 혼재되어있음. '버린다'라는 표현으로 통일한다.