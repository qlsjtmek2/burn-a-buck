# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**"천원 쓰레기통" (Burn a Buck)** - A donation-based mobile app where users pay ₩1,000 to receive a thank you message and get registered on a leaderboard. Users compete for rankings based on total donations and can share their achievements with friends.

**Current Status**:
- Phase 7 ✅ Complete (Main Screen UI + Leaderboard)
- Phase 8 🚧 In Progress (Payment Flow with Mock IAP)
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
│   └── share/             # Social sharing (future implementation)
│       └── index.ts
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
│   └── leaderboardService.ts
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
│   └── database.types.ts  # Supabase types
└── utils/                 # Utilities
    ├── errorHandler.ts    # ✨ NEW: Centralized error handling
    ├── donationStorage.ts # ✨ NEW: AsyncStorage utilities for donations
    ├── onboarding.ts      # Onboarding helpers
    └── timeFormat.ts      # Time formatting
```

**✨ Recent Refactoring (2025-11-04)**:
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

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nickname VARCHAR(12) UNIQUE,
  total_donated INTEGER DEFAULT 0,
  first_donation_at TIMESTAMP,
  last_donation_at TIMESTAMP,
  badge_earned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Donations Table
```sql
CREATE TABLE donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  nickname VARCHAR(12) NOT NULL,
  amount INTEGER DEFAULT 1000,
  receipt_token TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Leaderboard View
```sql
CREATE VIEW leaderboard AS
SELECT
  u.nickname,
  u.total_donated,
  RANK() OVER (ORDER BY u.total_donated DESC) as rank,
  u.last_donation_at
FROM users u
WHERE u.total_donated > 0
ORDER BY rank;
```

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
2. Check first-time donation (AsyncStorage: `STORAGE_KEYS.FIRST_DONATION`)
3. Get saved nickname or navigate to Nickname screen
4. Purchase via `paymentService.purchaseDonation(nickname)`
   - **Mock mode**: Generate fake Purchase object (0.5s delay)
   - **Real mode**: Request purchase from Google Play
   - Load product: `donate_1000won`
   - Validate receipt (mock receipts always valid)
5. Save to Supabase (donations + users tables) - **Always real**
6. Navigate to DonationComplete screen with params:
   - `nickname`: string
   - `amount`: 1000
   - `isFirstDonation`: boolean

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
- **Phase 8**: 🚧 Payment flow integration with Mock IAP
  - ✅ Mock IAP implementation (`src/config/env.ts` - `IAP_TEST_MODE`)
  - ✅ Mock payment objects with fake receipts
  - ✅ Supabase integration working with mock payments
  - ✅ Full payment flow testable in Expo Go
  - ✅ TypeScript type safety (18 errors resolved)
  - ⏳ Pending: Real IAP migration (Phase 17.5)
- **Refactoring Status**:
  - ✅ Type consolidation complete
  - ✅ Payment service modularization
  - ✅ Component extraction (OnboardingScreen)
  - ✅ Error handling centralization
  - ⏳ Pending: useDonationPayment hook simplification (Phase 3.2)
  - ⏳ Pending: Feature-based architecture migration (Phase 2.1)
- **Next Steps**:
  - Phase 8: Test complete payment flow in Expo Go
  - Phase 9-16: Implement remaining UI screens
  - Phase 17.5: Migrate to real IAP with Development Build
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