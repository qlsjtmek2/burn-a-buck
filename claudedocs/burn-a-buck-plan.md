# 천원 쓰레기통 앱 개발 계획

## 📋 프로젝트 개요

- **생성일**: 2025-11-03
- **작성자**: Claude Code (app-todolist-generator)
- **프로젝트 타입**: 후원/결제 기반 모바일 앱
- **복잡도**: 복잡 (4주 이상)
- **총 작업 수**: 72개
- **예상 기간**: 35-40일

### 프로젝트 설명

"천원 쓰레기통"은 사용자가 1000원을 결제하면 감사 메시지를 보여주고 리더보드에 등록하는 독특한 컨셉의 앱입니다. 사용자는 후원 금액으로 순위를 경쟁하며, 친구들과 결과를 공유할 수 있습니다.

## 🛠️ 기술 스택

- **플랫폼**: Mobile (Android)
- **프레임워크**: React Native + Expo
- **백엔드**: Supabase
- **상태관리**: Zustand + React Query
- **결제**: react-native-iap (Google Play In-App Purchase)
- **다국어**: i18next
- **UI 라이브러리**: React Native Paper / React Navigation

## ✨ 주요 기능

- ✅ Google Play 인앱 결제 (1000원 상품)
- ✅ 최초/중복 후원 구분 및 감사 메시지
- ✅ 후원자 배지 지급
- ✅ 닉네임 설정 (2-12자, 중복 검증)
- ✅ 리더보드 (총 후원 금액 기준)
- ✅ 최근 후원 리스트
- ✅ 공유 기능 (카카오톡, SNS, 링크 복사)
- ✅ 다국어 지원 (한국어, 영어)
- ✅ 온보딩 화면 (최초 실행 시)
- ✅ 애니메이션 (fade-in, slide-in, 카운팅)
- ✅ 에러 처리 (결제 실패, 네트워크 오류)

## 🗄️ 데이터베이스 스키마

### donations 테이블 (후원 내역)
```sql
CREATE TABLE donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  nickname VARCHAR(12) NOT NULL,
  amount INTEGER NOT NULL DEFAULT 1000,
  receipt_token TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### users 테이블 (사용자)
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

### leaderboard 뷰 (순위 계산용)
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

---

## 🎯 Phase 1: 프로젝트 초기 설정

### 작업 1-4: 프로젝트 기반 구축

- [x] **React Native 프로젝트 생성 (Expo 또는 CLI)**
  - Expo SDK 최신 버전 사용
  - TypeScript 설정

- [x] **필수 패키지 설치**
  - React Navigation (Stack, Bottom Tabs)
  - Zustand (상태관리)
  - React Query (서버 상태)
  - i18next (다국어)

- [x] **프로젝트 폴더 구조 구성**
  ```
  src/
  ├── features/
  │   ├── onboarding/
  │   ├── donation/
  │   ├── leaderboard/
  │   ├── nickname/
  │   └── share/
  ├── components/
  ├── services/
  ├── hooks/
  ├── store/
  ├── navigation/
  └── locales/
  ```

- [x] **TypeScript 설정 및 ESLint/Prettier 구성**

---

## 🎯 Phase 2: Supabase 백엔드 설정

### 작업 5-8: 백엔드 인프라

- [x] **Supabase 프로젝트 생성**
  - 프로젝트 생성 및 API 키 발급
  - 환경 변수 설정 (.env)

- [x] **데이터베이스 스키마 설계 및 생성**
  - donations 테이블
  - users 테이블
  - leaderboard 뷰

- [x] **Supabase 클라이언트 설정 및 API 서비스 레이어 구현**
  - `services/supabase.ts`
  - API 함수들 구현

- [x] **RLS(Row Level Security) 정책 설정**
  - 읽기는 모두 허용
  - 쓰기는 인증된 사용자만

---

## 🎯 Phase 3: Google Play 인앱 결제 설정

### 작업 9-12: 결제 시스템

- [x] **react-native-iap 패키지 설치**
  ```bash
  npm install react-native-iap
  ```

- [ ] **Google Play Console에서 인앱 상품 등록 (1000원 상품)**
  - Product ID: `donate_1000won`
  - 가격: ₩1,000

- [x] **결제 서비스 구현 (구매, 검증, 영수증 처리)**
  - `services/payment.ts`
  - 구매 플로우
  - 영수증 검증

- [x] **결제 영수증 Supabase에 저장하는 로직 구현**
  - 중복 결제 방지
  - 영수증 토큰 저장

---

## 🎯 Phase 4: 네비게이션 구조 설정

### 작업 13-14: 네비게이션

- [x] **React Navigation Stack 구성**
  - OnboardingScreen
  - MainScreen
  - NicknameScreen
  - DonationCompleteScreen

- [x] **온보딩 플로우 구현 (최초 실행 시에만 표시, AsyncStorage 활용)**
  - 최초 실행 여부 확인
  - 온보딩 완료 후 플래그 저장

---

## 🎯 Phase 5: 다국어 지원 구현

### 작업 15-17: 국제화

- [x] **i18next 설정 및 언어 파일 구조 생성**
  ```
  locales/
  ├── ko/
  │   └── translation.json
  └── en/
      └── translation.json
  ```

- [x] **한국어, 영어 번역 파일 작성 (모든 화면 텍스트)**
  - 온보딩 화면
  - 메인 화면
  - 버튼 텍스트
  - 다이얼로그 메시지

- [x] **디바이스 언어 자동 감지 로직 구현**
  - `expo-localization` 사용

---

## 🎯 Phase 6: 온보딩 화면 구현

### 작업 18-20: 온보딩 UX

- [x] **OTA 비활성화**

- [x] **온보딩 UI 디자인 및 구현**
  - 앱 소개 슬라이드
  - "이 앱은 아무것도 아닙니다! 그냥 후원해주세요."

- [x] **시작하기 버튼 및 메인 화면 전환 로직**
  - AsyncStorage에 온보딩 완료 플래그 저장

---

## 🎯 Phase 7: 메인 화면 구현

### 작업 21-25: 메인 UI

- [x] **메인 화면 레이아웃 설계 (후원 버튼 + 리더보드)**
  - 후원 버튼이 눈에 잘 띄도록
  - 리더보드가 중요하게 보이도록

- [x] **후원 버튼 UI 구현 ('여기에 천원 버리기' 버튼)**
  - 큰 사이즈
  - Primary 색상
  - 그림자 효과

- [x] **Top Ranker 리더보드 섹션 구현 (1~3등 특별 테두리)**
  - 금, 은, 동 테두리 효과
  - "랭킹" 타이틀

- [x] **최근 후원 리더보드 섹션 구현**
  - 최근 10명 표시
  - 시간 표시 (X분 전, X시간 전)

- [x] **리더보드 데이터 조회 API 연동 (React Query 활용)**
  - `useQuery` 훅 사용
  - 자동 리프레시

---

## 🎯 Phase 8: 결제 플로우 구현 ✅

### 작업 26-29: 결제 처리

- [x] **후원 버튼 클릭 시 결제 화면 트리거**
  - Google Play 결제 화면 띄우기
  - MainScreen에 `useDonationPayment` hook 통합
  - 후원 버튼에 `handleDonation` 이벤트 연결

- [x] **Google Play 결제 처리 로직 구현**
  - 결제 시작 (`payment.native.ts`)
  - 결제 중 로딩 표시 (`PaymentLoadingDialog`)
  - 상태별 로딩 메시지 (initializing, purchasing, validating, saving)

- [x] **결제 성공/실패 처리 및 다이얼로그 구현**
  - 성공: 감사 화면으로 이동 (`DonationComplete`)
  - 실패: 에러 다이얼로그 표시 (`PaymentErrorDialog`)
  - 재시도 기능 포함

- [x] **최초 후원 여부 검증 로직 구현**
  - AsyncStorage에서 확인 (`STORAGE_KEYS.FIRST_DONATION`)
  - `useDonationPayment` hook에서 `checkFirstDonation()` 구현
  - 서버에서도 확인 (`payment.native.ts` → `saveDonationToSupabase`)

---

## 🎯 Phase 9: 감사 메시지 화면 구현

### 작업 30-32: 후원 완료 UX

- [ ] **최초 후원 감사 메시지 UI 구현**
  - 감사 메시지 표시
  - 애니메이션 효과

- [ ] **후원자 배지 지급 로직 구현**
  - Google Play 배지 API 호출

- [ ] **다음 버튼 및 닉네임 설정 화면 전환**
  - 다음 버튼 클릭 시 닉네임 화면으로

---

## 🎯 Phase 10: 닉네임 설정 화면 구현

### 작업 33-38: 닉네임 관리

- [ ] **닉네임 입력 UI 구현 (최대 12자)**
  - TextInput 컴포넌트
  - 글자 수 카운터

- [ ] **닉네임 유효성 검증 (2자 이상, 12자 이하)**
  - 실시간 검증
  - 확인 버튼 활성화/비활성화

- [ ] **닉네임 중복 검사 API 구현 및 연동**
  - Supabase 쿼리
  - 중복 여부 반환

- [ ] **중복 닉네임 다이얼로그 구현 (동명이인 확인)**
  - "중복된 닉네임입니다. 그래도 사용하시겠습니까?"
  - 아니오/예 버튼

- [ ] **닉네임 AsyncStorage에 저장**
  - 다음 후원부터는 입력 생략

- [ ] **닉네임 저장 실패 처리 및 다이얼로그**
  - 네트워크 오류 시 재시도

---

## 🎯 Phase 11: 후원 완료 화면 구현

### 작업 39-42: 완료 화면

- [ ] **후원 완료 UI 구현 (닉네임, 총 후원금액, 순위)**
  - 카드 형식 UI
  - 축하 메시지

- [ ] **현재 순위 조회 및 표시 로직**
  - Supabase에서 순위 계산
  - 실시간 업데이트

- [ ] **친구에게 자랑하기 버튼 구현**
  - 공유 플로우로 연결

- [ ] **홈으로 돌아가기 버튼 구현**
  - 메인 화면으로 복귀

---

## 🎯 Phase 12: 공유 기능 구현

### 작업 43-47: 소셜 공유

- [ ] **공유 플랫폼 선택 Bottom Sheet 구현**
  - 반투명 배경
  - 플랫폼 아이콘 표시

- [ ] **카카오톡 공유 기능 구현 (Kakao SDK 연동)**
  - `@react-native-kakao/share` 설치
  - 템플릿 메시지 전송

- [ ] **소셜 미디어 공유 (Instagram, Facebook, Twitter) 구현**
  - `react-native-share` 사용

- [ ] **링크 복사 및 문자 공유 구현**
  - Clipboard API
  - SMS 공유

- [ ] **공유 메시지 템플릿 생성 (동적 데이터 삽입)**
  ```
  나도 천원 쓰레기통에 천원을 버렸어요! 💸
  현재 {순위}위로 등극!
  총 후원 금액: {금액}원

  {앱 링크}
  ```

---

## 🎯 Phase 13: 애니메이션 구현

### 작업 48-50: 모션 디자인

- [ ] **리더보드 진입 시 top-down fade-in 애니메이션**
  - `react-native-reanimated` 사용

- [ ] **새 후원자 등록 시 slide-in 애니메이션**
  - 최근 후원 섹션에 적용

- [ ] **순위 변동 시 숫자 카운팅 애니메이션**
  - 카운팅 효과로 순위 변화 강조

---

## 🎯 Phase 14: 에러 처리 및 엣지 케이스

### 작업 51-55: 안정성 강화

- [ ] **결제 실패 다이얼로그 및 재시도 로직**
  - "❌ 결제 실패"
  - "다시 시도" / "취소" 버튼

- [ ] **네트워크 연결 실패 처리 (오프라인 모드)**
  - 연결 상태 감지
  - 오프라인 메시지 표시

- [ ] **캐시된 리더보드 표시 로직 (마지막 업데이트 시간)**
  - React Query 캐시 활용
  - 마지막 업데이트 시간 표시

- [ ] **자동 재시도 로직 구현 (3회 시도)**
  - 네트워크 요청 실패 시 자동 재시도

- [ ] **빈 상태 UI 구현 (데이터 없을 때)**
  - "아직 후원자가 없습니다" 메시지

---

## 🎯 Phase 15: 로딩 상태 및 UX 개선

### 작업 56-59: 사용자 경험

- [ ] **전역 로딩 인디케이터 구현**
  - 스피너 컴포넌트

- [ ] **Skeleton 로딩 화면 구현 (리더보드)**
  - Shimmer 효과

- [ ] **Pull-to-refresh 기능 구현**
  - 리더보드 새로고침

- [ ] **토스트 메시지 시스템 구현**
  - 성공/에러 메시지 표시

---

## 🎯 Phase 16: 테스트

### 작업 60-64: 품질 보증

- [ ] **.env 내 Development Settings 주석 처리**

- [ ] **src/config/env __DEV__ = false로 바꾸기**

- [ ] **결제 플로우 E2E 테스트 (샌드박스 환경)**
  - 테스트 결제 계정 사용

- [ ] **닉네임 설정 및 중복 검증 테스트**
  - 다양한 시나리오 테스트

- [ ] **리더보드 조회 및 순위 계산 테스트**
  - 데이터 정확성 검증

- [ ] **다국어 전환 테스트**
  - 모든 화면 번역 확인

- [ ] **네트워크 오류 시나리오 테스트**
  - 오프라인 모드 검증

- [ ] **OTA 활성화 및 expo-updates 패키지 설치**

---

## 🎯 Phase 17: 디자인 및 스타일링 마무리

### 작업 65-69: 비주얼 폴리싱

- [ ] **앱 아이콘 제작 (512x512, 둥근 사각형)**
  - 쓰레기통 모티브
  - 심플한 디자인

- [ ] **스플래시 스크린 디자인 및 적용**
  - 브랜드 로고/아이콘

- [ ] **그래픽 이미지 제작 (1024x500, 스토어용)**
  - 스토어 스크린샷

- [ ] **반응형 디자인 검증 (다양한 화면 크기)**
  - 작은 화면/큰 화면 테스트

---

## 🎯 Phase 17.5: Mock IAP를 실제 IAP로 교체

### 배경
현재 개발 단계에서는 Expo Go에서 테스트할 수 있도록 Mock IAP 구현을 사용하고 있습니다.
배포 전에 실제 Google Play In-App Purchase로 교체해야 합니다.

### 체크리스트: Mock에서 실제 IAP로 전환

#### 0. 의존성 최신화 (Development Build 전 필수)
- [ ] **react-native-iap v14로 업그레이드**
  ```bash
  npm install react-native-iap@latest react-native-nitro-modules@latest
  ```
  - v14는 Nitro Modules 사용으로 성능 향상
  - React Native 0.79+ 필요
  - Breaking changes 확인: [v14 마이그레이션 가이드](https://hyochan.github.io/react-native-iap/)

- [ ] **Expo SDK 최신 버전으로 업그레이드 (선택)**
  ```bash
  npx expo install expo@latest
  npx expo install --fix
  ```
  - 현재: SDK 54 → 최신: SDK 52+ (2025년 기준)
  - React Native 버전도 함께 업그레이드됨

- [ ] **주요 의존성 최신화**
  ```bash
  # React Navigation 최신화
  npx expo install @react-navigation/native@latest @react-navigation/stack@latest

  # React Query 최신화
  npm install @tanstack/react-query@latest

  # React Native Paper 최신화
  npx expo install react-native-paper@latest

  # 기타 Expo 패키지 최신화
  npx expo install --check
  npx expo install --fix
  ```

- [ ] **Breaking Changes 확인 및 코드 수정**
  - react-native-iap v14: API 변경사항 확인
  - React Navigation: 라우팅 변경사항
  - React Query: 설정 변경사항
  - TypeScript 타입 에러 수정

- [ ] **테스트 실행 (Mock 모드)**
  ```bash
  npm start
  # Expo Go에서 앱 동작 확인
  # 모든 화면 정상 작동 확인
  ```

#### 1. Development Build 환경 설정
- [ ] **expo-dev-client 설치**
  ```bash
  npx expo install expo-dev-client
  ```

- [ ] **Native 디렉토리 생성 (Prebuild)**
  ```bash
  npx expo prebuild --clean
  ```

- [ ] **Kotlin 버전 설정 (Android)**
  - `app.json`에 `expo-build-properties` 플러그인 추가
  - Kotlin 2.1.20 이상 지정 (react-native-iap v14 요구사항)
  ```json
  {
    "expo": {
      "plugins": [
        [
          "expo-build-properties",
          {
            "android": {
              "kotlinVersion": "2.1.20"
            }
          }
        ]
      ]
    }
  }
  ```

#### 2. Google Play Console 설정
- [ ] **Google Play Console에 앱 등록**
  - 패키지 이름: `com.qlsjtmek2.burnaabuck`
  - 앱 제목 및 설명 등록

- [ ] **인앱 상품 등록**
  - Product ID: `donate_1000won`
  - 제품 유형: 소모성 (Consumable)
  - 가격: ₩1,000
  - 제품 이름: "천원 쓰레기통 기부"
  - 제품 설명: "₩1,000 기부하고 명예의 전당에 이름 올리기"

- [ ] **테스트 계정 등록**
  - 라이센스 테스트 계정 추가
  - 샌드박스 환경 설정

#### 3. 코드 변경사항
- [ ] **env.ts 수정: IAP_TEST_MODE를 false로 변경**
  ```typescript
  // src/config/env.ts
  export const IAP_TEST_MODE = false; // 또는 조건부로 설정
  ```

- [ ] **프로덕션 환경 설정 추가 (선택사항)**
  ```typescript
  // src/config/env.ts
  export const IAP_TEST_MODE = __DEV__ && !process.env.USE_REAL_IAP;
  ```

#### 4. EAS Build로 테스트 빌드 생성
- [ ] **EAS Build 설정**
  ```bash
  npm install -g eas-cli
  eas login
  eas build:configure
  ```

- [ ] **Development Build 생성 (Android)**
  ```bash
  eas build --platform android --profile development
  ```

- [ ] **빌드 설치 및 실제 기기 테스트**
  - APK 다운로드 및 설치
  - 실제 Google Play 결제 테스트 (샌드박스)

#### 5. 실제 IAP 테스트
- [ ] **결제 플로우 테스트**
  - 상품 조회 (getProducts) 동작 확인
  - 구매 요청 (requestPurchase) 정상 작동
  - 영수증 검증 (validateReceipt) 확인
  - Supabase 저장 확인

- [ ] **에러 처리 테스트**
  - 사용자 취소 (USER_CANCELLED)
  - 네트워크 오류 (NETWORK_ERROR)
  - 중복 결제 방지 (DUPLICATE_PAYMENT)

- [ ] **리더보드 업데이트 확인**
  - 결제 후 리더보드 즉시 반영
  - 닉네임 표시 정상
  - 순위 계산 정확성

#### 6. Mock 코드 정리 (선택사항)
- [ ] **Mock 관련 코드 제거 또는 주석 처리**
  - `payment.native.ts`의 `if (IAP_TEST_MODE)` 블록 제거
  - 또는 프로덕션 빌드에서 자동으로 제외되도록 설정

- [ ] **env.ts에서 테스트 모드 플래그 제거 (선택)**
  - 완전히 제거하거나 주석 처리

#### 7. 검증
- [ ] **내부 테스터 피드백 수집**
  - 최소 3-5명의 테스터에게 배포
  - 실제 결제 테스트 (샌드박스)
  - 버그 리포트 수집 및 수정

- [ ] **프로덕션 빌드 생성**
  ```bash
  eas build --platform android --profile production
  ```

### 주의사항
- ⚠️ **현재 버전**: react-native-iap v13, Expo SDK 54, React Native 0.81.5
- ⚠️ **목표 버전**: react-native-iap v14+, Expo SDK 52+, React Native 0.79+
- ⚠️ Mock IAP 사용 시 Supabase 데이터베이스에는 실제 데이터가 저장됩니다
- ⚠️ 실제 IAP 테스트는 반드시 실제 기기에서 수행해야 합니다 (시뮬레이터/에뮬레이터 불가)
- ⚠️ Google Play Console 상품 등록 후 활성화까지 몇 시간 소요될 수 있습니다
- ⚠️ 샌드박스 테스트 계정으로 테스트 시 실제 결제는 발생하지 않습니다
- ⚠️ 의존성 업그레이드 시 Breaking Changes 확인 필수 (특히 react-native-iap v13 → v14)

### 관련 리소스
- [React Native IAP 공식 문서](https://hyochan.github.io/react-native-iap/)
- [Expo Development Build 가이드](https://docs.expo.dev/develop/development-builds/introduction/)
- [Google Play Console 인앱 상품 설정](https://support.google.com/googleplay/android-developer/answer/1153481)

---

## 🎯 Phase 18: 배포 준비

### 작업 70-72: 출시

- [x] **개인정보처리방침 페이지 작성 및 호스팅**
  - URL: https://qlsjtmek2.github.io/portfolio-site/projects/burn-a-buck/privacy

- [ ] **앱 스토어 설명 및 스크린샷 준비**
  - 앱 이름: "천원 쓰레기통"
  - 설명: "당신의 천원을 저에게 버려주세요!"

- [ ] **EAS Build 설정 (Android APK/AAB)**
  ```bash
  eas build --platform android
  ```

- [ ] **Google Play Console 앱 등록**
  - 내부 테스트 트랙 배포

- [ ] **내부 테스트 트랙 배포 및 검증**
  - 테스터 초대
  - 피드백 수집

- [ ] **프로덕션 릴리스 제출**
  - 검토 대기
  - 승인 후 출시

---

## 📦 필수 패키지 목록

### 현재 버전 (개발 중)
```json
{
  "dependencies": {
    "@react-navigation/native": "^7.x",
    "@react-navigation/stack": "^7.x",
    "@supabase/supabase-js": "^2.x",
    "react-native-iap": "^13.x",
    "react-native-nitro-modules": "^0.x",
    "zustand": "^4.x",
    "@tanstack/react-query": "^5.x",
    "react-i18next": "^15.x",
    "i18next": "^23.x",
    "@react-native-async-storage/async-storage": "^2.x",
    "react-native-paper": "^5.x",
    "react-native-share": "^10.x",
    "react-native-reanimated": "^4.x",
    "react-native-gesture-handler": "^2.x",
    "expo-localization": "^15.x",
    "expo": "~54.0.0",
    "expo-dev-client": "^5.x"
  }
}
```

### 목표 버전 (Phase 17.5 업그레이드 후)
```json
{
  "dependencies": {
    "@react-navigation/native": "^7.x",
    "@react-navigation/stack": "^7.x",
    "@supabase/supabase-js": "^2.x",
    "react-native-iap": "^14.x",
    "react-native-nitro-modules": "latest",
    "zustand": "^5.x",
    "@tanstack/react-query": "^5.x",
    "react-i18next": "^15.x",
    "i18next": "^23.x",
    "@react-native-async-storage/async-storage": "^2.x",
    "react-native-paper": "^5.x",
    "react-native-share": "^11.x",
    "react-native-reanimated": "^4.x",
    "react-native-gesture-handler": "^2.x",
    "expo-localization": "latest",
    "expo": "^52.0.0",
    "expo-dev-client": "latest"
  }
}
```

### 주요 변경사항
- **react-native-iap**: v13 → v14 (Nitro Modules, 성능 향상)
- **Expo SDK**: 54 → 52+ (최신 안정 버전)
- **React Native**: 0.81.5 → 0.79+ (react-native-iap v14 요구사항)
- **zustand**: v4 → v5 (최신 기능)
- **@tanstack/react-query**: v5 유지 (안정 버전)

---

## 📝 메모 및 주의사항

### 중요 결정사항
- **결제 시스템**: Google Play In-App Purchase만 지원 (iOS는 Phase 2)
- **백엔드**: Supabase 사용 (실시간 업데이트, Row Level Security)
- **상태관리**: Zustand (클라이언트) + React Query (서버)
- **다국어**: 한국어, 영어 먼저 지원 (추후 확장 가능)

### 알려진 이슈
- Google Play 샌드박스 결제 테스트 필요
- 카카오톡 SDK 인증 키 발급 필요
- 개인정보처리방침 페이지 호스팅 필요
