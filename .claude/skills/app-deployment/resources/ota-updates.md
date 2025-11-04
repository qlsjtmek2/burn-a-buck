# OTA Updates (Over-The-Air) 가이드

앱 스토어 심사 없이 JavaScript 코드를 업데이트하는 EAS Update 가이드입니다.

## OTA Updates란?

**Over-The-Air (OTA) Updates:**
- 앱 스토어 심사 없이 JavaScript 코드 및 에셋 업데이트
- 사용자가 앱을 열 때 자동으로 업데이트 다운로드
- 긴급 버그 수정 또는 작은 기능 추가에 유용

**장점:**
- ✅ 빠른 배포 (몇 분 이내)
- ✅ 스토어 심사 불필요
- ✅ 버전별 롤백 가능
- ✅ 단계적 배포 (Phased Rollout) 지원

**제한사항:**
- ❌ Native 코드 변경 불가 (새 빌드 필요)
- ❌ app.json 권한 변경 불가
- ❌ Expo SDK 버전 업그레이드 불가
- ❌ 앱 아이콘, 스플래시 스크린 변경 불가

## EAS Update 설정

### 1. app.json 설정

```json
{
  "expo": {
    "name": "My App",
    "slug": "my-app",
    "version": "1.0.0",
    "updates": {
      "url": "https://u.expo.dev/your-project-id"
    },
    "runtimeVersion": {
      "policy": "sdkVersion"
    },
    "extra": {
      "eas": {
        "projectId": "your-project-id"
      }
    }
  }
}
```

**필드 설명:**
- `updates.url` - EAS Update 서버 URL
- `runtimeVersion.policy` - Runtime 버전 정책
  - `"sdkVersion"`: Expo SDK 버전 기반 (권장)
  - `"nativeVersion"`: Native 버전 기반
  - `"appVersion"`: app.json의 version 기반

### 2. runtimeVersion 정책

#### sdkVersion (권장)

```json
{
  "expo": {
    "runtimeVersion": {
      "policy": "sdkVersion"
    }
  }
}
```

**특징:**
- Expo SDK 버전과 자동 동기화
- SDK 업그레이드 시 새 빌드 필요
- 가장 안전하고 간단

#### nativeVersion

```json
{
  "expo": {
    "runtimeVersion": {
      "policy": "nativeVersion"
    }
  }
}
```

**특징:**
- app.json의 `version` (iOS) / `versionCode` (Android) 사용
- 버전 증가 시 새 빌드 필요

#### 커스텀 runtimeVersion

```json
{
  "expo": {
    "runtimeVersion": "1.0.0"
  }
}
```

**특징:**
- 수동으로 버전 관리
- 고급 사용자용

### 3. eas.json 설정

```json
{
  "cli": {
    "version": ">= 5.9.1"
  },
  "build": {
    "production": {
      "autoIncrement": true,
      "channel": "production"
    },
    "preview": {
      "channel": "preview"
    }
  }
}
```

**channel 설정:**
- 빌드를 특정 업데이트 채널에 연결
- 채널별로 다른 업데이트 배포 가능

## 업데이트 게시

### 기본 업데이트 게시

```bash
# 프로덕션 채널에 업데이트 게시
eas update --branch production --message "버그 수정 및 성능 개선"

# 또는 짧은 형식
eas update --message "버그 수정"
```

**자동 채널 선택:**
- 현재 Git 브랜치를 기반으로 채널 선택
- `main` 브랜치 → `production` 채널
- `develop` 브랜치 → `preview` 채널

### 특정 채널에 게시

```bash
# preview 채널에 게시
eas update --channel preview --message "새 기능 베타 테스트"

# staging 채널에 게시
eas update --channel staging --message "스테이징 테스트"
```

### 업데이트 확인

```bash
# 모든 업데이트 목록 확인
eas update:list

# 특정 채널의 업데이트 확인
eas update:list --channel production

# 특정 업데이트 상세 정보
eas update:view [update-id]
```

## 앱에서 업데이트 처리

### 기본 업데이트 확인

**자동 업데이트 (기본):**
- 앱 시작 시 자동으로 업데이트 확인
- 새 업데이트가 있으면 백그라운드에서 다운로드
- 다음 앱 재시작 시 적용

```typescript
import * as Updates from 'expo-updates';
import { useEffect } from 'react';

const App = () => {
  useEffect(() => {
    // 앱 시작 시 자동 확인 (기본 동작)
    // 추가 코드 불필요
  }, []);

  return <YourApp />;
};
```

### 수동 업데이트 확인

**사용자가 직접 업데이트 확인:**

```typescript
import * as Updates from 'expo-updates';
import { useState } from 'react';
import { View, Button, Text, ActivityIndicator } from 'react-native';

const UpdateChecker = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  const checkForUpdates = async () => {
    if (__DEV__) {
      console.log('개발 모드에서는 OTA 업데이트가 작동하지 않습니다.');
      return;
    }

    try {
      setIsChecking(true);
      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        setUpdateAvailable(true);
        // 업데이트 다운로드
        await Updates.fetchUpdateAsync();
        // 앱 재시작하여 업데이트 적용
        await Updates.reloadAsync();
      } else {
        alert('최신 버전입니다.');
      }
    } catch (error) {
      console.error('업데이트 확인 실패:', error);
      alert('업데이트 확인에 실패했습니다.');
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <View>
      <Button
        title="업데이트 확인"
        onPress={checkForUpdates}
        disabled={isChecking}
      />
      {isChecking && (
        <View style={{ marginTop: 10, alignItems: 'center' }}>
          <ActivityIndicator size="small" />
          <Text>업데이트 확인 중...</Text>
        </View>
      )}
    </View>
  );
};
```

### 강제 업데이트

**특정 버전 이하 사용자에게 강제 업데이트:**

```typescript
import * as Updates from 'expo-updates';
import { useEffect, useState } from 'react';
import { View, Text, Button, Modal } from 'react-native';
import Constants from 'expo-constants';

const MINIMUM_VERSION = '1.5.0';

const ForceUpdateModal = () => {
  const [showModal, setShowModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    checkVersion();
  }, []);

  const checkVersion = async () => {
    const currentVersion = Constants.expoConfig?.version || '0.0.0';

    if (compareVersions(currentVersion, MINIMUM_VERSION) < 0) {
      setShowModal(true);
    }
  };

  const handleUpdate = async () => {
    try {
      setIsUpdating(true);
      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        await Updates.reloadAsync();
      }
    } catch (error) {
      console.error('업데이트 실패:', error);
    }
  };

  return (
    <Modal visible={showModal} animationType="slide">
      <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>
          업데이트가 필요합니다
        </Text>
        <Text style={{ marginBottom: 20 }}>
          앱을 계속 사용하려면 최신 버전으로 업데이트해주세요.
        </Text>
        <Button
          title={isUpdating ? '업데이트 중...' : '지금 업데이트'}
          onPress={handleUpdate}
          disabled={isUpdating}
        />
      </View>
    </Modal>
  );
};

// 버전 비교 함수
const compareVersions = (v1: string, v2: string): number => {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);

  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const part1 = parts1[i] || 0;
    const part2 = parts2[i] || 0;

    if (part1 < part2) return -1;
    if (part1 > part2) return 1;
  }

  return 0;
};
```

### 업데이트 진행 상태 표시

```typescript
import * as Updates from 'expo-updates';
import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

const UpdateProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    checkForUpdates();
  }, []);

  const checkForUpdates = async () => {
    try {
      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        // 업데이트 다운로드 진행 상태 추적
        await Updates.fetchUpdateAsync();
        await Updates.reloadAsync();
      }
    } catch (error) {
      console.error('업데이트 실패:', error);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>업데이트 다운로드 중... {Math.round(progress * 100)}%</Text>
      <ActivityIndicator size="large" />
    </View>
  );
};
```

## 업데이트 롤백

### 이전 업데이트로 롤백

```bash
# 업데이트 목록 확인
eas update:list --channel production

# 특정 업데이트로 롤백
eas channel:edit production --branch [branch-name]

# 또는 특정 업데이트 ID로 롤백
eas update:republish [update-id]
```

**롤백 시나리오:**
1. 새 업데이트에 버그 발견
2. 이전 안정 버전 확인
3. 이전 버전을 현재 채널에 재게시
4. 사용자는 다음 앱 실행 시 이전 버전으로 되돌아감

## 업데이트 채널 관리

### 채널 생성 및 관리

```bash
# 새 채널 생성
eas channel:create [channel-name]

# 채널 목록 확인
eas channel:list

# 특정 채널 정보 확인
eas channel:view [channel-name]

# 채널 삭제
eas channel:delete [channel-name]
```

### 빌드를 채널에 연결

```bash
# 특정 빌드를 채널에 연결
eas channel:edit [channel-name] --branch [branch-name]
```

### 여러 채널 사용 예시

**프로덕션, 스테이징, 개발 환경:**

```json
// eas.json
{
  "build": {
    "production": {
      "channel": "production"
    },
    "staging": {
      "channel": "staging"
    },
    "development": {
      "channel": "development"
    }
  }
}
```

**업데이트 게시:**
```bash
# 개발 환경에 게시
eas update --channel development --message "개발 테스트"

# 스테이징 환경에 게시
eas update --channel staging --message "스테이징 검증"

# 프로덕션 환경에 게시
eas update --channel production --message "정식 출시"
```

## 업데이트 제한사항

### ✅ 업데이트 가능 (OTA)

**JavaScript 코드:**
- 앱 로직 변경
- 버그 수정
- 새 기능 추가 (Native 모듈 불필요 시)

**에셋:**
- 이미지 파일 (PNG, JPG, etc.)
- 폰트 파일
- JSON 데이터 파일
- 번역 파일

**설정:**
- API URL 변경 (app.config.js의 extra)
- 기능 플래그 (Feature Flags)

### ❌ 업데이트 불가 (새 빌드 필요)

**Native 코드:**
- Native 모듈 추가/변경
- Expo Config Plugins 변경
- 빌드 설정 변경

**app.json 권한:**
- `ios.infoPlist` 권한 설명 변경
- `android.permissions` 변경

**Expo SDK:**
- Expo SDK 버전 업그레이드
- `expo install` 패키지 업그레이드 (Native 의존성 포함 시)

**앱 메타데이터:**
- 앱 아이콘 변경
- 스플래시 스크린 변경
- 앱 이름 변경
- Bundle ID / Package Name 변경

## 모범 사례

### 1. 업데이트 메시지 작성

**명확하고 구체적인 메시지:**
```bash
# ✅ Good
eas update --message "로그인 버그 수정: 이메일 검증 오류 해결"
eas update --message "신규 기능: 다크 모드 지원 추가"

# ❌ Bad
eas update --message "버그 수정"
eas update --message "업데이트"
```

### 2. 테스트 후 배포

**workflow:**
1. 로컬에서 테스트
2. `preview` 채널에 배포하여 내부 테스트
3. 검증 완료 후 `production` 채널에 배포

```bash
# 1. 프리뷰 채널에 배포
eas update --channel preview --message "버그 수정 테스트"

# 2. 검증
# 테스터가 preview 채널 빌드에서 확인

# 3. 프로덕션 배포
eas update --channel production --message "버그 수정"
```

### 3. 업데이트 주기

**권장 주기:**
- **긴급 버그 수정**: 즉시
- **작은 기능 추가**: 주 1-2회
- **대규모 업데이트**: 새 빌드 제출

### 4. 모니터링

**업데이트 후 모니터링:**
- Sentry 또는 Firebase Crashlytics로 크래시 추적
- 사용자 피드백 확인
- 업데이트 다운로드 성공률 확인

```typescript
// 업데이트 성공 로깅
import * as Updates from 'expo-updates';
import * as Sentry from 'sentry-expo';

const checkForUpdates = async () => {
  try {
    const update = await Updates.checkForUpdateAsync();

    if (update.isAvailable) {
      Sentry.Native.addBreadcrumb({
        message: 'Update available',
        level: 'info',
      });

      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
    }
  } catch (error) {
    Sentry.Native.captureException(error);
  }
};
```

## 참고 자료

### Context7 MCP로 최신 문서 조회

```bash
# EAS Update 문서
mcp__context7__resolve-library-id "expo"
mcp__context7__get-library-docs "/expo/expo" topic: "EAS Update"

# expo-updates 패키지
mcp__context7__get-library-docs "/expo/expo" topic: "expo-updates"

# Runtime Version
mcp__context7__get-library-docs "/expo/expo" topic: "Runtime Version"
```

### 공식 문서

- EAS Update: https://docs.expo.dev/eas-update/introduction/
- expo-updates: https://docs.expo.dev/versions/latest/sdk/updates/
- Runtime Versions: https://docs.expo.dev/eas-update/runtime-versions/

---

**이 가이드는 OTA 업데이트를 사용하여 앱 스토어 심사 없이 빠르게 업데이트를 배포하는 방법을 다룹니다.**
