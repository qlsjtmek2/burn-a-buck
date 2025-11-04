# Context API Guide

## Overview

**Context API는 React의 내장 전역 상태 관리 솔루션입니다.**

### 장점
- 🆓 **별도 설치 불필요** - React에 포함
- 🎯 **Props drilling 해결** - 깊은 컴포넌트 트리에서 유용
- 📦 **타입 안전성** - TypeScript와 잘 동작

### 단점
- ⚠️ **성능 이슈** - Context 변경 시 모든 consumer 리렌더링
- 🔄 **복잡한 상태 관리 어려움** - 비동기 로직, 캐싱 등
- 📊 **DevTools 부족** - 디버깅 도구 제한적

### 언제 사용하나?
- ✅ 작은 앱의 전역 상태
- ✅ 테마, 언어 설정 같은 단순 상태
- ✅ 자주 변하지 않는 데이터
- ✅ Props drilling이 심한 경우

### 사용하지 말아야 할 경우
- ❌ 자주 변하는 상태 (성능 이슈)
- ❌ 복잡한 비동기 로직
- ❌ 대규모 앱

---

## Basic Usage

### Context 생성

```typescript
import { createContext, useContext, useState, ReactNode } from 'react';

// 1. Context 타입 정의
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

// 2. Context 생성
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 3. Provider 컴포넌트 생성
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 4. Custom Hook 생성
export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }

  return context;
};
```

### Provider 설정

```typescript
// App.tsx
export default function App() {
  return (
    <ThemeProvider>
      <Navigation />
    </ThemeProvider>
  );
}
```

### Context 사용

```typescript
const HomeScreen = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <View
      style={{
        backgroundColor: theme === 'dark' ? '#000' : '#fff'
      }}
    >
      <Text style={{ color: theme === 'dark' ? '#fff' : '#000' }}>
        현재 테마: {theme}
      </Text>

      <Button title="테마 전환" onPress={toggleTheme} />
    </View>
  );
};
```

---

## Multiple Contexts

### 여러 Context 함께 사용

```typescript
// AuthContext
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    // Login logic
    const loggedInUser = await authApi.login(email, password);
    setUser(loggedInUser);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

### Provider 조합

```typescript
export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <LanguageProvider>
          <Navigation />
        </LanguageProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

// 또는 Providers 조합 컴포넌트
const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default function App() {
  return (
    <AppProviders>
      <Navigation />
    </AppProviders>
  );
}
```

---

## Performance Optimization

### 문제: 불필요한 리렌더링

```typescript
// ❌ Bad - 모든 consumer가 리렌더링됨
const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('ko');

  // user, theme, language 중 하나만 변경돼도
  // 모든 consumer가 리렌더링됨
  return (
    <AppContext.Provider value={{ user, setUser, theme, setTheme, language, setLanguage }}>
      {children}
    </AppContext.Provider>
  );
};
```

### 해결: Context 분리

```typescript
// ✅ Good - 각 Context를 분리
const UserContext = createContext<UserContextType | undefined>(undefined);
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Theme, Language도 동일하게 분리
```

### useMemo로 최적화

```typescript
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // value 객체를 useMemo로 메모이제이션
  const value = useMemo(
    () => ({ user, setUser }),
    [user] // user가 변경될 때만 새 객체 생성
  );

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
```

---

## Advanced Patterns

### Reducer 패턴 (복잡한 상태 로직)

```typescript
import { createContext, useContext, useReducer, ReactNode } from 'react';

// State 타입
interface TodoState {
  todos: Todo[];
  filter: 'all' | 'active' | 'completed';
}

// Action 타입
type TodoAction =
  | { type: 'ADD_TODO'; payload: string }
  | { type: 'TOGGLE_TODO'; payload: number }
  | { type: 'DELETE_TODO'; payload: number }
  | { type: 'SET_FILTER'; payload: 'all' | 'active' | 'completed' };

// Reducer
const todoReducer = (state: TodoState, action: TodoAction): TodoState => {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        ...state,
        todos: [
          ...state.todos,
          {
            id: Date.now(),
            text: action.payload,
            completed: false,
          },
        ],
      };

    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed }
            : todo
        ),
      };

    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.payload),
      };

    case 'SET_FILTER':
      return { ...state, filter: action.payload };

    default:
      return state;
  }
};

// Context
const TodoContext = createContext<{
  state: TodoState;
  dispatch: React.Dispatch<TodoAction>;
} | undefined>(undefined);

// Provider
export const TodoProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(todoReducer, {
    todos: [],
    filter: 'all',
  });

  return (
    <TodoContext.Provider value={{ state, dispatch }}>
      {children}
    </TodoContext.Provider>
  );
};

// Custom Hook
export const useTodos = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodos must be used within TodoProvider');
  }
  return context;
};

// 사용
const TodoList = () => {
  const { state, dispatch } = useTodos();

  return (
    <View>
      <Button
        title="Add Todo"
        onPress={() => dispatch({ type: 'ADD_TODO', payload: 'New Todo' })}
      />

      {state.todos.map((todo) => (
        <View key={todo.id}>
          <Text>{todo.text}</Text>
          <Button
            title="Toggle"
            onPress={() => dispatch({ type: 'TOGGLE_TODO', payload: todo.id })}
          />
        </View>
      ))}
    </View>
  );
};
```

---

## When NOT to Use Context

### Context 대신 Zustand 사용

```typescript
// ✅ Better - Zustand로 교체
import { create } from 'zustand';

interface UserStore {
  user: User | null;
  setUser: (user: User) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

// 사용 - Provider 불필요
const ProfileScreen = () => {
  const user = useUserStore((state) => state.user);
  return <Text>{user?.name}</Text>;
};
```

### Context 대신 React Query 사용

```typescript
// ❌ Bad - Context로 서버 상태 관리
const UserContext = createContext<{ user: User } | undefined>(undefined);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser().then(setUser);
  }, []);

  return (
    <UserContext.Provider value={{ user }}>
      {children}
    </UserContext.Provider>
  );
};

// ✅ Good - React Query 사용
import { useQuery } from '@tanstack/react-query';

const ProfileScreen = () => {
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: fetchUser,
  });

  return <Text>{user?.name}</Text>;
};
```

---

## Best Practices

### 1. Context 분리

```typescript
// ✅ Good - 각 도메인별로 분리
<AuthProvider>
  <ThemeProvider>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </ThemeProvider>
</AuthProvider>

// ❌ Bad - 하나의 거대한 Context
<AppProvider> // user, theme, language, settings 모두 포함
  <App />
</AppProvider>
```

### 2. Custom Hook 제공

```typescript
// ✅ Good
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

// ❌ Bad - useContext 직접 사용
const HomeScreen = () => {
  const theme = useContext(ThemeContext); // 에러 처리 없음
};
```

### 3. 작은 상태만 Context에 저장

```typescript
// ✅ Good - 작고 자주 변하지 않는 상태
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

// ❌ Bad - 크고 자주 변하는 상태
interface AppContextType {
  posts: Post[]; // 자주 변함
  users: User[]; // 자주 변함
  comments: Comment[]; // 자주 변함
  // ... → Zustand나 React Query 사용
}
```

---

**결론:** Context API는 작고 단순한 전역 상태에 적합합니다. 복잡한 상태는 Zustand, 서버 상태는 React Query를 사용하세요.
