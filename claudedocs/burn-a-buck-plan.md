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

- [x] OTA 비활성화

- [x] **온보딩 UI 디자인 및 구현**
  - 앱 소개 슬라이드
  - "이 앱은 아무것도 아닙니다! 그냥 후원해주세요."

- [x] **시작하기 버튼 및 메인 화면 전환 로직**
  - AsyncStorage에 온보딩 완료 플래그 저장

---

## 🎯 Phase 7: 메인 화면 구현

### 작업 21-25: 메인 UI

- [ ] **메인 화면 레이아웃 설계 (후원 버튼 + 리더보드)**
  - 후원 버튼이 눈에 잘 띄도록
  - 리더보드가 중요하게 보이도록

- [ ] **후원 버튼 UI 구현 ('여기에 천원 버리기' 버튼)**
  - 큰 사이즈
  - Primary 색상
  - 그림자 효과

- [ ] **Top Ranker 리더보드 섹션 구현 (1~3등 특별 테두리)**
  - 금, 은, 동 테두리 효과
  - "이달의 쓰레기왕" 타이틀

- [ ] **최근 후원 리더보드 섹션 구현**
  - 최근 10명 표시
  - 시간 표시 (X분 전, X시간 전)

- [ ] **리더보드 데이터 조회 API 연동 (React Query 활용)**
  - `useQuery` 훅 사용
  - 자동 리프레시

---

## 🎯 Phase 8: 결제 플로우 구현

### 작업 26-29: 결제 처리

- [ ] **후원 버튼 클릭 시 결제 화면 트리거**
  - Google Play 결제 화면 띄우기

- [ ] **Google Play 결제 처리 로직 구현**
  - 결제 시작
  - 결제 중 로딩 표시

- [ ] **결제 성공/실패 처리 및 다이얼로그 구현**
  - 성공: 감사 화면으로 이동
  - 실패: 에러 다이얼로그 표시

- [ ] **최초 후원 여부 검증 로직 구현**
  - AsyncStorage에서 확인
  - 서버에서도 확인

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

- [ ] OTA 활성화 및 expo-updates 패키지 설치

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

- [ ] **다크 모드 지원 (선택사항)**
  - 라이트/다크 테마

---

## 🎯 Phase 18: 배포 준비

### 작업 70-72: 출시

- [ ] **개인정보처리방침 페이지 작성 및 호스팅**
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

## 📊 진행 상황

- **완료**: 0/72 (0.0%)
- **진행 중**: Phase 1
- **예상 남은 시간**: 35-40일
- **현재 Phase**: 프로젝트 초기 설정

### Phase별 진행 현황

| Phase | 작업 수 | 완료 | 진행률 |
|-------|---------|------|--------|
| Phase 1 | 4 | 0 | 0% |
| Phase 2 | 4 | 0 | 0% |
| Phase 3 | 4 | 0 | 0% |
| Phase 4 | 2 | 0 | 0% |
| Phase 5 | 3 | 0 | 0% |
| Phase 6 | 3 | 0 | 0% |
| Phase 7 | 5 | 0 | 0% |
| Phase 8 | 4 | 0 | 0% |
| Phase 9 | 3 | 0 | 0% |
| Phase 10 | 6 | 0 | 0% |
| Phase 11 | 4 | 0 | 0% |
| Phase 12 | 5 | 0 | 0% |
| Phase 13 | 3 | 0 | 0% |
| Phase 14 | 5 | 0 | 0% |
| Phase 15 | 4 | 0 | 0% |
| Phase 16 | 5 | 0 | 0% |
| Phase 17 | 5 | 0 | 0% |
| Phase 18 | 6 | 0 | 0% |

---

## 📦 필수 패키지 목록

```json
{
  "dependencies": {
    "@react-navigation/native": "^6.x",
    "@react-navigation/stack": "^6.x",
    "@supabase/supabase-js": "^2.x",
    "react-native-iap": "^12.x",
    "zustand": "^4.x",
    "@tanstack/react-query": "^5.x",
    "react-i18next": "^13.x",
    "i18next": "^23.x",
    "@react-native-async-storage/async-storage": "^1.x",
    "react-native-share": "^10.x",
    "@react-native-kakao/share": "^2.x",
    "react-native-reanimated": "^3.x",
    "react-native-gesture-handler": "^2.x",
    "expo-localization": "^15.x"
  }
}
```

---

## 🎨 디자인 가이드라인

### 색상 팔레트
- **Primary**: #FF6B6B (경쾌한 빨강 - 쓰레기통 이미지)
- **Secondary**: #4ECDC4 (청록색 - 액센트)
- **Success**: #95E1D3 (성공 메시지용)
- **Background**: #F7F7F7 (밝은 회색)
- **Text**: #2D3436 (진한 회색)

### 타이포그래피
- **헤더**: Bold, 24-32pt
- **본문**: Regular, 16pt
- **버튼**: SemiBold, 18pt

### 주요 컴포넌트
- **후원 버튼**: 큰 사이즈, Primary 색상, 그림자 효과
- **리더보드 카드**: 1~3등은 금/은/동 테두리
- **닉네임 입력**: 깔끔한 TextInput, 글자 수 카운터

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

### 다음 마일스톤
1. **Week 1-2**: Phase 1-5 완료 (프로젝트 기반 설정)
2. **Week 3-4**: Phase 6-11 완료 (핵심 기능)
3. **Week 5**: Phase 12-15 완료 (부가 기능)
4. **Week 6**: Phase 16-18 완료 (테스트 & 배포)

---

_이 문서는 Claude Code의 app-todolist-generator 스킬로 자동 생성되었습니다._
_마지막 업데이트: 2025-11-03_
