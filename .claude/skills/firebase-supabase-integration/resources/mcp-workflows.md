# Supabase MCP Workflows

Supabase MCP를 사용한 워크플로우 가이드입니다.

## 📚 Table of Contents

- [MCP 기본 사용법](#mcp-기본-사용법)
- [프로젝트 관리](#프로젝트-관리)
- [데이터베이스 작업](#데이터베이스-작업)
- [Edge Functions 관리](#edge-functions-관리)
- [보안 & 모니터링](#보안--모니터링)
- [브랜치 관리](#브랜치-관리)

---

## MCP 기본 사용법

### Supabase MCP란?

Supabase MCP (Model Context Protocol)는 Claude가 Supabase 프로젝트를 관리할 수 있게 해주는 도구입니다.

**주요 기능:**
- 프로젝트 조회 및 관리
- 데이터베이스 테이블 조회 및 SQL 실행
- Edge Function 배포 및 관리
- 보안 권고사항 확인
- 로그 조회
- TypeScript 타입 생성

---

## 프로젝트 관리

### 프로젝트 목록 조회

```bash
mcp__supabase__list_projects
```

**결과:**
```json
[
  {
    "id": "abc123",
    "name": "my-app",
    "organization_id": "org-123",
    "region": "us-east-1",
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

### 프로젝트 상세 정보

```bash
mcp__supabase__get_project "project-id"
```

**결과:**
```json
{
  "id": "project-id",
  "name": "my-app",
  "status": "ACTIVE_HEALTHY",
  "database": {
    "host": "db.xxx.supabase.co",
    "port": 5432
  }
}
```

### API URL 및 Key 가져오기

```bash
# API URL
mcp__supabase__get_project_url "project-id"

# Anon Key
mcp__supabase__get_anon_key "project-id"
```

---

## 데이터베이스 작업

### 테이블 목록 조회

```bash
# 모든 스키마의 테이블
mcp__supabase__list_tables "project-id"

# 특정 스키마만
mcp__supabase__list_tables "project-id" --schemas public
```

**결과:**
```json
[
  {
    "schema": "public",
    "name": "users",
    "columns": [
      { "name": "id", "type": "uuid" },
      { "name": "email", "type": "text" }
    ]
  }
]
```

### SQL 실행

```bash
mcp__supabase__execute_sql "project-id" "SELECT * FROM users LIMIT 10"
```

**결과:**
```json
[
  { "id": "user-1", "email": "user1@example.com" },
  { "id": "user-2", "email": "user2@example.com" }
]
```

### 마이그레이션 적용

```bash
mcp__supabase__apply_migration "project-id" "create_posts_table" "
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS 활성화
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- 정책: 자신의 게시글만 조회 가능
CREATE POLICY \"Users can view their own posts\"
  ON posts FOR SELECT
  USING (auth.uid() = user_id);
"
```

### TypeScript 타입 생성

```bash
mcp__supabase__generate_typescript_types "project-id"
```

**결과:**
```typescript
export interface Database {
  public: {
    Tables: {
      posts: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          content: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          content?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          content?: string | null;
          created_at?: string;
        };
      };
    };
  };
}
```

---

## Edge Functions 관리

### Edge Function 목록 조회

```bash
mcp__supabase__list_edge_functions "project-id"
```

**결과:**
```json
[
  {
    "id": "func-123",
    "name": "send-email",
    "version": 1,
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

### Edge Function 코드 조회

```bash
mcp__supabase__get_edge_function "project-id" "send-email"
```

### Edge Function 배포

```bash
mcp__supabase__deploy_edge_function "project-id" "hello" [
  {
    "name": "index.ts",
    "content": "
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

serve(async (req) => {
  const { name } = await req.json();
  return new Response(
    JSON.stringify({ message: \`Hello, \${name}!\` }),
    { headers: { 'Content-Type': 'application/json' } }
  );
});
    "
  }
]
```

---

## 보안 & 모니터링

### 보안 권고사항 확인

```bash
# 보안 권고
mcp__supabase__get_advisors "project-id" "security"

# 성능 권고
mcp__supabase__get_advisors "project-id" "performance"
```

**결과:**
```json
[
  {
    "name": "unprotected_table",
    "title": "RLS가 비활성화된 테이블",
    "description": "posts 테이블에 RLS가 활성화되지 않았습니다.",
    "level": "WARNING",
    "remediation": "https://supabase.com/docs/guides/auth/row-level-security"
  }
]
```

### 로그 조회

```bash
# API 로그
mcp__supabase__get_logs "project-id" "api"

# Edge Function 로그
mcp__supabase__get_logs "project-id" "edge-function"

# Auth 로그
mcp__supabase__get_logs "project-id" "auth"

# Postgres 로그
mcp__supabase__get_logs "project-id" "postgres"
```

---

## 브랜치 관리

### 개발 브랜치 생성

```bash
# 비용 확인
mcp__supabase__get_cost "project" "organization-id"

# 비용 승인
mcp__supabase__confirm_cost "branch" "hourly" 0.01344

# 브랜치 생성
mcp__supabase__create_branch "project-id" "confirm-cost-id"
```

### 브랜치 목록 조회

```bash
mcp__supabase__list_branches "project-id"
```

### 브랜치 병합

```bash
mcp__supabase__merge_branch "branch-id"
```

### 브랜치 리셋

```bash
mcp__supabase__reset_branch "branch-id" "migration-version"
```

### 브랜치 삭제

```bash
mcp__supabase__delete_branch "branch-id"
```

---

## 실전 워크플로우

### 워크플로우 1: 새 기능 개발

```bash
# 1. 프로젝트 ID 확인
mcp__supabase__list_projects

# 2. 현재 테이블 구조 확인
mcp__supabase__list_tables "project-id"

# 3. 새 테이블 생성 (마이그레이션)
mcp__supabase__apply_migration "project-id" "add_comments_table" "
CREATE TABLE comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY \"Users can view all comments\"
  ON comments FOR SELECT
  USING (true);

CREATE POLICY \"Users can create comments\"
  ON comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);
"

# 4. TypeScript 타입 갱신
mcp__supabase__generate_typescript_types "project-id"

# 5. 보안 권고사항 확인
mcp__supabase__get_advisors "project-id" "security"

# 6. 테스트 데이터 삽입
mcp__supabase__execute_sql "project-id" "
INSERT INTO comments (post_id, user_id, content)
SELECT
  posts.id,
  posts.user_id,
  'Test comment'
FROM posts
LIMIT 1;
"

# 7. 데이터 확인
mcp__supabase__execute_sql "project-id" "SELECT * FROM comments LIMIT 10"
```

### 워크플로우 2: Edge Function 배포 및 테스트

```bash
# 1. Edge Function 목록 확인
mcp__supabase__list_edge_functions "project-id"

# 2. Edge Function 배포
mcp__supabase__deploy_edge_function "project-id" "send-email" [
  {
    "name": "index.ts",
    "content": "..."
  }
]

# 3. Edge Function 로그 확인
mcp__supabase__get_logs "project-id" "edge-function"

# 4. API 로그 확인 (클라이언트 호출 후)
mcp__supabase__get_logs "project-id" "api"
```

### 워크플로우 3: 데이터베이스 분석 및 최적화

```bash
# 1. 성능 권고사항 확인
mcp__supabase__get_advisors "project-id" "performance"

# 2. 느린 쿼리 분석
mcp__supabase__execute_sql "project-id" "
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan ASC
LIMIT 10;
"

# 3. 인덱스 생성 (필요 시)
mcp__supabase__apply_migration "project-id" "add_index_posts_user_id" "
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
"

# 4. Postgres 로그 확인
mcp__supabase__get_logs "project-id" "postgres"
```

---

## 베스트 프랙티스

### ✅ 항상 프로젝트 ID 먼저 확인

```bash
# Bad - 프로젝트 ID를 외워서 사용
mcp__supabase__list_tables "abc123"

# Good - 먼저 프로젝트 목록 확인
mcp__supabase__list_projects
# → 결과에서 올바른 project-id 확인
mcp__supabase__list_tables "correct-project-id"
```

### ✅ DDL은 마이그레이션으로

```bash
# Bad - execute_sql로 DDL 실행
mcp__supabase__execute_sql "project-id" "CREATE TABLE ..."

# Good - apply_migration 사용
mcp__supabase__apply_migration "project-id" "migration_name" "CREATE TABLE ..."
```

### ✅ 보안 권고사항 정기 확인

```bash
# 중요한 변경 후 항상 확인
mcp__supabase__apply_migration "project-id" "..." "..."
mcp__supabase__get_advisors "project-id" "security"
```

### ✅ TypeScript 타입 갱신

```bash
# 테이블 변경 후 타입 갱신
mcp__supabase__apply_migration "project-id" "..." "..."
mcp__supabase__generate_typescript_types "project-id"
# → 생성된 타입을 types/database.types.ts에 저장
```

---

## 참고 자료

- [Supabase MCP GitHub](https://github.com/supabase/mcp-server-supabase)
- [Supabase CLI Docs](https://supabase.com/docs/guides/cli)
