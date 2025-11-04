# Async Storage Guide

## 📚 Table of Contents

- [Overview](#overview)
- [Basic Operations](#basic-operations)
- [React Hook Wrapper](#react-hook-wrapper)
- [Complex Data Management](#complex-data-management)
- [Best Practices](#best-practices)
- [Common Patterns](#common-patterns)

---

## Overview

**Async Storage는 React Native의 Key-Value 저장소입니다.**

### 특징
- 📦 **비동기 API** - Promise 기반
- 💾 **영구 저장** - 앱 재시작 후에도 유지
- 🔑 **Key-Value** - 간단한 저장소 구조
- 📊 **JSON 지원** - 객체 저장 가능
- 🚫 **용량 제한** - 플랫폼별 상이 (일반적으로 6MB)

### 언제 사용하나?
- 로그인 토큰 저장
- 사용자 설정 (테마, 언어 등)
- 오프라인 캐시
- 간단한 로컬 데이터

### 사용하지 말아야 할 경우
- ❌ 대용량 데이터 (2MB 이상)
- ❌ 복잡한 쿼리가 필요한 데이터
- ❌ 민감한 정보 (암호화 필요 시 다른 라이브러리 사용)

---

## Basic Operations

### 설치

```bash
npm install @react-native-async-storage/async-storage
```

### 데이터 저장 (setItem)

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

// 문자열 저장
const saveToken = async (token: string) => {
  try {
    await AsyncStorage.setItem('@auth_token', token);
    console.log('Token saved successfully');
  } catch (error) {
    console.error('Failed to save token:', error);
  }
};

// 객체 저장 (JSON.stringify 필요)
const saveUser = async (user: User) => {
  try {
    const jsonValue = JSON.stringify(user);
    await AsyncStorage.setItem('@user', jsonValue);
  } catch (error) {
    console.error('Failed to save user:', error);
  }
};
```

### 데이터 불러오기 (getItem)

```typescript
// 문자열 불러오기
const getToken = async (): Promise<string | null> => {
  try {
    const value = await AsyncStorage.getItem('@auth_token');
    return value;
  } catch (error) {
    console.error('Failed to fetch token:', error);
    return null;
  }
};

// 객체 불러오기 (JSON.parse 필요)
const getUser = async (): Promise<User | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem('@user');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return null;
  }
};
```

### 데이터 삭제 (removeItem)

```typescript
// 특정 key 삭제
const removeToken = async () => {
  try {
    await AsyncStorage.removeItem('@auth_token');
    console.log('Token removed');
  } catch (error) {
    console.error('Failed to remove token:', error);
  }
};

// 여러 key 동시 삭제
const removeMultiple = async () => {
  try {
    const keys = ['@auth_token', '@user', '@settings'];
    await AsyncStorage.multiRemove(keys);
  } catch (error) {
    console.error('Failed to remove items:', error);
  }
};
```

### 전체 삭제 (clear)

```typescript
const clearAll = async () => {
  try {
    await AsyncStorage.clear();
    console.log('All data cleared');
  } catch (error) {
    console.error('Failed to clear storage:', error);
  }
};
```

### 모든 키 조회 (getAllKeys)

```typescript
const listAllKeys = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    console.log('All keys:', keys);
    return keys;
  } catch (error) {
    console.error('Failed to get keys:', error);
    return [];
  }
};
```

### 여러 항목 동시 처리 (Multi Operations)

```typescript
// 여러 항목 동시 저장
const saveMultiple = async () => {
  try {
    await AsyncStorage.multiSet([
      ['@user_name', 'John'],
      ['@user_email', 'john@example.com'],
      ['@user_age', '30'],
    ]);
  } catch (error) {
    console.error('Failed to save multiple items:', error);
  }
};

// 여러 항목 동시 불러오기
const getMultiple = async () => {
  try {
    const values = await AsyncStorage.multiGet(['@user_name', '@user_email']);
    // values = [['@user_name', 'John'], ['@user_email', 'john@example.com']]

    const data = Object.fromEntries(values);
    // data = { '@user_name': 'John', '@user_email': 'john@example.com' }

    return data;
  } catch (error) {
    console.error('Failed to get multiple items:', error);
    return {};
  }
};
```

---

## React Hook Wrapper

### 기본 useAsyncStorage Hook

```typescript
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAsyncStorage = <T,>(
  key: string,
  initialValue: T
): [T, (value: T) => Promise<void>, boolean] => {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [loading, setLoading] = useState(true);

  // 초기 로드
  useEffect(() => {
    loadStoredValue();
  }, [key]);

  const loadStoredValue = async () => {
    try {
      const item = await AsyncStorage.getItem(key);
      const value = item ? JSON.parse(item) : initialValue;
      setStoredValue(value);
    } catch (error) {
      console.error('Failed to load value:', error);
      setStoredValue(initialValue);
    } finally {
      setLoading(false);
    }
  };

  const setValue = async (value: T) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;

      setStoredValue(valueToStore);
      await AsyncStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Failed to save value:', error);
    }
  };

  return [storedValue, setValue, loading];
};
```

### Hook 사용 예제

```typescript
const SettingsScreen = () => {
  const [theme, setTheme, loading] = useAsyncStorage<'light' | 'dark'>(
    '@theme',
    'light'
  );

  const [language, setLanguage] = useAsyncStorage<'ko' | 'en'>(
    '@language',
    'ko'
  );

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <View>
      <Text>테마: {theme}</Text>
      <Button
        title="다크 모드"
        onPress={() => setTheme('dark')}
      />

      <Text>언어: {language}</Text>
      <Button
        title="English"
        onPress={() => setLanguage('en')}
      />
    </View>
  );
};
```

### 함수형 업데이트 지원

```typescript
export const useAsyncStorage = <T,>(key: string, initialValue: T) => {
  // ...

  const setValue = async (value: T | ((prev: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;

      setStoredValue(valueToStore);
      await AsyncStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Failed to save value:', error);
    }
  };

  // ...
};

// 사용
const [count, setCount] = useAsyncStorage('@count', 0);

// 함수형 업데이트
setCount((prev) => prev + 1);
```

---

## Complex Data Management

### Settings Manager

```typescript
interface UserSettings {
  theme: 'light' | 'dark';
  language: 'ko' | 'en';
  notifications: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

const SETTINGS_KEY = '@user_settings';

export const SettingsStorage = {
  get: async (): Promise<UserSettings | null> => {
    try {
      const value = await AsyncStorage.getItem(SETTINGS_KEY);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Failed to load settings:', error);
      return null;
    }
  },

  set: async (settings: UserSettings): Promise<void> => {
    try {
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  },

  update: async (updates: Partial<UserSettings>): Promise<void> => {
    try {
      const current = await SettingsStorage.get();
      const newSettings = { ...current, ...updates };
      await SettingsStorage.set(newSettings as UserSettings);
    } catch (error) {
      console.error('Failed to update settings:', error);
    }
  },

  clear: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(SETTINGS_KEY);
    } catch (error) {
      console.error('Failed to clear settings:', error);
    }
  },

  // 기본값 반환
  getOrDefault: async (): Promise<UserSettings> => {
    const settings = await SettingsStorage.get();
    return settings ?? {
      theme: 'light',
      language: 'ko',
      notifications: true,
      fontSize: 'medium',
    };
  },
};
```

### Cache Manager

```typescript
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

export class CacheManager {
  private static PREFIX = '@cache_';

  static async set<T>(
    key: string,
    data: T,
    ttl: number = 3600000 // 기본 1시간
  ): Promise<void> {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + ttl,
    };

    try {
      await AsyncStorage.setItem(
        `${this.PREFIX}${key}`,
        JSON.stringify(entry)
      );
    } catch (error) {
      console.error('Cache set failed:', error);
    }
  }

  static async get<T>(key: string): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(`${this.PREFIX}${key}`);
      if (!value) return null;

      const entry: CacheEntry<T> = JSON.parse(value);

      // 만료 확인
      if (Date.now() > entry.expiresAt) {
        await this.remove(key);
        return null;
      }

      return entry.data;
    } catch (error) {
      console.error('Cache get failed:', error);
      return null;
    }
  }

  static async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(`${this.PREFIX}${key}`);
    } catch (error) {
      console.error('Cache remove failed:', error);
    }
  }

  static async clear(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter((key) => key.startsWith(this.PREFIX));
      await AsyncStorage.multiRemove(cacheKeys);
    } catch (error) {
      console.error('Cache clear failed:', error);
    }
  }
}

// 사용
await CacheManager.set('posts', posts, 5 * 60 * 1000); // 5분
const cachedPosts = await CacheManager.get<Post[]>('posts');
```

---

## Best Practices

### 1. Key Naming Convention

```typescript
// ✅ Good - 일관된 prefix 사용
const KEYS = {
  AUTH_TOKEN: '@auth/token',
  USER_DATA: '@auth/user',
  SETTINGS: '@app/settings',
  THEME: '@app/theme',
  CACHE_POSTS: '@cache/posts',
} as const;

// ❌ Bad - 일관성 없음
const token = '@token';
const user = 'user_data';
const settings = 'settings';
```

### 2. Error Handling

```typescript
// ✅ Good - 에러 처리와 fallback
const getToken = async (): Promise<string | null> => {
  try {
    const token = await AsyncStorage.getItem('@auth_token');
    return token;
  } catch (error) {
    console.error('Failed to get token:', error);
    // 에러 추적 (Sentry 등)
    Sentry.captureException(error);
    return null;
  }
};

// ❌ Bad - 에러 무시
const getToken = async () => {
  return await AsyncStorage.getItem('@auth_token');
};
```

### 3. Type Safety

```typescript
// ✅ Good - 타입 안전성
const saveUser = async (user: User): Promise<void> => {
  await AsyncStorage.setItem('@user', JSON.stringify(user));
};

const getUser = async (): Promise<User | null> => {
  const value = await AsyncStorage.getItem('@user');
  if (!value) return null;

  try {
    return JSON.parse(value) as User;
  } catch {
    return null;
  }
};

// ❌ Bad - any 타입
const saveData = async (key: string, data: any) => {
  await AsyncStorage.setItem(key, JSON.stringify(data));
};
```

### 4. 데이터 크기 제한

```typescript
// ✅ Good - 작은 데이터만 저장
await AsyncStorage.setItem('@token', token); // ~100 bytes
await AsyncStorage.setItem('@settings', JSON.stringify(settings)); // ~1KB

// ❌ Bad - 큰 데이터 저장
await AsyncStorage.setItem('@all_posts', JSON.stringify(thousandPosts)); // 2MB+
```

### 5. 민감 정보 처리

```typescript
// ⚠️ Async Storage는 암호화되지 않음

// ✅ Good - 민감 정보는 별도 라이브러리 사용
import * as SecureStore from 'expo-secure-store';

await SecureStore.setItemAsync('password', userPassword);

// ❌ Bad - 평문으로 저장
await AsyncStorage.setItem('@password', userPassword);
```

---

## Common Patterns

### 1. Migration Helper

```typescript
const migrate = async () => {
  try {
    const version = await AsyncStorage.getItem('@version');

    if (version !== '2.0') {
      // 이전 데이터 구조 마이그레이션
      const oldData = await AsyncStorage.getItem('@old_key');
      if (oldData) {
        const newData = transformOldData(oldData);
        await AsyncStorage.setItem('@new_key', newData);
        await AsyncStorage.removeItem('@old_key');
      }

      await AsyncStorage.setItem('@version', '2.0');
    }
  } catch (error) {
    console.error('Migration failed:', error);
  }
};
```

### 2. Batch Operations

```typescript
const saveBatch = async (items: Record<string, any>) => {
  try {
    const pairs: [string, string][] = Object.entries(items).map(
      ([key, value]) => [key, JSON.stringify(value)]
    );

    await AsyncStorage.multiSet(pairs);
  } catch (error) {
    console.error('Batch save failed:', error);
  }
};

// 사용
await saveBatch({
  '@user': user,
  '@token': token,
  '@settings': settings,
});
```

### 3. Offline Queue

```typescript
interface QueueItem {
  id: string;
  action: 'POST' | 'PUT' | 'DELETE';
  url: string;
  data: any;
  timestamp: number;
}

export const OfflineQueue = {
  add: async (item: Omit<QueueItem, 'id' | 'timestamp'>) => {
    const queue = await OfflineQueue.getAll();
    const newItem: QueueItem = {
      ...item,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };

    queue.push(newItem);
    await AsyncStorage.setItem('@offline_queue', JSON.stringify(queue));
  },

  getAll: async (): Promise<QueueItem[]> => {
    const value = await AsyncStorage.getItem('@offline_queue');
    return value ? JSON.parse(value) : [];
  },

  remove: async (id: string) => {
    const queue = await OfflineQueue.getAll();
    const filtered = queue.filter((item) => item.id !== id);
    await AsyncStorage.setItem('@offline_queue', JSON.stringify(filtered));
  },

  clear: async () => {
    await AsyncStorage.removeItem('@offline_queue');
  },
};
```

---

**참고:** 큰 데이터나 복잡한 쿼리가 필요하면 SQLite, Realm, WatermelonDB 같은 데이터베이스를 사용하세요.
