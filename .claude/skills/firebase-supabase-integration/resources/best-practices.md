# Best Practices & 주의사항

Firebase와 Supabase 사용 시 베스트 프랙티스와 주의사항입니다.

## 📚 Table of Contents

- [보안](#보안)
- [성능](#성능)
- [실시간 구독](#실시간-구독)
- [에러 처리](#에러-처리)
- [타입 안전성](#타입-안전성)

---

## 보안

### ❌ Bad - Anon Key로 민감한 작업

```typescript
// Bad - 클라이언트에서 직접 관리자 작업
await supabase.from('users').delete().eq('id', userId);
```

**문제점:**
- Anon Key는 RLS 정책의 제약을 받음
- 직접 삭제는 보안 위험

### ✅ Good - RLS + Edge Function 사용

```typescript
// Good - Edge Function에서 권한 확인 후 삭제
await supabase.functions.invoke('delete-user', { body: { userId } });
```

**장점:**
- 서버 사이드에서 권한 검증
- Service Role Key 사용으로 RLS 우회 가능
- 비즈니스 로직 중앙 집중화

---

### ✅ Row Level Security (RLS) 필수

```sql
-- Bad - RLS 없음
CREATE TABLE posts (
  id UUID PRIMARY KEY,
  content TEXT
);

-- Good - RLS 활성화
CREATE TABLE posts (
  id UUID PRIMARY KEY,
  content TEXT
);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own posts"
  ON posts FOR SELECT
  USING (auth.uid() = user_id);
```

**체크리스트:**
- [ ] 모든 테이블에 RLS 활성화
- [ ] 적절한 정책 설정 (SELECT, INSERT, UPDATE, DELETE)
- [ ] Supabase MCP로 보안 권고사항 정기 확인

```bash
mcp__supabase__get_advisors "project-id" "security"
```

---

### ✅ 환경 변수로 민감한 정보 관리

```typescript
// Bad - 하드코딩
const supabaseUrl = 'https://abc123.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI...';

// Good - 환경 변수 사용
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;
```

**.env 파일:**
```bash
EXPO_PUBLIC_SUPABASE_URL=https://abc123.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI...
```

---

## 성능

### ❌ Bad - N+1 쿼리

```typescript
// Bad - 반복 쿼리
for (const post of posts) {
  const { data: user } = await supabase
    .from('users')
    .select('name')
    .eq('id', post.user_id)
    .single();

  console.log(user.name);
}
```

**문제점:**
- N개의 게시글 → N번의 쿼리
- 네트워크 오버헤드 증가
- 느린 응답 시간

### ✅ Good - JOIN 사용

```typescript
// Good - 한 번에 조회
const { data } = await supabase
  .from('posts')
  .select(`
    *,
    users (
      name,
      avatar_url
    )
  `);
```

**장점:**
- 단일 쿼리로 모든 데이터 조회
- 네트워크 요청 최소화
- 빠른 응답 시간

---

### ✅ 페이지네이션 사용

```typescript
// Bad - 모든 데이터 한 번에 로드
const { data } = await supabase
  .from('posts')
  .select('*');

// Good - 페이지네이션
const { data } = await supabase
  .from('posts')
  .select('*')
  .range(0, 9) // 0-9번째 레코드 (10개)
  .order('created_at', { ascending: false });
```

---

### ✅ 인덱스 생성

```sql
-- 자주 조회/필터링하는 컬럼에 인덱스 생성
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_posts_composite ON posts(user_id, created_at DESC);
```

**인덱스가 필요한 경우:**
- WHERE 절에서 자주 사용되는 컬럼
- JOIN에 사용되는 외래 키
- ORDER BY에 사용되는 컬럼

---

## 실시간 구독

### ❌ Bad - 구독 해제 누락 (메모리 누수)

```typescript
useEffect(() => {
  const channel = supabase
    .channel('posts')
    .on('postgres_changes', {...}, handleChange)
    .subscribe();

  // cleanup 없음! ❌
}, []);
```

**문제점:**
- 컴포넌트 언마운트 시 구독이 계속 유지
- 메모리 누수 발생
- 불필요한 네트워크 연결 유지

### ✅ Good - 항상 cleanup

```typescript
useEffect(() => {
  const channel = supabase
    .channel('posts')
    .on('postgres_changes', {...}, handleChange)
    .subscribe();

  return () => {
    supabase.removeChannel(channel); // ✅ cleanup
  };
}, []);
```

---

### ✅ 구독 수 최소화

```typescript
// Bad - 각 컴포넌트마다 구독
const PostItem1 = () => {
  useRealtimePosts(); // 구독 1
};
const PostItem2 = () => {
  useRealtimePosts(); // 구독 2
};
const PostItem3 = () => {
  useRealtimePosts(); // 구독 3
};

// Good - 상위 컴포넌트에서 한 번만 구독
const PostList = () => {
  const posts = useRealtimePosts(); // 구독 1개만

  return posts.map((post) => <PostItem post={post} key={post.id} />);
};
```

---

### ✅ 필터 사용으로 불필요한 이벤트 제외

```typescript
// Bad - 모든 변경사항 수신
const channel = supabase
  .channel('all-posts')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'posts',
    },
    handleChange
  )
  .subscribe();

// Good - 특정 조건만 수신
const channel = supabase
  .channel('my-posts')
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

## 에러 처리

### ✅ Supabase 에러 메시지 처리

```typescript
const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // Supabase 에러 메시지를 사용자 친화적으로 변환
    if (error.message.includes('Invalid login credentials')) {
      throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
    } else if (error.message.includes('Email not confirmed')) {
      throw new Error('이메일 인증이 필요합니다.');
    }
    throw error;
  }

  return data;
};
```

---

### ✅ try-catch로 에러 처리

```typescript
const handleCreatePost = async () => {
  try {
    const post = await createPost({
      title: '새 게시글',
      content: '내용',
    });

    Alert.alert('성공', '게시글이 생성되었습니다.');
  } catch (error) {
    console.error('게시글 생성 실패:', error);
    Alert.alert('오류', error.message || '알 수 없는 오류가 발생했습니다.');
  }
};
```

---

### ✅ 로딩 상태 관리

```typescript
const LoginScreen = () => {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await signIn(email, password);
      // 로그인 성공
    } catch (error) {
      Alert.alert('로그인 실패', error.message);
    } finally {
      setLoading(false); // ✅ 항상 로딩 상태 해제
    }
  };

  return (
    <Button
      title="로그인"
      onPress={handleLogin}
      disabled={loading} // ✅ 로딩 중 버튼 비활성화
    />
  );
};
```

---

## 타입 안전성

### ✅ TypeScript 타입 생성

```bash
# Supabase MCP로 타입 생성
mcp__supabase__generate_typescript_types "project-id"

# 생성된 타입을 types/database.types.ts에 저장
```

### ✅ 타입 사용

```typescript
import type { Database } from './types/database.types';

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];

export type Inserts<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];

export type Updates<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];

// 사용 예시
type Post = Tables<'posts'>;
type NewPost = Inserts<'posts'>;
type PostUpdate = Updates<'posts'>;

const createPost = async (post: Omit<NewPost, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('posts')
    .insert(post)
    .select()
    .single();

  if (error) throw error;
  return data as Post; // ✅ 타입 안전
};
```

---

## 기타 베스트 프랙티스

### ✅ AsyncStorage 사용 (세션 저장)

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage, // ✅ 세션 저장
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```

---

### ✅ Edge Function에서 Service Role Key 보호

```typescript
// Edge Function
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  // ✅ 환경 변수에서 Service Role Key 가져오기
  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '', // ✅ Service Role Key
  );

  // 비즈니스 로직
});
```

---

### ✅ 파일 크기 제한 (Storage)

```typescript
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const uploadImage = async (uri: string) => {
  const response = await fetch(uri);
  const blob = await response.blob();

  if (blob.size > MAX_FILE_SIZE) {
    throw new Error('파일 크기는 5MB를 초과할 수 없습니다.');
  }

  // 업로드 진행
};
```

---

### ✅ 이미지 압축 (Storage)

```typescript
import * as ImageManipulator from 'expo-image-manipulator';

const compressAndUpload = async (uri: string) => {
  // 이미지 압축
  const manipResult = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: 1024 } }],
    { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
  );

  // 압축된 이미지 업로드
  const response = await fetch(manipResult.uri);
  const blob = await response.blob();

  const { data, error } = await supabase.storage
    .from('photos')
    .upload(path, blob);

  if (error) throw error;
  return data;
};
```

---

## 보안 체크리스트

- [ ] 모든 테이블에 RLS 활성화
- [ ] 적절한 RLS 정책 설정
- [ ] 환경 변수로 민감한 정보 관리
- [ ] Service Role Key를 클라이언트에 노출하지 않음
- [ ] Edge Function에서만 Service Role Key 사용
- [ ] Supabase MCP로 보안 권고사항 정기 확인

```bash
mcp__supabase__get_advisors "project-id" "security"
```

---

## 성능 체크리스트

- [ ] N+1 쿼리 방지 (JOIN 사용)
- [ ] 페이지네이션 구현
- [ ] 자주 조회하는 컬럼에 인덱스 생성
- [ ] 실시간 구독 수 최소화
- [ ] 구독 필터 사용
- [ ] 파일 크기 제한 및 압축

---

## 참고 자료

- [Supabase Best Practices](https://supabase.com/docs/guides/platform/best-practices)
- [PostgreSQL Performance Tips](https://wiki.postgresql.org/wiki/Performance_Optimization)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
