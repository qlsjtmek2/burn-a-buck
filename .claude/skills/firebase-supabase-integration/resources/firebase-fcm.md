# Firebase Cloud Messaging (FCM)

Firebase Cloud Messaging을 사용한 푸시 알림 구현 가이드입니다.

## 📚 Table of Contents

- [설치 및 설정](#설치-및-설정)
- [FCM 토큰 가져오기](#fcm-토큰-가져오기)
- [포그라운드 메시지 수신](#포그라운드-메시지-수신)
- [백그라운드 메시지 수신](#백그라운드-메시지-수신)
- [알림 권한 요청](#알림-권한-요청)
- [Edge Function에서 FCM 전송](#edge-function에서-fcm-전송)

---

## 설치 및 설정

### 패키지 설치

```bash
npm install @react-native-firebase/app @react-native-firebase/messaging

# iOS
cd ios && pod install
```

### Android 설정

1. `android/app/google-services.json` 파일 추가
2. `android/build.gradle` 수정:

```gradle
buildscript {
  dependencies {
    classpath 'com.google.gms:google-services:4.3.15'
  }
}
```

3. `android/app/build.gradle` 수정:

```gradle
apply plugin: 'com.google.gms.google-services'
```

### iOS 설정

1. `ios/GoogleService-Info.plist` 파일 추가
2. Xcode에서 Push Notifications capability 활성화
3. Apple Developer에서 APNs 인증서 설정

---

## FCM 토큰 가져오기

```typescript
import messaging from '@react-native-firebase/messaging';
import { supabase } from './lib/supabase';

const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('알림 권한 승인:', authStatus);
  } else {
    console.log('알림 권한 거부');
  }

  return enabled;
};

const getFCMToken = async () => {
  // 권한 요청
  const hasPermission = await requestUserPermission();

  if (!hasPermission) {
    throw new Error('알림 권한이 필요합니다.');
  }

  // FCM 토큰 가져오기
  const token = await messaging().getToken();
  console.log('FCM Token:', token);

  // Supabase에 토큰 저장
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    await supabase
      .from('user_devices')
      .upsert({
        user_id: user.id,
        fcm_token: token,
        platform: Platform.OS,
        updated_at: new Date().toISOString(),
      });
  }

  return token;
};

// 앱 시작 시 호출
useEffect(() => {
  getFCMToken();
}, []);
```

---

## 포그라운드 메시지 수신

앱이 실행 중일 때 메시지를 수신합니다.

```typescript
import messaging from '@react-native-firebase/messaging';
import { useEffect } from 'react';
import { Alert } from 'react-native';

const usePushNotifications = () => {
  useEffect(() => {
    // 포그라운드 메시지 수신
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log('포그라운드 메시지:', remoteMessage);

      const { notification } = remoteMessage;

      if (notification) {
        Alert.alert(
          notification.title || '알림',
          notification.body || ''
        );
      }
    });

    return unsubscribe;
  }, []);
};

// 사용 예시
const App = () => {
  usePushNotifications();

  return <YourApp />;
};
```

---

## 백그라운드 메시지 수신

앱이 백그라운드에 있거나 종료된 상태에서 메시지를 수신합니다.

### index.js에 추가

```javascript
// index.js (앱의 최상위 파일)
import messaging from '@react-native-firebase/messaging';
import { AppRegistry } from 'react-native';
import App from './App';

// 백그라운드 메시지 핸들러
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('백그라운드 메시지:', remoteMessage);

  // 백그라운드에서 처리할 로직
  // 예: 로컬 알림 표시, 데이터 저장 등
});

AppRegistry.registerComponent('YourApp', () => App);
```

### 앱 실행 시 초기 알림 처리

```typescript
import messaging from '@react-native-firebase/messaging';
import { useEffect } from 'react';

const App = () => {
  useEffect(() => {
    // 앱이 종료된 상태에서 알림을 탭하여 실행된 경우
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log('앱 실행 알림:', remoteMessage);
          // 알림 데이터에 따라 특정 화면으로 이동
        }
      });

    // 앱이 백그라운드에서 알림을 탭하여 포그라운드로 전환된 경우
    const unsubscribe = messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log('백그라운드에서 알림 탭:', remoteMessage);
      // 알림 데이터에 따라 특정 화면으로 이동
    });

    return unsubscribe;
  }, []);

  return <YourApp />;
};
```

---

## 알림 권한 요청

```typescript
import messaging from '@react-native-firebase/messaging';
import { Alert, Platform } from 'react-native';

const requestNotificationPermission = async () => {
  if (Platform.OS === 'ios') {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (!enabled) {
      Alert.alert(
        '알림 권한 필요',
        '앱의 알림을 받으려면 설정에서 알림 권한을 활성화해주세요.'
      );
    }

    return enabled;
  }

  // Android는 자동으로 권한 요청
  return true;
};

// 사용 예시
const SettingsScreen = () => {
  const handleEnableNotifications = async () => {
    const hasPermission = await requestNotificationPermission();

    if (hasPermission) {
      await getFCMToken();
      Alert.alert('성공', '알림이 활성화되었습니다.');
    }
  };

  return (
    <Button
      title="알림 활성화"
      onPress={handleEnableNotifications}
    />
  );
};
```

---

## Edge Function에서 FCM 전송

### Supabase Edge Function으로 푸시 알림 전송

```typescript
// Supabase Edge Function: send-notification
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  const { userId, title, body, data } = await req.json();

  // Supabase Admin 클라이언트
  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  // FCM 토큰 가져오기
  const { data: devices } = await supabaseAdmin
    .from('user_devices')
    .select('fcm_token')
    .eq('user_id', userId);

  if (!devices || devices.length === 0) {
    return new Response(
      JSON.stringify({ error: 'No devices found for user' }),
      { status: 404 }
    );
  }

  // FCM API 호출
  const results = [];

  for (const device of devices) {
    const response = await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `key=${Deno.env.get('FCM_SERVER_KEY')}`,
      },
      body: JSON.stringify({
        to: device.fcm_token,
        notification: {
          title,
          body,
        },
        data, // 추가 데이터 (선택)
      }),
    });

    results.push({
      token: device.fcm_token,
      success: response.ok,
    });
  }

  return new Response(
    JSON.stringify({ success: true, results }),
    { headers: { 'Content-Type': 'application/json' } }
  );
});
```

### 클라이언트에서 호출

```typescript
const sendNotification = async (userId: string, title: string, body: string) => {
  const { data, error } = await supabase.functions.invoke('send-notification', {
    body: {
      userId,
      title,
      body,
      data: {
        type: 'new_message',
        messageId: '123',
      },
    },
  });

  if (error) {
    console.error('알림 전송 실패:', error.message);
    throw error;
  }

  console.log('알림 전송 완료:', data);
};

// 사용 예시
await sendNotification(
  'user-id',
  '새 메시지',
  '홍길동님이 메시지를 보냈습니다.'
);
```

---

## FCM 토큰 갱신 처리

```typescript
import messaging from '@react-native-firebase/messaging';
import { useEffect } from 'react';

const useTokenRefresh = () => {
  useEffect(() => {
    // 토큰이 갱신될 때마다 호출
    const unsubscribe = messaging().onTokenRefresh(async (newToken) => {
      console.log('FCM 토큰 갱신:', newToken);

      // Supabase에 새 토큰 저장
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        await supabase
          .from('user_devices')
          .upsert({
            user_id: user.id,
            fcm_token: newToken,
            updated_at: new Date().toISOString(),
          });
      }
    });

    return unsubscribe;
  }, []);
};
```

---

## 베스트 프랙티스

### ✅ user_devices 테이블 생성

```sql
CREATE TABLE user_devices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  fcm_token TEXT NOT NULL,
  platform TEXT NOT NULL, -- 'ios' or 'android'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, fcm_token)
);

-- RLS 정책
ALTER TABLE user_devices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own devices"
  ON user_devices FOR ALL
  USING (auth.uid() = user_id);
```

### ✅ 토큰 정리 (로그아웃 시)

```typescript
const handleLogout = async () => {
  // FCM 토큰 삭제
  const token = await messaging().getToken();

  await supabase
    .from('user_devices')
    .delete()
    .eq('fcm_token', token);

  // Supabase 로그아웃
  await supabase.auth.signOut();
};
```

### ✅ 에러 처리

```typescript
const sendPushNotification = async (userId: string, message: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('send-notification', {
      body: { userId, title: '알림', body: message },
    });

    if (error) {
      // FCM 토큰이 만료된 경우 처리
      if (error.message.includes('InvalidRegistration')) {
        console.log('FCM 토큰 만료됨, 삭제 필요');
        // 토큰 삭제 로직
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error('푸시 알림 전송 실패:', error);
    throw error;
  }
};
```

---

## 참고 자료

- [React Native Firebase Messaging Docs](https://rnfirebase.io/messaging/usage)
- [FCM HTTP v1 API](https://firebase.google.com/docs/cloud-messaging/http-server-ref)
- Context7 MCP로 최신 문서 조회:
  ```bash
  mcp__context7__get-library-docs "/firebase/firebase-js-sdk" --topic="cloud-messaging"
  ```
