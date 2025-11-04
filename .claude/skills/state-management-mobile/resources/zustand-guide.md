# Zustand Guide

## 📚 Table of Contents

- [Overview](#overview)
- [Basic Usage](#basic-usage)
- [Async Actions](#async-actions)
- [Persist with Async Storage](#persist-with-async-storage)
- [Selectors for Optimization](#selectors-for-optimization)
- [Performance Best Practices](#performance-best-practices)

---

## Overview

**Zustand는 가볍고 직관적한 전역 상태 관리 라이브러리입니다.**

### 장점
- 📦 **작은 번들 크기** (1KB 미만)
- 🎯 **직관적인 API** (보일러플레이트 최소화)
- ⚡ **빠른 성능** (Selector 기반 최적화)
- 🔄 **TypeScript 친화적**
- 💾 **Persist 미들웨어** (Async Storage 연동)

### 언제 사용하나?
- 간단한 전역 상태 관리가 필요할 때
- Redux는 너무 복잡하고 Context API는 부족할 때
- 여러 컴포넌트에서 공유하는 UI 상태 관리
- 로컬 저장소와 연동이 필요한 상태

---

## Basic Usage

### Store 생성

```typescript
import { create } from 'zustand';

interface UserStore {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));
```

### 컴포넌트에서 사용

```typescript
const ProfileScreen = () => {
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);

  return (
    <View>
      <Text>{user?.name}</Text>
      <Button title="로그아웃" onPress={logout} />
    </View>
  );
};
```

### 여러 값 동시에 가져오기

```typescript
const TodoList = () => {
  const { todos, loading, addTodo } = useTodoStore((state) => ({
    todos: state.todos,
    loading: state.loading,
    addTodo: state.addTodo,
  }));

  // 또는 shallow equality를 사용
  import { shallow } from 'zustand/shallow';

  const { todos, loading } = useTodoStore(
    (state) => ({ todos: state.todos, loading: state.loading }),
    shallow
  );
};
```

---

## Async Actions

### 비동기 작업 처리

```typescript
interface TodoStore {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  fetchTodos: () => Promise<void>;
  addTodo: (text: string) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
}

export const useTodoStore = create<TodoStore>((set, get) => ({
  todos: [],
  loading: false,
  error: null,

  fetchTodos: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('https://api.example.com/todos');
      if (!response.ok) throw new Error('Failed to fetch');

      const todos = await response.json();
      set({ todos, loading: false });
    } catch (error) {
      set({
        error: error.message,
        loading: false
      });
    }
  },

  addTodo: async (text) => {
    set({ loading: true });
    try {
      const response = await fetch('https://api.example.com/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, completed: false }),
      });

      const newTodo = await response.json();
      set((state) => ({
        todos: [...state.todos, newTodo],
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  deleteTodo: async (id) => {
    try {
      await fetch(`https://api.example.com/todos/${id}`, {
        method: 'DELETE',
      });

      set((state) => ({
        todos: state.todos.filter((todo) => todo.id !== id),
      }));
    } catch (error) {
      set({ error: error.message });
    }
  },
}));
```

### 현재 상태 접근 (get 함수)

```typescript
export const useCartStore = create<CartStore>((set, get) => ({
  items: [],

  addItem: (item) => {
    const currentItems = get().items; // 현재 상태 접근
    const exists = currentItems.find((i) => i.id === item.id);

    if (exists) {
      set((state) => ({
        items: state.items.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        ),
      }));
    } else {
      set((state) => ({
        items: [...state.items, { ...item, quantity: 1 }],
      }));
    }
  },
}));
```

---

## Persist with Async Storage

### 기본 Persist 설정

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface SettingsStore {
  theme: 'light' | 'dark';
  language: 'ko' | 'en';
  notifications: boolean;
  setTheme: (theme: 'light' | 'dark') => void;
  setLanguage: (language: 'ko' | 'en') => void;
  toggleNotifications: () => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      theme: 'light',
      language: 'ko',
      notifications: true,

      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      toggleNotifications: () => set((state) => ({
        notifications: !state.notifications
      })),
    }),
    {
      name: 'settings-storage', // AsyncStorage key
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

### 부분 Persist (일부 상태만 저장)

```typescript
export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      tempData: null, // 저장하지 않을 데이터

      login: async (credentials) => { /* ... */ },
      logout: () => set({ token: null, user: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // tempData는 저장하지 않음
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
    }
  )
);
```

### Persist 마이그레이션 (버전 업그레이드)

```typescript
export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({ /* state */ }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => AsyncStorage),
      version: 2, // 버전 명시

      // 버전 1에서 2로 마이그레이션
      migrate: (persistedState: any, version: number) => {
        if (version === 1) {
          // 이전 구조 변환
          return {
            ...persistedState,
            newField: 'default',
          };
        }
        return persistedState;
      },
    }
  )
);
```

---

## Selectors for Optimization

### ❌ 잘못된 사용 (불필요한 리렌더링)

```typescript
// Bad - 전체 store 구독
const TodoList = () => {
  const store = useTodoStore();
  // store의 모든 변경에 리렌더링 발생

  return (
    <FlatList
      data={store.todos}
      renderItem={({ item }) => <TodoItem todo={item} />}
    />
  );
};
```

### ✅ 올바른 사용 (필요한 값만 구독)

```typescript
// Good - 필요한 값만 selector로 구독
const TodoList = () => {
  const todos = useTodoStore((state) => state.todos);
  // todos만 변경될 때 리렌더링

  return (
    <FlatList
      data={todos}
      renderItem={({ item }) => <TodoItem todo={item} />}
    />
  );
};
```

### 여러 값 최적화 (shallow comparison)

```typescript
import { shallow } from 'zustand/shallow';

const TodoControls = () => {
  // shallow equality로 비교
  const { addTodo, clearTodos, filter } = useTodoStore(
    (state) => ({
      addTodo: state.addTodo,
      clearTodos: state.clearTodos,
      filter: state.filter,
    }),
    shallow
  );

  // addTodo, clearTodos, filter 중 하나라도 변경될 때만 리렌더링
};
```

### Computed Values (파생 상태)

```typescript
interface CartStore {
  items: CartItem[];
  // ...
}

// ❌ Bad - computed value를 state에 저장
export const useCartStore = create<CartStore>((set) => ({
  items: [],
  total: 0, // 중복된 상태!

  addItem: (item) => {
    set((state) => {
      const newItems = [...state.items, item];
      const newTotal = newItems.reduce((sum, i) => sum + i.price, 0);
      return { items: newItems, total: newTotal }; // 매번 계산
    });
  },
}));

// ✅ Good - selector에서 계산
export const useCartStore = create<CartStore>((set) => ({
  items: [],
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
}));

// 사용할 때 계산
const CartTotal = () => {
  const total = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  );

  return <Text>Total: ${total}</Text>;
};
```

---

## Performance Best Practices

### 1. Selector 사용 (리렌더링 최소화)

```typescript
// ✅ Good
const userName = useUserStore((state) => state.user?.name);

// ❌ Bad
const user = useUserStore((state) => state.user);
const userName = user?.name; // user 객체 전체 변경에 리렌더링
```

### 2. 함수는 Store에 정의

```typescript
// ✅ Good
const logout = useUserStore((state) => state.logout);

// ❌ Bad - 매번 새 함수 생성
const { user } = useUserStore();
const logout = () => useUserStore.getState().logout(); // 안티패턴
```

### 3. 큰 리스트는 ID 배열 사용

```typescript
// ✅ Good - 정규화된 상태
interface TodoStore {
  todoIds: string[];
  todosById: Record<string, Todo>;
}

// ❌ Bad - 배열 전체 변경
interface TodoStore {
  todos: Todo[]; // 하나만 변경해도 전체 배열 새로 생성
}
```

### 4. Middleware 활용

```typescript
import { devtools } from 'zustand/middleware';

export const useStore = create<Store>()(
  devtools(
    persist(
      (set) => ({ /* state */ }),
      { name: 'my-storage' }
    ),
    { name: 'MyStore' } // Redux DevTools에서 확인 가능
  )
);
```

---

**참고:** Zustand와 React Query를 함께 사용하면 클라이언트 상태(Zustand)와 서버 상태(React Query)를 명확히 분리할 수 있습니다.
