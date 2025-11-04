---
name: app-deployment
description: Deploy React Native apps to App Store and Google Play with EAS Build. Covers EAS configuration, iOS App Store deployment, Android Google Play deployment, OTA updates, version management, testing checklist, troubleshooting builds and submissions. Use for app store submission, TestFlight, Google Play Console, build configuration, deployment issues.
version: 2.0.0
type: domain
tags:
  - deployment
  - eas-build
  - app-store
  - google-play
  - testflight
  - ota-updates
  - version-management
  - troubleshooting
  - context7
---

# App Deployment

React Native 앱을 App Store와 Google Play에 배포하는 통합 가이드입니다. EAS Build를 사용하여 효율적으로 빌드하고 배포합니다.

## 핵심 원칙

### 1. EAS Build 사용 (권장)

Expo Application Services (EAS)를 사용하여 클라우드에서 빌드합니다.

```bash
# EAS CLI 설치
npm install -g eas-cli

# EAS Build 설정
eas build:configure
```

**장점:**
- ✅ macOS 없이도 iOS 빌드 가능
- ✅ 빌드 환경 일관성 보장
- ✅ 자동 코드 서명
- ✅ 빌드 히스토리 관리

### 2. Context7 MCP로 최신 문서 조회

배포 전 **반드시 Context7 MCP로 최신 EAS 문서 확인**:

```bash
# EAS Build 문서
mcp__context7__resolve-library-id "expo"
mcp__context7__get-library-docs "/expo/expo" topic: "EAS Build"

# App Store / Google Play 가이드
mcp__context7__get-library-docs "/expo/expo" topic: "App Store"
mcp__context7__get-library-docs "/expo/expo" topic: "Google Play"
```

## 리소스 안내 (Navigation Guide)

각 배포 단계별로 상세 가이드가 준비되어 있습니다. 필요한 리소스를 선택하여 참고하세요.

| 필요한 작업 | 리소스 파일 | 설명 |
|------------|-----------|------|
| EAS 빌드 환경 설정 | [resources/eas-build-config.md](resources/eas-build-config.md) | eas.json, app.json, 환경 변수, credentials 관리 |
| iOS App Store 배포 | [resources/ios-deployment.md](resources/ios-deployment.md) | TestFlight, App Store Connect, 심사 대응 |
| Android Google Play 배포 | [resources/android-deployment.md](resources/android-deployment.md) | Internal Testing, Google Play Console, 심사 대응 |
| OTA 업데이트 관리 | [resources/ota-updates.md](resources/ota-updates.md) | 스토어 심사 없이 JavaScript 코드 업데이트 |
| 버전 번호 관리 | [resources/version-management.md](resources/version-management.md) | Semantic Versioning, buildNumber, versionCode |
| 배포 전 테스트 | [resources/testing-checklist.md](resources/testing-checklist.md) | 기능 테스트, 실기기 테스트, 성능 테스트 체크리스트 |
| 배포 문제 해결 | [resources/troubleshooting.md](resources/troubleshooting.md) | 빌드 실패, 스토어 거절, 업데이트 문제 해결 |

## 빠른 시작

### 기본 빌드 명령어

```bash
# iOS 빌드
eas build --profile production --platform ios

# Android 빌드
eas build --profile production --platform android

# iOS & Android 동시 빌드
eas build --profile production --platform all
```

### 스토어 제출

```bash
# iOS App Store 제출
eas submit --platform ios

# Android Google Play 제출
eas submit --platform android

# 동시 제출
eas submit --platform all
```

### OTA 업데이트

```bash
# 프로덕션 업데이트 게시
eas update --branch production --message "버그 수정 및 성능 개선"
```

## 배포 워크플로우

### 전체 프로세스

```
1. 개발 완료
   ↓
2. 버전 업데이트 (app.json)
   ↓
3. 프리뷰 빌드 (TestFlight / Internal Testing)
   ↓
4. 베타 테스트 및 피드백
   ↓
5. 프로덕션 빌드
   ↓
6. 스토어 제출
   ↓
7. 심사 대기 (iOS: 24-48시간, Android: 몇 시간~3일)
   ↓
8. 승인 후 출시
   ↓
9. 모니터링 (Sentry, Firebase Crashlytics)
   ↓
10. 핫픽스 (필요 시 OTA Update)
```

### 배포 전 체크리스트

```
□ app.json 설정 완료 (bundleIdentifier, package, version)
□ 스토어 설명 및 스크린샷 준비
□ 개인정보처리방침 URL 준비
□ 앱 아이콘 및 스플래시 스크린 최적화
□ 테스트 완료 (iOS 실기기, Android 실기기)
□ 프로덕션 환경 변수 설정
```

자세한 체크리스트는 [resources/testing-checklist.md](resources/testing-checklist.md)를 참고하세요.

## 주의사항

### 버전 관리
- ❌ 버전 번호 감소 금지 (App Store / Google Play 거절)
- ✅ 제출마다 buildNumber (iOS) / versionCode (Android) 증가
- ✅ Semantic Versioning 사용 권장 (MAJOR.MINOR.PATCH)

### OTA 업데이트 제한
- ✅ 업데이트 가능: JavaScript 코드, 이미지, 폰트
- ❌ 업데이트 불가: Native 모듈, 권한 변경, Expo SDK 업그레이드

### 스토어 심사
- **iOS 주요 거절 사유:** 크래시/버그, 메타데이터 부정확, 개인정보처리방침 누락
- **Android 주요 거절 사유:** 콘텐츠 등급 부정확, 권한 설명 부족

문제 해결은 [resources/troubleshooting.md](resources/troubleshooting.md)를 참고하세요.

## 참고 자료

### Context7 MCP로 최신 문서 조회

```bash
# EAS Build
mcp__context7__get-library-docs "/expo/expo" topic: "EAS Build"

# EAS Submit
mcp__context7__get-library-docs "/expo/expo" topic: "EAS Submit"

# EAS Update
mcp__context7__get-library-docs "/expo/expo" topic: "EAS Update"
```

### 공식 문서

- EAS Build: https://docs.expo.dev/build/introduction/
- EAS Submit: https://docs.expo.dev/submit/introduction/
- EAS Update: https://docs.expo.dev/eas-update/introduction/
- App Store Guidelines: https://developer.apple.com/app-store/review/guidelines/
- Google Play Guidelines: https://play.google.com/console/about/guides/

---

**이 스킬은 React Native 앱을 EAS Build로 효율적으로 빌드하고 배포하는 전체 프로세스를 다룹니다.**
