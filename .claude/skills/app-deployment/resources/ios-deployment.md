# iOS App Store 배포 가이드

React Native 앱을 App Store에 배포하는 완전한 가이드입니다.

## 사전 준비

### Apple Developer Program 가입

**필수 요구사항:**
- Apple Developer Program 가입 ($99/year)
- Apple ID
- 결제 수단 (신용카드 또는 PayPal)

**가입 절차:**
1. https://developer.apple.com/programs/ 접속
2. **Enroll Now** 클릭
3. Apple ID로 로그인
4. 개인 또는 조직 선택
5. 결제 정보 입력
6. 약관 동의
7. 승인 대기 (보통 24시간 이내)

### App Store Connect 접근

**App Store Connect:** https://appstoreconnect.apple.com

**역할:**
- **Account Holder**: 모든 권한 (결제, 법적 계약)
- **Admin**: 앱 관리, 사용자 추가
- **Developer**: 앱 업로드, TestFlight 관리
- **Marketing**: 앱 정보 편집 (코드 제외)

## iOS 빌드

### 개발 빌드 (Development)

**용도:** 개발 중 테스트, 디버깅

```bash
# iOS 시뮬레이터 빌드
eas build --profile development --platform ios

# 빌드 완료 후 시뮬레이터에 설치
npx expo install:ios
```

### 프리뷰 빌드 (Preview - TestFlight)

**용도:** 내부/외부 베타 테스트

```bash
# TestFlight용 빌드
eas build --profile preview --platform ios

# 빌드 상태 확인
eas build:list
```

**빌드 완료 후:**
- EAS 대시보드에서 `.ipa` 파일 다운로드 가능
- TestFlight에 자동 업로드 (eas submit 사용 시)

### 프로덕션 빌드 (Production - App Store)

**용도:** App Store 제출

```bash
# App Store용 빌드
eas build --profile production --platform ios

# 빌드 로그 확인
eas build:view
```

## App Store Connect 앱 등록

### 1. 새 앱 생성

1. **App Store Connect** 접속
2. **My Apps** → **+** 버튼 → **New App**
3. **정보 입력:**
   - **Platforms**: iOS
   - **Name**: 앱 이름 (App Store에 표시)
   - **Primary Language**: 주 언어
   - **Bundle ID**: app.json의 `ios.bundleIdentifier`와 일치
   - **SKU**: 고유 식별자 (예: `com-yourcompany-yourapp-2025`)

### 2. 앱 정보 입력

#### App Information

- **Name**: 앱 이름 (최대 30자)
- **Subtitle**: 부제목 (최대 30자)
- **Privacy Policy URL**: 개인정보처리방침 (필수)
- **Category**: 앱 카테고리 (Primary 필수, Secondary 선택)

#### Pricing and Availability

- **Price**: 가격 설정 (무료 또는 유료)
- **Availability**: 판매 지역 선택
- **Pre-Order**: 사전 주문 설정 (선택)

### 3. 버전 정보

**App Store Connect** → **Your App** → **1.0 Prepare for Submission**

#### What's New in This Version

```
버전 1.0.0

초기 출시:
- 사용자 인증 (로그인/회원가입)
- 프로필 관리
- 알림 기능
- 오프라인 모드 지원
```

#### Promotional Text (선택)

앱 설명 상단에 표시되는 텍스트 (심사 없이 변경 가능, 최대 170자)

```
새로운 기능: 다크 모드 지원!
```

#### Description

앱 설명 (최대 4000자)

```
[Your App Name]은 ...을 위한 앱입니다.

주요 기능:
• 기능 1: 설명
• 기능 2: 설명
• 기능 3: 설명

...
```

#### Keywords

검색 키워드 (최대 100자, 쉼표로 구분)

```
productivity,task,todo,reminder,calendar
```

#### Support URL

지원 웹사이트 URL (필수)

```
https://www.yourcompany.com/support
```

#### Marketing URL (선택)

마케팅 웹사이트 URL

```
https://www.yourcompany.com
```

### 4. 스크린샷

**필수 스크린샷 크기:**

| Device | Size (pixels) | Orientation |
|--------|---------------|-------------|
| 6.7" Display (iPhone 14 Pro Max, 15 Plus, 15 Pro Max) | 1290 x 2796 | Portrait |
| 6.5" Display (iPhone 11 Pro Max, XS Max) | 1242 x 2688 | Portrait |
| 5.5" Display (iPhone 8 Plus, 7 Plus, 6s Plus) | 1242 x 2208 | Portrait |

**iPad 스크린샷 (iPad 지원 시):**

| Device | Size (pixels) | Orientation |
|--------|---------------|-------------|
| 12.9" iPad Pro (3rd Gen) | 2048 x 2732 | Portrait |
| 12.9" iPad Pro (2nd Gen) | 2048 x 2732 | Portrait |

**권장사항:**
- 각 크기별 최소 3개 이상 (최대 10개)
- 실제 앱 화면 캡처
- 깔끔하고 선명한 이미지
- 텍스트가 읽기 쉽게

**스크린샷 생성 도구:**
- Simulator를 사용한 캡처: `Cmd + S`
- [Screenshot Creator](https://www.applaunchpad.com/) - 스크린샷 디자인 도구
- [App Store Screenshot Generator](https://appscreens.io/) - 자동 크기 조정

### 5. App Preview (선택)

앱 미리보기 동영상 (최대 3개, 각 15-30초)

**요구사항:**
- 해상도: 스크린샷과 동일
- 형식: M4V, MP4, MOV
- 크기: 최대 500MB

## TestFlight 배포 (베타 테스트)

### TestFlight 제출

```bash
# TestFlight용 빌드 및 제출
eas build --profile preview --platform ios
eas submit --platform ios --profile preview
```

**또는 수동 제출:**
1. EAS에서 `.ipa` 파일 다운로드
2. App Store Connect → **TestFlight** → **iOS Builds** → **+** → 파일 업로드

### 내부 테스터 추가

**내부 테스터:** Apple Developer 계정 필요 (최대 100명)

1. **TestFlight** → **Internal Testing**
2. **Add Internal Testers**
3. 이메일 주소 입력 (Apple ID)
4. 테스터에게 이메일 발송
5. 테스터가 TestFlight 앱 설치 및 빌드 다운로드

**장점:**
- 즉시 테스트 가능 (심사 불필요)
- 앱 제한 없음

### 외부 테스터 추가

**외부 테스터:** Apple Developer 계정 불필요 (최대 10,000명)

1. **TestFlight** → **External Testing**
2. **Add External Testers**
3. 이메일 주소 입력
4. **Beta App Review** 제출 (1-2일 소요)
5. 승인 후 테스터에게 이메일 발송

**Beta App Review 정보:**
- 테스터 대상 앱 설명
- 이메일 주소 (연락용)
- 로그인 필요 시 테스트 계정 제공
- 앱 스크린샷 또는 동영상

### TestFlight 빌드 만료

**빌드 유효 기간:** 90일

90일 후:
- 테스터는 더 이상 빌드 설치 불가
- 새 빌드를 제출해야 함

## App Store 제출

### 빌드 제출

```bash
# 프로덕션 빌드 생성
eas build --profile production --platform ios

# App Store에 자동 제출
eas submit --platform ios
```

### 수동 제출 (App Store Connect)

1. **App Store Connect** → **Your App** → **1.0 Prepare for Submission**
2. **Build** 섹션에서 빌드 선택
   - Processing → Ready to Submit (10-30분 소요)
3. **App Review Information** 입력
   - **Sign-In Information** (로그인 필요 시)
     - Username
     - Password
   - **Contact Information**
     - First Name
     - Last Name
     - Phone Number
     - Email Address
4. **Notes** (심사자에게 전달할 메모)
5. **Submit for Review** 클릭

### 앱 심사

**심사 단계:**

1. **Waiting for Review** - 심사 대기 중
2. **In Review** - 심사 진행 중 (보통 24-48시간)
3. **Pending Developer Release** - 승인됨, 수동 출시 대기
4. **Ready for Sale** - 출시 완료

**심사 기간:** 보통 24-48시간 (최대 1주일)

**심사 중 추가 정보 요청:**
- App Store Connect에서 메시지 확인
- Resolution Center에서 답변 제공

## 심사 거절 대응

### 주요 거절 사유

#### Guideline 2.1 - App Completeness
**이유:** 앱이 충돌하거나 버그가 있음

**대응:**
- 버그 수정
- 충돌 원인 파악 (Sentry, Firebase Crashlytics)
- 철저한 테스트
- 새 빌드 제출

#### Guideline 2.3 - Accurate Metadata
**이유:** 스크린샷이 실제 앱과 다름

**대응:**
- 스크린샷 업데이트 (실제 앱 화면)
- 설명 정확성 확인
- 메타데이터 재제출

#### Guideline 4.3 - Spam
**이유:** 유사한 앱이 너무 많음

**대응:**
- 앱의 고유한 기능 강조
- Resolution Center에서 차별점 설명
- 앱 통합 고려

#### Guideline 5.1.1 - Privacy - Data Collection and Storage
**이유:** 개인정보처리방침 누락 또는 불충분

**대응:**
- 개인정보처리방침 URL 추가
- 수집하는 데이터 명시
- 데이터 사용 목적 설명

#### Guideline 5.1.2 - Privacy - Data Use and Sharing
**이유:** 권한 사용 설명 부족

**대응:**
- `Info.plist`에 권한 설명 추가
- 권한 요청 이유 명확히 설명
- 불필요한 권한 제거

### 심사 거절 후 대응 절차

1. **거절 사유 분석**
   - Resolution Center 메시지 확인
   - 정확한 Guideline 확인

2. **수정 또는 답변 결정**
   - 수정 필요 → 버그 수정 후 새 빌드 제출
   - 오해 → Resolution Center에서 설명 제공

3. **새 제출 준비**
   ```bash
   # 수정 후 새 빌드
   eas build --profile production --platform ios
   eas submit --platform ios
   ```

4. **Resolution Center에서 답변**
   - 명확하고 상세한 설명 제공
   - 스크린샷 또는 동영상 첨부 (필요 시)
   - 정중한 어조 유지

## 출시 후 관리

### 앱 출시

**자동 출시 (기본):**
- 승인 즉시 App Store에 출시

**수동 출시:**
1. **Pricing and Availability** → **App Store Availability**
2. **Manually release this version** 선택
3. 승인 후 **Pending Developer Release** 상태
4. **Release this Version** 클릭하여 출시

### 단계적 출시 (Phased Release)

**장점:**
- 점진적으로 사용자에게 배포
- 문제 발생 시 빠른 대응 가능

**단계:**
1. Day 1: 1% 사용자
2. Day 2: 2%
3. Day 3: 5%
4. Day 4: 10%
5. Day 5: 20%
6. Day 6: 50%
7. Day 7: 100%

**설정:**
1. **App Store Connect** → **Your App** → **Pricing and Availability**
2. **Phased Release for Automatic Updates** 활성화

**중단:**
- 문제 발생 시 **Pause** 또는 **Release** 선택

### 사용자 피드백 관리

**App Store 리뷰:**
- **App Store Connect** → **Your App** → **Ratings and Reviews**
- 리뷰 응답 (최대 1회 수정 가능)

**크래시 리포트:**
- **App Store Connect** → **Your App** → **TestFlight** → **Crashes**
- 또는 Sentry, Firebase Crashlytics 사용

### 앱 업데이트

**새 버전 제출:**
1. `app.json`에서 `version` 및 `ios.buildNumber` 증가
   ```json
   {
     "expo": {
       "version": "1.1.0",
       "ios": {
         "buildNumber": "2"
       }
     }
   }
   ```

2. 새 빌드 생성 및 제출
   ```bash
   eas build --profile production --platform ios
   eas submit --platform ios
   ```

3. **App Store Connect**에서 **What's New** 업데이트

## App Store Optimization (ASO)

### 키워드 최적화

**전략:**
- 관련성 높은 키워드 선택
- 경쟁사 분석
- 키워드 조합 (최대 100자)

**도구:**
- [App Annie](https://www.appannie.com/)
- [Sensor Tower](https://sensortower.com/)
- [Mobile Action](https://www.mobileaction.co/)

### 아이콘 및 스크린샷 최적화

**아이콘:**
- 단순하고 인식하기 쉽게
- 브랜드 컬러 일관성
- 다양한 배경에서 테스트

**스크린샷:**
- 첫 번째 스크린샷이 가장 중요
- 주요 기능 강조
- 텍스트 오버레이 활용

### 설명 최적화

**Description 작성 팁:**
- 첫 3줄이 가장 중요 (더 보기 전)
- 주요 기능 bullet point로 나열
- 명확하고 간결한 언어
- 검색 키워드 자연스럽게 포함

## 참고 자료

### Context7 MCP로 최신 문서 조회

```bash
# EAS Submit (iOS)
mcp__context7__resolve-library-id "expo"
mcp__context7__get-library-docs "/expo/expo" topic: "EAS Submit iOS"

# App Store 가이드
mcp__context7__get-library-docs "/expo/expo" topic: "App Store"

# TestFlight
mcp__context7__get-library-docs "/expo/expo" topic: "TestFlight"
```

### 공식 문서

- App Store Review Guidelines: https://developer.apple.com/app-store/review/guidelines/
- App Store Connect Help: https://help.apple.com/app-store-connect/
- TestFlight: https://developer.apple.com/testflight/
- EAS Submit: https://docs.expo.dev/submit/ios/

---

**이 가이드는 React Native 앱을 App Store에 성공적으로 배포하는 전체 프로세스를 다룹니다.**
