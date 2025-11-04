# React Query Guide

## 📚 Table of Contents

- [Overview](#overview)
- [Setup](#setup)
- [useQuery - Data Fetching](#usequery---data-fetching)
- [useMutation - Data Modification](#usemutation---data-modification)
- [Optimistic Updates](#optimistic-updates)
- [Pagination](#pagination)
- [Infinite Scroll](#infinite-scroll)
- [Advanced Patterns](#advanced-patterns)
- [Best Practices](#best-practices)

---

## Overview

**React Query (TanStack Query)는 서버 상태 관리의 표준 라이브러리입니다.**

### 핵심 기능
- 🔄 **자동 캐싱** - 중복 요청 제거
- ♻️ **자동 재검증** - 백그라운드 업데이트
- 📊 **Loading/Error 상태** - 자동 관리
- 🎯 **Optimistic Updates** - 빠른 UI 반응
- 📡 **Offline 지원** - 네트워크 재연결 시 자동 재시도

### 언제 사용하나?
- API에서 데이터를 가져올 때
- 캐싱과 자동 재검증이 필요할 때
- 페이지네이션/무한 스크롤 구현 시
- 서버 데이터와 UI 동기화가 중요할 때

---

## Setup

### 설치

```bash
npm install @tanstack/react-query
```

### QueryClient 설정

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2, // 실패 시 2번 재시도
      staleTime: 5 * 60 * 1000, // 5분간 fresh 상태 유지
      cacheTime: 10 * 60 * 1000, // 10분간 캐시 유지
      refetchOnWindowFocus: false, // 앱 포커스 시 재조회 비활성화
      refetchOnReconnect: true, // 재연결 시 재조회
    },
    mutations: {
      retry: 1, // Mutation은 1번만 재시도
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Navigation />
    </QueryClientProvider>
  );
}
```

### React Native 최적화 설정

```typescript
import NetInfo from '@react-native-community/netinfo';
import { onlineManager } from '@tanstack/react-query';

// 네트워크 상태 추적
onlineManager.setEventListener((setOnline) => {
  return NetInfo.addEventListener((state) => {
    setOnline(!!state.isConnected);
  });
});
```

---

## useQuery - Data Fetching

### 기본 사용법

```typescript
import { useQuery } from '@tanstack/react-query';

interface Post {
  id: number;
  title: string;
  content: string;
}

const fetchPosts = async (): Promise<Post[]> => {
  const response = await fetch('https://api.example.com/posts');
  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }
  return response.json();
};

const PostListScreen = () => {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching
  } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  });

  if (isLoading) {
    return <ActivityIndicator size="large" />;
  }

  if (isError) {
    return (
      <View>
        <Text>에러: {error.message}</Text>
        <Button title="다시 시도" onPress={() => refetch()} />
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      renderItem={({ item }) => <PostItem post={item} />}
      keyExtractor={(item) => item.id.toString()}
      refreshing={isFetching}
      onRefresh={refetch}
    />
  );
};
```

### Query Key로 파라미터 전달

```typescript
const fetchPost = async (postId: number): Promise<Post> => {
  const response = await fetch(`https://api.example.com/posts/${postId}`);
  if (!response.ok) throw new Error('Failed to fetch post');
  return response.json();
};

const PostDetailScreen = ({ route }) => {
  const { postId } = route.params;

  const { data: post } = useQuery({
    queryKey: ['post', postId], // postId 변경 시 자동으로 새 쿼리
    queryFn: () => fetchPost(postId),
  });

  return <PostDetail post={post} />;
};
```

### Dependent Queries (의존 쿼리)

```typescript
const UserProfileScreen = ({ userId }: { userId: number }) => {
  // 1. 먼저 사용자 정보 가져오기
  const { data: user } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  // 2. 사용자 정보가 있을 때만 게시글 가져오기
  const { data: posts } = useQuery({
    queryKey: ['posts', user?.id],
    queryFn: () => fetchUserPosts(user!.id),
    enabled: !!user, // user가 있을 때만 실행
  });

  return (
    <View>
      <UserInfo user={user} />
      <PostList posts={posts} />
    </View>
  );
};
```

### Parallel Queries (병렬 쿼리)

```typescript
const DashboardScreen = () => {
  const users = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  const posts = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  });

  const comments = useQuery({
    queryKey: ['comments'],
    queryFn: fetchComments,
  });

  if (users.isLoading || posts.isLoading || comments.isLoading) {
    return <ActivityIndicator />;
  }

  return (
    <View>
      <Text>Users: {users.data?.length}</Text>
      <Text>Posts: {posts.data?.length}</Text>
      <Text>Comments: {comments.data?.length}</Text>
    </View>
  );
};
```

---

## useMutation - Data Modification

### 기본 사용법

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';

const createPost = async (newPost: { title: string; content: string }) => {
  const response = await fetch('https://api.example.com/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newPost),
  });

  if (!response.ok) throw new Error('Failed to create post');
  return response.json();
};

const CreatePostScreen = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createPost,

    onSuccess: (data) => {
      // 성공 시 posts 쿼리 무효화 (자동 재조회)
      queryClient.invalidateQueries({ queryKey: ['posts'] });

      Alert.alert('성공', '게시글이 작성되었습니다.');
      navigation.goBack();
    },

    onError: (error: Error) => {
      Alert.alert('실패', error.message);
    },
  });

  const handleSubmit = (values: { title: string; content: string }) => {
    mutation.mutate(values);
  };

  return (
    <View>
      <TextInput placeholder="제목" />
      <TextInput placeholder="내용" multiline />

      <Button
        title="게시글 작성"
        onPress={handleSubmit}
        disabled={mutation.isPending}
      />

      {mutation.isPending && <ActivityIndicator />}
    </View>
  );
};
```

### Update Mutation

```typescript
const updatePost = async ({
  id,
  updates
}: {
  id: number;
  updates: Partial<Post>
}) => {
  const response = await fetch(`https://api.example.com/posts/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });

  if (!response.ok) throw new Error('Failed to update');
  return response.json();
};

const EditPostScreen = ({ route }) => {
  const { postId } = route.params;
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: updatePost,

    onSuccess: (updatedPost) => {
      // 특정 post 쿼리만 무효화
      queryClient.invalidateQueries({ queryKey: ['post', postId] });

      // 또는 직접 캐시 업데이트
      queryClient.setQueryData(['post', postId], updatedPost);
    },
  });

  return (
    <View>
      <Button
        title="수정"
        onPress={() => mutation.mutate({
          id: postId,
          updates: { title: 'New Title' }
        })}
      />
    </View>
  );
};
```

### Delete Mutation

```typescript
const deletePost = async (postId: number) => {
  const response = await fetch(`https://api.example.com/posts/${postId}`, {
    method: 'DELETE',
  });

  if (!response.ok) throw new Error('Failed to delete');
};

const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePost,

    onSuccess: (_, postId) => {
      // posts 리스트에서 해당 post 제거
      queryClient.setQueryData(['posts'], (old: Post[] | undefined) =>
        old?.filter((post) => post.id !== postId)
      );

      // 해당 post 상세 쿼리 제거
      queryClient.removeQueries({ queryKey: ['post', postId] });
    },
  });
};
```

---

## Optimistic Updates

**낙관적 업데이트는 서버 응답 전에 UI를 먼저 업데이트하여 빠른 사용자 경험을 제공합니다.**

### Like 기능 예제

```typescript
const useLikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: number) =>
      fetch(`https://api.example.com/posts/${postId}/like`, {
        method: 'POST',
      }),

    onMutate: async (postId) => {
      // 1. 진행 중인 refetch 취소
      await queryClient.cancelQueries({ queryKey: ['posts'] });

      // 2. 이전 값 저장 (롤백용)
      const previousPosts = queryClient.getQueryData<Post[]>(['posts']);

      // 3. 낙관적으로 UI 업데이트
      queryClient.setQueryData<Post[]>(['posts'], (old) =>
        old?.map((post) =>
          post.id === postId
            ? { ...post, likes: post.likes + 1, isLiked: true }
            : post
        )
      );

      // 4. context 반환 (onError에서 사용)
      return { previousPosts };
    },

    onError: (err, postId, context) => {
      // 에러 시 이전 값으로 롤백
      if (context?.previousPosts) {
        queryClient.setQueryData(['posts'], context.previousPosts);
      }

      Alert.alert('실패', '좋아요 처리 중 오류가 발생했습니다.');
    },

    onSettled: () => {
      // 성공/실패 여부와 관계없이 최종적으로 서버 데이터와 동기화
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};

// 사용
const PostItem = ({ post }: { post: Post }) => {
  const likeMutation = useLikePost();

  return (
    <TouchableOpacity onPress={() => likeMutation.mutate(post.id)}>
      <Text>{post.likes} ❤️</Text>
    </TouchableOpacity>
  );
};
```

---

## Pagination

### Offset-based Pagination

```typescript
const usePosts = (page: number) => {
  return useQuery({
    queryKey: ['posts', page],
    queryFn: () =>
      fetch(`https://api.example.com/posts?page=${page}&limit=20`)
        .then((r) => r.json()),
    keepPreviousData: true, // 페이지 전환 시 이전 데이터 유지
    staleTime: 5 * 60 * 1000, // 5분간 fresh
  });
};

const PostListScreen = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching, isPreviousData } = usePosts(page);

  return (
    <View>
      <FlatList
        data={data?.posts}
        renderItem={({ item }) => <PostItem post={item} />}
        ListFooterComponent={() => (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Button
              title="이전 페이지"
              onPress={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || isFetching}
            />

            <Text>Page {page}</Text>

            <Button
              title="다음 페이지"
              onPress={() => setPage((p) => p + 1)}
              disabled={isPreviousData || !data?.hasMore}
            />
          </View>
        )}
      />

      {isFetching && <ActivityIndicator />}
    </View>
  );
};
```

---

## Infinite Scroll

### useInfiniteQuery 사용

```typescript
import { useInfiniteQuery } from '@tanstack/react-query';

interface PostsResponse {
  posts: Post[];
  nextCursor: number | null;
  hasMore: boolean;
}

const fetchPosts = async ({ pageParam = 1 }): Promise<PostsResponse> => {
  const response = await fetch(
    `https://api.example.com/posts?cursor=${pageParam}&limit=20`
  );
  return response.json();
};

const useInfinitePosts = () => {
  return useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.nextCursor : undefined;
    },
    initialPageParam: 1,
  });
};

const InfinitePostListScreen = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfinitePosts();

  if (isLoading) {
    return <ActivityIndicator />;
  }

  const posts = data?.pages.flatMap((page) => page.posts) ?? [];

  return (
    <FlatList
      data={posts}
      renderItem={({ item }) => <PostItem post={item} />}
      keyExtractor={(item) => item.id.toString()}

      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }}
      onEndReachedThreshold={0.5}

      ListFooterComponent={
        isFetchingNextPage ? (
          <ActivityIndicator style={{ marginVertical: 20 }} />
        ) : null
      }
    />
  );
};
```

---

## Advanced Patterns

### Query Invalidation Strategies

```typescript
const queryClient = useQueryClient();

// 1. 모든 posts 쿼리 무효화
queryClient.invalidateQueries({ queryKey: ['posts'] });

// 2. 특정 post만 무효화
queryClient.invalidateQueries({ queryKey: ['post', postId] });

// 3. 특정 패턴 매칭
queryClient.invalidateQueries({
  predicate: (query) =>
    query.queryKey[0] === 'posts' && query.queryKey[1] === userId
});

// 4. 즉시 refetch (기본은 다음 사용 시)
queryClient.invalidateQueries({
  queryKey: ['posts'],
  refetchType: 'active', // 현재 활성 쿼리만
});
```

### Prefetching (미리 가져오기)

```typescript
const PostListScreen = () => {
  const queryClient = useQueryClient();
  const { data: posts } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  });

  const handlePostPress = (postId: number) => {
    // 상세 페이지 이동 전에 미리 데이터 가져오기
    queryClient.prefetchQuery({
      queryKey: ['post', postId],
      queryFn: () => fetchPost(postId),
    });

    navigation.navigate('PostDetail', { postId });
  };

  return (
    <FlatList
      data={posts}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => handlePostPress(item.id)}>
          <PostItem post={item} />
        </TouchableOpacity>
      )}
    />
  );
};
```

### Background Updates

```typescript
const { data } = useQuery({
  queryKey: ['posts'],
  queryFn: fetchPosts,
  refetchInterval: 30000, // 30초마다 자동 재조회
  refetchIntervalInBackground: false, // 앱이 백그라운드일 때는 중지
});
```

---

## Best Practices

### 1. Query Key 구조화

```typescript
// ✅ Good - 계층적 구조
['posts'] // 모든 posts
['posts', { status: 'published' }] // 필터링된 posts
['posts', postId] // 특정 post
['posts', postId, 'comments'] // 특정 post의 comments

// ❌ Bad - 일관성 없음
['allPosts']
['post-123']
['comments-for-post-123']
```

### 2. Error Handling

```typescript
const { data, error, isError } = useQuery({
  queryKey: ['posts'],
  queryFn: fetchPosts,
  retry: (failureCount, error) => {
    // 404는 재시도하지 않음
    if (error.status === 404) return false;
    return failureCount < 3;
  },
});

if (isError) {
  if (error.status === 404) {
    return <NotFound />;
  }
  return <ErrorScreen error={error} />;
}
```

### 3. Loading States

```typescript
const PostDetailScreen = ({ route }) => {
  const { postId } = route.params;

  const {
    data: post,
    isLoading,
    isFetching,
    isError
  } = useQuery({
    queryKey: ['post', postId],
    queryFn: () => fetchPost(postId),
  });

  // 초기 로딩
  if (isLoading) {
    return <LoadingScreen />;
  }

  // 에러
  if (isError) {
    return <ErrorScreen />;
  }

  return (
    <View>
      {/* 백그라운드 재조회 표시 */}
      {isFetching && <RefreshIndicator />}

      <PostDetail post={post} />
    </View>
  );
};
```

### 4. Cache Time 최적화

```typescript
// 자주 변하는 데이터
useQuery({
  queryKey: ['notifications'],
  queryFn: fetchNotifications,
  staleTime: 0, // 즉시 stale
  cacheTime: 5 * 60 * 1000, // 5분 캐시
});

// 거의 변하지 않는 데이터
useQuery({
  queryKey: ['categories'],
  queryFn: fetchCategories,
  staleTime: 60 * 60 * 1000, // 1시간 fresh
  cacheTime: 24 * 60 * 60 * 1000, // 24시간 캐시
});
```

---

**참고:** React Query는 서버 상태 관리에 특화되어 있습니다. 클라이언트 UI 상태는 Zustand나 Context API를 사용하세요.
