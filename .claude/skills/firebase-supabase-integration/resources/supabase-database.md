# Supabase Database (PostgreSQL)

Supabase PostgreSQL 데이터베이스 사용 가이드입니다.

## 📚 Table of Contents

- [테이블 생성 (with MCP)](#테이블-생성-with-mcp)
- [데이터 조회 (SELECT)](#데이터-조회-select)
- [데이터 삽입 (INSERT)](#데이터-삽입-insert)
- [데이터 수정 (UPDATE)](#데이터-수정-update)
- [데이터 삭제 (DELETE)](#데이터-삭제-delete)
- [Row Level Security (RLS)](#row-level-security-rls)
- [필터링 & 정렬](#필터링--정렬)
- [페이지네이션](#페이지네이션)
- [조인 (JOIN)](#조인-join)

---

## 테이블 생성 (with MCP)

### Supabase MCP로 마이그레이션 적용

```bash
# 테이블 목록 확인
mcp__supabase__list_tables "project-id"

# 마이그레이션으로 테이블 생성
mcp__supabase__apply_migration "project-id" "create_posts_table" "
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS (Row Level Security) 활성화
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- 정책: 자신의 게시글만 조회 가능
CREATE POLICY \"Users can view their own posts\"
  ON posts FOR SELECT
  USING (auth.uid() = user_id);

-- 정책: 자신의 게시글만 생성 가능
CREATE POLICY \"Users can create their own posts\"
  ON posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 정책: 자신의 게시글만 수정 가능
CREATE POLICY \"Users can update their own posts\"
  ON posts FOR UPDATE
  USING (auth.uid() = user_id);

-- 정책: 자신의 게시글만 삭제 가능
CREATE POLICY \"Users can delete their own posts\"
  ON posts FOR DELETE
  USING (auth.uid() = user_id);
"
```

### TypeScript 타입 생성

```bash
# Supabase MCP로 타입 생성
mcp__supabase__generate_typescript_types "project-id"

# 생성된 타입을 types/database.types.ts에 저장
```

```typescript
// lib/supabase.ts
import type { Database } from './types/database.types';

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];

export type Inserts<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];

export type Updates<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];
```

---

## 데이터 조회 (SELECT)

### 모든 데이터 조회

```typescript
import { supabase } from './lib/supabase';
import type { Tables } from './lib/supabase';

type Post = Tables<'posts'>;

const fetchPosts = async (): Promise<Post[]> => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('게시글 조회 실패:', error.message);
    throw error;
  }

  return data;
};
```

### 특정 데이터 조회 (단일)

```typescript
const fetchPost = async (id: string): Promise<Post> => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('게시글 조회 실패:', error.message);
    throw error;
  }

  return data;
};
```

### 특정 컬럼만 조회

```typescript
const fetchPostTitles = async () => {
  const { data, error } = await supabase
    .from('posts')
    .select('id, title, created_at');

  if (error) throw error;
  return data;
};
```

---

## 데이터 삽입 (INSERT)

```typescript
import type { Inserts } from './lib/supabase';

type NewPost = Inserts<'posts'>;

const createPost = async (post: Omit<NewPost, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('posts')
    .insert(post)
    .select()
    .single();

  if (error) {
    console.error('게시글 생성 실패:', error.message);
    throw error;
  }

  return data;
};

// 사용 예시
const handleCreatePost = async () => {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('로그인이 필요합니다.');
  }

  const newPost = await createPost({
    user_id: user.id,
    title: '새 게시글',
    content: '내용입니다.',
    is_public: true,
  });

  console.log('생성된 게시글:', newPost);
};
```

### 여러 개 삽입

```typescript
const createMultiplePosts = async (posts: NewPost[]) => {
  const { data, error } = await supabase
    .from('posts')
    .insert(posts)
    .select();

  if (error) throw error;
  return data;
};
```

---

## 데이터 수정 (UPDATE)

```typescript
import type { Updates } from './lib/supabase';

type PostUpdate = Updates<'posts'>;

const updatePost = async (id: string, updates: PostUpdate) => {
  const { data, error } = await supabase
    .from('posts')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('게시글 수정 실패:', error.message);
    throw error;
  }

  return data;
};

// 사용 예시
await updatePost('post-id', {
  title: '수정된 제목',
  content: '수정된 내용',
  updated_at: new Date().toISOString(),
});
```

---

## 데이터 삭제 (DELETE)

```typescript
const deletePost = async (id: string) => {
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('게시글 삭제 실패:', error.message);
    throw error;
  }

  console.log('게시글 삭제 완료');
};
```

---

## Row Level Security (RLS)

### 보안 정책 (Policies)

```sql
-- 모든 사용자가 공개 게시글 조회 가능
CREATE POLICY "Anyone can view public posts"
  ON posts FOR SELECT
  USING (is_public = true);

-- 자신의 게시글만 수정 가능
CREATE POLICY "Users can update their own posts"
  ON posts FOR UPDATE
  USING (auth.uid() = user_id);

-- 관리자는 모든 게시글 삭제 가능
CREATE POLICY "Admins can delete any post"
  ON posts FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );
```

### Supabase MCP로 보안 권고사항 확인

```bash
# 보안 권고사항 조회
mcp__supabase__get_advisors "project-id" "security"

# 결과 예시:
# - RLS가 비활성화된 테이블 경고
# - 권한이 너무 느슨한 정책 경고
# - 인증되지 않은 접근 허용 경고
```

---

## 필터링 & 정렬

### 필터링

```typescript
// 같음 (eq)
const { data } = await supabase
  .from('posts')
  .select('*')
  .eq('user_id', userId);

// 같지 않음 (neq)
const { data } = await supabase
  .from('posts')
  .select('*')
  .neq('is_public', false);

// 보다 큼 (gt), 보다 크거나 같음 (gte)
const { data } = await supabase
  .from('posts')
  .select('*')
  .gte('created_at', '2024-01-01');

// 보다 작음 (lt), 보다 작거나 같음 (lte)
const { data } = await supabase
  .from('posts')
  .select('*')
  .lte('created_at', '2024-12-31');

// 포함 (in)
const { data } = await supabase
  .from('posts')
  .select('*')
  .in('id', ['id1', 'id2', 'id3']);

// 텍스트 검색 (like, ilike)
const { data } = await supabase
  .from('posts')
  .select('*')
  .ilike('title', '%react%'); // 대소문자 구분 없음
```

### 정렬

```typescript
// 내림차순
const { data } = await supabase
  .from('posts')
  .select('*')
  .order('created_at', { ascending: false });

// 여러 컬럼으로 정렬
const { data } = await supabase
  .from('posts')
  .select('*')
  .order('is_public', { ascending: false })
  .order('created_at', { ascending: false });
```

---

## 페이지네이션

```typescript
const fetchPostsByUser = async (
  userId: string,
  page: number = 0,
  pageSize: number = 10
) => {
  const from = page * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from('posts')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
    .range(from, to)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return {
    data,
    totalCount: count,
    totalPages: count ? Math.ceil(count / pageSize) : 0,
  };
};
```

---

## 조인 (JOIN)

### 외래 키 관계로 조인

```typescript
// posts 테이블과 users 테이블 조인
const { data } = await supabase
  .from('posts')
  .select(`
    *,
    users (
      id,
      email,
      display_name
    )
  `);

// 결과:
// [
//   {
//     id: 'post-id',
//     title: '게시글 제목',
//     users: {
//       id: 'user-id',
//       email: 'user@example.com',
//       display_name: '홍길동'
//     }
//   }
// ]
```

### 다중 조인

```typescript
const { data } = await supabase
  .from('posts')
  .select(`
    *,
    users (
      id,
      display_name
    ),
    comments (
      id,
      content,
      users (
        display_name
      )
    )
  `);
```

---

## N+1 쿼리 문제 방지

### ❌ Bad (N+1 쿼리)

```typescript
// 각 게시글마다 개별 쿼리 실행
for (const post of posts) {
  const { data: user } = await supabase
    .from('users')
    .select('name')
    .eq('id', post.user_id)
    .single();
}
```

### ✅ Good (JOIN 사용)

```typescript
// 한 번에 조회
const { data } = await supabase
  .from('posts')
  .select(`
    *,
    users (
      name
    )
  `);
```

---

## 참고 자료

- [Supabase Database Docs](https://supabase.com/docs/guides/database)
- [PostgREST API Reference](https://postgrest.org/en/stable/api.html)
- Context7 MCP로 최신 문서 조회:
  ```bash
  mcp__context7__get-library-docs "/supabase/supabase" --topic="database"
  ```
