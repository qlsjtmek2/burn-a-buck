# React Native / TypeScript Refactoring Patterns

## Table of Contents

1. [Component Refactoring](#component-refactoring)
2. [Hook Extraction](#hook-extraction)
3. [Type Safety Improvements](#type-safety-improvements)
4. [State Management Patterns](#state-management-patterns)
5. [Conditional Rendering](#conditional-rendering)
6. [Service Layer Patterns](#service-layer-patterns)
7. [Platform-Specific Code](#platform-specific-code)
8. [Performance Optimizations](#performance-optimizations)

---

## Component Refactoring

### Pattern 1: Extract Component from Monolithic Screen

**Problem:** Screen component exceeds 200-500 lines with mixed responsibilities

**Solution:** Split into focused, reusable components

**Step-by-step:**

```typescript
// ❌ BEFORE: Monolithic MainScreen (500 lines)
function MainScreen() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);

  // Header logic (50 lines)
  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <Text style={styles.title}>천원 쓰레기통</Text>
        <Text style={styles.subtitle}>
          작은 기부로 큰 변화를 만드세요
        </Text>
      </View>
    );
  };

  // Donation button logic (100 lines)
  const renderDonateButton = () => {
    const handlePress = async () => {
      setLoading(true);
      try {
        // Payment logic
      } catch (error) {
        // Error handling
      }
    };

    return (
      <TouchableOpacity onPress={handlePress}>
        <Text>여기에 천원 버리기</Text>
      </TouchableOpacity>
    );
  };

  // Leaderboard logic (200 lines)
  const renderLeaderboard = () => {
    // Complex leaderboard rendering
  };

  // Footer logic (50 lines)
  const renderFooter = () => {
    // Footer rendering
  };

  return (
    <ScrollView>
      {renderHeader()}
      {renderDonateButton()}
      {renderLeaderboard()}
      {renderFooter()}
    </ScrollView>
  );
}

// ✅ AFTER: Extracted components
// src/features/main/MainScreen.tsx
function MainScreen() {
  return (
    <ScrollView>
      <MainHeader />
      <DonateButton />
      <LeaderboardSection />
      <MainFooter />
    </ScrollView>
  );
}

// src/features/main/components/MainHeader.tsx
export function MainHeader() {
  const { t } = useTranslation();

  return (
    <View style={styles.header}>
      <Text style={styles.title}>{t('app.title')}</Text>
      <Text style={styles.subtitle}>{t('app.subtitle')}</Text>
    </View>
  );
}

// src/features/main/components/DonateButton.tsx
export function DonateButton() {
  const { processDonation, status } = useDonationPayment();

  return (
    <TouchableOpacity
      onPress={processDonation}
      disabled={status !== 'idle'}
    >
      <Text>여기에 천원 버리기</Text>
    </TouchableOpacity>
  );
}

// src/features/main/components/LeaderboardSection.tsx
export function LeaderboardSection() {
  const { data: topRankers } = useTopRankers(3);
  const { data: recentDonations } = useRecentDonations(10);

  return (
    <View style={styles.container}>
      <TopRankers data={topRankers} />
      <RecentDonations data={recentDonations} />
    </View>
  );
}
```

**Benefits:**
- Screen component: 500 lines → 30 lines
- Each component has single responsibility
- Easier to test in isolation
- Improved reusability

---

### Pattern 2: Functional Component Optimization

**Problem:** Re-renders occurring unnecessarily

**Solution:** Use React.memo and useCallback appropriately

```typescript
// ❌ BEFORE: Unnecessary re-renders
function LeaderboardItem({ entry, onPress }) {
  console.log('LeaderboardItem rendered'); // Logs on every parent update
  return (
    <TouchableOpacity onPress={onPress}>
      <Text>{entry.nickname}</Text>
    </TouchableOpacity>
  );
}

// Parent
function LeaderboardList({ entries }) {
  const [selected, setSelected] = useState(null);

  return entries.map(entry => (
    <LeaderboardItem
      key={entry.id}
      entry={entry}
      onPress={() => setSelected(entry.id)}
    />
  ));
}

// ✅ AFTER: Optimized with React.memo and useCallback
const LeaderboardItem = React.memo(function LeaderboardItem({
  entry,
  onPress
}: LeaderboardItemProps) {
  console.log('LeaderboardItem rendered'); // Only logs when entry changes
  return (
    <TouchableOpacity onPress={onPress}>
      <Text>{entry.nickname}</Text>
    </TouchableOpacity>
  );
});

function LeaderboardList({ entries }: { entries: LeaderboardEntry[] }) {
  const [selected, setSelected] = useState<string | null>(null);

  const handlePress = useCallback((id: string) => {
    setSelected(id);
  }, []);

  return entries.map(entry => (
    <LeaderboardItem
      key={entry.id}
      entry={entry}
      onPress={() => handlePress(entry.id)}
    />
  ));
}
```

---

## Hook Extraction

### Pattern 3: Extract Business Logic into Custom Hook

**Problem:** Component contains complex state management and side effects

**Solution:** Extract into custom hook

```typescript
// ❌ BEFORE: Component with embedded logic
function DonateButton() {
  const [status, setStatus] = useState<PaymentStatus>('idle');
  const [error, setError] = useState<PaymentError | null>(null);
  const navigation = useNavigation();

  useEffect(() => {
    // Initialize payment service
    const init = async () => {
      try {
        setStatus('initializing');
        await paymentService.initialize();
        setStatus('idle');
      } catch (err) {
        setError({ code: 'E_INIT_ERROR', message: err.message });
        setStatus('error');
      }
    };
    init();
  }, []);

  const handleDonate = async () => {
    setStatus('purchasing');
    try {
      const nickname = await getNickname();
      if (!nickname) {
        navigation.navigate('Nickname');
        return;
      }

      const purchase = await paymentService.purchaseDonation(nickname);
      setStatus('validating');

      await donationService.createDonation({
        nickname,
        amount: 1000,
        receiptToken: purchase.transactionReceipt,
      });

      setStatus('success');
      navigation.navigate('DonationComplete', {
        nickname,
        amount: 1000,
      });
    } catch (err) {
      setError(parsePaymentError(err));
      setStatus('error');
    }
  };

  return (
    <>
      <Button onPress={handleDonate} disabled={status !== 'idle'}>
        기부하기
      </Button>
      {status === 'error' && <ErrorMessage error={error} />}
    </>
  );
}

// ✅ AFTER: Extracted custom hook
// src/hooks/useDonationPayment.ts
export function useDonationPayment() {
  const [status, setStatus] = useState<PaymentStatus>('idle');
  const [error, setError] = useState<PaymentError | null>(null);
  const navigation = useNavigation();

  useEffect(() => {
    initializePaymentService();
  }, []);

  const initializePaymentService = async () => {
    try {
      setStatus('initializing');
      await paymentService.initialize();
      setStatus('idle');
    } catch (err) {
      handleError(err, 'E_INIT_ERROR');
    }
  };

  const processDonation = async () => {
    setStatus('purchasing');
    try {
      const nickname = await ensureNickname();
      if (!nickname) return;

      const purchase = await purchaseProduct(nickname);
      await saveDonation(nickname, purchase);

      navigateToSuccess(nickname);
    } catch (err) {
      handleError(err);
    }
  };

  const ensureNickname = async () => {
    const nickname = await getNickname();
    if (!nickname) {
      navigation.navigate('Nickname');
      return null;
    }
    return nickname;
  };

  const purchaseProduct = async (nickname: string) => {
    return await paymentService.purchaseDonation(nickname);
  };

  const saveDonation = async (nickname: string, purchase: Purchase) => {
    setStatus('validating');
    await donationService.createDonation({
      nickname,
      amount: 1000,
      receiptToken: purchase.transactionReceipt,
    });
  };

  const navigateToSuccess = (nickname: string) => {
    setStatus('success');
    navigation.navigate('DonationComplete', {
      nickname,
      amount: 1000,
    });
  };

  const handleError = (err: any, code?: string) => {
    setError(parsePaymentError(err, code));
    setStatus('error');
  };

  return {
    status,
    error,
    processDonation,
    clearError: () => setError(null),
  };
}

// Component is now clean
function DonateButton() {
  const { status, error, processDonation } = useDonationPayment();

  return (
    <>
      <Button onPress={processDonation} disabled={status !== 'idle'}>
        기부하기
      </Button>
      {error && <ErrorMessage error={error} />}
    </>
  );
}
```

**Benefits:**
- Component: 80 lines → 10 lines
- Business logic testable independently
- Reusable across components
- Clear separation of concerns

---

### Pattern 4: Extract Data Fetching Hook

**Problem:** Data fetching logic mixed with UI logic

**Solution:** Create specialized data hook with React Query

```typescript
// ❌ BEFORE: Mixed data and UI
function LeaderboardSection() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await leaderboardService.getTopRankers(10);
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  if (loading) return <Spinner />;
  if (error) return <ErrorView error={error} />;

  return (
    <FlatList
      data={data}
      renderItem={({ item }) => <LeaderboardItem entry={item} />}
    />
  );
}

// ✅ AFTER: Extracted data hook with React Query
// src/hooks/useLeaderboard.ts
export function useTopRankers(limit: number) {
  return useQuery({
    queryKey: ['topRankers', limit],
    queryFn: () => leaderboardService.getTopRankers(limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 30 * 1000, // 30 seconds
    retry: 3,
  });
}

// Component is now clean
function LeaderboardSection() {
  const { data, isLoading, error } = useTopRankers(10);

  if (isLoading) return <Spinner />;
  if (error) return <ErrorView error={error} />;

  return (
    <FlatList
      data={data}
      renderItem={({ item }) => <LeaderboardItem entry={item} />}
    />
  );
}
```

---

## Type Safety Improvements

### Pattern 5: Replace `any` with Explicit Types

**Problem:** TypeScript benefits lost due to `any` usage

**Solution:** Define explicit interfaces and types

```typescript
// ❌ BEFORE: any types everywhere
async function fetchUser(id: any): Promise<any> {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}

function UserProfile({ user }: any) {
  return <Text>{user.name}</Text>;
}

// ✅ AFTER: Explicit types
interface User {
  id: string;
  nickname: string;
  totalDonated: number;
  createdAt: string;
  badgeEarned: boolean;
}

interface ApiResponse<T> {
  data: T;
  error?: ApiError;
}

interface ApiError {
  code: string;
  message: string;
}

async function fetchUser(id: string): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  const result: ApiResponse<User> = await response.json();

  if (result.error) {
    throw new Error(result.error.message);
  }

  return result.data;
}

interface UserProfileProps {
  user: User;
}

function UserProfile({ user }: UserProfileProps) {
  return <Text>{user.nickname}</Text>;
}
```

---

### Pattern 6: Use Discriminated Unions for States

**Problem:** State management with string status and optional error

**Solution:** Discriminated union types

```typescript
// ❌ BEFORE: Inconsistent state
type PaymentState = {
  status: 'idle' | 'loading' | 'success' | 'error';
  data?: PaymentResult;
  error?: Error;
};

// Possible invalid states:
// { status: 'success', error: Error } ❌
// { status: 'error', data: PaymentResult } ❌

// ✅ AFTER: Discriminated unions
type PaymentState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: PaymentResult }
  | { status: 'error'; error: Error };

// Usage
function PaymentView({ state }: { state: PaymentState }) {
  switch (state.status) {
    case 'idle':
      return <Button>Start Payment</Button>;

    case 'loading':
      return <Spinner />;

    case 'success':
      return <SuccessView result={state.data} />; // ✅ data guaranteed

    case 'error':
      return <ErrorView error={state.error} />; // ✅ error guaranteed
  }
}
```

**Benefits:**
- Impossible states are unrepresentable
- TypeScript enforces correct property access
- Better autocomplete support

---

### Pattern 7: Utility Types for Props

**Problem:** Repetitive prop type definitions

**Solution:** Use TypeScript utility types

```typescript
// ❌ BEFORE: Repeated prop definitions
interface LeaderboardEntry {
  rank: number;
  nickname: string;
  totalDonated: number;
  lastDonationAt: string;
}

interface LeaderboardItemProps {
  rank: number;
  nickname: string;
  totalDonated: number;
  onPress: () => void;
}

// ✅ AFTER: Utility types
interface LeaderboardEntry {
  rank: number;
  nickname: string;
  totalDonated: number;
  lastDonationAt: string;
}

type LeaderboardItemProps = Pick<
  LeaderboardEntry,
  'rank' | 'nickname' | 'totalDonated'
> & {
  onPress: () => void;
};

// Even better: with Omit
type LeaderboardDisplayProps = Omit<LeaderboardEntry, 'lastDonationAt'> & {
  onPress: () => void;
};
```

---

## State Management Patterns

### Pattern 8: Lift State When Shared

**Problem:** Same state duplicated across components

**Solution:** Lift state to common ancestor

```typescript
// ❌ BEFORE: Duplicated state
function ParentScreen() {
  return (
    <>
      <UserInfo />
      <UserStats />
    </>
  );
}

function UserInfo() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    fetchUser().then(setUser);
  }, []);

  return <Text>{user?.nickname}</Text>;
}

function UserStats() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    fetchUser().then(setUser); // Duplicate fetch!
  }, []);

  return <Text>{user?.totalDonated}</Text>;
}

// ✅ AFTER: Lifted state
function ParentScreen() {
  const { data: user } = useUser(); // Single fetch

  if (!user) return <Spinner />;

  return (
    <>
      <UserInfo user={user} />
      <UserStats user={user} />
    </>
  );
}

function UserInfo({ user }: { user: User }) {
  return <Text>{user.nickname}</Text>;
}

function UserStats({ user }: { user: User }) {
  return <Text>{user.totalDonated}</Text>;
}
```

---

## Conditional Rendering

### Pattern 9: Guard Clauses for Early Returns

**Problem:** Deep nesting in conditional rendering

**Solution:** Early returns (guard clauses)

```typescript
// ❌ BEFORE: Nested conditionals
function PaymentStatus({ status, error, data }: PaymentStatusProps) {
  return (
    <View>
      {status === 'loading' ? (
        <Spinner />
      ) : status === 'error' ? (
        error ? (
          error.code === 'E_USER_CANCELLED' ? (
            <Text>사용자가 취소했습니다</Text>
          ) : error.code === 'E_NETWORK_ERROR' ? (
            <Text>네트워크 오류가 발생했습니다</Text>
          ) : (
            <Text>오류: {error.message}</Text>
          )
        ) : (
          <Text>알 수 없는 오류</Text>
        )
      ) : status === 'success' ? (
        data ? (
          <SuccessView data={data} />
        ) : (
          <Text>데이터 없음</Text>
        )
      ) : (
        <IdleView />
      )}
    </View>
  );
}

// ✅ AFTER: Guard clauses
function PaymentStatus({ status, error, data }: PaymentStatusProps) {
  if (status === 'loading') {
    return <Spinner />;
  }

  if (status === 'idle') {
    return <IdleView />;
  }

  if (status === 'error') {
    return <ErrorDisplay error={error} />;
  }

  if (status === 'success') {
    return <SuccessDisplay data={data} />;
  }

  return null;
}

function ErrorDisplay({ error }: { error?: PaymentError }) {
  if (!error) {
    return <Text>알 수 없는 오류</Text>;
  }

  if (error.code === 'E_USER_CANCELLED') {
    return <Text>사용자가 취소했습니다</Text>;
  }

  if (error.code === 'E_NETWORK_ERROR') {
    return <Text>네트워크 오류가 발생했습니다</Text>;
  }

  return <Text>오류: {error.message}</Text>;
}

function SuccessDisplay({ data }: { data?: PaymentResult }) {
  if (!data) {
    return <Text>데이터 없음</Text>;
  }

  return <SuccessView data={data} />;
}
```

**Benefits:**
- Nesting: 6 levels → 1 level
- Each component has single responsibility
- Easier to test and modify

---

## Service Layer Patterns

### Pattern 10: Extract Service Layer

**Problem:** API calls scattered throughout components

**Solution:** Centralize in service layer

```typescript
// ❌ BEFORE: API calls in components
function DonationList() {
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setDonations(data);
    };
    fetch();
  }, []);

  // ...
}

// ✅ AFTER: Service layer
// src/services/donationService.ts
import { supabase } from './supabase';
import type { Donation } from '../types/database.types';

export const donationService = {
  async getRecentDonations(limit: number = 20): Promise<Donation[]> {
    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new DonationError('Failed to fetch donations', error);
    }

    return data;
  },

  async createDonation(donation: CreateDonationInput): Promise<Donation> {
    const { data, error } = await supabase
      .from('donations')
      .insert(donation)
      .select()
      .single();

    if (error) {
      throw new DonationError('Failed to create donation', error);
    }

    return data;
  },

  async getDonationsByUser(nickname: string): Promise<Donation[]> {
    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .eq('nickname', nickname)
      .order('created_at', { ascending: false });

    if (error) {
      throw new DonationError('Failed to fetch user donations', error);
    }

    return data;
  },
};

class DonationError extends Error {
  constructor(message: string, public cause?: any) {
    super(message);
    this.name = 'DonationError';
  }
}

// Component uses service
function DonationList() {
  const { data: donations } = useQuery({
    queryKey: ['donations'],
    queryFn: () => donationService.getRecentDonations(20),
  });

  // ...
}
```

**Benefits:**
- Single source of truth for API calls
- Easy to mock for testing
- Centralized error handling
- Type-safe API layer

---

## Platform-Specific Code

### Pattern 11: Platform-Specific Implementations

**Problem:** Web and native need different implementations

**Solution:** Use `.native.ts` and `.web.ts` suffixes

```typescript
// ❌ BEFORE: Platform checks everywhere
import { Platform } from 'react-native';

export const paymentService = {
  async initialize() {
    if (Platform.OS === 'web') {
      throw new Error('Payment not supported on web');
    }
    // Native implementation
    return await initConnection();
  },

  async purchaseDonation(nickname: string) {
    if (Platform.OS === 'web') {
      throw new Error('Payment not supported on web');
    }
    // Native implementation
  },
};

// ✅ AFTER: Separate files
// src/services/payment.ts (re-exports platform-specific)
export { paymentService } from './payment.native';

// src/services/payment.native.ts
import { initConnection, requestPurchase } from 'react-native-iap';

export const paymentService = {
  async initialize() {
    await initConnection();
  },

  async purchaseDonation(nickname: string) {
    const products = await getProducts(['donate_1000won']);
    const purchase = await requestPurchase({
      sku: products[0].productId,
    });
    return purchase;
  },
};

// src/services/payment.web.ts
export const paymentService = {
  async initialize() {
    console.warn('Payment not available on web');
  },

  async purchaseDonation(nickname: string) {
    throw new Error('Payment not supported on web platform');
  },
};
```

**Benefits:**
- React Native automatically picks correct file
- No runtime platform checks
- TypeScript enforces same interface
- Clean separation

---

## Performance Optimizations

### Pattern 12: FlatList Optimization

**Problem:** Poor list performance with many items

**Solution:** Optimize FlatList props

```typescript
// ❌ BEFORE: Unoptimized list
function LeaderboardList({ entries }: { entries: LeaderboardEntry[] }) {
  return (
    <FlatList
      data={entries}
      renderItem={({ item }) => (
        <View>
          <Text>{item.nickname}</Text>
          <Text>{item.totalDonated}</Text>
        </View>
      )}
    />
  );
}

// ✅ AFTER: Optimized list
const LeaderboardItem = React.memo(function LeaderboardItem({
  entry
}: {
  entry: LeaderboardEntry
}) {
  return (
    <View style={styles.item}>
      <Text style={styles.nickname}>{entry.nickname}</Text>
      <Text style={styles.amount}>{entry.totalDonated}</Text>
    </View>
  );
});

function LeaderboardList({ entries }: { entries: LeaderboardEntry[] }) {
  const keyExtractor = useCallback((item: LeaderboardEntry) => item.id, []);

  const renderItem = useCallback(
    ({ item }: { item: LeaderboardEntry }) => <LeaderboardItem entry={item} />,
    []
  );

  return (
    <FlatList
      data={entries}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      maxToRenderPerBatch={10}
      windowSize={21}
      removeClippedSubviews={true}
      initialNumToRender={10}
      getItemLayout={(data, index) => ({
        length: ITEM_HEIGHT,
        offset: ITEM_HEIGHT * index,
        index,
      })}
    />
  );
}
```

**Optimization techniques:**
- `React.memo` prevents unnecessary re-renders
- `useCallback` for renderItem and keyExtractor
- `getItemLayout` enables jump-to-item
- `maxToRenderPerBatch` controls rendering batches
- `windowSize` controls viewport size

---

### Pattern 13: Lazy Loading Components

**Problem:** Large bundle size, slow initial load

**Solution:** Code splitting with React.lazy

```typescript
// ❌ BEFORE: All components loaded upfront
import { MainScreen } from './screens/MainScreen';
import { DonationCompleteScreen } from './screens/DonationCompleteScreen';
import { LeaderboardScreen } from './screens/LeaderboardScreen';

function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Main" component={MainScreen} />
      <Stack.Screen name="DonationComplete" component={DonationCompleteScreen} />
      <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
    </Stack.Navigator>
  );
}

// ✅ AFTER: Lazy loaded
import React, { Suspense, lazy } from 'react';
import { MainScreen } from './screens/MainScreen'; // Keep main screen eager

const DonationCompleteScreen = lazy(() =>
  import('./screens/DonationCompleteScreen')
);
const LeaderboardScreen = lazy(() =>
  import('./screens/LeaderboardScreen')
);

function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Main" component={MainScreen} />
      <Stack.Screen name="DonationComplete">
        {() => (
          <Suspense fallback={<Spinner />}>
            <DonationCompleteScreen />
          </Suspense>
        )}
      </Stack.Screen>
      <Stack.Screen name="Leaderboard">
        {() => (
          <Suspense fallback={<Spinner />}>
            <LeaderboardScreen />
          </Suspense>
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
```

---

## Summary: Refactoring Checklist

### Component Level
- [ ] Component under 250 lines
- [ ] Single responsibility
- [ ] No business logic (extracted to hooks)
- [ ] Props properly typed
- [ ] Memoized when appropriate

### Hook Level
- [ ] Custom hooks for business logic
- [ ] Data fetching separated
- [ ] Clear naming (use prefix)
- [ ] Proper dependencies in useEffect/useCallback

### Type Safety
- [ ] No `any` types
- [ ] Discriminated unions for state
- [ ] Utility types for props
- [ ] API responses typed

### Performance
- [ ] FlatList optimized (getItemLayout, memo, callbacks)
- [ ] Expensive computations memoized (useMemo)
- [ ] Event handlers stable (useCallback)
- [ ] Lazy loading for large components

### Architecture
- [ ] Service layer for API calls
- [ ] Platform-specific files when needed
- [ ] Feature-based organization
- [ ] Clear separation of concerns

---

**Document Version:** 1.0.0
**Last Updated:** 2025-11-04
