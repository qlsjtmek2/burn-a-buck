---
name: state-management-mobile
description: State management for React Native applications using Zustand for client state, React Query (TanStack Query) for server state, Async Storage for persistence, and Context API for simple global state. Covers store creation, hooks, selectors, mutations, caching strategies, optimistic updates, pagination, infinite scroll, performance optimization, and best practices. Includes authentication patterns, shopping cart examples, social media feed implementations, and comprehensive testing guidelines. Use when working with mobile state management, global state, data fetching, local storage, or cache synchronization in React Native apps.
version: 2.0.0
type: domain
tags:
  - state-management
  - zustand
  - react-query
  - tanstack-query
  - async-storage
  - context-api
  - mobile
  - react-native
  - caching
  - persistence
---

# State Management for Mobile Apps

**React Native 앱에서 상태를 효과적으로 관리하는 가이드입니다.**

이 스킬은 클라이언트 상태, 서버 상태, 영구 저장소를 적절히 구분하고 각각에 최적화된 도구를 사용하는 방법을 제공합니다.

---

## 🎯 Purpose

React Native 앱에서 상태 관리는 복잡합니다. 클라이언트 UI 상태, 서버 데이터, 로컬 저장소를 모두 고려해야 하며, 각각에 적합한 도구를 선택하는 것이 중요합니다.

**이 스킬이 제공하는 것:**
- 상태 유형별 올바른 도구 선택 가이드
- Zustand, React Query, Async Storage, Context API 통합 사용법
- 프로덕션 준비된 예제 (인증, 장바구니, 소셜 피드)
- 성능 최적화 및 일반적인 실수 방지

---

## 🔑 Core Principles

### 1. 상태를 용도별로 구분

```
┌─────────────────────────────────────────┐
│ 클라이언트 상태 (Client State)          │
│ - UI 상태 (모달, 탭, 로딩 등)           │
│ - 폼 입력 상태                          │
│ - 사용자 선택/필터                      │
│ → Zustand 또는 useState 사용             │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ 서버 상태 (Server State)                │
│ - API로부터 받은 데이터                 │
│ - 캐싱이 필요한 데이터                  │
│ - 자동 재검증이 필요한 데이터           │
│ → React Query (TanStack Query) 사용      │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ 영구 상태 (Persistent State)            │
│ - 로그인 토큰                           │
│ - 사용자 설정                           │
│ - 오프라인 데이터                       │
│ → Async Storage 사용                     │
└─────────────────────────────────────────┘
```

### 2. Context7 MCP로 최신 문서 조회

상태 관리 라이브러리 사용 전 **Context7 MCP로 최신 API 확인**:

```bash
# Zustand 문서 조회
mcp__context7__resolve-library-id "zustand"
mcp__context7__get-library-docs "/pmndrs/zustand"

# React Query 문서 조회
mcp__context7__resolve-library-id "tanstack query"
mcp__context7__get-library-docs "/tanstack/query"
```

### 3. 성능을 고려한 선택

- **간단한 전역 상태**: Zustand (번들 크기 작음, 빠름)
- **복잡한 상태 로직**: Redux Toolkit
- **서버 데이터**: React Query (캐싱 + 자동 재검증)
- **로컬 저장소**: Async Storage (작은 데이터만)

---

## 🚀 Quick Start

### Zustand (클라이언트 상태)

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

// 사용
const ProfileScreen = () => {
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);

  return <Text>{user?.name}</Text>;
};
```

### React Query (서버 상태)

```typescript
import { useQuery } from '@tanstack/react-query';

const PostListScreen = () => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  });

  if (isLoading) return <ActivityIndicator />;

  return (
    <FlatList
      data={data}
      renderItem={({ item }) => <PostItem post={item} />}
      onRefresh={refetch}
    />
  );
};
```

### Async Storage (영구 저장)

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

// 저장
await AsyncStorage.setItem('@token', token);

// 불러오기
const token = await AsyncStorage.getItem('@token');

// Zustand와 연동 (persist)
import { persist, createJSONStorage } from 'zustand/middleware';

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      theme: 'light',
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

---

## 📖 Navigation Guide

아래 표를 참고하여 필요한 리소스를 찾으세요:

| 필요한 내용 | 리소스 파일 | 주요 내용 |
|------------|-----------|----------|
| **Zustand 완전 가이드** | [zustand-guide.md](resources/zustand-guide.md) | 기본 사용법, 비동기 액션, Persist, Selectors, 성능 최적화 |
| **React Query 완전 가이드** | [react-query-guide.md](resources/react-query-guide.md) | useQuery, useMutation, Optimistic Updates, Pagination, Infinite Scroll, 고급 패턴 |
| **Async Storage 완전 가이드** | [async-storage-guide.md](resources/async-storage-guide.md) | 기본 작업, React Hook 래퍼, 복잡한 데이터 관리, Cache Manager, 베스트 프랙티스 |
| **Context API 가이드** | [context-api.md](resources/context-api.md) | 기본 사용법, 여러 Context 조합, 성능 최적화, Reducer 패턴, 사용 제한사항 |
| **실전 예제** | [examples.md](resources/examples.md) | 인증 시스템, 쇼핑 카트, 소셜 미디어 피드 (프로덕션 준비 완료) |
| **베스트 프랙티스** | [best-practices.md](resources/best-practices.md) | 상태 선택 전략, 성능 최적화, 에러 처리, 일반적인 실수, 테스트 가이드 |

---

## 🔄 Workflow

### 1. 상태 유형 파악

먼저 관리할 상태가 어떤 유형인지 판단하세요:

```typescript
// Q: 이 상태는 서버에서 오는가?
// Yes → React Query 사용

// Q: 앱 재시작 후에도 유지되어야 하는가?
// Yes → Async Storage 사용 (또는 Zustand + Persist)

// Q: 간단한 UI 상태인가?
// Yes → useState 또는 Zustand 사용

// Q: 작은 앱이고 전역 상태가 간단한가?
// Yes → Context API 고려 (하지만 Zustand가 더 나음)
```

### 2. 도구 선택

| 상태 유형 | 추천 도구 | 이유 |
|---------|---------|------|
| UI 상태 (모달, 탭) | `useState` or `Zustand` | 간단하고 빠름 |
| 전역 클라이언트 상태 | `Zustand` | 가볍고 성능 좋음 |
| 서버 데이터 | `React Query` | 캐싱, 자동 재검증 |
| 로컬 저장 | `Async Storage` | 영구 저장 |
| 작은 앱의 간단한 전역 상태 | `Context API` | 별도 설치 불필요 |

### 3. 구현

선택한 도구의 리소스 파일을 참고하여 구현하세요:

- **Zustand**: [resources/zustand-guide.md](resources/zustand-guide.md)
- **React Query**: [resources/react-query-guide.md](resources/react-query-guide.md)
- **Async Storage**: [resources/async-storage-guide.md](resources/async-storage-guide.md)
- **Context API**: [resources/context-api.md](resources/context-api.md)

### 4. 최적화 및 테스트

구현 후 성능 최적화 및 테스트:

- **성능**: [resources/best-practices.md#performance-optimization](resources/best-practices.md#performance-optimization)
- **에러 처리**: [resources/best-practices.md#error-handling](resources/best-practices.md#error-handling)
- **테스트**: [resources/best-practices.md#testing-guidelines](resources/best-practices.md#testing-guidelines)

---

## ⚡ Common Patterns

### Pattern 1: Zustand + React Query 조합

```typescript
// Zustand: UI 상태
const useUIStore = create((set) => ({
  sidebarOpen: false,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
}));

// React Query: 서버 데이터
const { data: posts } = useQuery({
  queryKey: ['posts'],
  queryFn: fetchPosts,
});
```

### Pattern 2: Zustand + Persist (로그인 상태)

```typescript
const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      login: async (credentials) => { /* ... */ },
      logout: () => set({ token: null, user: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

### Pattern 3: React Query + Optimistic Updates

```typescript
const likeMutation = useMutation({
  mutationFn: (postId) => likePost(postId),

  onMutate: async (postId) => {
    // UI를 먼저 업데이트 (낙관적)
    queryClient.setQueryData(['posts'], (old) =>
      old.map((post) =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      )
    );
  },

  onError: (err, postId, context) => {
    // 에러 시 롤백
    queryClient.setQueryData(['posts'], context.previousPosts);
  },
});
```

---

## 📚 Related Skills

- **react-native-guidelines** - React Native 컴포넌트 패턴 및 구조
- **mobile-ui-components** - UI 컴포넌트 개발 패턴
- **firebase-supabase-integration** - 백엔드 통합 (Supabase MCP 활용)

---

## 📖 References

### Context7 MCP로 최신 문서 조회

```bash
# Zustand
mcp__context7__resolve-library-id "zustand"
mcp__context7__get-library-docs "/pmndrs/zustand"

# React Query
mcp__context7__resolve-library-id "tanstack query"
mcp__context7__get-library-docs "/tanstack/query"

# Async Storage
mcp__context7__resolve-library-id "react-native-async-storage"
mcp__context7__get-library-docs "/react-native-async-storage/async-storage"
```

### 공식 문서

- **Zustand**: https://docs.pmnd.rs/zustand/getting-started/introduction
- **React Query**: https://tanstack.com/query/latest/docs/react/overview
- **Async Storage**: https://react-native-async-storage.github.io/async-storage/

---

**이 스킬은 클라이언트/서버/영구 상태를 명확히 구분하고 각각에 최적화된 도구를 사용합니다.**

**프로덕션 준비 완료:** 모든 예제는 실제 앱에서 사용할 수 있도록 에러 처리, 타입 안전성, 성능 최적화가 적용되어 있습니다.
