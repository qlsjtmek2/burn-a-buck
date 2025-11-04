# App Architecture Patterns

앱 개발 시 일반적으로 사용되는 아키텍처 패턴과 프로젝트 구조를 정리한 참조 문서입니다.

## Table of Contents

- [프로젝트 폴더 구조](#프로젝트-폴더-구조)
- [상태 관리 패턴](#상태-관리-패턴)
- [데이터 흐름 아키텍처](#데이터-흐름-아키텍처)
- [컴포넌트 설계 원칙](#컴포넌트-설계-원칙)

---

## 프로젝트 폴더 구조

### React Native 표준 구조

```
src/
├── features/              # Feature-based organization
│   ├── auth/
│   │   ├── components/   # Feature-specific components
│   │   ├── screens/      # Feature screens
│   │   ├── hooks/        # Feature hooks
│   │   └── services/     # Feature services
│   ├── todos/
│   └── profile/
├── components/           # Shared components
│   ├── ui/              # UI primitives
│   └── common/          # Common components
├── services/            # API and external services
│   ├── api/
│   └── storage/
├── hooks/               # Shared hooks
├── store/               # Global state management
├── navigation/          # Navigation configuration
├── utils/               # Utility functions
├── types/               # TypeScript types
└── assets/              # Images, fonts, etc.
```

### Web App (React) 표준 구조

```
src/
├── features/            # Same as React Native
├── components/          # Shared components
├── pages/               # Page components
├── services/            # API services
├── hooks/               # Custom hooks
├── store/               # State management
├── styles/              # Global styles
├── utils/               # Utilities
└── types/               # TypeScript types
```

---

## 상태 관리 패턴

### Client State (Zustand)

앱 전역 UI 상태 관리에 사용합니다.

**사용 예시:**
- 사용자 설정 (테마, 언어)
- 임시 UI 상태 (모달 열림/닫힘)
- 앱 전역 필터/정렬 상태

**구조:**
```typescript
// store/useAuthStore.ts
import { create } from 'zustand';

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));
```

### Server State (React Query / TanStack Query)

서버 데이터 관리에 사용합니다.

**사용 예시:**
- API 데이터 fetching
- 캐싱 및 동기화
- Optimistic updates
- Infinite scroll / Pagination

**구조:**
```typescript
// services/api/todos.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const useTodos = () => {
  return useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
  });
};

export const useCreateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
};
```

### Local Persistence (AsyncStorage / localStorage)

영구 저장이 필요한 데이터에 사용합니다.

**사용 예시:**
- 인증 토큰
- 사용자 설정
- 오프라인 데이터

---

## 데이터 흐름 아키텍처

### Standard Flow (일반 CRUD 앱)

```
User Interaction → Component → Service/Hook → API → Backend
                       ↓                               ↓
                    UI Update ← State Update ← Response
```

**설명:**
1. 사용자가 UI와 상호작용
2. 컴포넌트가 이벤트를 처리하고 서비스/훅 호출
3. 서비스가 API 요청 전송
4. 백엔드가 응답 반환
5. 상태 업데이트 (React Query 캐시 또는 Zustand)
6. UI 자동 리렌더링

### Optimistic Update Flow

빠른 사용자 경험을 위한 낙관적 업데이트:

```
User Action → Optimistic UI Update → API Call → Success/Rollback
```

**구현 예시:**
```typescript
const { mutate } = useMutation({
  mutationFn: updateTodo,
  onMutate: async (newTodo) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: ['todos'] });

    // Snapshot previous value
    const previousTodos = queryClient.getQueryData(['todos']);

    // Optimistically update
    queryClient.setQueryData(['todos'], (old) => [...old, newTodo]);

    return { previousTodos };
  },
  onError: (err, newTodo, context) => {
    // Rollback on error
    queryClient.setQueryData(['todos'], context.previousTodos);
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['todos'] });
  },
});
```

---

## 컴포넌트 설계 원칙

### Component Hierarchy

```
Screen/Page (Smart Component)
    ↓
Feature Components (Container)
    ↓
Presentational Components (Dumb)
    ↓
UI Primitives (Button, Input, Card)
```

### Smart vs Dumb Components

**Smart Components (Container):**
- 비즈니스 로직 포함
- 상태 관리 (hooks 사용)
- API 호출
- 자식 컴포넌트에 데이터 전달

**Dumb Components (Presentational):**
- UI 렌더링만 담당
- Props로 데이터 받음
- 재사용 가능
- 상태 없음 (stateless)

**예시:**
```typescript
// Smart Component
const TodoListContainer = () => {
  const { data: todos, isLoading } = useTodos();
  const { mutate: deleteTodo } = useDeleteTodo();

  if (isLoading) return <LoadingSpinner />;

  return <TodoList todos={todos} onDelete={deleteTodo} />;
};

// Dumb Component
const TodoList = ({ todos, onDelete }) => {
  return (
    <View>
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} onDelete={onDelete} />
      ))}
    </View>
  );
};
```

### Component Composition

재사용성을 위해 컴포넌트를 작게 나누고 합성합니다:

```typescript
// ❌ Bad: Monolithic component
const TodoApp = () => {
  return (
    <View>
      <Text>Todos</Text>
      <TextInput />
      <Button />
      {/* 500 lines of code... */}
    </View>
  );
};

// ✅ Good: Composed components
const TodoApp = () => {
  return (
    <Screen>
      <TodoHeader />
      <TodoInput />
      <TodoList />
      <TodoFooter />
    </Screen>
  );
};
```

---

## 추가 패턴

### Error Boundaries (React)

전역 에러 처리:

```typescript
import { ErrorBoundary } from 'react-error-boundary';

const App = () => (
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <AppContent />
  </ErrorBoundary>
);
```

### Suspense + Lazy Loading

성능 최적화:

```typescript
import { lazy, Suspense } from 'react';

const TodoScreen = lazy(() => import('./screens/TodoScreen'));

const App = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <TodoScreen />
  </Suspense>
);
```

---

## 권장 사항

1. **Feature-based organization**: 기능별로 코드를 구성하여 확장성 향상
2. **Container/Presentational pattern**: 로직과 UI 분리
3. **React Query for server state**: 서버 데이터는 React Query로 관리
4. **Zustand for client state**: 간단한 전역 상태는 Zustand 사용
5. **Composition over inheritance**: 컴포넌트 합성 활용
6. **Single Responsibility**: 각 컴포넌트는 하나의 책임만
7. **TypeScript**: 타입 안정성 확보

---

**참조:**
- React Native Best Practices
- React Query Documentation
- Zustand Documentation
- Clean Architecture Principles
