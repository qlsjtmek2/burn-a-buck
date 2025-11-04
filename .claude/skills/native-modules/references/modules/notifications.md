# Notifications (expo-notifications) 상세 가이드

## 개요

expo-notifications는 로컬 알림, 푸시 알림(원격), 알림 스케줄링, 알림 채널 관리 등 포괄적인 알림 기능을 제공합니다.

## Context7 문서 조회

```bash
mcp__context7__get-library-docs "/expo/expo" topic: "Notifications"
```

## 설치

```bash
npx expo install expo-notifications
```

## 기본 설정

### 알림 핸들러 설정

앱 진입점(App.tsx)에서 알림 처리 방식을 설정합니다.

```typescript
import * as Notifications from 'expo-notifications';

// 앱 시작 시 알림 처리 방식 설정
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,      // 알림 표시
    shouldPlaySound: true,       // 소리 재생
    shouldSetBadge: false,       // 배지 설정 안함
  }),
});
```

## 권한 요청

```typescript
const requestPermission = async () => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  // 권한이 아직 결정되지 않았으면 요청
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    alert('알림 권한이 필요합니다.');
    return false;
  }

  return true;
};
```

## 로컬 알림

### 1. 즉시 알림 표시

```typescript
const showImmediateNotification = async () => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '알림 제목',
      body: '알림 내용입니다.',
      data: { customData: 'custom value' },
      sound: true,
    },
    trigger: null,  // 즉시 표시
  });
};
```

### 2. 예약 알림

```typescript
// 5초 후 알림
const scheduleNotificationAfter5Seconds = async () => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '5초 후 알림',
      body: '5초가 지났습니다!',
    },
    trigger: {
      seconds: 5,
    },
  });
};

// 특정 시간에 알림
const scheduleNotificationAtTime = async () => {
  const schedulingDate = new Date();
  schedulingDate.setHours(14);  // 오후 2시
  schedulingDate.setMinutes(30);
  schedulingDate.setSeconds(0);

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '예약 알림',
      body: '오후 2시 30분입니다!',
    },
    trigger: {
      date: schedulingDate,
    },
  });
};

// 매일 반복 알림
const scheduleDailyNotification = async () => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '일일 알림',
      body: '오늘도 좋은 하루 되세요!',
    },
    trigger: {
      hour: 9,
      minute: 0,
      repeats: true,
    },
  });
};

// 매주 반복 알림
const scheduleWeeklyNotification = async () => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '주간 알림',
      body: '새로운 한 주가 시작되었습니다!',
    },
    trigger: {
      weekday: 2,  // 1=일요일, 2=월요일, ...
      hour: 9,
      minute: 0,
      repeats: true,
    },
  });
};
```

### 3. 예약된 알림 관리

```typescript
// 모든 예약된 알림 조회
const getAllScheduledNotifications = async () => {
  const notifications = await Notifications.getAllScheduledNotificationsAsync();
  console.log('예약된 알림:', notifications);
  return notifications;
};

// 특정 알림 취소
const cancelNotification = async (notificationId: string) => {
  await Notifications.cancelScheduledNotificationAsync(notificationId);
};

// 모든 예약된 알림 취소
const cancelAllNotifications = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};
```

## 푸시 알림 (원격)

### 1. Push Token 가져오기

```typescript
import Constants from 'expo-constants';

const getPushToken = async () => {
  try {
    // 권한 확인
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      const { status: newStatus } = await Notifications.requestPermissionsAsync();
      if (newStatus !== 'granted') {
        alert('푸시 알림 권한이 필요합니다.');
        return null;
      }
    }

    // Push token 가져오기
    const token = await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig?.extra?.eas?.projectId,
    });

    console.log('Push Token:', token.data);
    return token.data;
  } catch (error) {
    console.error('Push Token 가져오기 실패:', error);
    return null;
  }
};
```

### 2. 서버로 Token 전송

```typescript
const registerForPushNotifications = async () => {
  const token = await getPushToken();

  if (token) {
    // 서버에 토큰 전송
    await fetch('https://api.example.com/register-push-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: 'user123',
        pushToken: token,
        platform: Platform.OS,
      }),
    });
  }
};
```

## 알림 리스너

### 1. 알림 수신 리스너

```typescript
import { useEffect, useRef } from 'react';

const NotificationComponent = () => {
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    // 알림 수신 리스너 (앱이 포그라운드일 때)
    notificationListener.current = Notifications.addNotificationReceivedListener(
      notification => {
        console.log('알림 수신:', notification);
        console.log('제목:', notification.request.content.title);
        console.log('내용:', notification.request.content.body);
        console.log('데이터:', notification.request.content.data);
      }
    );

    // 알림 클릭 리스너
    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      response => {
        console.log('알림 클릭:', response);
        const data = response.notification.request.content.data;

        // 데이터에 따라 화면 이동 등 처리
        if (data.screen) {
          navigation.navigate(data.screen);
        }
      }
    );

    return () => {
      // 리스너 정리
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  return <View />;
};
```

### 2. 마지막 알림 응답 가져오기

앱이 종료된 상태에서 알림을 탭하여 앱이 실행된 경우:

```typescript
useEffect(() => {
  const getLastNotificationResponse = async () => {
    const response = await Notifications.getLastNotificationResponseAsync();

    if (response) {
      console.log('마지막 알림 응답:', response);
      const data = response.notification.request.content.data;

      // 특정 화면으로 이동
      if (data.screen) {
        navigation.navigate(data.screen);
      }
    }
  };

  getLastNotificationResponse();
}, []);
```

## 알림 채널 (Android)

Android 8.0 이상에서는 알림 채널을 통해 알림을 그룹화하고 사용자가 채널별로 설정을 제어할 수 있습니다.

```typescript
import { Platform } from 'react-native';

const setNotificationChannels = async () => {
  if (Platform.OS === 'android') {
    // 기본 채널
    await Notifications.setNotificationChannelAsync('default', {
      name: '기본 알림',
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });

    // 중요 알림 채널
    await Notifications.setNotificationChannelAsync('important', {
      name: '중요 알림',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 500, 500, 500],
      sound: 'notification_sound.wav',
    });

    // 조용한 알림 채널
    await Notifications.setNotificationChannelAsync('silent', {
      name: '조용한 알림',
      importance: Notifications.AndroidImportance.LOW,
      vibrationPattern: null,
      sound: null,
    });
  }
};

// 특정 채널로 알림 발송
const sendNotificationToChannel = async () => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '중요 알림',
      body: '긴급한 내용입니다!',
    },
    trigger: null,
    // Android 전용
    ...(Platform.OS === 'android' && {
      channelId: 'important',
    }),
  });
};
```

## 알림 배지

### iOS 배지 설정

```typescript
// 배지 숫자 설정
await Notifications.setBadgeCountAsync(5);

// 배지 숫자 증가
const currentBadge = await Notifications.getBadgeCountAsync();
await Notifications.setBadgeCountAsync(currentBadge + 1);

// 배지 제거
await Notifications.setBadgeCountAsync(0);
```

## 실전 예제

### 예제 1: 할 일 알림 앱

```typescript
import * as Notifications from 'expo-notifications';

interface Todo {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  notificationId?: string;
}

const TodoNotifications = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const addTodoWithNotification = async (todo: Omit<Todo, 'id' | 'notificationId'>) => {
    const newTodo = {
      ...todo,
      id: Date.now().toString(),
    };

    // 알림 예약
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: '할 일 알림',
        body: todo.title,
        data: { todoId: newTodo.id },
        sound: true,
      },
      trigger: {
        date: todo.dueDate,
      },
    });

    newTodo.notificationId = notificationId;
    setTodos([...todos, newTodo]);
  };

  const completeTodo = async (todoId: string) => {
    const todo = todos.find(t => t.id === todoId);

    if (todo?.notificationId) {
      // 알림 취소
      await Notifications.cancelScheduledNotificationAsync(todo.notificationId);
    }

    setTodos(todos.filter(t => t.id !== todoId));
  };

  return (
    <View>
      {/* Todo 리스트 UI */}
    </View>
  );
};
```

### 예제 2: 채팅 알림

```typescript
const ChatNotifications = () => {
  useEffect(() => {
    // 새 메시지 알림 리스너
    const messageListener = onNewMessage((message) => {
      // 앱이 백그라운드일 때만 알림 표시
      if (AppState.currentState !== 'active') {
        Notifications.scheduleNotificationAsync({
          content: {
            title: message.senderName,
            body: message.text,
            data: {
              chatRoomId: message.chatRoomId,
              screen: 'ChatRoom',
            },
          },
          trigger: null,
        });
      }
    });

    return () => messageListener.remove();
  }, []);

  // 알림 클릭 시 채팅방으로 이동
  useEffect(() => {
    const responseListener = Notifications.addNotificationResponseReceivedListener(
      response => {
        const { chatRoomId, screen } = response.notification.request.content.data;

        if (screen === 'ChatRoom' && chatRoomId) {
          navigation.navigate('ChatRoom', { id: chatRoomId });
        }
      }
    );

    return () => {
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);
};
```

## 플랫폼별 설정

### iOS (app.json)

```json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "UIBackgroundModes": ["remote-notification"]
      }
    },
    "plugins": [
      [
        "expo-notifications",
        {
          "icon": "./assets/notification-icon.png",
          "color": "#ffffff",
          "sounds": ["./assets/notification-sound.wav"]
        }
      ]
    ]
  }
}
```

### Android (app.json)

```json
{
  "expo": {
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#FFFFFF"
      }
    },
    "plugins": [
      [
        "expo-notifications",
        {
          "icon": "./assets/notification-icon.png",
          "color": "#ffffff",
          "sounds": ["./assets/notification-sound.wav"]
        }
      ]
    ]
  }
}
```

## 베스트 프랙티스

1. **권한 먼저 요청**: 알림 사용 전 항상 권한 확인
2. **채널 설정**: Android에서는 앱 시작 시 채널 미리 생성
3. **알림 정리**: 불필요한 예약 알림 주기적으로 정리
4. **의미있는 데이터**: 알림 클릭 시 적절한 화면으로 이동하도록 data 설정
5. **배터리 고려**: 과도한 알림은 배터리 소모 및 사용자 불편 초래

## 주의사항

1. **iOS 시뮬레이터**: 원격 푸시 알림은 실제 기기에서만 테스트 가능
2. **Android 배터리 최적화**: 일부 Android 기기에서는 배터리 최적화로 인해 알림이 지연될 수 있음
3. **알림 권한**: 사용자가 권한을 거부하면 알림 표시 불가
4. **앱 종료 상태**: 앱이 완전히 종료된 상태에서는 로컬 알림도 표시되지 않을 수 있음 (플랫폼마다 다름)

## 관련 모듈

- **expo-task-manager**: 백그라운드 작업과 함께 사용
- **expo-device**: 기기 정보 확인
