# Android Google Play Store 배포 가이드

React Native 앱을 Google Play Store에 배포하는 완전한 가이드입니다.

## 사전 준비

### Google Play Developer 계정 생성

**필수 요구사항:**
- Google 계정
- $25 등록 수수료 (1회 결제)
- 결제 수단 (신용카드 또는 PayPal)

**가입 절차:**
1. https://play.google.com/console 접속
2. **Create Account** 클릭
3. **Account Type** 선택:
   - **개인**: 개인 개발자
   - **조직**: 회사 또는 조직
4. **Developer Account Details** 입력
5. $25 등록 수수료 결제
6. 약관 동의
7. 승인 대기 (보통 48시간 이내)

### Google Play Console 접근

**Google Play Console:** https://play.google.com/console

**역할:**
- **Account Owner**: 모든 권한
- **Admin**: 앱 관리, 사용자 추가
- **Developer**: 앱 업로드, 릴리스 관리
- **Marketing**: 스토어 등록정보 관리

## Android 빌드

### 개발 빌드 (Development)

**용도:** 개발 중 테스트, 디버깅

```bash
# Android APK 빌드
eas build --profile development --platform android

# 빌드 완료 후 에뮬레이터/실기기에 설치
npx expo install:android
```

### 프리뷰 빌드 (Preview - Internal Testing)

**용도:** 내부 테스트

```bash
# Internal Testing용 APK 빌드
eas build --profile preview --platform android

# 빌드 상태 확인
eas build:list
```

**빌드 완료 후:**
- EAS 대시보드에서 `.apk` 파일 다운로드 가능
- 실기기에 직접 설치

### 프로덕션 빌드 (Production - Google Play)

**용도:** Google Play Store 제출

```bash
# Google Play용 AAB 빌드
eas build --profile production --platform android

# 빌드 로그 확인
eas build:view
```

**AAB vs APK:**
- **AAB** (Android App Bundle): Google Play 제출용 (권장)
  - 최적화된 APK 자동 생성
  - 앱 크기 감소
- **APK**: 직접 설치용
  - 파일 크기가 더 큼
  - 모든 디바이스 코드 포함

## Google Play Console 앱 등록

### 1. 앱 만들기

1. **Google Play Console** 접속
2. **모든 앱** → **앱 만들기**
3. **정보 입력:**
   - **앱 이름**: 앱 이름 (Google Play에 표시)
   - **기본 언어**: 주 언어 (한국어, 영어 등)
   - **앱 또는 게임**: 앱 선택 (게임이 아닌 경우)
   - **무료 또는 유료**: 가격 정책 선택
4. **선언 및 동의** 체크
5. **앱 만들기** 클릭

### 2. 대시보드 설정

**필수 작업:**
1. ✅ 스토어 등록정보 설정
2. ✅ 콘텐츠 등급 설정
3. ✅ 타겟 고객 및 콘텐츠 선택
4. ✅ 개인정보처리방침 추가
5. ✅ 앱 액세스 권한 설정
6. ✅ 광고 여부 선택
7. ✅ 앱 카테고리 선택
8. ✅ 연락처 정보 추가

### 3. 스토어 등록정보

#### 앱 세부정보

**앱 이름:**
- 최대 50자
- Google Play에 표시되는 이름

**짧은 설명:**
- 최대 80자
- 검색 결과에 표시

**전체 설명:**
- 최대 4000자
- 앱 상세 페이지에 표시

**예제:**
```
짧은 설명:
할 일 관리를 쉽고 빠르게! 효율적인 작업 관리 앱

전체 설명:
[Your App Name]은 일상의 작업을 효율적으로 관리하는 앱입니다.

주요 기능:
• 직관적인 할 일 목록
• 우선순위 설정
• 알림 및 리마인더
• 다크 모드 지원
• 오프라인 모드

...
```

#### 그래픽

**앱 아이콘:**
- 크기: 512 x 512 px
- 형식: PNG (32비트, 투명 배경 없음)

**그래픽 이미지 (Feature Graphic):**
- 크기: 1024 x 500 px
- 형식: PNG 또는 JPG
- Google Play 상단에 표시

**스크린샷 (최소 2개, 최대 8개):**

| Device Type | Size | Orientation |
|-------------|------|-------------|
| 전화 | 16:9 또는 9:16 | Portrait/Landscape |
| 7인치 태블릿 | 16:9 또는 9:16 | Portrait/Landscape |
| 10인치 태블릿 | 16:9 또는 9:16 | Portrait/Landscape |

**최소 해상도:** 320px

**권장사항:**
- 실제 앱 화면 캡처
- 각 스크린샷에 설명 추가 가능
- 주요 기능을 보여주는 화면 선택

#### 동영상 (선택)

**YouTube 동영상 링크:**
- 앱 소개 동영상
- 최대 30초 권장

### 4. 콘텐츠 등급

**설문 작성:**
1. **프로그램 카테고리** 선택: 앱 또는 게임
2. **이메일 주소** 입력
3. **콘텐츠 설문** 응답
   - 폭력
   - 성적 콘텐츠
   - 언어
   - 약물, 담배, 술
   - 사용자 간 상호작용
   - 기타

**예제 (일반 생산성 앱):**
- 폭력: 없음
- 성적 콘텐츠: 없음
- 언어: 없음
- 약물: 없음
- 사용자 간 상호작용: 있음 (채팅 기능 등)

**등급 결과:**
- PEGI: 3+
- ESRB: Everyone
- USK: All ages
- IARC: 3+

### 5. 타겟 고객 및 콘텐츠

**대상 연령:**
- 연령대 선택 (예: 13세 이상)

**스토어 등록정보:**
- 스토어 프로필 완성

**광고:**
- 광고 포함 여부 선택

### 6. 개인정보처리방침

**개인정보처리방침 URL 입력 (필수):**
```
https://www.yourcompany.com/privacy-policy
```

**필수 포함 사항:**
- 수집하는 데이터
- 데이터 사용 목적
- 데이터 보관 기간
- 사용자 권리

### 7. 앱 액세스 권한

**앱 전체 액세스:**
- 일반 사용자가 모든 기능 사용 가능

**제한된 액세스:**
- 로그인 필요 또는 특정 사용자만 액세스 가능
- 테스트 계정 정보 제공 필요

### 8. 앱 카테고리 및 연락처

**카테고리:**
- 앱 카테고리 선택 (예: 생산성, 소셜, 엔터테인먼트 등)

**연락처 정보:**
- 이메일 주소 (필수)
- 전화번호 (선택)
- 웹사이트 (선택)

## 앱 릴리스

### Internal Testing (내부 테스트)

**용도:** 소규모 팀 테스트 (최대 100명)

```bash
# Internal Testing용 빌드 및 제출
eas build --profile preview --platform android
eas submit --platform android --profile preview
```

**설정:**
1. **테스트** → **Internal testing** → **새 릴리스 만들기**
2. **App bundle** 업로드 (`.aab` 파일)
3. **릴리스 이름** 입력 (예: `1.0.0`)
4. **출시 노트** 작성
5. **검토** → **출시 시작**
6. **테스터 추가**:
   - 이메일 주소 입력
   - 테스터가 링크를 통해 앱 다운로드

**장점:**
- 즉시 테스트 가능 (심사 불필요)
- 빠른 피드백 수집

### Closed Testing (비공개 테스트)

**용도:** 확장된 베타 테스트 (최대 트랙당 2000명)

**설정:**
1. **테스트** → **Closed testing** → **새 트랙 만들기**
2. **트랙 이름** 입력 (예: `beta`)
3. **App bundle** 업로드
4. **테스터 목록** 추가
   - 이메일 목록 업로드 (CSV)
   - 또는 Google Group 사용
5. **검토** → **출시 시작**

**트랙 관리:**
- 여러 트랙 생성 가능 (예: `beta`, `alpha`)
- 트랙별 다른 버전 배포 가능

### Open Testing (공개 테스트)

**용도:** 누구나 참여 가능한 베타 테스트

**설정:**
1. **테스트** → **Open testing** → **새 릴리스 만들기**
2. **App bundle** 업로드
3. **출시 노트** 작성
4. **국가** 선택 (공개 테스트 가능 국가)
5. **검토** → **출시 시작**

**장점:**
- 대규모 사용자 테스트
- Google Play에서 검색 가능

### Production (프로덕션)

**용도:** 정식 출시

```bash
# 프로덕션 빌드 생성 및 제출
eas build --profile production --platform android
eas submit --platform android
```

**설정:**
1. **프로덕션** → **새 릴리스 만들기**
2. **App bundle** 업로드
3. **출시 노트** 작성
   ```
   버전 1.0.0

   초기 출시:
   - 사용자 인증 기능
   - 프로필 관리
   - 알림 기능
   ```
4. **국가/지역** 선택
5. **출시 유형** 선택:
   - **전체 출시** (모든 사용자에게 즉시)
   - **단계적 출시** (5%, 10%, 20%, ...)
6. **검토** → **출시 시작**

**심사 기간:** 보통 몇 시간 ~ 3일

## 앱 서명 키 관리

### Google Play App Signing (권장)

**Google Play App Signing:**
- Google이 프로덕션 키 관리
- EAS가 자동으로 설정

**설정:**
1. 첫 프로덕션 빌드 시 자동 활성화
2. **App Signing** → **Play App Signing** 확인
3. Google이 프로덕션 서명 키 생성 및 보관

**장점:**
- 키 분실 걱정 없음
- 키 재설정 가능
- 최적화된 APK 생성

### 기존 Keystore 업로드 (필요 시)

**기존 앱이 있는 경우:**

```bash
# EAS Credentials 관리
eas credentials

# Android 선택
# - Upload Keystore
```

**Keystore 파일 업로드:**
- `.keystore` 또는 `.jks` 파일
- Key alias
- Key password
- Keystore password

## 심사 및 출시

### 심사 단계

1. **검토 중** - 자동 검토 진행
2. **승인됨** - 심사 통과
3. **게시됨** - Google Play에서 사용 가능

**심사 기간:** 보통 몇 시간 ~ 3일

### 주요 거절 사유

#### 개인정보처리방침 누락
**이유:** 개인정보처리방침 URL이 없거나 유효하지 않음

**대응:**
- 유효한 개인정보처리방침 URL 추가
- HTTPS 사용

#### 권한 사용 설명 부족
**이유:** 앱에서 요청하는 권한에 대한 설명 부족

**대응:**
- `app.json`의 `android.permissions` 확인
- 불필요한 권한 제거
- 권한 사용 이유 명확히 설명

#### 콘텐츠 등급 부정확
**이유:** 앱 콘텐츠가 등급과 맞지 않음

**대응:**
- 콘텐츠 등급 설문 재작성
- 정확한 콘텐츠 정보 제공

#### 메타데이터 정확성
**이유:** 스크린샷이 실제 앱과 다름

**대응:**
- 실제 앱 화면으로 스크린샷 업데이트
- 설명 정확성 확인

### 심사 거절 후 대응

1. **거절 사유 확인**
   - Google Play Console에서 메시지 확인

2. **수정 또는 답변**
   - 수정 필요 → 버그 수정 후 새 빌드 제출
   - 오해 → 이의 제기

3. **새 제출**
   ```bash
   # 수정 후 새 빌드
   eas build --profile production --platform android
   eas submit --platform android
   ```

## 출시 후 관리

### 단계적 출시 (Staged Rollout)

**장점:**
- 점진적으로 사용자에게 배포
- 문제 발생 시 빠른 대응

**단계:**
1. **프로덕션** → **새 릴리스** → **출시 유형**
2. **단계적 출시** 선택
3. **비율 선택**:
   - 5%, 10%, 20%, 50%, 100%
4. **출시 시작**

**단계 증가:**
- 문제 없으면 비율 점진적 증가
- **출시 속도 늘리기** 클릭

**중단:**
- 문제 발생 시 **출시 일시중지**
- 수정 후 재개

### 앱 업데이트

**새 버전 제출:**
1. `app.json`에서 `version` 및 `android.versionCode` 증가
   ```json
   {
     "expo": {
       "version": "1.1.0",
       "android": {
         "versionCode": 2
       }
     }
   }
   ```

2. 새 빌드 생성 및 제출
   ```bash
   eas build --profile production --platform android
   eas submit --platform android
   ```

3. **출시 노트** 작성

### 사용자 피드백 관리

**Google Play 리뷰:**
- **프로덕션** → **평가 및 리뷰**
- 리뷰 응답 (사용자에게 보임)

**크래시 리포트:**
- **품질** → **Android Vitals** → **크래시 및 ANR**
- 또는 Sentry, Firebase Crashlytics 사용

### 앱 번들 탐색기

**App Bundle Explorer:**
- **프로덕션** → **릴리스** → **App Bundle Explorer**
- 다양한 디바이스별 APK 크기 확인
- 최적화 기회 파악

## Google Play 정책 준수

### 필수 정책

1. **개인정보처리방침**
   - 유효한 URL 제공
   - 수집 데이터 명시

2. **사용자 데이터**
   - 명확한 동의 절차
   - 데이터 삭제 옵션 제공

3. **광고**
   - 광고 포함 시 명시
   - 허위 광고 금지

4. **앱 콘텐츠**
   - 콘텐츠 등급 정확성
   - 불법 콘텐츠 금지

### 정책 위반 대응

**경고 수신 시:**
1. 위반 사항 확인
2. 수정 계획 수립
3. 7일 이내 수정 또는 이의 제기
4. 새 버전 제출

**앱 정지:**
- 심각한 위반 시 앱 정지
- 이의 제기 가능
- 수정 후 재제출

## 참고 자료

### Context7 MCP로 최신 문서 조회

```bash
# EAS Submit (Android)
mcp__context7__resolve-library-id "expo"
mcp__context7__get-library-docs "/expo/expo" topic: "EAS Submit Android"

# Google Play 가이드
mcp__context7__get-library-docs "/expo/expo" topic: "Google Play"

# Android App Bundle
mcp__context7__get-library-docs "/expo/expo" topic: "AAB"
```

### 공식 문서

- Google Play Console Help: https://support.google.com/googleplay/android-developer/
- Google Play Policies: https://play.google.com/about/developer-content-policy/
- Android App Bundles: https://developer.android.com/guide/app-bundle
- EAS Submit: https://docs.expo.dev/submit/android/

---

**이 가이드는 React Native 앱을 Google Play Store에 성공적으로 배포하는 전체 프로세스를 다룹니다.**
