# 권한 관리 상세 가이드

## 개요

React Native 앱에서 카메라, 위치, 알림 등의 네이티브 기능을 사용하려면 반드시 사용자로부터 권한을 받아야 합니다. 이 가이드는 권한 요청, 상태 확인, 에러 처리 등 권한 관리의 모든 측면을 다룹니다.

## 권한 상태

모든 Expo SDK 권한은 다음 3가지 상태를 가집니다:

```typescript
type PermissionStatus = 'granted' | 'denied' | 'undetermined';

// granted: 사용자가 권한 승인
// denied: 사용자가 권한 거부
// undetermined: 아직 권한 요청 안함
```

## 권한 확인 및 요청 패턴

### 기본 패턴

```typescript
import * as Location from 'expo-location';

const requestLocationPermission = async () => {
  // 1. 현재 권한 상태 확인
  const { status: existingStatus } = await Location.getForegroundPermissionsAsync();

  let finalStatus = existingStatus;

  // 2. 권한이 미결정 상태면 요청
  if (existingStatus !== 'granted') {
    const { status } = await Location.requestForegroundPermissionsAsync();
    finalStatus = status;
  }

  // 3. 권한 상태에 따라 처리
  if (finalStatus !== 'granted') {
    alert('위치 권한이 필요합니다.');
    return false;
  }

  return true;
};
```

### Hook 패턴 (권장)

일부 Expo SDK는 권한 관리를 위한 Hook을 제공합니다:

```typescript
import { Camera } from 'expo-camera';

const CameraScreen = () => {
  const [permission, requestPermission] = Camera.useCameraPermissions();

  // permission 객체:
  // - status: 'granted' | 'denied' | 'undetermined'
  // - granted: boolean
  // - canAskAgain: boolean
  // - expires: 'never' | number

  if (!permission) {
    // 권한 정보 로딩 중
    return <LoadingView />;
  }

  if (!permission.granted) {
    return (
      <View>
        <Text>카메라 권한이 필요합니다</Text>
        <Button onPress={requestPermission} title="권한 요청" />
      </View>
    );
  }

  // 권한 승인됨 - 카메라 사용
  return <CameraView />;
};
```

## 주요 모듈별 권한 요청

### 1. Camera

```typescript
import { Camera } from 'expo-camera';

// Hook 사용
const [permission, requestPermission] = Camera.useCameraPermissions();

// 또는 직접 요청
const { status } = await Camera.requestCameraPermissionsAsync();

// 마이크 권한 (비디오 녹화 시)
const { status } = await Camera.requestMicrophonePermissionsAsync();
```

### 2. Image Picker

```typescript
import * as ImagePicker from 'expo-image-picker';

// 갤러리 권한
const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

// 카메라 권한
const { status } = await ImagePicker.requestCameraPermissionsAsync();
```

### 3. Location

```typescript
import * as Location from 'expo-location';

// 포그라운드 권한 (앱 사용 중)
const { status } = await Location.requestForegroundPermissionsAsync();

// 백그라운드 권한 (항상)
const { status } = await Location.requestBackgroundPermissionsAsync();
```

### 4. Notifications

```typescript
import * as Notifications from 'expo-notifications';

// 알림 권한
const { status } = await Notifications.requestPermissionsAsync();

// 특정 옵션 포함
const { status } = await Notifications.requestPermissionsAsync({
  ios: {
    allowAlert: true,
    allowBadge: true,
    allowSound: true,
    allowAnnouncements: true,
  },
});
```

### 5. Media Library

```typescript
import * as MediaLibrary from 'expo-media-library';

// 읽기 권한
const { status } = await MediaLibrary.requestPermissionsAsync();

// 쓰기 권한 (Android)
const { status } = await MediaLibrary.requestPermissionsAsync(true);
```

## 권한 거부 처리

### 1. 기본 에러 처리

```typescript
const handlePermissionDenied = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();

  if (status !== 'granted') {
    Alert.alert(
      '권한 필요',
      '위치 서비스를 사용하려면 위치 권한이 필요합니다.',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '설정 열기',
          onPress: () => Linking.openSettings(),
        },
      ]
    );
    return false;
  }

  return true;
};
```

### 2. 재요청 가능 여부 확인

```typescript
const checkCanAskAgain = async () => {
  const { status, canAskAgain } = await Camera.getCameraPermissionsAsync();

  if (status !== 'granted') {
    if (canAskAgain) {
      // 다시 요청 가능
      const { status: newStatus } = await Camera.requestCameraPermissionsAsync();
    } else {
      // 다시 요청 불가 - 설정으로 안내
      Alert.alert(
        '권한 필요',
        '카메라 권한이 필요합니다. 설정에서 권한을 허용해주세요.',
        [
          { text: '취소', style: 'cancel' },
          {
            text: '설정 열기',
            onPress: () => Linking.openSettings(),
          },
        ]
      );
    }
  }
};
```

## 권한 UI 패턴

### 패턴 1: 권한 요청 전 설명

```typescript
const LocationPermissionFlow = () => {
  const [showExplanation, setShowExplanation] = useState(true);
  const [permission, setPermission] = useState<PermissionStatus>('undetermined');

  const requestPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    setPermission(status);
  };

  if (showExplanation) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>위치 권한 필요</Text>
        <Text style={styles.description}>
          주변 장소를 찾기 위해 위치 정보가 필요합니다.
          위치 정보는 서비스 제공 목적으로만 사용됩니다.
        </Text>
        <Button
          title="권한 요청"
          onPress={() => {
            setShowExplanation(false);
            requestPermission();
          }}
        />
      </View>
    );
  }

  if (permission === 'denied') {
    return (
      <View style={styles.container}>
        <Text>위치 권한이 거부되었습니다.</Text>
        <Button title="설정 열기" onPress={() => Linking.openSettings()} />
      </View>
    );
  }

  // 권한 승인됨
  return <LocationFeature />;
};
```

### 패턴 2: 인라인 권한 요청

```typescript
const InlinePermissionRequest = () => {
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      // 권한 설명과 함께 요청
      Alert.alert(
        '갤러리 접근 권한',
        '프로필 사진 선택을 위해 갤러리 접근 권한이 필요합니다.',
        [
          { text: '취소', style: 'cancel' },
          {
            text: '허용',
            onPress: async () => {
              const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

              if (status === 'granted') {
                launchImagePicker();
              }
            },
          },
        ]
      );
      return;
    }

    launchImagePicker();
  };

  const launchImagePicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return <Button title="이미지 선택" onPress={pickImage} />;
};
```

### 패턴 3: 권한 상태 관리 Hook

```typescript
const usePermission = (
  getPermission: () => Promise<PermissionResponse>,
  requestPermission: () => Promise<PermissionResponse>
) => {
  const [status, setStatus] = useState<PermissionStatus>('undetermined');
  const [canAskAgain, setCanAskAgain] = useState(true);

  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () => {
    const response = await getPermission();
    setStatus(response.status);
    setCanAskAgain(response.canAskAgain);
  };

  const request = async () => {
    const response = await requestPermission();
    setStatus(response.status);
    setCanAskAgain(response.canAskAgain);
    return response.status === 'granted';
  };

  return { status, canAskAgain, request, checkPermission };
};

// 사용 예시
const MyComponent = () => {
  const locationPermission = usePermission(
    Location.getForegroundPermissionsAsync,
    Location.requestForegroundPermissionsAsync
  );

  if (locationPermission.status !== 'granted') {
    return (
      <View>
        <Text>위치 권한이 필요합니다</Text>
        <Button title="권한 요청" onPress={locationPermission.request} />
      </View>
    );
  }

  return <LocationFeature />;
};
```

## app.json 권한 설정

### iOS (Info.plist)

```json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "NSCameraUsageDescription": "프로필 사진 촬영에 카메라가 필요합니다.",
        "NSMicrophoneUsageDescription": "비디오 녹화에 마이크가 필요합니다.",
        "NSPhotoLibraryUsageDescription": "프로필 사진 선택을 위해 갤러리 접근이 필요합니다.",
        "NSPhotoLibraryAddUsageDescription": "촬영한 사진을 저장하기 위해 갤러리 접근이 필요합니다.",
        "NSLocationWhenInUseUsageDescription": "주변 장소를 찾기 위해 위치 정보가 필요합니다.",
        "NSLocationAlwaysAndWhenInUseUsageDescription": "백그라운드에서도 위치를 추적하기 위해 항상 접근 권한이 필요합니다.",
        "NSLocationAlwaysUsageDescription": "백그라운드에서 위치를 추적합니다."
      }
    }
  }
}
```

### Android (permissions)

```json
{
  "expo": {
    "android": {
      "permissions": [
        "CAMERA",
        "RECORD_AUDIO",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE",
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION",
        "ACCESS_BACKGROUND_LOCATION",
        "ACCESS_MEDIA_LOCATION"
      ]
    }
  }
}
```

## 플랫폼별 차이점

### iOS

1. **권한 설명 필수**: Info.plist에 사용 이유 명시 필수
2. **재요청 제한**: 한 번 거부하면 다시 요청 불가 (설정으로 안내)
3. **백그라운드 위치**: 앱 스토어 심사 시 명확한 사용 이유 필요

### Android

1. **런타임 권한**: Android 6.0+ 부터 런타임 권한 요청 필요
2. **백그라운드 위치**: Android 10+ 부터 별도 권한 필요
3. **Scoped Storage**: Android 10+ 부터 Scoped Storage 적용

### Android 버전별 차이

```typescript
// Android 10+ (API 29) 백그라운드 위치 권한
if (Platform.OS === 'android' && Platform.Version >= 29) {
  const { status } = await Location.requestBackgroundPermissionsAsync();
}

// Android 13+ (API 33) 알림 권한
if (Platform.OS === 'android' && Platform.Version >= 33) {
  const { status } = await Notifications.requestPermissionsAsync();
}
```

## 베스트 프랙티스

### 1. 권한 요청 타이밍

```typescript
// ✅ GOOD: 기능 사용 직전 요청
const takePhoto = async () => {
  const { status } = await Camera.requestCameraPermissionsAsync();

  if (status === 'granted') {
    // 카메라 실행
  }
};

// ❌ BAD: 앱 시작 시 모든 권한 요청
useEffect(() => {
  Camera.requestCameraPermissionsAsync();
  Location.requestForegroundPermissionsAsync();
  Notifications.requestPermissionsAsync();
  // 사용자 혼란 및 거부 가능성 높음
}, []);
```

### 2. 명확한 설명 제공

```typescript
// ✅ GOOD: 왜 필요한지 설명
Alert.alert(
  '카메라 권한 필요',
  '프로필 사진 촬영을 위해 카메라 접근 권한이 필요합니다.',
  [
    { text: '취소', style: 'cancel' },
    { text: '허용', onPress: requestPermission },
  ]
);

// ❌ BAD: 설명 없이 요청
await Camera.requestCameraPermissionsAsync();
```

### 3. 거부 시 대안 제공

```typescript
const uploadProfilePhoto = async () => {
  const { status } = await Camera.requestCameraPermissionsAsync();

  if (status !== 'granted') {
    // 대안 제공: 갤러리에서 선택
    Alert.alert(
      '카메라 사용 불가',
      '갤러리에서 사진을 선택하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        { text: '갤러리', onPress: pickFromGallery },
      ]
    );
    return;
  }

  takePhoto();
};
```

### 4. 권한 상태 캐싱

```typescript
const useLocationPermission = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () => {
    const { status } = await Location.getForegroundPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  return { hasPermission, checkPermission };
};
```

## 일반적인 에러 및 해결

### 에러 1: "Permission denied"

```typescript
// 원인: 권한 요청 없이 기능 사용
// 해결: 항상 권한 확인 후 사용
const { status } = await Camera.requestCameraPermissionsAsync();
if (status === 'granted') {
  // 기능 사용
}
```

### 에러 2: "Cannot ask for permission again"

```typescript
// 원인: iOS에서 이미 거부한 권한 재요청
// 해결: 설정으로 안내
if (!permission.canAskAgain) {
  Alert.alert('설정에서 권한을 허용해주세요.');
  Linking.openSettings();
}
```

### 에러 3: "Missing permission in AndroidManifest.xml"

```typescript
// 원인: app.json에 권한 설정 누락
// 해결: app.json에 필요한 권한 추가
{
  "android": {
    "permissions": ["CAMERA"]
  }
}
```

## 테스트 체크리스트

- [ ] 권한 승인 시 정상 동작
- [ ] 권한 거부 시 적절한 메시지 표시
- [ ] 권한 재요청 불가 시 설정 안내
- [ ] 플랫폼별 권한 설명 메시지 확인
- [ ] app.json 권한 설정 확인
- [ ] 실제 기기에서 테스트 (시뮬레이터는 일부 권한 제한)

## 관련 문서

- [Expo Permissions API](https://docs.expo.dev/versions/latest/sdk/permissions/)
- [iOS App Store Review Guidelines - Permissions](https://developer.apple.com/app-store/review/guidelines/#data-collection-and-storage)
- [Android Permissions Best Practices](https://developer.android.com/training/permissions/requesting)
