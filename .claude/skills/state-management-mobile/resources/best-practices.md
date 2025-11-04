# Best Practices & Common Pitfalls

## 📚 Table of Contents

- [State Selection Strategy](#state-selection-strategy)
- [Performance Optimization](#performance-optimization)
- [Error Handling](#error-handling)
- [Common Pitfalls](#common-pitfalls)
- [Testing Guidelines](#testing-guidelines)

---

## State Selection Strategy

### 올바른 도구 선택

```typescript
// ✅ Good - 각 상태에 맞는 도구 사용
interface AppState {
  // Zustand - 클라이언트 UI 상태
  theme: 'light' | 'dark';
  sidebarOpen: boolean;

  // React Query - 서버 상태
  posts: Post[]; // useQuery로 관리
  user: User; // useQuery로 관리

  // Async Storage - 영구 저장
  authToken: string;
  userSettings: Settings;
}

// ❌ Bad - 모든 상태를 하나의 도구로
interface AppState {
  // Zustand에 서버 데이터와 UI 상태를 섞음
  posts: Post[]; // React Query로 관리해야 함
  loading: boolean;
  theme: 'light' | 'dark';
}
```

### 상태 분류 가이드

```
┌─────────────────────────────────────┐
│ 클라이언트 상태 (Client State)      │
│ → Zustand 또는 useState            │
├─────────────────────────────────────┤
│ - UI 상태 (모달, 드로워 열림/닫힘)  │
│ - 폼 입력값                         │
│ - 사용자 선택 (필터, 정렬)          │
│ - 현재 탭/페이지                    │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ 서버 상태 (Server State)            │
│ → React Query                       │
├─────────────────────────────────────┤
│ - API에서 가져온 데이터             │
│ - 캐싱 필요                         │
│ - 자동 재검증 필요                  │
│ - 낙관적 업데이트                   │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ 영구 상태 (Persistent State)        │
│ → Async Storage                     │
├─────────────────────────────────────┤
│ - 로그인 토큰                       │
│ - 사용자 설정                       │
│ - 오프라인 캐시                     │
│ - 앱 재시작 후에도 유지되어야 함    │
└─────────────────────────────────────┘
```

---

## Performance Optimization

### 1. Zustand Selector 최적화

```typescript
// ❌ Bad - 전체 store 구독
const TodoList = () => {
  const store = useTodoStore();
  // store의 모든 변경에 리렌더링

  return <FlatList data={store.todos} />;
};

// ✅ Good - 필요한 값만 선택
const TodoList = () => {
  const todos = useTodoStore((state) => state.todos);
  // todos만 변경될 때 리렌더링

  return <FlatList data={todos} />;
};

// ✅ Better - Shallow equality
import { shallow } from 'zustand/shallow';

const TodoControls = () => {
  const { addTodo, filter } = useTodoStore(
    (state) => ({ addTodo: state.addTodo, filter: state.filter }),
    shallow
  );

  // addTodo 또는 filter가 변경될 때만 리렌더링
};
```

### 2. React Query Stale Time 설정

```typescript
// ❌ Bad - 매번 refetch
const { data } = useQuery({
  queryKey: ['posts'],
  queryFn: fetchPosts,
  staleTime: 0, // 즉시 stale → 매번 refetch
});

// ✅ Good - 적절한 stale time
const { data } = useQuery({
  queryKey: ['posts'],
  queryFn: fetchPosts,
  staleTime: 5 * 60 * 1000, // 5분간 fresh 유지
  cacheTime: 10 * 60 * 1000, // 10분간 캐시 유지
});
```

### 3. 큰 리스트 최적화

```typescript
// ❌ Bad - 배열 전체를 state에
interface TodoStore {
  todos: Todo[]; // 하나만 변경해도 전체 배열 새로 생성
  updateTodo: (id: string, updates: Partial<Todo>) => void;
}

export const useTodoStore = create<TodoStore>((set) => ({
  todos: [],

  updateTodo: (id, updates) => {
    set((state) => ({
      todos: state.todos.map((todo) =>
        todo.id === id ? { ...todo, ...updates } : todo
      ),
    }));
    // todos 배열 전체가 새로 생성됨
  },
}));

// ✅ Good - 정규화된 상태
interface TodoStore {
  todoIds: string[];
  todosById: Record<string, Todo>;
  updateTodo: (id: string, updates: Partial<Todo>) => void;
}

export const useTodoStore = create<TodoStore>((set) => ({
  todoIds: [],
  todosById: {},

  updateTodo: (id, updates) => {
    set((state) => ({
      todosById: {
        ...state.todosById,
        [id]: { ...state.todosById[id], ...updates },
      },
    }));
    // 해당 todo만 업데이트, 나머지는 참조 유지
  },
}));

// 사용
const TodoItem = ({ id }: { id: string }) => {
  const todo = useTodoStore((state) => state.todosById[id]);
  // 이 todo만 변경될 때 리렌더링
};
```

### 4. Memo와 Callback 최적화

```typescript
import { memo, useCallback } from 'react';

// ❌ Bad - 매번 새 함수 생성
const TodoList = () => {
  const todos = useTodoStore((state) => state.todos);

  return (
    <FlatList
      data={todos}
      renderItem={({ item }) => (
        <TodoItem
          todo={item}
          onToggle={() => toggleTodo(item.id)} // 매번 새 함수
        />
      )}
    />
  );
};

// ✅ Good - useCallback + memo
const TodoItem = memo(({ todo, onToggle }: {
  todo: Todo;
  onToggle: () => void;
}) => {
  return (
    <TouchableOpacity onPress={onToggle}>
      <Text>{todo.text}</Text>
    </TouchableOpacity>
  );
});

const TodoList = () => {
  const todos = useTodoStore((state) => state.todos);
  const toggleTodo = useTodoStore((state) => state.toggleTodo);

  const handleToggle = useCallback((id: string) => {
    toggleTodo(id);
  }, [toggleTodo]);

  return (
    <FlatList
      data={todos}
      renderItem={({ item }) => (
        <TodoItem
          todo={item}
          onToggle={() => handleToggle(item.id)}
        />
      )}
    />
  );
};
```

---

## Error Handling

### 1. React Query Error Handling

```typescript
// ✅ Good - 전역 error handler
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      onError: (error) => {
        // 전역 에러 처리
        if (error.status === 401) {
          // 로그아웃
          useAuthStore.getState().logout();
        }

        // Sentry 등 에러 추적
        Sentry.captureException(error);
      },
    },
  },
});

// ✅ Good - 개별 query error handling
const PostDetailScreen = ({ route }) => {
  const { postId } = route.params;

  const { data, error, isError } = useQuery({
    queryKey: ['post', postId],
    queryFn: () => fetchPost(postId),
    retry: (failureCount, error) => {
      // 404는 재시도 안 함
      if (error.status === 404) return false;
      return failureCount < 3;
    },
  });

  if (isError) {
    if (error.status === 404) {
      return <NotFoundScreen />;
    }
    return <ErrorScreen error={error} retry={() => refetch()} />;
  }

  return <PostDetail post={data} />;
};
```

### 2. Zustand Async Error Handling

```typescript
// ✅ Good - 에러 상태 관리
interface TodoStore {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  fetchTodos: () => Promise<void>;
}

export const useTodoStore = create<TodoStore>((set) => ({
  todos: [],
  loading: false,
  error: null,

  fetchTodos: async () => {
    set({ loading: true, error: null });

    try {
      const response = await fetch('https://api.example.com/todos');

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const todos = await response.json();
      set({ todos, loading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';

      set({
        error: message,
        loading: false,
      });

      // Sentry 에러 추적
      Sentry.captureException(error);
    }
  },
}));

// 사용
const TodoList = () => {
  const { todos, loading, error, fetchTodos } = useTodoStore();

  if (loading) return <ActivityIndicator />;

  if (error) {
    return (
      <View>
        <Text>에러: {error}</Text>
        <Button title="다시 시도" onPress={fetchTodos} />
      </View>
    );
  }

  return <FlatList data={todos} />;
};
```

---

## Common Pitfalls

### 1. Async Storage에 큰 데이터 저장

```typescript
// ❌ Bad - 큰 데이터 저장 (2MB+)
const saveAllPosts = async (posts: Post[]) => {
  await AsyncStorage.setItem('posts', JSON.stringify(posts));
  // 성능 저하, 저장 실패 가능
};

// ✅ Good - 작은 데이터만 저장, 큰 데이터는 SQLite/Realm
const saveRecentPosts = async (posts: Post[]) => {
  const recent = posts.slice(0, 10); // 최근 10개만
  await AsyncStorage.setItem('recent_posts', JSON.stringify(recent));
};
```

### 2. Context로 자주 변하는 상태 관리

```typescript
// ❌ Bad - 자주 변하는 상태를 Context로
const AppContext = createContext<{
  posts: Post[];
  setPosts: (posts: Post[]) => void;
}>();

export const AppProvider = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>([]);

  // posts 변경될 때마다 모든 consumer 리렌더링
  return (
    <AppContext.Provider value={{ posts, setPosts }}>
      {children}
    </AppContext.Provider>
  );
};

// ✅ Good - Zustand나 React Query 사용
export const usePostsStore = create<PostsStore>((set) => ({
  posts: [],
  setPosts: (posts) => set({ posts }),
}));

// 또는 React Query
const { data: posts } = useQuery({
  queryKey: ['posts'],
  queryFn: fetchPosts,
});
```

### 3. Query Key 일관성 부족

```typescript
// ❌ Bad - 일관성 없는 query key
useQuery({ queryKey: ['posts'], queryFn: fetchPosts });
useQuery({ queryKey: ['allPosts'], queryFn: fetchPosts });
useQuery({ queryKey: ['post-list'], queryFn: fetchPosts });

// ✅ Good - 일관된 query key 구조
const queryKeys = {
  posts: {
    all: ['posts'] as const,
    list: (filters: PostFilters) => ['posts', 'list', filters] as const,
    detail: (id: number) => ['posts', 'detail', id] as const,
  },
} as const;

// 사용
useQuery({ queryKey: queryKeys.posts.all, queryFn: fetchPosts });
useQuery({ queryKey: queryKeys.posts.detail(123), queryFn: () => fetchPost(123) });
```

### 4. 불필요한 Re-render

```typescript
// ❌ Bad - 매번 새 객체/배열 생성
const TodoList = () => {
  const todos = useTodoStore((state) => state.todos);

  return (
    <FlatList
      data={todos}
      renderItem={({ item }) => <TodoItem todo={item} />}
      // 매번 새 객체 생성 → FlatList 리렌더링
      contentContainerStyle={{ padding: 16 }}
    />
  );
};

// ✅ Good - useMemo로 메모이제이션
const TodoList = () => {
  const todos = useTodoStore((state) => state.todos);

  const contentContainerStyle = useMemo(
    () => ({ padding: 16 }),
    []
  );

  return (
    <FlatList
      data={todos}
      renderItem={({ item }) => <TodoItem todo={item} />}
      contentContainerStyle={contentContainerStyle}
    />
  );
};
```

---

## Testing Guidelines

### 1. Zustand Store 테스트

```typescript
import { renderHook, act } from '@testing-library/react-native';
import { useCounterStore } from './counterStore';

describe('CounterStore', () => {
  beforeEach(() => {
    // 각 테스트 전 store 초기화
    useCounterStore.setState({ count: 0 });
  });

  it('should increment count', () => {
    const { result } = renderHook(() => useCounterStore());

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });

  it('should decrement count', () => {
    const { result } = renderHook(() => useCounterStore());

    act(() => {
      result.current.decrement();
    });

    expect(result.current.count).toBe(-1);
  });
});
```

### 2. React Query 테스트

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react-native';
import { usePosts } from './usePosts';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('usePosts', () => {
  it('should fetch posts', async () => {
    const { result } = renderHook(() => usePosts(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toHaveLength(10);
  });
});
```

### 3. Component 통합 테스트

```typescript
import { render, fireEvent } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LoginScreen } from './LoginScreen';

const createWrapper = () => {
  const queryClient = new QueryClient();

  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('LoginScreen', () => {
  it('should login successfully', async () => {
    const { getByPlaceholderText, getByText } = render(
      <LoginScreen />,
      { wrapper: createWrapper() }
    );

    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');
    const loginButton = getByText('로그인');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
    });
  });
});
```

---

**요약:** 올바른 도구를 선택하고, 성능을 고려하며, 에러를 적절히 처리하고, 테스트를 작성하세요.
