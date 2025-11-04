# 배포 전 테스트 체크리스트

앱 스토어 제출 전 필수 테스트 및 검증 사항입니다.

## 배포 전 준비 체크리스트

### 📋 기본 정보

```
□ app.json 설정 완료
  □ bundleIdentifier (iOS) 설정
  □ package (Android) 설정
  □ version 번호 설정
  □ buildNumber/versionCode 증가
  □ 앱 이름 확인
  □ 앱 아이콘 최적화 (1024x1024)
  □ 스플래시 스크린 최적화
```

### 📝 스토어 등록정보

```
□ 앱 설명 작성 완료
  □ 짧은 설명 (80자)
  □ 전체 설명 (4000자)
  □ 키워드 설정
```

```
□ 스크린샷 준비
  □ iOS: 6.7", 6.5", 5.5" 각 3개 이상
  □ Android: 최소 2개
  □ 실제 앱 화면 캡처
```

```
□ 개인정보처리방침 URL 준비 (HTTPS)
□ 서비스 이용약관 URL 준비 (선택)
□ 지원 URL 준비
```

### 🔒 권한 및 보안

```
□ iOS 권한 설명 (Info.plist)
  □ NSCameraUsageDescription
  □ NSPhotoLibraryUsageDescription
  □ NSLocationWhenInUseUsageDescription
  □ NSMicrophoneUsageDescription
  □ 기타 필요한 권한
```

```
□ Android 권한 (app.json)
  □ CAMERA
  □ READ_EXTERNAL_STORAGE
  □ WRITE_EXTERNAL_STORAGE
  □ ACCESS_FINE_LOCATION
  □ 기타 필요한 권한
```

```
□ 불필요한 권한 제거 확인
□ 민감한 정보 환경 변수 처리
□ API 키 보안 확인
□ 프로덕션 환경 변수 설정
```

## 기능 테스트

### 🔐 인증 및 로그인

```
□ 이메일 로그인
  □ 유효한 이메일로 로그인
  □ 잘못된 이메일 에러 처리
  □ 비밀번호 틀린 경우 에러 처리
  □ 빈 필드 검증
```

```
□ 소셜 로그인 (해당 시)
  □ Google 로그인
  □ Facebook 로그인
  □ Apple 로그인 (iOS 필수)
  □ 기타 소셜 로그인
```

```
□ 회원가입
  □ 유효한 정보로 가입
  □ 중복 이메일 에러 처리
  □ 비밀번호 강도 검증
  □ 약관 동의 확인
```

```
□ 비밀번호 재설정
  □ 이메일 전송 확인
  □ 링크 유효성 확인
  □ 비밀번호 변경 성공
```

```
□ 로그아웃
  □ 정상 로그아웃
  □ 세션 정리 확인
  □ 로그인 화면으로 이동
```

### 📊 주요 기능

```
□ 데이터 조회
  □ 목록 조회
  □ 상세 조회
  □ 빈 상태 처리
  □ 로딩 상태 표시
```

```
□ 데이터 생성
  □ 정상 생성
  □ 유효성 검증
  □ 에러 처리
  □ 성공 메시지
```

```
□ 데이터 수정
  □ 정상 수정
  □ 유효성 검증
  □ 에러 처리
  □ 성공 메시지
```

```
□ 데이터 삭제
  □ 삭제 확인 다이얼로그
  □ 정상 삭제
  □ 에러 처리
  □ 성공 메시지
```

### 🔔 푸시 알림 (해당 시)

```
□ 알림 권한 요청
□ 알림 수신 확인
□ 알림 클릭 시 화면 이동
□ 알림 설정 (on/off)
□ 백그라운드 알림 수신
□ Foreground 알림 수신
```

### 📸 미디어 기능 (해당 시)

```
□ 카메라
  □ 권한 요청
  □ 사진 촬영
  □ 촬영한 사진 업로드
  □ 에러 처리
```

```
□ 갤러리
  □ 권한 요청
  □ 사진 선택
  □ 다중 선택 (해당 시)
  □ 선택한 사진 업로드
  □ 에러 처리
```

### 📍 위치 기능 (해당 시)

```
□ 위치 권한 요청
□ 현재 위치 조회
□ 지도 표시
□ 위치 기반 기능 동작
□ 권한 거부 시 대체 동작
```

## 네트워크 테스트

### 🌐 API 통신

```
□ 정상 응답 처리
□ 에러 응답 처리
  □ 400 Bad Request
  □ 401 Unauthorized
  □ 403 Forbidden
  □ 404 Not Found
  □ 500 Server Error
```

```
□ 네트워크 에러
  □ 인터넷 연결 없음
  □ 타임아웃
  □ 에러 메시지 표시
  □ 재시도 옵션
```

```
□ 로딩 상태
  □ 로딩 인디케이터 표시
  □ 로딩 중 중복 요청 방지
  □ 로딩 완료 후 UI 업데이트
```

### 📡 오프라인 모드 (해당 시)

```
□ 오프라인 감지
□ 오프라인 메시지 표시
□ 캐시 데이터 사용
□ 온라인 복구 시 동기화
□ 오프라인 큐 처리 (해당 시)
```

## UI/UX 테스트

### 🎨 디자인

```
□ 앱 아이콘 표시
□ 스플래시 스크린 표시
□ 폰트 로딩
□ 이미지 로딩
□ 색상 일관성
□ 텍스트 가독성
```

### 📱 화면 크기

```
□ 다양한 화면 크기
  □ iPhone SE (작은 화면)
  □ iPhone 15 (중간 화면)
  □ iPhone 15 Pro Max (큰 화면)
  □ iPad (태블릿, 해당 시)
```

```
□ Android 디바이스
  □ 작은 화면 (5인치)
  □ 중간 화면 (6인치)
  □ 큰 화면 (6.5인치+)
  □ 태블릿 (해당 시)
```

```
□ 화면 방향
  □ Portrait (세로)
  □ Landscape (가로, 해당 시)
  □ 회전 시 레이아웃 유지
```

### 🌙 다크 모드 (해당 시)

```
□ 라이트 모드 표시
□ 다크 모드 표시
□ 모드 전환 동작
□ 색상 대비 확인
□ 텍스트 가독성 확인
```

### ⌨️ 키보드

```
□ 키보드 표시
□ 키보드 숨김
□ 입력 필드 가려짐 방지
□ 자동 스크롤
□ Return 키 동작
```

### 🔄 애니메이션

```
□ 화면 전환 애니메이션
□ 로딩 애니메이션
□ 버튼 클릭 피드백
□ 스크롤 애니메이션
□ 부드러운 동작 (60fps)
```

## 실기기 테스트

### 📱 iOS 실기기

```bash
# iOS 실기기 빌드 및 설치
npx expo run:ios --device
```

```
□ 실기기 설치 확인
□ 앱 시작
□ 권한 요청 동작
□ 푸시 알림 (해당 시)
□ 카메라/갤러리 (해당 시)
□ 위치 서비스 (해당 시)
□ 백그라운드 동작 (해당 시)
```

### 🤖 Android 실기기

```bash
# Android 실기기 빌드 및 설치
npx expo run:android --device
```

```
□ 실기기 설치 확인
□ 앱 시작
□ 권한 요청 동작
□ 푸시 알림 (해당 시)
□ 카메라/갤러리 (해당 시)
□ 위치 서비스 (해당 시)
□ 백 버튼 동작
□ 백그라운드 동작 (해당 시)
```

## 프로덕션 빌드 테스트

### 🏗️ 빌드 생성

```bash
# iOS 프리뷰 빌드
eas build --profile preview --platform ios

# Android 프리뷰 APK
eas build --profile preview --platform android
```

### 📦 TestFlight / Internal Testing

```
□ TestFlight 업로드 (iOS)
  □ 처리 완료 대기
  □ 테스터 추가
  □ 빌드 설치
  □ 실제 사용 시나리오 테스트
```

```
□ Internal Testing (Android)
  □ 업로드 완료
  □ 테스터 추가
  □ APK 설치
  □ 실제 사용 시나리오 테스트
```

### ✅ 프로덕션 환경 확인

```
□ API 엔드포인트
  □ 프로덕션 URL 사용
  □ 스테이징 URL 미사용
  □ 환경 변수 확인
```

```
□ 서드파티 서비스
  □ 프로덕션 API 키 사용
  □ Sentry DSN (프로덕션)
  □ Firebase 프로젝트 (프로덕션)
  □ 기타 서비스 확인
```

```
□ 디버그 코드 제거
  □ console.log 제거 또는 비활성화
  □ 디버그 메뉴 제거
  □ 테스트 코드 제거
```

## 성능 테스트

### ⚡ 앱 성능

```
□ 앱 시작 시간
  □ 3초 이내 스플래시 표시
  □ 5초 이내 첫 화면 로딩
```

```
□ 화면 전환
  □ 부드러운 애니메이션
  □ 지연 없음
```

```
□ 스크롤 성능
  □ 긴 목록 렌더링
  □ 60fps 유지
  □ 버벅임 없음
```

```
□ 메모리 사용
  □ 메모리 누수 확인
  □ 백그라운드 메모리 정리
```

```
□ 배터리 소모
  □ 정상 범위 내
  □ 백그라운드에서 과도한 사용 없음
```

## 크래시 테스트

### 💥 앱 안정성

```
□ 일반 사용 시나리오
  □ 크래시 없음
  □ ANR (Android Not Responding) 없음
  □ 화면 멈춤 없음
```

```
□ 엣지 케이스
  □ 빈 데이터
  □ 매우 큰 데이터
  □ 특수 문자 입력
  □ 긴 텍스트 입력
```

```
□ 에러 처리
  □ API 에러 대응
  □ 네트워크 에러 대응
  □ 권한 거부 대응
  □ 파일 시스템 에러 대응
```

## 보안 테스트

### 🔒 데이터 보안

```
□ 민감한 정보 암호화
  □ 비밀번호
  □ API 키
  □ 토큰
```

```
□ HTTPS 사용
  □ 모든 API 요청
  □ 이미지 로딩
```

```
□ 로컬 저장소
  □ Async Storage 암호화 (필요 시)
  □ SecureStore 사용 (민감 정보)
```

## 접근성 테스트

### ♿ Accessibility

```
□ VoiceOver (iOS) / TalkBack (Android)
  □ 화면 읽기 확인
  □ 버튼 라벨 확인
  □ 입력 필드 힌트
```

```
□ 글꼴 크기
  □ 큰 글꼴 지원
  □ 레이아웃 깨짐 없음
```

```
□ 색상 대비
  □ WCAG AA 준수 (최소 4.5:1)
  □ 색맹 모드 확인
```

## 스토어 제출 전 최종 확인

### 📋 제출 전 체크리스트

```
□ 버전 번호 확인
  □ version 증가
  □ buildNumber/versionCode 증가
```

```
□ 출시 노트 작성
  □ 새로운 기능
  □ 버그 수정
  □ 개선 사항
```

```
□ 빌드 생성
  □ 프로덕션 프로파일 사용
  □ 빌드 성공 확인
```

```
□ 제출
  □ App Store Connect / Google Play Console
  □ 스토어 등록정보 최종 확인
  □ 스크린샷 업로드
  □ 심사 제출
```

## 테스트 자동화

### 🤖 자동화된 테스트

```
□ Unit Tests
  □ 비즈니스 로직 테스트
  □ 유틸리티 함수 테스트
  □ 커버리지 80% 이상
```

```
□ Integration Tests
  □ API 통신 테스트
  □ 데이터 흐름 테스트
```

```
□ E2E Tests (선택)
  □ Detox (React Native)
  □ 주요 사용자 시나리오
```

```bash
# 테스트 실행
npm test

# E2E 테스트 (Detox)
detox test --configuration ios.release
```

## 참고 자료

### Context7 MCP로 최신 문서 조회

```bash
# Expo Testing
mcp__context7__resolve-library-id "expo"
mcp__context7__get-library-docs "/expo/expo" topic: "Testing"

# Detox E2E Testing
mcp__context7__resolve-library-id "detox"
mcp__context7__get-library-docs "/wix/Detox" topic: "Getting Started"
```

### 공식 문서

- Expo Testing: https://docs.expo.dev/develop/unit-testing/
- Detox E2E Testing: https://wix.github.io/Detox/
- React Native Testing Library: https://callstack.github.io/react-native-testing-library/

---

**이 체크리스트는 앱 스토어 제출 전 필수 테스트 및 검증 사항을 망라합니다.**
