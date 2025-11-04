# 마이그레이션 가이드: user_id 제거

## 개요

이 마이그레이션은 `user_id` 컬럼을 제거하고 `nickname` 기반 구조로 전환합니다.

**이유**: 앱에 로그인 기능이 없으므로 user_id가 불필요합니다. 모든 사용자는 익명이며, nickname으로만 식별됩니다.

**작업 일자**: 2025-11-05

---

## ⚠️ 주의사항

### 백업 필수
마이그레이션 전 **반드시 데이터베이스 백업**을 수행하세요:
```sql
-- Supabase Dashboard > Database > Backups
-- 또는 SQL Editor에서:
SELECT * FROM users;
SELECT * FROM donations;
```

### 영향 범위
- ✅ **donations 테이블**: `user_id` 컬럼 제거
- ✅ **leaderboard 뷰**: `nickname` 기반으로 재생성
- ✅ **트리거**: `nickname` 기반으로 업데이트
- ✅ **RLS 정책**: 익명 사용자 허용

### 다운타임
- 마이그레이션 중 약 **1-2분** 예상
- 앱 사용자는 마이그레이션 완료 후 정상 사용 가능

---

## 마이그레이션 실행 순서

### Step 1: Supabase 대시보드 접속
1. https://app.supabase.com 접속
2. 프로젝트 선택: `burn-a-buck`
3. 좌측 메뉴 > **SQL Editor** 클릭

### Step 2: 마이그레이션 004 실행
1. "New query" 클릭
2. 파일 열기: `supabase/migrations/004_remove_user_id.sql`
3. 전체 내용 복사하여 붙여넣기
4. **Run** 버튼 클릭
5. 결과 확인: "Success. No rows returned"

**예상 소요 시간**: 10-20초

### Step 3: 마이그레이션 005 실행
1. "New query" 클릭
2. 파일 열기: `supabase/migrations/005_update_rls_for_anonymous.sql`
3. 전체 내용 복사하여 붙여넣기
4. **Run** 버튼 클릭
5. 결과 확인: "Success. No rows returned"

**예상 소요 시간**: 5-10초

### Step 4: 검증
다음 쿼리로 마이그레이션 성공 여부 확인:

```sql
-- 1. donations 테이블에 user_id 컬럼이 없는지 확인
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'donations';
-- ✅ user_id가 목록에 없어야 함

-- 2. leaderboard 뷰 확인
SELECT * FROM leaderboard LIMIT 5;
-- ✅ 정상적으로 조회되어야 함

-- 3. RLS 정책 확인
SELECT policyname, cmd, permissive
FROM pg_policies
WHERE tablename = 'donations';
-- ✅ "Anyone can insert donations" 정책이 있어야 함

-- 4. 트리거 작동 테스트 (테스트 기부)
INSERT INTO donations (nickname, amount, receipt_token, platform)
VALUES ('테스트유저', 1000, 'test_receipt_' || NOW()::text, 'google_play');

-- users 테이블 확인 (자동 생성되어야 함)
SELECT * FROM users WHERE nickname = '테스트유저';
-- ✅ total_donated = 1000, badge_earned = true

-- 테스트 데이터 삭제
DELETE FROM donations WHERE nickname = '테스트유저';
DELETE FROM users WHERE nickname = '테스트유저';
```

---

## 변경 사항 요약

### 데이터베이스 스키마

#### Before
```sql
CREATE TABLE donations (
  id UUID,
  user_id UUID REFERENCES users(id),  -- ❌ 제거됨
  nickname VARCHAR(12),
  amount INTEGER,
  receipt_token TEXT,
  platform VARCHAR(20),
  created_at TIMESTAMP
);
```

#### After
```sql
CREATE TABLE donations (
  id UUID,
  nickname VARCHAR(12),  -- ✅ 단독 식별자
  amount INTEGER,
  receipt_token TEXT,
  platform VARCHAR(20),
  transaction_id TEXT,   -- ✅ 추가
  created_at TIMESTAMP
);

-- 인덱스 추가 (성능 최적화)
CREATE INDEX idx_donations_nickname ON donations(nickname);
```

### 트리거 함수

#### Before
```sql
UPDATE users
SET ...
WHERE id = NEW.user_id;  -- ❌ user_id 사용
```

#### After
```sql
UPDATE users
SET ...
WHERE nickname = NEW.nickname;  -- ✅ nickname 사용

-- users 테이블에 없으면 자동 생성
IF NOT FOUND THEN
  INSERT INTO users (nickname, total_donated, ...)
  VALUES (NEW.nickname, NEW.amount, ...);
END IF;
```

### RLS 정책

#### Before
```sql
-- 인증된 사용자만 INSERT 가능
CREATE POLICY "Authenticated users can insert donations"
  ON donations FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');  -- ❌ 제한적
```

#### After
```sql
-- 누구나 INSERT 가능 (익명 포함)
CREATE POLICY "Anyone can insert donations"
  ON donations FOR INSERT
  WITH CHECK (true);  -- ✅ 익명 허용
```

---

## 코드 변경 사항

### 서비스 레이어

#### userService.ts
```typescript
// Before
export const getUserById = async (userId: string): Promise<User | null>
export const updateUser = async (userId: string, updates: UserUpdate)
export const getUserRank = async (userId: string)

// After
export const getUserByNickname = async (nickname: string): Promise<User | null>  // ✅ 주요 메서드
export const updateUser = async (nickname: string, updates: UserUpdate)
export const getUserRank = async (nickname: string)
```

#### donationService.ts
```typescript
// Before
export const getUserDonations = async (userId: string)
export const isFirstDonation = async (userId: string)

// After
export const getUserDonations = async (nickname: string)
export const isFirstDonation = async (nickname: string)
```

#### payment.native.ts
```typescript
// Before
private async checkFirstDonation(): Promise<boolean> {
  // user_id로 조회
  const { data: { user } } = await supabase.auth.getUser();
  const { data } = await supabase.from('donations').eq('user_id', user.id)
}

// After
private async checkFirstDonation(nickname: string): Promise<boolean> {
  // nickname으로 조회 (인증 불필요)
  const { data } = await supabase.from('donations').eq('nickname', nickname)
}
```

---

## 롤백 방법

마이그레이션 실패 시 다음 SQL로 롤백:

```sql
-- Step 1: 트리거 제거
DROP TRIGGER IF EXISTS trigger_update_user_donation_stats ON donations;
DROP FUNCTION IF EXISTS update_user_donation_stats();

-- Step 2: 뷰 제거
DROP VIEW IF EXISTS leaderboard;

-- Step 3: user_id 컬럼 복원
ALTER TABLE donations ADD COLUMN user_id UUID REFERENCES users(id) ON DELETE SET NULL;

-- Step 4: 001_initial_schema.sql 재실행
-- (원본 스키마 복원)
```

⚠️ **주의**: 롤백 후에는 기존 코드도 함께 롤백해야 합니다!

---

## 테스트 체크리스트

마이그레이션 완료 후 다음 항목을 테스트하세요:

### 백엔드 테스트
- [ ] donations 테이블에 user_id 컬럼이 없음
- [ ] leaderboard 뷰 정상 작동
- [ ] 트리거로 users 테이블 자동 생성/업데이트
- [ ] RLS 정책으로 익명 INSERT 가능

### 앱 테스트
- [ ] 신규 사용자 첫 후원 → 배지 표시
- [ ] 신규 사용자 두 번째 후원 → 일반 메시지
- [ ] 기존 사용자 후원 → 일반 메시지
- [ ] 명예의 전당 표시 정상
- [ ] 최근 기부 목록 표시 정상

### 성능 테스트
- [ ] `idx_donations_nickname` 인덱스 사용 확인
- [ ] leaderboard 쿼리 속도 측정

---

## 문제 해결

### 문제 1: "column user_id does not exist"
**원인**: 코드가 아직 업데이트되지 않음
**해결**: 최신 코드로 업데이트 (`git pull`) 후 재시작

### 문제 2: "permission denied for table donations"
**원인**: RLS 정책이 올바르게 설정되지 않음
**해결**: `005_update_rls_for_anonymous.sql` 재실행

### 문제 3: "트리거가 작동하지 않음"
**원인**: 트리거 함수 생성 실패
**해결**: `004_remove_user_id.sql` 재실행

---

## 추가 정보

- **관련 이슈**: #N/A
- **담당자**: Developer
- **검토자**: N/A
- **승인자**: N/A

---

**마이그레이션 완료 후 이 파일을 문서 아카이브에 보관하세요.**
