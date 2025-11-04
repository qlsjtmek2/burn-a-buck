# Phase 4: 네비게이션 구조 설정 - 완료 요약

## ✅ 완료된 작업

### 1. 네비게이션 타입 정의 및 상수 설정 ✓

#### 1-1. 네비게이션 타입 (`src/types/navigation.ts`)
```typescript
export type RootStackParamList = {
  Onboarding: undefined;
  Main: undefined;
  Nickname: {
    donation?: DonationInfo;
    isFirstDonation?: boolean;
  };
  DonationComplete: {
    donation: DonationInfo;
    isFirstDonation: boolean;
    rank?: number;
  };
};
```

**주요 특징:**
- TypeScript 타입 안전성 보장
- 화면 간 파라미터 타입 정의
- `StackScreenProps` 타입 헬퍼 제공
- Global navigation type augmentation

#### 1-2. AsyncStorage 키 상수 (`src/constants/storage.ts`)
```typescript
export const STORAGE_KEYS = {
  ONBOARDING_COMPLETED: '@burn-a-buck:onboarding-completed',
  SAVED_NICKNAME: '@burn-a-buck:saved-nickname',
  FIRST_DONATION: '@burn-a-buck:first-donation',
  PENDING_PURCHASE: '@burn-a-buck:pending-purchase',
  APP_LANGUAGE: '@burn-a-buck:app-language',
} as const;
```

**주요 특징:**
- 모든 AsyncStorage 키 중앙 관리
- TypeScript const assertion으로 타입 안전성
- `StorageValues` 타입으로 값 타입 정의

---

### 2. 온보딩 유틸리티 구현 (AsyncStorage) ✓

**파일**: `src/utils/onboarding.ts`

#### 주요 함수

##### A. 온보딩 상태 관리
- `checkOnboardingCompleted()`: 온보딩 완료 여부 확인
- `setOnboardingCompleted()`: 온보딩 완료 플래그 저장
- `resetOnboarding()`: 온보딩 상태 초기화 (개발/테스트용)

##### B. 닉네임 관리
- `getSavedNickname()`: 저장된 닉네임 가져오기
- `saveNickname(nickname)`: 닉네임 저장
- `clearSavedNickname()`: 저장된 닉네임 삭제

**사용 예시:**
```typescript
// 온보딩 완료 여부 확인
const isCompleted = await checkOnboardingCompleted();

// 온보딩 완료 처리
await setOnboardingCompleted();

// 닉네임 저장 및 불러오기
await saveNickname('사용자닉네임');
const nickname = await getSavedNickname();
```

---

### 3. React Navigation Stack 구성 ✓

**파일**: `src/navigation/RootNavigator.tsx`

#### 주요 기능

##### A. 초기 화면 결정 로직
```typescript
useEffect(() => {
  async function checkInitialRoute() {
    const isOnboardingCompleted = await checkOnboardingCompleted();
    setInitialRouteName(isOnboardingCompleted ? 'Main' : 'Onboarding');
  }
  checkInitialRoute();
}, []);
```

- 온보딩 완료 시: 메인 화면으로 시작
- 온보딩 미완료 시: 온보딩 화면으로 시작
- AsyncStorage 기반 영구 저장

##### B. Stack Navigator 설정
```typescript
<Stack.Navigator
  initialRouteName={initialRouteName}
  screenOptions={{
    headerShown: false,
    cardStyle: { backgroundColor: '#F7F7F7' },
    animationEnabled: true,
  }}
>
```

**화면별 설정:**
- **Onboarding**: 헤더 숨김, 뒤로가기 제스처 비활성화
- **Main**: 헤더 숨김, 뒤로가기 제스처 비활성화 (온보딩으로 돌아가지 않도록)
- **Nickname**: 헤더 숨김, 뒤로가기 제스처 활성화
- **DonationComplete**: 헤더 숨김, 뒤로가기 제스처 비활성화 (완료 화면에서는 돌아갈 수 없음)

---

### 4. 화면 스켈레톤 생성 ✓

#### 4-1. OnboardingScreen (`src/screens/OnboardingScreen.tsx`)

**현재 구현:**
- 앱 제목 및 설명 표시
- "시작하기" 버튼
- 온보딩 완료 처리 및 메인 화면 이동

**Phase 6에서 추가 예정:**
- 앱 소개 슬라이드
- 기능 설명
- 스와이프 네비게이션

#### 4-2. MainScreen (`src/screens/MainScreen.tsx`)

**현재 구현:**
- 앱 헤더 (타이틀)
- 플레이스홀더 콘텐츠 영역
- "여기에 천원 버리기" 버튼
- 임시: 닉네임 화면으로 이동

**Phase 7-8에서 추가 예정:**
- 리더보드 (Top Ranker, Recent Donations)
- 통계 표시
- 실제 결제 플로우 연동

#### 4-3. NicknameScreen (`src/screens/NicknameScreen.tsx`)

**현재 구현:**
- 닉네임 입력 필드
- 글자 수 카운터 (2-12자)
- 유효성 검증 (최소 2자)
- 닉네임 저장 및 완료 화면 이동

**Phase 10에서 추가 예정:**
- 중복 닉네임 확인
- 중복 시 확인 다이얼로그
- 저장된 닉네임 자동 입력
- 상세 유효성 검증

#### 4-4. DonationCompleteScreen (`src/screens/DonationCompleteScreen.tsx`)

**현재 구현:**
- 감사 메시지
- 기부 금액 표시
- 현재 순위 표시 (파라미터로 전달 시)
- 공유하기 버튼 (임시)
- 메인으로 돌아가기 버튼

**Phase 11-12에서 추가 예정:**
- 첫 기부 시 배지 애니메이션
- 실제 순위 조회 및 표시
- 총 기부 금액 표시
- 소셜 공유 기능 (KakaoTalk, Instagram, Facebook 등)

---

### 5. App.tsx 네비게이션 통합 ✓

**파일**: `App.tsx`

#### 주요 변경사항

##### A. Provider 구조
```typescript
<GestureHandlerRootView style={{ flex: 1 }}>
  <SafeAreaProvider>
    <QueryClientProvider client={queryClient}>
      <RootNavigator />
      <StatusBar style="auto" />
    </QueryClientProvider>
  </SafeAreaProvider>
</GestureHandlerRootView>
```

**Provider 순서:**
1. `GestureHandlerRootView`: React Native Gesture Handler 루트
2. `SafeAreaProvider`: Safe Area Insets 제공
3. `QueryClientProvider`: React Query 클라이언트
4. `RootNavigator`: 네비게이션 루트

##### B. 결제 서비스 초기화
```typescript
useEffect(() => {
  async function initializeApp() {
    await paymentService.initialize();
  }
  initializeApp();

  return () => {
    paymentService.cleanup();
  };
}, []);
```

- 앱 시작 시 결제 서비스 초기화
- 앱 종료 시 리소스 정리

##### C. React Query 설정
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 1000 * 60 * 5, // 5분
      gcTime: 1000 * 60 * 10,   // 10분
    },
    mutations: {
      retry: 1,
    },
  },
});
```

---

## 📂 생성된 파일

```
src/
├── types/
│   └── navigation.ts              # 네비게이션 타입 정의
├── constants/
│   └── storage.ts                 # AsyncStorage 키 상수
├── utils/
│   └── onboarding.ts              # 온보딩 유틸리티
├── navigation/
│   └── RootNavigator.tsx          # 루트 네비게이터
└── screens/
    ├── OnboardingScreen.tsx       # 온보딩 화면
    ├── MainScreen.tsx             # 메인 화면
    ├── NicknameScreen.tsx         # 닉네임 입력 화면
    └── DonationCompleteScreen.tsx # 기부 완료 화면

App.tsx                            # 앱 엔트리 포인트 (업데이트)

claudedocs/
└── phase4-navigation-summary.md  # 이 파일
```

---

## 🎯 네비게이션 플로우

### 1. 최초 실행 시
```
앱 시작
  → 온보딩 완료 여부 확인 (AsyncStorage)
  → Onboarding 화면
  → "시작하기" 버튼 클릭
  → 온보딩 완료 플래그 저장
  → Main 화면으로 이동
```

### 2. 재실행 시
```
앱 시작
  → 온보딩 완료 여부 확인 (AsyncStorage)
  → Main 화면 (온보딩 건너뜀)
```

### 3. 기부 플로우 (임시 구현)
```
Main 화면
  → "여기에 천원 버리기" 버튼 클릭
  → Nickname 화면
  → 닉네임 입력 및 완료
  → DonationComplete 화면
  → "메인으로 돌아가기" 버튼
  → Main 화면
```

### 4. 실제 기부 플로우 (Phase 8에서 구현 예정)
```
Main 화면
  → "여기에 천원 버리기" 버튼 클릭
  → Google Play 결제 다이얼로그
  → 결제 성공
  → Nickname 화면 (또는 저장된 닉네임 사용)
  → DonationComplete 화면 (실제 순위 표시)
  → 공유하기 또는 메인으로 돌아가기
```

---

## 🔧 사용 가이드

### 화면 이동
```typescript
import { useNavigation } from '@react-navigation/native';
import type { RootStackParamList } from '@/types/navigation';
import type { StackNavigationProp } from '@react-navigation/stack';

type NavigationProp = StackNavigationProp<RootStackParamList>;

const MyComponent = () => {
  const navigation = useNavigation<NavigationProp>();

  // 파라미터 없이 이동
  navigation.navigate('Main');

  // 파라미터와 함께 이동
  navigation.navigate('Nickname', {
    donation: donationInfo,
    isFirstDonation: true,
  });

  // 이전 화면으로 이동 (replace는 스택에 남기지 않음)
  navigation.replace('Main');

  // 뒤로가기
  navigation.goBack();
};
```

### AsyncStorage 사용
```typescript
import {
  checkOnboardingCompleted,
  setOnboardingCompleted,
  getSavedNickname,
  saveNickname,
} from '@/utils/onboarding';

// 온보딩 완료 확인
const isCompleted = await checkOnboardingCompleted();

// 온보딩 완료 처리
await setOnboardingCompleted();

// 닉네임 저장 및 불러오기
await saveNickname('사용자닉네임');
const nickname = await getSavedNickname();
```

---

## ⚠️ 주의사항

### 1. 화면 스켈레톤
- 모든 화면은 **기본 구조만** 구현되어 있음
- 상세 기능은 추후 Phase에서 구현 예정:
  - Phase 6: Onboarding 상세 구현
  - Phase 7: Main 화면 리더보드
  - Phase 8: 결제 플로우 연동
  - Phase 10: Nickname 유효성 검증
  - Phase 11: DonationComplete 상세 기능
  - Phase 12: 소셜 공유

### 2. 네비게이션 제스처
- **Onboarding**: 뒤로가기 불가 (최초 실행)
- **Main**: 뒤로가기 불가 (온보딩으로 돌아가지 않도록)
- **Nickname**: 뒤로가기 가능
- **DonationComplete**: 뒤로가기 불가 (완료 화면)

### 3. AsyncStorage
- 모든 키는 `@burn-a-buck:` 접두사 사용
- 앱 삭제 시 모든 데이터 초기화됨
- 개발 중 온보딩 리셋: `resetOnboarding()` 사용

---

## 🚀 다음 단계

### Phase 5: i18n 다국어 지원
- i18next 설정
- 한국어/영어 번역 파일
- 언어 자동 감지
- 언어 전환 기능

### Phase 6: 온보딩 화면 구현
- 앱 소개 슬라이드
- 스와이프 네비게이션
- 진행 표시 인디케이터
- 건너뛰기 버튼

### Phase 7: 메인 화면 구현
- 리더보드 UI (Top Ranker, Recent Donations)
- Supabase 데이터 조회
- React Query 통합
- 실시간 업데이트

---

## 📚 관련 문서

- [Phase 3 완료 요약](./phase3-payment-summary.md) - 결제 시스템 구현
- [전체 개발 계획](./burn-a-buck-plan.md) - 72 tasks 로드맵
- [React Navigation 문서](https://reactnavigation.org/docs/getting-started)
- [AsyncStorage 문서](https://react-native-async-storage.github.io/async-storage/)

---

## 🎨 디자인 가이드

### 색상 팔레트
```typescript
const colors = {
  primary: '#FF6B6B',      // 메인 컬러 (빨강)
  secondary: '#4ECDC4',    // 보조 컬러 (청록)
  success: '#95E1D3',      // 성공 메시지
  background: '#F7F7F7',   // 배경
  text: '#2D3436',         // 텍스트
  textSecondary: '#636E72',// 보조 텍스트
  border: '#DFE6E9',       // 테두리
  white: '#FFFFFF',        // 흰색
};
```

### 타이포그래피
```typescript
const typography = {
  title: { fontSize: 32, fontWeight: 'bold' },
  subtitle: { fontSize: 18, fontWeight: '600' },
  body: { fontSize: 16, fontWeight: 'normal' },
  caption: { fontSize: 14, fontWeight: 'normal' },
};
```

### 버튼 스타일
```typescript
const buttonStyles = {
  primary: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  secondary: {
    backgroundColor: '#4ECDC4',
    // ... 동일한 스타일
  },
  outline: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#FF6B6B',
    // ... 나머지 스타일
  },
};
```

---

**작성일**: 2025-11-03
**Phase**: 4/18 완료
**진행률**: 22.2% (4/18 phases)
