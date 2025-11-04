# Supabase Realtime

Supabase Realtime을 사용한 실시간 구독 가이드입니다.

## 📚 Table of Contents

- [기본 개념](#기본-개념)
- [실시간 구독 (PostgreSQL Changes)](#실시간-구독-postgresql-changes)
- [특정 이벤트 필터링](#특정-이벤트-필터링)
- [React Hook 패턴](#react-hook-패턴)
- [Cleanup (구독 해제)](#cleanup-구독-해제)

---

## 기본 개념

Supabase Realtime은 PostgreSQL 변경 사항을 실시간으로 수신할 수 있게 합니다.

**지원하는 이벤트:**
- `INSERT` - 새 레코드 추가
- `UPDATE` - 기존 레코드 수정
- `DELETE` - 레코드 삭제
- `*` - 모든 이벤트

---

## 실시간 구독 (PostgreSQL Changes)

### 모든 변경사항 수신

```typescript
import { supabase } from './lib/supabase';
import { useEffect, useState } from 'react';
import type { Tables } from './lib/supabase';

type Post = Tables<'posts'>;

const useRealtimePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    // 초기 데이터 가져오기
    fetchPosts().then(setPosts);

    // 실시간 구독
    const channel = supabase
      .channel('posts-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'posts',
        },
        (payload) => {
          console.log('실시간 변경:', payload);

          if (payload.eventType === 'INSERT') {
            setPosts((prev) => [payload.new as Post, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setPosts((prev) =>
              prev.map((post) =>
                post.id === payload.new.id ? (payload.new as Post) : post
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setPosts((prev) =>
              prev.filter((post) => post.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return posts;
};

// 사용 예시
const PostListScreen = () => {
  const posts = useRealtimePosts();

  return (
    <FlatList
      data={posts}
      renderItem={({ item }) => <PostItem post={item} />}
      keyExtractor={(item) => item.id}
    />
  );
};
```

---

## 특정 이벤트 필터링

### INSERT만 수신

```typescript
const channel = supabase
  .channel('new-posts')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'posts',
    },
    (payload) => {
      console.log('새 게시글:', payload.new);
      setPosts((prev) => [payload.new as Post, ...prev]);
    }
  )
  .subscribe();
```

### 특정 조건 필터링

```typescript
// 특정 user의 게시글만 수신
const channel = supabase
  .channel('user-posts')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'posts',
      filter: `user_id=eq.${userId}`,
    },
    (payload) => {
      console.log('내 게시글 변경:', payload);
    }
  )
  .subscribe();
```

---

## React Hook 패턴

### useRealtimeQuery (Custom Hook)

```typescript
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';

type RealtimeConfig<T> = {
  table: string;
  filter?: string;
  initialFetch: () => Promise<T[]>;
  onInsert?: (item: T) => void;
  onUpdate?: (item: T) => void;
  onDelete?: (item: T) => void;
};

const useRealtimeQuery = <T extends { id: string }>(
  config: RealtimeConfig<T>
) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 초기 데이터 로드
    config.initialFetch().then((initialData) => {
      setData(initialData);
      setLoading(false);
    });

    // 실시간 구독
    const channel = supabase
      .channel(`${config.table}-changes`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: config.table,
          filter: config.filter,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setData((prev) => [payload.new as T, ...prev]);
            config.onInsert?.(payload.new as T);
          } else if (payload.eventType === 'UPDATE') {
            setData((prev) =>
              prev.map((item) =>
                item.id === payload.new.id ? (payload.new as T) : item
              )
            );
            config.onUpdate?.(payload.new as T);
          } else if (payload.eventType === 'DELETE') {
            setData((prev) => prev.filter((item) => item.id !== payload.old.id));
            config.onDelete?.(payload.old as T);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [config.table, config.filter]);

  return { data, loading };
};

// 사용 예시
const PostsScreen = ({ userId }: { userId: string }) => {
  const { data: posts, loading } = useRealtimeQuery<Post>({
    table: 'posts',
    filter: `user_id=eq.${userId}`,
    initialFetch: () => fetchPostsByUser(userId),
    onInsert: (post) => {
      console.log('새 게시글 추가:', post);
    },
  });

  if (loading) {
    return <LoadingIndicator />;
  }

  return <PostList posts={posts} />;
};
```

---

## Cleanup (구독 해제)

### ❌ Bad - 구독 해제 누락 (메모리 누수)

```typescript
useEffect(() => {
  const channel = supabase.channel('posts').subscribe();
  // cleanup 없음!
}, []);
```

### ✅ Good - 항상 cleanup

```typescript
useEffect(() => {
  const channel = supabase.channel('posts').subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, []);
```

---

## 실전 예제

### 실시간 좋아요 수 표시

```typescript
const usePostLikes = (postId: string) => {
  const [likes, setLikes] = useState(0);

  useEffect(() => {
    // 초기 좋아요 수
    supabase
      .from('post_likes')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', postId)
      .then(({ count }) => setLikes(count || 0));

    // 실시간 구독
    const channel = supabase
      .channel(`post-likes-${postId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'post_likes',
          filter: `post_id=eq.${postId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setLikes((prev) => prev + 1);
          } else if (payload.eventType === 'DELETE') {
            setLikes((prev) => prev - 1);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [postId]);

  return likes;
};

// 사용
const PostItem = ({ post }: { post: Post }) => {
  const likes = usePostLikes(post.id);

  return (
    <View>
      <Text>{post.title}</Text>
      <Text>좋아요: {likes}</Text>
    </View>
  );
};
```

### 실시간 채팅 메시지

```typescript
const useRoomMessages = (roomId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    // 초기 메시지 로드
    supabase
      .from('messages')
      .select('*')
      .eq('room_id', roomId)
      .order('created_at', { ascending: true })
      .then(({ data }) => setMessages(data || []));

    // 실시간 구독
    const channel = supabase
      .channel(`room-${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  return messages;
};
```

---

## 베스트 프랙티스

### ✅ 항상 초기 데이터 + 실시간 구독

```typescript
useEffect(() => {
  // 1. 초기 데이터 로드
  fetchData().then(setData);

  // 2. 실시간 구독
  const channel = supabase.channel('changes').subscribe();

  // 3. Cleanup
  return () => supabase.removeChannel(channel);
}, []);
```

### ✅ 구독 수 최소화

```typescript
// Bad - 각 컴포넌트마다 구독
const PostItem1 = () => {
  useRealtimePosts(); // 구독 1
};
const PostItem2 = () => {
  useRealtimePosts(); // 구독 2
};

// Good - 상위 컴포넌트에서 한 번만 구독
const PostList = () => {
  const posts = useRealtimePosts(); // 구독 1개만

  return posts.map((post) => <PostItem post={post} key={post.id} />);
};
```

### ✅ 필터 사용으로 불필요한 이벤트 제외

```typescript
// 특정 조건만 수신
const channel = supabase
  .channel('filtered')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'posts',
      filter: `user_id=eq.${userId}`, // ✅ 필터 사용
    },
    handleChange
  )
  .subscribe();
```

---

## 참고 자료

- [Supabase Realtime Docs](https://supabase.com/docs/guides/realtime)
- Context7 MCP로 최신 문서 조회:
  ```bash
  mcp__context7__get-library-docs "/supabase/supabase" --topic="realtime"
  ```
