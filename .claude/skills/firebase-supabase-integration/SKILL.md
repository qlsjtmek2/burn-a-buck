---
name: firebase-supabase-integration
description: Firebase and Supabase backend integration for React Native apps. Covers Supabase (authentication, PostgreSQL database with RLS, realtime subscriptions, storage, edge functions) and Firebase (FCM push notifications). Uses Supabase MCP for project management and Context7 MCP for up-to-date documentation. Essential for building BaaS backends, implementing auth flows, real-time features, file uploads, and serverless logic.
version: 2.0.0
type: domain
tags:
  - firebase
  - supabase
  - baas
  - authentication
  - database
  - storage
  - realtime
  - push-notifications
  - fcm
  - edge-functions
  - mcp
---

# Firebase & Supabase Integration Skill

React Native 앱에서 Firebase와 Supabase를 사용하여 백엔드를 구축하는 가이드입니다.

## 🎯 Purpose

이 스킬은 BaaS (Backend as a Service)를 활용하여 인증, 데이터베이스, 스토리지, 실시간 기능을 구현하는 방법을 제공합니다.

**핵심 구성:**
- **Supabase** (메인 백엔드): PostgreSQL, RLS, Edge Functions, Realtime, Storage
- **Firebase** (보조): FCM 푸시 알림 전용

## 🔑 Core Principles

### 1. Supabase 우선, Firebase는 보조

**권장 스택:**
- ✅ Supabase: 메인 백엔드 (PostgreSQL, RLS, Edge Functions)
- ✅ Firebase: 푸시 알림 전용 (FCM)

**이유:**
- PostgreSQL 기반으로 더 강력한 쿼리 지원
- Row Level Security (RLS)로 데이터 보안 강화
- Edge Functions로 서버리스 로직 구현
- 오픈소스이며 벤더 락인 위험 적음

### 2. Supabase MCP 적극 활용

**모든 Supabase 작업 전에 Supabase MCP 사용:**

```bash
# 프로젝트 목록 조회
mcp__supabase__list_projects

# 프로젝트 상세 정보
mcp__supabase__get_project "project-id"

# 테이블 목록 조회
mcp__supabase__list_tables "project-id"

# SQL 실행
mcp__supabase__execute_sql "project-id" "SELECT * FROM users LIMIT 10"

# 마이그레이션 적용
mcp__supabase__apply_migration "project-id" "add_users_table" "CREATE TABLE users (...)"
```

**Supabase MCP 필수 사용 시나리오:**
- ✅ 테이블 생성/수정 (DDL)
- ✅ 데이터 조회/분석
- ✅ Edge Function 배포
- ✅ 보안 권고사항 확인 (get_advisors)
- ✅ TypeScript 타입 생성

### 3. Context7 MCP로 최신 문서 조회

라이브러리 사용 전 Context7 MCP로 최신 API 문서 확인:

```bash
# Supabase 문서 조회
mcp__context7__resolve-library-id "supabase"
mcp__context7__get-library-docs "/supabase/supabase"

# Firebase 문서 조회
mcp__context7__resolve-library-id "firebase"
mcp__context7__get-library-docs "/firebase/firebase-js-sdk"
```

## 🚀 Quick Start

### Supabase 클라이언트 초기화

```bash
# 설치
npm install @supabase/supabase-js @react-native-async-storage/async-storage
```

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = 'https://your-project.supabase.co';
const supabaseAnonKey = 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// TypeScript 타입 생성 (Supabase MCP 사용)
// mcp__supabase__generate_typescript_types "project-id"
// → 생성된 타입을 types/database.types.ts에 저장

import type { Database } from './types/database.types';

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
export type Inserts<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];
export type Updates<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];
```

### Firebase FCM 초기화

```bash
# 설치
npm install @react-native-firebase/app @react-native-firebase/messaging

# iOS: Podfile 업데이트
cd ios && pod install
```

```typescript
import messaging from '@react-native-firebase/messaging';

// FCM 토큰 가져오기
const token = await messaging().getToken();
console.log('FCM Token:', token);
```

## 📖 Navigation Guide

### 구현이 필요한 기능별로 해당 리소스를 참조하세요:

| 필요한 기능 | 참조 문서 |
|------------|-----------|
| 인증 구현 (회원가입, 로그인, 소셜, 세션 관리) | [supabase-auth.md](resources/supabase-auth.md) |
| 데이터베이스 CRUD, RLS 정책 | [supabase-database.md](resources/supabase-database.md) |
| 실시간 구독 (Realtime) | [supabase-realtime.md](resources/supabase-realtime.md) |
| 파일 업로드/다운로드 (Storage) | [supabase-storage.md](resources/supabase-storage.md) |
| 서버리스 로직 (Edge Functions) | [supabase-edge-functions.md](resources/supabase-edge-functions.md) |
| 푸시 알림 (Firebase FCM) | [firebase-fcm.md](resources/firebase-fcm.md) |
| Supabase MCP 사용 방법 | [mcp-workflows.md](resources/mcp-workflows.md) |
| 실전 예제 (소셜 미디어, 채팅 앱) | [examples.md](resources/examples.md) |
| 보안, 성능 주의사항 | [best-practices.md](resources/best-practices.md) |

## 🔧 Supabase MCP 치트시트

### 프로젝트 관리
```bash
mcp__supabase__list_projects                          # 프로젝트 목록
mcp__supabase__get_project "project-id"               # 프로젝트 상세
mcp__supabase__get_project_url "project-id"           # API URL
mcp__supabase__get_anon_key "project-id"              # Anon Key
```

### 데이터베이스
```bash
mcp__supabase__list_tables "project-id"               # 테이블 목록
mcp__supabase__execute_sql "project-id" "query"       # SQL 실행
mcp__supabase__apply_migration "project-id" "name" "query"  # 마이그레이션
mcp__supabase__generate_typescript_types "project-id"       # 타입 생성
```

### Edge Functions
```bash
mcp__supabase__list_edge_functions "project-id"       # 함수 목록
mcp__supabase__deploy_edge_function "project-id" "name" [files]  # 배포
```

### 보안 & 모니터링
```bash
mcp__supabase__get_advisors "project-id" "security"   # 보안 권고
mcp__supabase__get_logs "project-id" "api"            # API 로그
```

## 📚 Related Skills

- **state-management-mobile** - React Query와 Zustand를 사용한 상태 관리
- **error-tracking** - Sentry를 사용한 오류 추적
- **react-native-guidelines** - React Native 개발 베스트 프랙티스

---

**Skill Status**: COMPLETE - Progressive disclosure with 9 resource files ✅
**Line Count**: ~270 lines (under 500-line rule) ✅
**Version**: 2.0.0 - Complete restructure with correct resources ✅
