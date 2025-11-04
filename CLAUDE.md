# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**"천원 쓰레기통" (Burn a Buck)** - A donation-based mobile app where users pay ₩1,000 to receive a thank you message and get registered on a leaderboard. Users compete for rankings based on total donations and can share their achievements with friends.

**Current Status**: Phase 2 completed (Supabase backend setup). Basic UI structure and theme system implemented.

**Tech Stack**:
- **Frontend**: React Native 0.81.5 + Expo SDK 54
- **UI Framework**: React Native Paper 5.14 (Material Design 3)
- **Navigation**: React Navigation 7 (Stack Navigator)
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Realtime)
- **State Management**: Zustand (client) + React Query (server state)
- **Payment**: react-native-iap (Google Play In-App Purchase)
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

### Theme System (src/theme/)

**CRITICAL**: All colors must use the centralized theme system. Never hardcode color values.

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

```
src/
├── features/              # Feature modules (future)
│   ├── onboarding/
│   ├── donation/
│   ├── leaderboard/
│   ├── nickname/
│   └── share/
├── screens/               # Current screen components
├── components/            # Shared components
├── services/              # API clients
│   ├── supabase.ts        # Supabase client initialization
│   ├── userService.ts     # User CRUD
│   ├── donationService.ts # Donation CRUD
│   └── leaderboardService.ts
├── theme/                 # Theme system
│   ├── colors.ts          # Color palette (single source of truth)
│   └── index.ts           # React Native Paper theme
├── navigation/            # Navigation config
├── locales/               # i18n translations
│   ├── ko/
│   └── en/
├── config/                # App configuration
├── constants/             # App constants
├── types/                 # TypeScript types
└── utils/                 # Utilities
```

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

### Payment Flow (Phase 3 - Future)
1. User taps donation button
2. Google Play payment dialog
3. On success:
   - Verify receipt with Google
   - Check if first-time donation (AsyncStorage + Supabase)
   - Prompt for nickname (or use saved)
   - Update Supabase (donations, users tables)
   - Navigate to DonationComplete screen
4. On failure: Show error dialog with retry

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
- **Phase 2+**: ✅ Theme system implemented (amber palette)
- **Phase 2+**: ✅ Onboarding screens (2 slides)
- **Phase 2+**: ✅ Basic navigation structure
- **Next**: Phase 3 - Google Play In-App Purchase integration
