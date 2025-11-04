# 플랫폼별 처리 가이드

## 개요

React Native는 크로스 플랫폼 프레임워크이지만, iOS와 Android는 많은 부분에서 차이가 있습니다. 이 가이드는 플랫폼별 차이점을 처리하는 방법을 제공합니다.

## Platform.OS 사용

### 1. 플랫폼 확인

```typescript
import { Platform } from 'react-native';

// 현재 플랫폼 확인
console.log(Platform.OS); // 'ios' | 'android' | 'web'

// 조건부 실행
if (Platform.OS === 'ios') {
  console.log('iOS에서 실행 중');
} else if (Platform.OS === 'android') {
  console.log('Android에서 실행 중');
}
```

### 2. 플랫폼 버전 확인

```typescript
// iOS 버전
if (Platform.OS === 'ios') {
  console.log('iOS 버전:', Platform.Version); // 예: "14.0"
}

// Android API 레벨
if (Platform.OS === 'android') {
  console.log('Android API 레벨:', Platform.Version); // 예: 30
}
```

## Platform.select 사용

### 1. 값 선택

```typescript
import { Platform } from 'react-native';

// 플랫폼별로 다른 값 사용
const padding = Platform.select({
  ios: 20,
  android: 16,
  default: 18, // web이나 다른 플랫폼
});

const fontSize = Platform.select({
  ios: {
    fontSize: 16,
    fontWeight: '600',
  },
  android: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
```

### 2. 스타일링

```typescript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Platform.select({ ios: 20, android: 16 }),
  },
  text: {
    fontSize: Platform.select({ ios: 16, android: 14 }),
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
});
```

### 3. 컴포넌트 선택

```typescript
const Button = Platform.select({
  ios: () => <IOSButton />,
  android: () => <AndroidButton />,
})();

// 또는 JSX 내에서
<View>
  {Platform.select({
    ios: <IOSHeader />,
    android: <AndroidHeader />,
  })}
</View>
```

## 플랫폼별 파일

### 1. 파일 확장자

```
components/
  Button.ios.tsx    # iOS 전용
  Button.android.tsx  # Android 전용
  Button.tsx        # 공통 (또는 web)
```

### 2. Import

```typescript
// React Native가 자동으로 플랫폼에 맞는 파일 선택
import Button from './components/Button';
// iOS에서는 Button.ios.tsx 로드
// Android에서는 Button.android.tsx 로드
```

### 3. 예제

**Button.ios.tsx**
```typescript
import { TouchableOpacity, Text } from 'react-native';

export default function Button({ title, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.iosButton}>
      <Text style={styles.iosText}>{title}</Text>
    </TouchableOpacity>
  );
}
```

**Button.android.tsx**
```typescript
import { TouchableNativeFeedback, Text, View } from 'react-native';

export default function Button({ title, onPress }) {
  return (
    <TouchableNativeFeedback onPress={onPress}>
      <View style={styles.androidButton}>
        <Text style={styles.androidText}>{title}</Text>
      </View>
    </TouchableNativeFeedback>
  );
}
```

## 주요 플랫폼별 차이점

### 1. Shadow vs Elevation

**iOS: Shadow**
```typescript
const styles = StyleSheet.create({
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
```

**Android: Elevation**
```typescript
const styles = StyleSheet.create({
  card: {
    elevation: 5,
  },
});
```

**통합 스타일**
```typescript
const styles = StyleSheet.create({
  card: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
});
```

### 2. Status Bar

```typescript
import { StatusBar, Platform } from 'react-native';

// iOS
<StatusBar barStyle="dark-content" />

// Android
<StatusBar
  barStyle="dark-content"
  backgroundColor="#FFFFFF"
  translucent={false}
/>

// 통합
<StatusBar
  barStyle="dark-content"
  {...Platform.select({
    android: {
      backgroundColor: '#FFFFFF',
      translucent: false,
    },
  })}
/>
```

### 3. Safe Area

```typescript
import { SafeAreaView, Platform, StatusBar } from 'react-native';

const App = () => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        // Android에서 StatusBar 영역 확보
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
      }}
    >
      <View />
    </SafeAreaView>
  );
};
```

### 4. Back Handler

**Android만 지원**
```typescript
import { BackHandler, Platform } from 'react-native';

useEffect(() => {
  if (Platform.OS === 'android') {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        // 뒤로가기 버튼 처리
        navigation.goBack();
        return true; // 기본 동작 방지
      }
    );

    return () => backHandler.remove();
  }
}, []);
```

### 5. Font 처리

**iOS**
```typescript
fontFamily: 'System',
fontWeight: '600',
```

**Android**
```typescript
fontFamily: 'Roboto',
fontWeight: 'bold',
```

**통합**
```typescript
const styles = StyleSheet.create({
  text: {
    ...Platform.select({
      ios: {
        fontFamily: 'System',
        fontWeight: '600',
      },
      android: {
        fontFamily: 'Roboto',
        fontWeight: 'bold',
      },
    }),
  },
});
```

## 네이티브 모듈 플랫폼별 처리

### 1. Camera

```typescript
import { Camera } from 'expo-camera';

const cameraConfig = Platform.select({
  ios: {
    quality: 1,
    videoStabilizationMode: 'auto',
  },
  android: {
    quality: 0.8,
    // Android는 videoStabilizationMode 미지원
  },
});

const photo = await cameraRef.current.takePictureAsync(cameraConfig);
```

### 2. Location

```typescript
import * as Location from 'expo-location';

const locationConfig = Platform.select({
  ios: {
    accuracy: Location.Accuracy.BestForNavigation,
  },
  android: {
    accuracy: Location.Accuracy.High,
  },
});

const location = await Location.getCurrentPositionAsync(locationConfig);
```

### 3. Notifications

```typescript
import * as Notifications from 'expo-notifications';

// Android 전용: 알림 채널 생성
if (Platform.OS === 'android') {
  await Notifications.setNotificationChannelAsync('default', {
    name: '기본 알림',
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#FF231F7C',
  });
}
```

## app.json 플랫폼별 설정

### iOS 전용 설정

```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.example.app",
      "buildNumber": "1.0.0",
      "supportsTablet": true,
      "infoPlist": {
        "NSCameraUsageDescription": "카메라 사용 이유",
        "UIBackgroundModes": ["location", "remote-notification"]
      },
      "config": {
        "usesNonExemptEncryption": false
      }
    }
  }
}
```

### Android 전용 설정

```json
{
  "expo": {
    "android": {
      "package": "com.example.app",
      "versionCode": 1,
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#FFFFFF"
      },
      "permissions": [
        "CAMERA",
        "ACCESS_FINE_LOCATION"
      ],
      "config": {
        "googleMaps": {
          "apiKey": "YOUR_GOOGLE_MAPS_API_KEY"
        }
      }
    }
  }
}
```

## 조건부 Import

### 1. 플랫폼별 모듈

```typescript
let NotificationModule;

if (Platform.OS === 'ios') {
  NotificationModule = require('./NotificationModuleIOS').default;
} else {
  NotificationModule = require('./NotificationModuleAndroid').default;
}

export default NotificationModule;
```

### 2. 동적 Import

```typescript
const loadPlatformModule = async () => {
  if (Platform.OS === 'ios') {
    const module = await import('./IOSModule');
    return module.default;
  } else {
    const module = await import('./AndroidModule');
    return module.default;
  }
};
```

## 플랫폼 버전별 처리

### iOS 버전

```typescript
const isIOS14OrLater = Platform.OS === 'ios' && parseInt(Platform.Version, 10) >= 14;

if (isIOS14OrLater) {
  // iOS 14+ 전용 기능
}
```

### Android API 레벨

```typescript
const isAndroid10OrLater = Platform.OS === 'android' && Platform.Version >= 29;

if (isAndroid10OrLater) {
  // Android 10 (API 29)+ 전용 기능
  const { status } = await Location.requestBackgroundPermissionsAsync();
}

const isAndroid13OrLater = Platform.OS === 'android' && Platform.Version >= 33;

if (isAndroid13OrLater) {
  // Android 13 (API 33)+ 전용 기능
  const { status } = await Notifications.requestPermissionsAsync();
}
```

## 실전 예제

### 예제 1: 플랫폼별 카드 컴포넌트

```typescript
const Card = ({ children }) => {
  return (
    <View style={styles.card}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    margin: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
});
```

### 예제 2: 플랫폼별 헤더

```typescript
const Header = ({ title, onBack }) => {
  return (
    <View style={styles.header}>
      {Platform.OS === 'ios' ? (
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>← 뒤로</Text>
        </TouchableOpacity>
      ) : (
        <TouchableNativeFeedback onPress={onBack}>
          <View style={styles.backButton}>
            <Icon name="arrow-back" size={24} />
          </View>
        </TouchableNativeFeedback>
      )}
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: Platform.select({ ios: 64, android: 56 }),
    paddingTop: Platform.select({
      ios: 20,
      android: StatusBar.currentHeight,
    }),
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: Platform.select({ ios: 18, android: 20 }),
    fontWeight: Platform.select({ ios: '600', android: 'bold' }),
  },
});
```

### 예제 3: 플랫폼별 알림

```typescript
const sendNotification = async () => {
  const notificationContent = {
    title: '새 메시지',
    body: '새로운 메시지가 도착했습니다.',
    data: { screen: 'Chat' },
    ...Platform.select({
      ios: {
        sound: 'notification.wav',
        badge: 1,
      },
      android: {
        channelId: 'default',
        icon: './assets/notification-icon.png',
        color: '#FF0000',
      },
    }),
  };

  await Notifications.scheduleNotificationAsync({
    content: notificationContent,
    trigger: null,
  });
};
```

## 베스트 프랙티스

### 1. 공통 코드 우선

```typescript
// ✅ GOOD: 공통 코드 최대한 사용
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16, // 공통
    backgroundColor: '#FFFFFF', // 공통
    ...Platform.select({ // 플랫폼별 차이만 분리
      ios: { paddingTop: 20 },
      android: { paddingTop: 16 },
    }),
  },
});

// ❌ BAD: 모든 코드를 플랫폼별로 분리
const styles = StyleSheet.create({
  container: Platform.select({
    ios: {
      flex: 1,
      padding: 16,
      backgroundColor: '#FFFFFF',
      paddingTop: 20,
    },
    android: {
      flex: 1,
      padding: 16,
      backgroundColor: '#FFFFFF',
      paddingTop: 16,
    },
  }),
});
```

### 2. 플랫폼별 파일은 필요한 경우만

```typescript
// 플랫폼별 차이가 크면 파일 분리
// Button.ios.tsx
// Button.android.tsx

// 플랫폼별 차이가 작으면 Platform.select 사용
const Button = ({ title, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={Platform.select({
        ios: styles.iosButton,
        android: styles.androidButton,
      })}
    >
      <Text>{title}</Text>
    </TouchableOpacity>
  );
};
```

### 3. 테스트

```typescript
// 플랫폼별 로직은 반드시 양쪽 플랫폼에서 테스트
if (__DEV__) {
  console.log('현재 플랫폼:', Platform.OS);
  console.log('플랫폼 버전:', Platform.Version);
}
```

## 주의사항

1. **과도한 플랫폼 분기 피하기**: 공통 코드를 최대한 유지
2. **플랫폼별 테스트 필수**: 양쪽 플랫폼에서 항상 테스트
3. **API 차이 확인**: Expo SDK 문서에서 플랫폼별 차이 확인
4. **디자인 가이드라인 준수**: 각 플랫폼의 디자인 가이드라인 따르기

## 관련 문서

- [React Native Platform API](https://reactnative.dev/docs/platform)
- [iOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Material Design (Android)](https://material.io/design)
