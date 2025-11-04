# 문제 해결 가이드

배포 과정에서 발생할 수 있는 일반적인 문제와 해결 방법입니다.

## 빌드 실패

### EAS Build 실패

#### 오류: "Build failed"

**일반적인 원인:**
- 패키지 버전 충돌
- Native 의존성 문제
- 환경 변수 누락

**해결 방법:**

```bash
# 1. 캐시 클리어
npx expo start --clear

# 2. node_modules 재설치
rm -rf node_modules
npm install

# 3. EAS 빌드 재시도 (캐시 클리어)
eas build --profile production --platform ios --clear-cache
```

#### 오류: "Command PhaseScriptExecution failed" (iOS)

**원인:** CocoaPods 또는 빌드 스크립트 문제

**해결 방법:**

```bash
# Podfile.lock 삭제 후 재빌드
rm -rf ios/Pods ios/Podfile.lock
eas build --profile production --platform ios --clear-cache
```

#### 오류: "Gradle build failed" (Android)

**원인:** Gradle 캐시 또는 의존성 문제

**해결 방법:**

```bash
# Gradle 캐시 클리어
eas build --profile production --platform android --clear-cache

# 또는 로컬에서
cd android
./gradlew clean
cd ..
```

### 패키지 버전 충돌

#### 오류: "peer dependency conflict"

**해결 방법:**

```bash
# npm 7+ (strict peer dependencies)
npm install --legacy-peer-deps

# 또는 package.json에 overrides 추가
{
  "overrides": {
    "package-name": "version"
  }
}
```

### Native 모듈 문제

#### 오류: "Module not found" (Native 모듈)

**원인:** Native 모듈이 제대로 링크되지 않음

**해결 방법:**

```bash
# Expo에서 prebuild 실행
npx expo prebuild --clean

# 또는 전체 재빌드
eas build --profile production --platform all --clear-cache
```

## iOS 배포 문제

### TestFlight 업로드 실패

#### 오류: "Invalid Bundle"

**일반적인 원인:**
- 잘못된 Bundle ID
- Provisioning Profile 문제
- 서명 인증서 문제

**해결 방법:**

```bash
# 1. EAS Credentials 확인
eas credentials

# 2. iOS 선택
# 3. Manage Distribution Certificate
# 4. Remove and regenerate

# 5. 재빌드
eas build --profile production --platform ios
```

#### 오류: "This bundle is invalid. The bundle version must be higher"

**원인:** buildNumber가 이전 제출보다 낮거나 같음

**해결 방법:**

```json
// app.json
{
  "expo": {
    "ios": {
      "buildNumber": "3"  // 이전보다 높은 번호
    }
  }
}
```

### App Store 심사 거절

#### Guideline 2.1 - App Completeness (크래시, 버그)

**대응:**
1. Sentry 또는 Firebase Crashlytics로 크래시 로그 확인
2. 버그 수정
3. 철저한 테스트
4. 새 빌드 제출

```bash
# 버그 수정 후
npm run version:patch  # 버전 증가
eas build --profile production --platform ios
eas submit --platform ios
```

#### Guideline 2.3 - Accurate Metadata (메타데이터 부정확)

**대응:**
1. 스크린샷이 실제 앱과 일치하는지 확인
2. 설명이 정확한지 확인
3. 메타데이터 업데이트
4. App Store Connect에서 재제출 (새 빌드 불필요)

#### Guideline 5.1.1 - Privacy (개인정보처리방침 누락)

**대응:**
1. 개인정보처리방침 페이지 생성 (HTTPS)
2. App Store Connect에 URL 추가
3. 재제출

#### Guideline 5.1.2 - Data Use and Sharing (권한 설명 부족)

**대응:**

```json
// app.json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "NSCameraUsageDescription": "프로필 사진 촬영을 위해 카메라 접근이 필요합니다.",
        "NSPhotoLibraryUsageDescription": "프로필 사진 업로드를 위해 사진 라이브러리 접근이 필요합니다.",
        "NSLocationWhenInUseUsageDescription": "주변 장소를 찾기 위해 위치 접근이 필요합니다."
      }
    }
  }
}
```

### Apple Developer 계정 문제

#### 오류: "Your Apple Developer Program membership has expired"

**해결:**
1. https://developer.apple.com 접속
2. 계정 갱신 ($99/year)
3. EAS Credentials 재설정

```bash
eas credentials
# iOS → Set up App Store Connect API Key
```

## Android 배포 문제

### Google Play 업로드 실패

#### 오류: "Version code X has already been used"

**원인:** versionCode가 이전 제출과 같거나 낮음

**해결 방법:**

```json
// app.json
{
  "expo": {
    "android": {
      "versionCode": 3  // 이전보다 높은 번호
    }
  }
}
```

#### 오류: "Upload failed: APK signature verification failed"

**원인:** Keystore 문제

**해결 방법:**

```bash
# 1. EAS Credentials 확인
eas credentials

# 2. Android 선택
# 3. Keystore 재생성 또는 업로드
```

### Google Play 심사 거절

#### 개인정보처리방침 누락

**대응:**
1. 개인정보처리방침 페이지 생성 (HTTPS)
2. Google Play Console → 앱 콘텐츠 → 개인정보처리방침 URL 추가
3. 재제출

#### 콘텐츠 등급 부정확

**대응:**
1. Google Play Console → 앱 콘텐츠 → 콘텐츠 등급
2. 설문 재작성
3. 정확한 콘텐츠 정보 제공
4. 재제출

#### 권한 사용 설명 부족

**대응:**

```json
// app.json
{
  "expo": {
    "android": {
      "permissions": [
        "CAMERA",
        "READ_EXTERNAL_STORAGE"
      ]
    }
  }
}
```

불필요한 권한 제거 후 재빌드

## OTA 업데이트 문제

### 업데이트가 적용되지 않음

#### 원인 1: runtimeVersion 불일치

**확인:**

```json
// app.json
{
  "expo": {
    "runtimeVersion": {
      "policy": "sdkVersion"
    }
  }
}
```

**해결:**
- 빌드와 업데이트의 runtimeVersion이 일치하는지 확인
- Expo SDK 버전이 다르면 새 빌드 필요

#### 원인 2: Native 코드 변경

**제한사항:**
- Native 모듈 추가/변경 → 새 빌드 필요
- app.json 권한 변경 → 새 빌드 필요
- Expo SDK 업그레이드 → 새 빌드 필요

**해결:**
새 빌드를 생성하여 스토어에 제출

#### 원인 3: 캐시 문제

**해결:**

```typescript
import * as Updates from 'expo-updates';

// 강제 업데이트 확인
await Updates.fetchUpdateAsync();
await Updates.reloadAsync();
```

### 업데이트 후 앱 크래시

**디버깅:**

```typescript
import * as Updates from 'expo-updates';
import * as Sentry from 'sentry-expo';

try {
  const update = await Updates.checkForUpdateAsync();
  if (update.isAvailable) {
    await Updates.fetchUpdateAsync();

    Sentry.Native.addBreadcrumb({
      message: 'Update downloaded',
      data: { updateId: update.manifest?.id },
    });

    await Updates.reloadAsync();
  }
} catch (error) {
  Sentry.Native.captureException(error);
  console.error('Update failed:', error);
}
```

**해결:**
1. 크래시 로그 확인 (Sentry)
2. 문제가 되는 업데이트 롤백
3. 버그 수정 후 새 업데이트 게시

```bash
# 이전 안정 버전으로 롤백
eas update:list --channel production
eas update:republish [stable-update-id]
```

## 환경 변수 문제

### 환경 변수가 로드되지 않음

#### 원인: app.config.js 오류

**확인:**

```javascript
// app.config.js
require('dotenv').config();

module.exports = {
  expo: {
    extra: {
      apiUrl: process.env.API_URL,
      apiKey: process.env.API_KEY,
    },
  },
};
```

**디버깅:**

```bash
# app.config.js가 제대로 로드되는지 확인
npx expo config

# extra 필드 확인
```

#### 원인: .env 파일 누락

**해결:**

```bash
# .env 파일 존재 확인
ls -la .env*

# .env.production 파일 생성
echo "API_URL=https://api.production.com" > .env.production
```

### EAS Build 환경 변수

```json
// eas.json
{
  "build": {
    "production": {
      "env": {
        "API_URL": "https://api.production.com"
      }
    }
  }
}
```

**또는 EAS Secrets 사용:**

```bash
# Secret 추가
eas secret:create --scope project --name API_KEY --value "secret-key"

# eas.json에서 참조
{
  "build": {
    "production": {
      "env": {
        "API_KEY": "$API_KEY"
      }
    }
  }
}
```

## 네트워크 문제

### API 요청 실패

#### 오류: "Network request failed"

**디버깅:**

```typescript
import axios from 'axios';

axios.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    // Sentry로 전송
    Sentry.Native.captureException(error);

    return Promise.reject(error);
  }
);
```

#### 원인 1: CORS 문제

**해결:**
- 백엔드에서 CORS 헤더 설정
- 프록시 서버 사용 (필요 시)

#### 원인 2: SSL 인증서 문제

**해결:**
- HTTPS 사용 확인
- 유효한 SSL 인증서 사용

#### 원인 3: 타임아웃

**해결:**

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.yourapp.com',
  timeout: 30000, // 30초
});
```

## 권한 문제

### 권한 요청이 작동하지 않음 (iOS)

#### 원인: Info.plist 설명 누락

**해결:**

```json
// app.json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "NSCameraUsageDescription": "카메라 접근이 필요합니다.",
        "NSPhotoLibraryUsageDescription": "사진 라이브러리 접근이 필요합니다."
      }
    }
  }
}
```

#### 권한 요청 코드:

```typescript
import * as ImagePicker from 'expo-image-picker';

const requestPermission = async () => {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();

  if (status !== 'granted') {
    alert('카메라 권한이 필요합니다.');
  }
};
```

### 권한 요청이 작동하지 않음 (Android)

#### 원인: Manifest 권한 누락

**해결:**

```json
// app.json
{
  "expo": {
    "android": {
      "permissions": [
        "CAMERA",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE"
      ]
    }
  }
}
```

## 성능 문제

### 앱이 느림

#### 디버깅:

```typescript
import { InteractionManager } from 'react-native';

// 화면 전환 후 무거운 작업 지연
InteractionManager.runAfterInteractions(() => {
  // 무거운 작업
});
```

#### 최적화:

1. **이미지 최적화**
   ```typescript
   import { Image } from 'expo-image';

   <Image
     source={{ uri: 'https://...' }}
     placeholder={{ uri: 'data:image/...' }} // 블러 플레이스홀더
     contentFit="cover"
     transition={200}
   />
   ```

2. **리스트 최적화**
   ```typescript
   import { FlashList } from '@shopify/flash-list';

   <FlashList
     data={items}
     renderItem={renderItem}
     estimatedItemSize={100}
   />
   ```

3. **메모이제이션**
   ```typescript
   import { useMemo, useCallback } from 'react';

   const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
   const memoizedCallback = useCallback(() => doSomething(a, b), [a, b]);
   ```

### 메모리 누수

#### 디버깅:

```typescript
import { useEffect } from 'react';

useEffect(() => {
  const subscription = someAPI.subscribe();

  // 클린업 함수
  return () => {
    subscription.unsubscribe();
  };
}, []);
```

## 일반적인 에러 해결

### "Couldn't find a navigation object"

**원인:** React Navigation 컨텍스트 외부에서 navigation 접근

**해결:**

```typescript
import { useNavigation } from '@react-navigation/native';

const MyComponent = () => {
  const navigation = useNavigation();

  // navigation 사용
};
```

### "Invariant Violation: requireNativeComponent"

**원인:** Native 모듈이 제대로 링크되지 않음

**해결:**

```bash
# Expo Go에서는 일부 Native 모듈 사용 불가
# Development Build 사용 필요

eas build --profile development --platform ios
```

### "Unable to resolve module"

**원인:** 모듈을 찾을 수 없음

**해결:**

```bash
# 캐시 클리어
npx expo start --clear

# node_modules 재설치
rm -rf node_modules
npm install
```

## 도움 받기

### 공식 문서

- Expo Documentation: https://docs.expo.dev/
- EAS Build Troubleshooting: https://docs.expo.dev/build-reference/troubleshooting/

### 커뮤니티

- Expo Forums: https://forums.expo.dev/
- Discord: https://chat.expo.dev/
- Stack Overflow: [expo] 태그

### 지원 요청

```bash
# EAS Build 로그 공유
eas build:view [build-id]

# 로그 URL 복사하여 포럼/Discord에 공유
```

---

**이 가이드는 배포 과정에서 발생하는 일반적인 문제와 해결 방법을 다룹니다.**
