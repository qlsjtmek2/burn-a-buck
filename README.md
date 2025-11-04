# 천원 쓰레기통 (Burn a Buck)

기부 기반 모바일 앱으로, 사용자가 ₩1,000을 기부하면 감사 메시지를 받고 리더보드에 등록됩니다. 총 기부 금액에 따라 순위를 경쟁하고 친구들과 성과를 공유할 수 있습니다.

## 📱 프로젝트 개요

- **플랫폼**: Android (Google Play 우선), iOS (추후)
- **현재 상태**: Phase 1 완료 - 프로젝트 초기 설정 완료
- **개발 계획**: `claudedocs/burn-a-buck-plan.md` 참조 (72개 작업, 18개 페이즈)

## 🛠 기술 스택

### Frontend
- **Framework**: React Native + Expo SDK ~54.0
- **Language**: TypeScript (strict mode)
- **Navigation**: React Navigation (Stack, Bottom Tabs)
- **State Management**:
  - Zustand (client state)
  - React Query (server state)
- **Internationalization**: i18next
- **Animations**: React Native Reanimated

### Backend
- **BaaS**: Supabase (PostgreSQL, Auth, Storage, Realtime)
- **Payment**: react-native-iap (Google Play In-App Purchase)

### Dev Tools
- **Code Quality**: ESLint, Prettier
- **Type Checking**: TypeScript strict mode
- **Version Control**: Git

## 📁 프로젝트 구조

```
.
├── src/
│   ├── features/           # 기능별 모듈
│   │   ├── onboarding/     # 온보딩 화면
│   │   ├── donation/       # 결제 및 기부 플로우
│   │   ├── leaderboard/    # 순위 표시
│   │   ├── nickname/       # 닉네임 설정
│   │   └── share/          # 소셜 공유
│   ├── components/         # 공유 컴포넌트
│   ├── services/           # API 및 비즈니스 로직
│   ├── hooks/              # 커스텀 React 훅
│   ├── store/              # Zustand 스토어
│   ├── navigation/         # 내비게이션 설정
│   ├── locales/            # i18n 번역 파일
│   │   ├── ko/             # 한국어
│   │   └── en/             # 영어
│   └── types/              # TypeScript 타입 정의
├── .claude/                # Claude Code 설정
│   └── skills/             # 도메인별 스킬
├── claudedocs/             # 프로젝트 문서
└── dev/                    # Dev docs 패턴
```

## 🚀 시작하기

### 필수 요구사항

- Node.js 18+
- npm 또는 yarn
- Expo CLI
- Android Studio (Android 개발용) 또는 Xcode (iOS 개발용)

### 설치

```bash
# 의존성 설치
npm install

# 개발 서버 시작
npm start

# Android에서 실행
npm run android

# iOS에서 실행 (macOS only)
npm run ios
```

### 사용 가능한 스크립트

```bash
# 개발 서버
npm start

# 플랫폼별 실행
npm run android
npm run ios
npm run web

# 코드 품질
npm run lint              # ESLint 검사
npm run lint:fix          # ESLint 자동 수정
npm run format            # Prettier 포맷팅
npm run format:check      # Prettier 검사
npm run type-check        # TypeScript 타입 체크
```

## 🎯 주요 기능

### 1. Google Play 인앱 결제 (₩1,000)
- Product ID: `donate_1000won`
- 첫 기부 vs 재기부 감지
- 영수증 검증 및 저장

### 2. 닉네임 시스템
- 2-12자 제한
- 중복 감지 및 확인 대화상자
- AsyncStorage에 저장하여 재사용

### 3. 리더보드
- **Top Ranker**: 1-3위 특별 테두리 (금/은/동)
- **Recent Donations**: 최근 10명의 기부자와 타임스탬프
- React Query를 사용한 실시간 업데이트

### 4. 소셜 공유
- 카카오톡, Instagram, Facebook, Twitter
- 링크 복사 및 SMS 공유
- 순위와 금액이 포함된 동적 메시지 템플릿

### 5. 다국어 지원
- 한국어 (기본) 및 영어
- expo-localization을 사용한 자동 언어 감지

### 6. 애니메이션
- 리더보드 진입: 위에서 아래로 페이드인
- 새 기부자: 슬라이드인 애니메이션
- 순위 변경: 숫자 카운팅 애니메이션

## 🗄 데이터베이스 스키마

### Users 테이블
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  nickname VARCHAR(12) UNIQUE,
  total_donated INTEGER DEFAULT 0,
  first_donation_at TIMESTAMP,
  last_donation_at TIMESTAMP,
  badge_earned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Donations 테이블
```sql
CREATE TABLE donations (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  nickname VARCHAR(12) NOT NULL,
  amount INTEGER DEFAULT 1000,
  receipt_token TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Leaderboard 뷰
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

## 🎨 디자인 가이드라인

### 색상 팔레트
- **Primary**: #FF6B6B (생동감 있는 빨강 - 쓰레기통 테마)
- **Secondary**: #4ECDC4 (청록색 - 강조)
- **Success**: #95E1D3 (성공 메시지)
- **Background**: #F7F7F7 (밝은 회색)
- **Text**: #2D3436 (어두운 회색)

### 타이포그래피
- **헤더**: Bold, 24-32pt
- **본문**: Regular, 16pt
- **버튼**: SemiBold, 18pt

## 📋 개발 로드맵

### ✅ Phase 1: 프로젝트 초기 설정 (완료)
- [x] React Native 프로젝트 생성 (Expo + TypeScript)
- [x] 필수 패키지 설치
- [x] 프로젝트 폴더 구조 구성
- [x] TypeScript 설정 및 ESLint/Prettier 구성

### ✅ Phase 2: Supabase 백엔드 설정 (완료)
- [x] Supabase 프로젝트 생성 가이드 작성
- [x] 데이터베이스 스키마 설계 및 SQL 파일 생성
- [x] Supabase 클라이언트 설정
- [x] API 서비스 레이어 구현 (사용자, 기부, 리더보드)
- [x] RLS 정책 설정

### 🔄 다음 단계
- Phase 3: Google Play 인앱 결제 통합
- Phase 4-5: 내비게이션 구조 및 i18n
- Phase 6-18: 기능 구현 및 배포

전체 계획은 [claudedocs/burn-a-buck-plan.md](claudedocs/burn-a-buck-plan.md)를 참조하세요.

## 📚 문서

- **개발 계획**: [claudedocs/burn-a-buck-plan.md](claudedocs/burn-a-buck-plan.md)
- **프로젝트 가이드**: [CLAUDE.md](CLAUDE.md)
- **Supabase 설정 가이드**: [supabase/SETUP_GUIDE.md](supabase/SETUP_GUIDE.md)
- **Supabase 스키마 참조**: [supabase/README.md](supabase/README.md)
- **개인정보 보호정책**: https://qlsjtmek2.github.io/portfolio-site/projects/burn-a-buck/privacy

## 🤝 기여

이 프로젝트는 개인 프로젝트입니다. 제안 사항이나 버그 리포트는 이슈를 통해 제출해 주세요.

## 📄 라이선스

이 프로젝트는 개인 사용을 위한 것입니다.

---

**개발 시작일**: 2025-11-03
**현재 상태**: Phase 2 완료 - Supabase 백엔드 설정 완료
