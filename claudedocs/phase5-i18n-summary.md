# Phase 5: 다국어 지원 구현 - 완료 요약

## ✅ 완료된 작업

### 1. i18next 설정 및 구성 ✓

#### 1-1. i18n 설정 파일 (`src/config/i18n.ts`)

**주요 기능:**
```typescript
- initializeI18n(): i18next 초기화
- getDeviceLanguage(): 디바이스 언어 감지
- getSavedLanguage(): 저장된 언어 설정 불러오기
- saveLanguage(): 언어 설정 저장
- changeLanguage(): 언어 변경
- getCurrentLanguage(): 현재 언어 가져오기
```

**언어 결정 로직:**
1. AsyncStorage에 저장된 언어가 있으면 사용
2. 없으면 `expo-localization`으로 디바이스 언어 감지
3. 지원하지 않는 언어는 한국어로 폴백
4. 감지된 언어를 AsyncStorage에 저장

**설정 옵션:**
```typescript
{
  lng: initialLanguage,          // 초기 언어 (ko 또는 en)
  fallbackLng: 'ko',            // 폴백 언어
  compatibilityJSON: 'v3',      // React Native 호환성
  interpolation: {
    escapeValue: false,         // React XSS 방지 기본 제공
  },
  react: {
    useSuspense: false,         // React Native에서는 Suspense 미사용
  },
}
```

---

### 2. 언어 파일 구조 생성 ✓

#### 디렉토리 구조
```
src/locales/
├── ko/
│   └── translation.json    # 한국어 번역
└── en/
    └── translation.json    # 영어 번역
```

#### 지원 언어
- **Korean (ko)**: 기본 언어
- **English (en)**: 보조 언어

---

### 3. 한국어 번역 파일 작성 ✓

**파일**: `src/locales/ko/translation.json`

#### 번역 카테고리

##### A. 공통 (common)
- `appName`: "천원 쓰레기통"
- `loading`, `error`, `success`: 상태 메시지
- `confirm`, `cancel`, `close`: 버튼 텍스트
- `retry`, `back`, `next`, `done`: 액션 버튼

##### B. 온보딩 (onboarding)
- `title`: "천원 쓰레기통"
- `subtitle`: "천원을 기부하고\n감사 메시지를 받아보세요"
- `button.start`: "시작하기"

##### C. 메인 화면 (main)
- `header.title`: "천원 쓰레기통"
- `leaderboard.*`: 리더보드 관련 텍스트
- `button.donate`: "여기에 천원 버리기"

##### D. 닉네임 (nickname)
- `title`: "닉네임을 입력해주세요"
- `subtitle`: "2-12자의 닉네임으로\n리더보드에 표시됩니다"
- `placeholder`: "닉네임 입력"
- `charCount`: "{{current}}/{{max}}" (변수 지원)
- `validation.*`: 유효성 검증 메시지

##### E. 기부 완료 (donationComplete)
- `title.first`: "🎉 첫 기부 완료!"
- `title.normal`: "감사합니다!"
- `message`: "{{nickname}}님의 천원이\n소중히 사용되었습니다"
- `rank.*`, `donation.*`, `button.*`

##### F. 결제 (payment)
- `processing`: "결제 진행 중..."
- `error.*`: 모든 결제 에러 메시지

##### G. 설정 (settings)
- `language.korean`: "한국어"
- `language.english`: "English"

##### H. 다이얼로그 (dialog)
- `error.title`: "오류"
- `confirm.*`: 확인 다이얼로그

**총 번역 키**: 60+ 개

---

### 4. 영어 번역 파일 작성 ✓

**파일**: `src/locales/en/translation.json`

**주요 번역 예시:**
```json
{
  "onboarding": {
    "title": "Burn a Buck",
    "subtitle": "Donate ₩1,000 and\nreceive a thank you message"
  },
  "main": {
    "button": {
      "donate": "Donate ₩1,000 Here"
    }
  },
  "nickname": {
    "title": "Enter your nickname",
    "charCount": "{{current}}/{{max}}"
  },
  "donationComplete": {
    "title": {
      "first": "🎉 First Donation Complete!",
      "normal": "Thank You!"
    }
  }
}
```

**변수 보간 (Interpolation) 지원:**
- `{{nickname}}`: 닉네임 삽입
- `{{rank}}`: 순위 삽입
- `{{amount}}`: 금액 삽입
- `{{current}}`, `{{max}}`: 글자 수 카운터

---

### 5. 디바이스 언어 자동 감지 로직 구현 ✓

#### expo-localization 통합

```typescript
import * as Localization from 'expo-localization';

export function getDeviceLanguage(): SupportedLanguage {
  const locales = Localization.getLocales();
  const deviceLanguage = locales[0]?.languageCode;

  // 지원하는 언어인지 확인
  if (deviceLanguage === 'ko' || deviceLanguage === 'en') {
    return deviceLanguage;
  }

  // 지원하지 않는 언어는 한국어로 폴백
  return 'ko';
}
```

#### 언어 결정 우선순위
1. **AsyncStorage 저장값**: 사용자가 이전에 선택한 언어
2. **디바이스 언어**: `expo-localization`으로 감지
3. **폴백 언어**: 한국어 (ko)

#### AsyncStorage 통합
```typescript
// 저장
await AsyncStorage.setItem(STORAGE_KEYS.APP_LANGUAGE, 'ko');

// 불러오기
const savedLanguage = await AsyncStorage.getItem(STORAGE_KEYS.APP_LANGUAGE);
```

---

### 6. 화면에 번역 적용 ✓

#### 6-1. App.tsx 통합

**i18n 초기화 추가:**
```typescript
useEffect(() => {
  async function initializeApp() {
    // 1. i18n 초기화
    await initializeI18n();

    // 2. 결제 서비스 초기화
    await paymentService.initialize();

    setIsReady(true);
  }
  initializeApp();
}, []);
```

**로딩 화면:**
- i18n 초기화 완료 전까지 `ActivityIndicator` 표시
- 초기화 실패 시에도 앱 실행 (폴백)

#### 6-2. OnboardingScreen (`src/screens/OnboardingScreen.tsx`)

**적용된 번역:**
```typescript
const { t } = useTranslation();

<Text>{t('onboarding.title')}</Text>
<Text>{t('onboarding.subtitle')}</Text>
<Text>{t('onboarding.button.start')}</Text>
```

#### 6-3. MainScreen (`src/screens/MainScreen.tsx`)

**적용된 번역:**
```typescript
<Text>{t('main.header.title')}</Text>
<Text>{t('main.leaderboard.placeholder')}</Text>
<Text>{t('main.button.donate')}</Text>
```

#### 6-4. NicknameScreen (`src/screens/NicknameScreen.tsx`)

**적용된 번역:**
```typescript
<Text>{t('nickname.title')}</Text>
<Text>{t('nickname.subtitle')}</Text>
<TextInput placeholder={t('nickname.placeholder')} />
<Text>{t('nickname.charCount', { current: nickname.length, max: 12 })}</Text>
```

**Alert 메시지 번역:**
```typescript
Alert.alert(t('dialog.error.title'), t('nickname.validation.tooShort'));
```

#### 6-5. DonationCompleteScreen (`src/screens/DonationCompleteScreen.tsx`)

**적용된 번역:**
```typescript
<Text>{t(isFirstDonation ? 'donationComplete.title.first' : 'donationComplete.title.normal')}</Text>
<Text>{t('donationComplete.message', { nickname: donation.nickname })}</Text>
<Text>{t('donationComplete.rank.value', { rank })}</Text>
<Text>{t('donationComplete.donation.amount', { amount: donation.amount.toLocaleString() })}</Text>
```

**조건부 번역:**
- 첫 기부 vs 일반 기부: 다른 타이틀 표시
- 변수 보간: 닉네임, 순위, 금액 동적 삽입

---

## 📂 생성된 파일

```
src/
├── config/
│   └── i18n.ts                  # i18next 설정 및 초기화
├── locales/
│   ├── ko/
│   │   └── translation.json     # 한국어 번역 (60+ 키)
│   └── en/
│       └── translation.json     # 영어 번역 (60+ 키)
└── screens/
    ├── OnboardingScreen.tsx     # 번역 적용 ✓
    ├── MainScreen.tsx           # 번역 적용 ✓
    ├── NicknameScreen.tsx       # 번역 적용 ✓
    └── DonationCompleteScreen.tsx # 번역 적용 ✓

App.tsx (업데이트)              # i18n 초기화 추가
claudedocs/phase5-i18n-summary.md # 이 파일
```

---

## 🎯 사용 방법

### useTranslation 훅 사용

```typescript
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t, i18n } = useTranslation();

  return (
    <View>
      {/* 기본 번역 */}
      <Text>{t('common.appName')}</Text>

      {/* 변수 보간 */}
      <Text>{t('donationComplete.message', { nickname: 'John' })}</Text>

      {/* 현재 언어 확인 */}
      <Text>Current language: {i18n.language}</Text>
    </View>
  );
};
```

### 언어 변경

```typescript
import { changeLanguage } from '@/config/i18n';

// 언어 변경
await changeLanguage('en'); // 또는 'ko'
```

### Alert 번역

```typescript
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';

const { t } = useTranslation();

Alert.alert(
  t('dialog.error.title'),
  t('nickname.validation.tooShort')
);
```

---

## 🔧 i18next 설정 상세

### compatibilityJSON: 'v3'

React Native에서는 Intl API가 없을 수 있으므로 `v3` 형식 사용:
```json
{
  "key": "value",
  "key_plural": "values"
}
```

### useSuspense: false

React Native에서는 Suspense가 완전히 지원되지 않으므로 비활성화:
```typescript
react: {
  useSuspense: false
}
```

### escapeValue: false

React는 기본적으로 XSS를 방지하므로 비활성화:
```typescript
interpolation: {
  escapeValue: false
}
```

---

## 📊 번역 통계

### 한국어 (ko)
- **카테고리**: 8개 (common, onboarding, main, nickname, donationComplete, payment, settings, dialog)
- **번역 키**: 60+ 개
- **변수 보간**: 5개 (nickname, rank, amount, current, max)

### 영어 (en)
- **동일한 구조**
- **모든 키 번역 완료**
- **자연스러운 영어 표현**

---

## ⚠️ 주의사항

### 1. 초기화 순서
- **중요**: App.tsx에서 i18n을 결제 서비스보다 먼저 초기화
- i18n 초기화 실패 시에도 앱 실행 (폴백)

### 2. 변수 보간
- 변수는 `{{variableName}}` 형식 사용
- 객체를 전달하여 동적 값 삽입
```typescript
t('key', { name: 'John', age: 30 })
```

### 3. AsyncStorage
- 언어 설정은 `@burn-a-buck:app-language` 키로 저장
- 값: `'ko'` 또는 `'en'`

### 4. expo-localization
- `getLocales()[0]?.languageCode`로 디바이스 언어 감지
- 지원하지 않는 언어는 한국어로 폴백

---

## 🚀 다음 단계

### Phase 6: 온보딩 화면 상세 구현
- 앱 소개 슬라이드
- 스와이프 네비게이션
- 진행 표시 인디케이터
- **번역된 텍스트 사용** ✓

### Phase 7: 메인 화면 리더보드 구현
- Top Ranker, Recent Donations UI
- Supabase 데이터 조회
- React Query 통합
- **번역된 텍스트 사용** ✓

### Phase 10: 닉네임 유효성 검증
- 중복 확인 다이얼로그
- **번역된 에러 메시지 사용** ✓

### Phase 12: 소셜 공유
- **번역된 공유 메시지** 생성 (추가 작업 필요)

---

## 🌐 언어 추가 방법 (추후)

### 1. 번역 파일 추가
```bash
mkdir src/locales/ja
touch src/locales/ja/translation.json
```

### 2. i18n.ts 업데이트
```typescript
import jaTranslation from '../locales/ja/translation.json';

const resources = {
  ko: { translation: koTranslation },
  en: { translation: enTranslation },
  ja: { translation: jaTranslation }, // 추가
};

export const SUPPORTED_LANGUAGES = {
  ko: 'Korean',
  en: 'English',
  ja: 'Japanese', // 추가
} as const;
```

### 3. getDeviceLanguage 업데이트
```typescript
if (deviceLanguage === 'ko' || deviceLanguage === 'en' || deviceLanguage === 'ja') {
  return deviceLanguage;
}
```

---

## 📚 관련 문서

- [Phase 4 완료 요약](./phase4-navigation-summary.md) - 네비게이션 구조
- [Phase 3 완료 요약](./phase3-payment-summary.md) - 결제 시스템
- [전체 개발 계획](./burn-a-buck-plan.md) - 72 tasks 로드맵
- [i18next 문서](https://www.i18next.com/)
- [react-i18next 문서](https://react.i18next.com/)
- [expo-localization 문서](https://docs.expo.dev/versions/latest/sdk/localization/)

---

**작성일**: 2025-11-03
**Phase**: 5/18 완료
**진행률**: 27.8% (5/18 phases)
