# EAS Build 설정 가이드

EAS (Expo Application Services)를 사용하여 React Native 앱을 빌드하기 위한 설정 가이드입니다.

## EAS CLI 설치 및 로그인

### CLI 설치

```bash
# EAS CLI 전역 설치
npm install -g eas-cli

# 설치 확인
eas --version
```

### Expo 계정 로그인

```bash
# 로그인
eas login

# 로그인 상태 확인
eas whoami
```

### 프로젝트 초기화

```bash
# EAS Build 설정 파일 생성
eas build:configure

# eas.json 파일이 생성됩니다
```

## eas.json 설정

`eas.json`은 빌드 프로파일, 제출 설정, 업데이트 설정을 정의합니다.

### 기본 구조

```json
{
  "cli": {
    "version": ">= 5.9.1"
  },
  "build": {
    "development": {},
    "preview": {},
    "production": {}
  },
  "submit": {
    "production": {}
  }
}
```

### 완전한 eas.json 예제

```json
{
  "cli": {
    "version": ">= 5.9.1"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": false
      },
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "autoIncrement": true,
      "env": {
        "NODE_ENV": "production"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@example.com",
        "ascAppId": "1234567890",
        "appleTeamId": "ABCDE12345"
      },
      "android": {
        "serviceAccountKeyPath": "./google-play-service-account.json",
        "track": "internal"
      }
    }
  }
}
```

### 빌드 프로파일 설명

#### development 프로파일
**용도:** 개발 중 테스트

```json
{
  "development": {
    "developmentClient": true,
    "distribution": "internal",
    "ios": {
      "simulator": true
    }
  }
}
```

**특징:**
- `developmentClient: true` - Expo Go 대신 Development Build 사용
- `distribution: "internal"` - 내부 배포용
- `simulator: true` - iOS 시뮬레이터용 빌드 생성

**빌드 명령:**
```bash
eas build --profile development --platform ios
```

#### preview 프로파일
**용도:** 내부 테스트 (TestFlight, Internal Testing)

```json
{
  "preview": {
    "distribution": "internal",
    "ios": {
      "simulator": false
    },
    "android": {
      "buildType": "apk"
    }
  }
}
```

**특징:**
- `distribution: "internal"` - TestFlight 또는 Internal Testing용
- `buildType: "apk"` - Android APK 생성 (직접 설치 가능)

**빌드 명령:**
```bash
# iOS: TestFlight
eas build --profile preview --platform ios

# Android: APK
eas build --profile preview --platform android
```

#### production 프로파일
**용도:** App Store / Google Play 제출용

```json
{
  "production": {
    "autoIncrement": true,
    "env": {
      "NODE_ENV": "production"
    }
  }
}
```

**특징:**
- `autoIncrement: true` - buildNumber/versionCode 자동 증가
- `env` - 프로덕션 환경 변수

**빌드 명령:**
```bash
# iOS와 Android 동시 빌드
eas build --profile production --platform all
```

### 고급 빌드 옵션

#### 캐시 설정

```json
{
  "build": {
    "production": {
      "cache": {
        "key": "production",
        "paths": [
          "node_modules",
          ".expo"
        ]
      }
    }
  }
}
```

#### 빌드 시 실행할 스크립트

```json
{
  "build": {
    "production": {
      "prebuildCommand": "echo 'Pre-build script'",
      "postBuildCommand": "echo 'Post-build script'"
    }
  }
}
```

#### 커스텀 빌드 이미지

```json
{
  "build": {
    "production": {
      "image": "latest"
    }
  }
}
```

**사용 가능한 이미지:**
- `latest` - 최신 안정 버전
- `stable` - 안정 버전
- `canary` - 베타 버전

## app.json 설정

`app.json`은 앱의 메타데이터와 설정을 정의합니다.

### 기본 정보

```json
{
  "expo": {
    "name": "My App",
    "slug": "my-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "automatic"
  }
}
```

**필드 설명:**
- `name` - 앱 이름 (홈 화면에 표시)
- `slug` - URL-safe 앱 식별자 (고유해야 함)
- `version` - 앱 버전 (Semantic Versioning)
- `orientation` - 화면 방향 (`portrait`, `landscape`, `default`)
- `icon` - 앱 아이콘 (1024x1024 PNG)
- `userInterfaceStyle` - 다크 모드 지원 (`automatic`, `light`, `dark`)

### 스플래시 스크린

```json
{
  "expo": {
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    }
  }
}
```

**필드 설명:**
- `image` - 스플래시 이미지 경로
- `resizeMode` - 이미지 크기 조정 (`contain`, `cover`)
- `backgroundColor` - 배경 색상

### iOS 설정

```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.yourcompany.yourapp",
      "buildNumber": "1",
      "supportsTablet": true,
      "infoPlist": {
        "NSCameraUsageDescription": "카메라 접근이 필요합니다.",
        "NSPhotoLibraryUsageDescription": "사진 접근이 필요합니다.",
        "NSLocationWhenInUseUsageDescription": "위치 접근이 필요합니다."
      }
    }
  }
}
```

**필드 설명:**
- `bundleIdentifier` - iOS Bundle ID (역도메인 형식, 변경 불가)
- `buildNumber` - 빌드 번호 (TestFlight 제출마다 증가)
- `supportsTablet` - iPad 지원 여부
- `infoPlist` - Info.plist 설정 (권한 설명 포함)

**주요 권한 설명 키:**
- `NSCameraUsageDescription` - 카메라
- `NSPhotoLibraryUsageDescription` - 사진 라이브러리
- `NSLocationWhenInUseUsageDescription` - 위치 (사용 중)
- `NSLocationAlwaysUsageDescription` - 위치 (항상)
- `NSMicrophoneUsageDescription` - 마이크
- `NSContactsUsageDescription` - 연락처
- `NSCalendarsUsageDescription` - 캘린더

### Android 설정

```json
{
  "expo": {
    "android": {
      "package": "com.yourcompany.yourapp",
      "versionCode": 1,
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "permissions": [
        "CAMERA",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE",
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION"
      ]
    }
  }
}
```

**필드 설명:**
- `package` - Android Package Name (역도메인 형식, 변경 불가)
- `versionCode` - 버전 코드 (정수, Google Play 제출마다 증가)
- `adaptiveIcon` - Android 8.0+ Adaptive Icon
- `permissions` - Android 권한 목록

**주요 권한:**
- `CAMERA` - 카메라
- `READ_EXTERNAL_STORAGE` - 저장소 읽기
- `WRITE_EXTERNAL_STORAGE` - 저장소 쓰기
- `ACCESS_FINE_LOCATION` - 정확한 위치
- `ACCESS_COARSE_LOCATION` - 대략적인 위치
- `RECORD_AUDIO` - 오디오 녹음
- `READ_CONTACTS` - 연락처 읽기

### EAS 프로젝트 ID

```json
{
  "expo": {
    "extra": {
      "eas": {
        "projectId": "your-project-id"
      }
    }
  }
}
```

**프로젝트 ID 생성:**
```bash
# EAS 프로젝트 생성
eas build:configure

# 자동으로 projectId가 생성되어 app.json에 추가됩니다
```

### 완전한 app.json 예제

```json
{
  "expo": {
    "name": "My App",
    "slug": "my-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "bundleIdentifier": "com.yourcompany.yourapp",
      "buildNumber": "1",
      "supportsTablet": true,
      "infoPlist": {
        "NSCameraUsageDescription": "카메라 접근이 필요합니다.",
        "NSPhotoLibraryUsageDescription": "사진 접근이 필요합니다.",
        "NSLocationWhenInUseUsageDescription": "위치 접근이 필요합니다."
      }
    },
    "android": {
      "package": "com.yourcompany.yourapp",
      "versionCode": 1,
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "permissions": [
        "CAMERA",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE",
        "ACCESS_FINE_LOCATION"
      ]
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "extra": {
      "eas": {
        "projectId": "your-project-id"
      }
    },
    "updates": {
      "url": "https://u.expo.dev/your-project-id"
    },
    "runtimeVersion": {
      "policy": "sdkVersion"
    }
  }
}
```

## 환경 변수 관리

### .env 파일 사용

```bash
# .env.development
API_URL=https://api.development.com
API_KEY=dev-api-key

# .env.production
API_URL=https://api.production.com
API_KEY=prod-api-key
```

### app.config.js로 환경 변수 로드

```javascript
// app.config.js
require('dotenv').config();

module.exports = {
  expo: {
    name: process.env.APP_NAME || 'My App',
    slug: 'my-app',
    version: '1.0.0',
    extra: {
      apiUrl: process.env.API_URL,
      apiKey: process.env.API_KEY,
      sentryDsn: process.env.SENTRY_DSN,
      // EAS Update 설정 - .env 파일에서 로드 가능
      eas: {
        projectId: process.env.EAS_PROJECT_ID || 'your-project-id',
      },
    },
  },
};
```

### 앱에서 환경 변수 사용

```typescript
// src/config/env.ts
import Constants from 'expo-constants';

interface ExtraConfig {
  apiUrl: string;
  apiKey: string;
  sentryDsn: string;
}

const extra = Constants.expoConfig?.extra as ExtraConfig;

export const ENV = {
  API_URL: extra?.apiUrl || 'https://api.default.com',
  API_KEY: extra?.apiKey || 'default-key',
  SENTRY_DSN: extra?.sentryDsn,
};
```

```typescript
// 사용 예
import { ENV } from './config/env';

fetch(`${ENV.API_URL}/users`, {
  headers: {
    'X-API-Key': ENV.API_KEY,
  },
});
```

### EAS Build 환경 변수

```json
// eas.json
{
  "build": {
    "production": {
      "env": {
        "NODE_ENV": "production",
        "API_URL": "https://api.production.com"
      }
    },
    "preview": {
      "env": {
        "NODE_ENV": "staging",
        "API_URL": "https://api.staging.com"
      }
    }
  }
}
```

### 비밀 환경 변수 (Secrets)

**EAS Secrets 사용 (권장):**
```bash
# Secret 추가
eas secret:create --scope project --name API_KEY --value "your-secret-key"

# Secret 목록 확인
eas secret:list

# Secret 삭제
eas secret:delete --name API_KEY
```

**eas.json에서 Secret 참조:**
```json
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

## Credentials 관리

### iOS Credentials

**Apple Developer 계정 필요:**
- Apple Developer Program 가입 ($99/year)
- App Store Connect 접근 권한

**EAS가 자동 관리 (권장):**
```bash
# 첫 빌드 시 자동으로 생성
eas build --profile production --platform ios

# EAS가 자동으로 생성하는 것:
# - App ID
# - Distribution Certificate
# - Provisioning Profile
```

**수동 관리 (필요 시):**
```bash
# Credentials 관리 메뉴
eas credentials

# iOS 선택
# - Set up App Store Connect API Key
# - Manage Distribution Certificate
# - Manage Provisioning Profile
```

### Android Credentials

**Android Keystore:**
- EAS가 자동으로 생성 및 관리 (권장)
- 또는 기존 keystore 업로드 가능

**EAS가 자동 관리 (권장):**
```bash
# 첫 빌드 시 자동으로 생성
eas build --profile production --platform android

# EAS가 자동으로 생성:
# - Keystore
# - Key alias
# - Key password
# - Keystore password
```

**기존 Keystore 업로드:**
```bash
# Credentials 관리 메뉴
eas credentials

# Android 선택
# - Upload Keystore
```

**Keystore 생성 (로컬):**
```bash
# keytool로 Keystore 생성
keytool -genkeypair -v -keystore my-release-key.keystore \
  -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

## 빌드 캐시

### 캐시 활성화

```json
// eas.json
{
  "build": {
    "production": {
      "cache": {
        "key": "production-cache",
        "paths": [
          "node_modules",
          ".expo",
          "$HOME/.gradle/caches",
          "$HOME/Library/Caches/CocoaPods"
        ]
      }
    }
  }
}
```

### 캐시 클리어

```bash
# 특정 빌드에서 캐시 무시
eas build --profile production --platform ios --clear-cache

# 또는 eas.json에서 캐시 비활성화
{
  "build": {
    "production": {
      "cache": {
        "disabled": true
      }
    }
  }
}
```

## 참고 자료

### Context7 MCP로 최신 문서 조회

```bash
# EAS Build 문서
mcp__context7__resolve-library-id "expo"
mcp__context7__get-library-docs "/expo/expo" topic: "EAS Build"

# app.json 설정
mcp__context7__get-library-docs "/expo/expo" topic: "app.json"

# eas.json 설정
mcp__context7__get-library-docs "/expo/expo" topic: "eas.json"
```

### 공식 문서

- EAS Build: https://docs.expo.dev/build/introduction/
- app.json: https://docs.expo.dev/versions/latest/config/app/
- eas.json: https://docs.expo.dev/build/eas-json/
- Credentials: https://docs.expo.dev/app-signing/managed-credentials/

---

**이 가이드는 EAS Build 설정에 필요한 모든 파일 및 환경 변수 관리를 다룹니다.**
