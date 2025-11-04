# Supabase 설정 가이드

이 가이드는 "천원 쓰레기통" 앱의 Supabase 백엔드를 설정하는 방법을 안내합니다.

## 📋 사전 준비

1. Supabase 계정 생성: https://supabase.com
2. 새 프로젝트 생성

## 🚀 Step 1: Supabase 프로젝트 생성

### 1.1 프로젝트 생성

1. Supabase 대시보드 접속: https://app.supabase.com
2. "New Project" 클릭
3. 프로젝트 정보 입력:
   - **Name**: `burn-a-buck` (또는 원하는 이름)
   - **Database Password**: 강력한 비밀번호 생성 (저장 필수!)
   - **Region**: `Northeast Asia (Seoul)` 권장
   - **Pricing Plan**: Free (개발 단계)

4. "Create new project" 클릭 (생성까지 약 2-3분 소요)

### 1.2 API 키 확인

프로젝트 생성 완료 후:

1. 좌측 메뉴에서 **Settings** > **API** 클릭
2. 다음 정보 확인 및 복사:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

⚠️ **주의**: `service_role` 키는 서버에서만 사용하며, 클라이언트 앱에 노출하면 안 됩니다!

## 🔑 Step 2: 환경 변수 설정

### 2.1 .env 파일 생성

프로젝트 루트에 `.env` 파일을 생성합니다:

```bash
# 프로젝트 루트에서 실행
cp .env.example .env
```

### 2.2 환경 변수 입력

`.env` 파일을 열고 Supabase 정보를 입력합니다:

```env
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Google Play In-App Purchase
# Product ID: donate_1000won (to be configured in Google Play Console)
```

**중요 사항:**
- Expo는 `EXPO_PUBLIC_` 접두사가 붙은 환경 변수만 클라이언트에서 접근 가능합니다
- `.env` 파일은 `.gitignore`에 포함되어 있어 Git에 커밋되지 않습니다
- 팀원과 공유 시 별도의 보안 채널(1Password, Bitwarden 등) 사용

### 2.3 환경 변수 확인

앱을 재시작하여 환경 변수가 올바르게 로드되는지 확인:

```bash
npm start
```

## 🗄️ Step 3: 데이터베이스 스키마 생성

### 3.1 SQL Editor에서 마이그레이션 실행

1. Supabase 대시보드에서 **SQL Editor** 클릭
2. "New query" 클릭
3. 다음 마이그레이션 파일들을 순서대로 실행:

#### 📄 1. 초기 스키마 생성

`supabase/migrations/001_initial_schema.sql` 파일 내용을 복사하여 실행

#### 📄 2. RLS 정책 적용

`supabase/migrations/002_rls_policies.sql` 파일 내용을 복사하여 실행

#### 📄 3. 인덱스 및 함수 생성

`supabase/migrations/003_indexes_and_functions.sql` 파일 내용을 복사하여 실행

### 3.2 테이블 확인

1. 좌측 메뉴에서 **Table Editor** 클릭
2. 다음 테이블이 생성되었는지 확인:
   - ✅ `users` (사용자)
   - ✅ `donations` (기부 내역)

3. 좌측 메뉴에서 **Database** > **Views** 클릭
4. 다음 뷰가 생성되었는지 확인:
   - ✅ `leaderboard` (리더보드)

## 🔒 Step 4: RLS (Row Level Security) 정책 확인

### 4.1 RLS 활성화 확인

1. **Table Editor** > `users` 테이블 선택
2. 우측 상단 "RLS" 토글이 **활성화**되어 있는지 확인
3. `donations` 테이블도 동일하게 확인

### 4.2 정책 확인

1. **Authentication** > **Policies** 클릭
2. 각 테이블에 다음 정책이 적용되었는지 확인:

**users 테이블:**
- ✅ `Anyone can read users` (SELECT)
- ✅ `Authenticated users can insert` (INSERT)
- ✅ `Users can update own data` (UPDATE)

**donations 테이블:**
- ✅ `Anyone can read donations` (SELECT)
- ✅ `Authenticated users can insert` (INSERT)

## 🧪 Step 5: 데이터베이스 테스트

### 5.1 샘플 데이터 삽입 (선택사항)

SQL Editor에서 다음 쿼리 실행:

```sql
-- 테스트 사용자 생성
INSERT INTO users (nickname, total_donated, first_donation_at, last_donation_at, badge_earned)
VALUES
  ('테스터1', 5000, NOW(), NOW(), true),
  ('테스터2', 3000, NOW(), NOW(), false),
  ('테스터3', 1000, NOW(), NOW(), false);

-- 테스트 기부 내역 생성
INSERT INTO donations (user_id, nickname, amount, receipt_token)
SELECT
  u.id,
  u.nickname,
  1000,
  'test_receipt_' || u.nickname
FROM users u;
```

### 5.2 리더보드 조회

```sql
SELECT * FROM leaderboard LIMIT 10;
```

예상 결과:
```
nickname | total_donated | rank | last_donation_at
---------|---------------|------|------------------
테스터1   | 5000          | 1    | 2025-11-03 ...
테스터2   | 3000          | 2    | 2025-11-03 ...
테스터3   | 1000          | 3    | 2025-11-03 ...
```

## 🔌 Step 6: 앱에서 연결 테스트

### 6.1 Supabase 클라이언트 초기화 확인

`src/services/supabase.ts` 파일이 생성되었는지 확인

### 6.2 연결 테스트

앱을 실행하고 다음 코드로 연결 테스트:

```typescript
import { supabase } from '@/services/supabase';

// 리더보드 조회 테스트
const { data, error } = await supabase
  .from('leaderboard')
  .select('*')
  .limit(10);

console.log('Leaderboard:', data);
```

## 📊 Step 7: TypeScript 타입 생성 (선택사항)

Supabase CLI를 사용하여 TypeScript 타입을 자동 생성할 수 있습니다:

```bash
# Supabase CLI 설치
npm install -g supabase

# 로그인
supabase login

# 프로젝트 연결
supabase link --project-ref xxxxx

# 타입 생성
supabase gen types typescript --project-id xxxxx > src/types/database.types.ts
```

## ✅ 체크리스트

설정 완료 후 다음 항목들을 확인하세요:

- [ ] Supabase 프로젝트 생성 완료
- [ ] `.env` 파일에 환경 변수 설정
- [ ] `users` 테이블 생성 및 RLS 활성화
- [ ] `donations` 테이블 생성 및 RLS 활성화
- [ ] `leaderboard` 뷰 생성
- [ ] RLS 정책 적용 (읽기: 모두, 쓰기: 인증된 사용자)
- [ ] 샘플 데이터로 테스트 완료
- [ ] 앱에서 Supabase 연결 성공

## 🚨 문제 해결

### 환경 변수가 로드되지 않음

```bash
# 앱 완전히 재시작
npm start -- --clear
```

### RLS 정책 오류

- SQL Editor에서 `002_rls_policies.sql` 재실행
- 각 테이블의 RLS 토글이 활성화되어 있는지 확인

### 연결 실패

- `.env` 파일의 URL과 Key가 올바른지 확인
- Supabase 프로젝트가 활성 상태인지 확인 (대시보드에서)

## 📚 참고 자료

- Supabase 공식 문서: https://supabase.com/docs
- React Native 가이드: https://supabase.com/docs/guides/getting-started/quickstarts/react-native
- RLS 가이드: https://supabase.com/docs/guides/auth/row-level-security

---

**다음 단계**: Phase 3 - Google Play In-App Purchase 통합
