---
name: native-modules
description: Expo SDK and native modules integration with Context7 documentation. Use when implementing camera, location, notifications, file system, image picker, or media library features. Covers permissions, platform differences, and best practices.
version: 2.0.0
type: domain
tags:
  - expo
  - native-modules
  - permissions
  - camera
  - location
  - notifications
  - react-native
  - ios
  - android
---

# Native Modules Integration

**Expo SDK와 네이티브 기능을 안전하고 효과적으로 통합하는 가이드입니다.**

카메라, 위치, 푸시 알림 등 네이티브 기능을 React Native 앱에 통합하는 방법을 제공합니다.

## 🎯 핵심 원칙

### 1. Context7 MCP로 최신 Expo 문서 조회

Expo SDK 사용 전 **반드시 Context7 MCP로 최신 문서를 확인**합니다.

```bash
# 1. resolve-library-id "expo" → Context7 호환 라이브러리 ID 확인
# 2. get-library-docs "/expo/expo" topic: "Camera" → 특정 모듈의 최신 API 문서 조회
```

**Context7 사용 필수 시나리오:**
- ✅ 새로운 Expo SDK 모듈 사용 시작
- ✅ API 변경 사항 확인 (Expo SDK는 자주 업데이트됨)
- ✅ 권한 요청 방법 확인
- ✅ 플랫폼별 차이점 확인

### 2. 권한 처리 우선

모든 네이티브 기능 사용 전 **권한을 먼저 요청**하고 처리합니다.

```typescript
// ✅ GOOD: 권한 먼저 확인
const pickImage = async () => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (status !== 'granted') {
    alert('사진 접근 권한이 필요합니다.');
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync();
  // ...
};

// ❌ BAD: 권한 확인 없이 바로 사용
const pickImage = async () => {
  const result = await ImagePicker.launchImageLibraryAsync(); // 권한 거부 시 에러!
};
```

**권한 관리 상세 가이드**: `references/permissions-guide.md` 참조

### 3. 에러 처리 필수

네이티브 모듈은 **항상 try-catch로 감싸**고 사용자에게 명확한 피드백을 제공합니다.

```typescript
const getLocation = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      throw new Error('위치 권한이 거부되었습니다.');
    }

    const location = await Location.getCurrentPositionAsync({});
    return location;
  } catch (error) {
    console.error('위치 가져오기 실패:', error);
    alert('위치를 가져올 수 없습니다. 설정에서 권한을 확인해주세요.');
    throw error;
  }
};
```

## 📦 주요 Expo SDK 모듈

### Camera (expo-camera)

**카메라 촬영 및 스캔 기능**

```typescript
import { Camera } from 'expo-camera';

const [permission, requestPermission] = Camera.useCameraPermissions();

if (!permission?.granted) {
  return <Button onPress={requestPermission} title="권한 요청" />;
}

// 카메라 사용
<Camera ref={cameraRef} style={styles.camera} />
```

**상세 가이드**: `references/modules/camera.md` 참조

### Image Picker (expo-image-picker)

**갤러리에서 이미지/비디오 선택 또는 카메라 촬영**

```typescript
import * as ImagePicker from 'expo-image-picker';

const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
const result = await ImagePicker.launchImageLibraryAsync({
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  allowsEditing: true,
  quality: 0.8,
});
```

**상세 가이드**: `references/modules/image-picker.md` 참조

### Location (expo-location)

**위치 정보 가져오기 및 백그라운드 추적**

```typescript
import * as Location from 'expo-location';

const { status } = await Location.requestForegroundPermissionsAsync();
const location = await Location.getCurrentPositionAsync({
  accuracy: Location.Accuracy.Balanced,
});
```

**상세 가이드**: `references/modules/location.md` 참조

### Notifications (expo-notifications)

**푸시 알림 및 로컬 알림**

```typescript
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const { status } = await Notifications.requestPermissionsAsync();
await Notifications.scheduleNotificationAsync({
  content: { title: '알림', body: '내용' },
  trigger: { seconds: 5 },
});
```

**상세 가이드**: `references/modules/notifications.md` 참조

### File System (expo-file-system)

**파일 읽기/쓰기 및 다운로드**

```typescript
import * as FileSystem from 'expo-file-system';

const fileUri = FileSystem.documentDirectory + 'file.txt';
await FileSystem.writeAsStringAsync(fileUri, 'content');
const content = await FileSystem.readAsStringAsync(fileUri);
```

**상세 가이드**: `references/modules/filesystem.md` 참조

### Media Library (expo-media-library)

**갤러리 접근 및 미디어 관리**

```typescript
import * as MediaLibrary from 'expo-media-library';

const { status } = await MediaLibrary.requestPermissionsAsync();
const asset = await MediaLibrary.createAssetAsync(uri);
await MediaLibrary.createAlbumAsync('MyApp', asset);
```

**상세 가이드**: `references/modules/media-library.md` 참조

## 🔐 권한 관리 패턴

### Hook 패턴 (권장)

```typescript
import { Camera } from 'expo-camera';

const [permission, requestPermission] = Camera.useCameraPermissions();

if (!permission) return <LoadingView />;
if (!permission.granted) return <PermissionRequestView onPress={requestPermission} />;

return <CameraView />;
```

### 직접 요청 패턴

```typescript
const { status } = await Location.requestForegroundPermissionsAsync();

if (status !== 'granted') {
  Alert.alert('권한 필요', '위치 권한이 필요합니다.', [
    { text: '취소', style: 'cancel' },
    { text: '설정 열기', onPress: () => Linking.openSettings() },
  ]);
  return;
}
```

**권한 관리 상세 가이드**: `references/permissions-guide.md` 참조

## 🔧 플랫폼별 처리

### Platform.select 사용

```typescript
import { Platform } from 'react-native';

const config = Platform.select({
  ios: { quality: 1, format: 'png' },
  android: { quality: 0.8, format: 'jpeg' },
});

// 스타일에서
const styles = StyleSheet.create({
  card: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
      },
      android: {
        elevation: 4,
      },
    }),
  },
});
```

### 플랫폼별 파일

```
components/
  Button.ios.tsx    # iOS 전용
  Button.android.tsx  # Android 전용
```

**플랫폼별 처리 상세 가이드**: `references/platform-guide.md` 참조

## 📱 app.json 권한 설정

### iOS

```json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "NSCameraUsageDescription": "프로필 사진 촬영에 카메라가 필요합니다.",
        "NSPhotoLibraryUsageDescription": "프로필 사진 선택을 위해 갤러리 접근이 필요합니다.",
        "NSLocationWhenInUseUsageDescription": "주변 장소를 찾기 위해 위치 정보가 필요합니다."
      }
    }
  }
}
```

### Android

```json
{
  "expo": {
    "android": {
      "permissions": [
        "CAMERA",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE",
        "ACCESS_FINE_LOCATION"
      ]
    }
  }
}
```

## ⚠️ 주의사항

### 권한 관련

✅ **권한 먼저 확인**
```typescript
const { status } = await Location.requestForegroundPermissionsAsync();
if (status !== 'granted') return;
const location = await Location.getCurrentPositionAsync();
```

❌ **권한 없이 기능 사용**
```typescript
const location = await Location.getCurrentPositionAsync(); // 에러 발생!
```

### 에러 처리

✅ **try-catch로 에러 처리**
```typescript
try {
  const location = await Location.getCurrentPositionAsync();
} catch (error) {
  console.error(error);
  alert('위치를 가져올 수 없습니다.');
}
```

❌ **에러 무시**
```typescript
const location = await Location.getCurrentPositionAsync(); // 에러 시 앱 크래시
```

### 플랫폼별 처리

✅ **플랫폼별로 적절한 처리**
```typescript
...Platform.select({
  ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 } },
  android: { elevation: 3 },
})
```

❌ **플랫폼 차이 무시**
```typescript
shadowColor: '#000', // Android에서 작동 안함
```

## 📖 참고 자료

### Context7 MCP로 조회할 주요 모듈

```bash
# Expo 전체 문서
mcp__context7__get-library-docs "/expo/expo"

# 특정 모듈 문서
mcp__context7__get-library-docs "/expo/expo" topic: "Camera"
mcp__context7__get-library-docs "/expo/expo" topic: "Location"
mcp__context7__get-library-docs "/expo/expo" topic: "Notifications"
```

### 상세 가이드

**모듈별 가이드:**
- `references/modules/camera.md` - Camera 상세 가이드
- `references/modules/image-picker.md` - ImagePicker 상세 가이드
- `references/modules/location.md` - Location 상세 가이드
- `references/modules/notifications.md` - Notifications 상세 가이드
- `references/modules/filesystem.md` - FileSystem 상세 가이드
- `references/modules/media-library.md` - MediaLibrary 상세 가이드

**주제별 가이드:**
- `references/permissions-guide.md` - 권한 관리 상세 가이드
- `references/platform-guide.md` - 플랫폼별 처리 가이드
- `references/examples.md` - 실전 예제 모음

### 공식 문서

- Expo 문서: https://docs.expo.dev/
- Expo API Reference: https://docs.expo.dev/versions/latest/
- Permissions Guide: https://docs.expo.dev/guides/permissions/

### Magic MCP 활용

네이티브 기능을 사용하는 UI가 필요하면 Magic MCP 사용:
```bash
mcp__magic__21st_magic_component_builder
# "프로필 사진 업로드 UI 만들어줘"
```

---

**이 스킬은 Expo SDK의 최신 API를 Context7 MCP로 조회하여 안전하고 효과적으로 네이티브 기능을 통합합니다.**
