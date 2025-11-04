# Supabase 백엔드 설정

"천원 쓰레기통" 앱의 Supabase 백엔드 설정 파일 모음입니다.

## 📁 디렉토리 구조

```
supabase/
├── README.md                          # 이 파일
├── SETUP_GUIDE.md                     # 상세 설정 가이드
└── migrations/                        # 데이터베이스 마이그레이션
    ├── 001_initial_schema.sql         # 초기 스키마 (테이블, 뷰, 트리거)
    ├── 002_rls_policies.sql           # RLS 정책 설정
    └── 003_indexes_and_functions.sql  # 인덱스 및 헬퍼 함수
```

## 🚀 빠른 시작

### 1. Supabase 프로젝트 생성

1. https://app.supabase.com 접속
2. "New Project" 클릭
3. 프로젝트 이름: `burn-a-buck`
4. Region: `Northeast Asia (Seoul)`
5. 생성 완료 대기 (2-3분)

### 2. 환경 변수 설정

```bash
# 프로젝트 루트에서
cp .env.example .env
```

`.env` 파일 편집:
```env
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. 마이그레이션 실행

Supabase 대시보드 > SQL Editor에서 다음 순서대로 실행:

1. **001_initial_schema.sql** - 테이블 및 뷰 생성
2. **002_rls_policies.sql** - 보안 정책 적용
3. **003_indexes_and_functions.sql** - 인덱스 및 함수 생성

### 4. 연결 테스트

앱에서 Supabase 연결 테스트:

```typescript
import { testSupabaseConnection } from '@/services/supabase';

const isConnected = await testSupabaseConnection();
console.log('Supabase connected:', isConnected);
```

## 📊 데이터베이스 스키마

### Tables

#### `users` - 사용자 프로필
```sql
- id (UUID, PK)
- nickname (VARCHAR(12), UNIQUE)
- total_donated (INTEGER)
- first_donation_at (TIMESTAMP)
- last_donation_at (TIMESTAMP)
- badge_earned (BOOLEAN)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### `donations` - 기부 내역
```sql
- id (UUID, PK)
- user_id (UUID, FK)
- nickname (VARCHAR(12))
- amount (INTEGER)
- receipt_token (TEXT, UNIQUE)
- platform (VARCHAR(20))
- created_at (TIMESTAMP)
```

### Views

#### `leaderboard` - 순위표
```sql
- id (UUID)
- nickname (VARCHAR(12))
- total_donated (INTEGER)
- rank (BIGINT)
- last_donation_at (TIMESTAMP)
- badge_earned (BOOLEAN)
- donation_count (BIGINT)
```

## 🔒 RLS (Row Level Security) 정책

### users 테이블
- ✅ **SELECT**: 누구나 조회 가능 (리더보드용)
- ✅ **INSERT**: 인증된 사용자만 가능
- ✅ **UPDATE**: 본인 데이터만 수정 가능

### donations 테이블
- ✅ **SELECT**: 누구나 조회 가능 (기부 내역 조회용)
- ✅ **INSERT**: 인증된 사용자만 가능
- ❌ **UPDATE/DELETE**: 불가 (데이터 무결성)

## 🛠 헬퍼 함수

### `get_user_rank(user_id)`
특정 사용자의 현재 순위 조회

```typescript
import { getUserRank } from '@/services/userService';

const rank = await getUserRank(userId);
// { rank: 5, total_donated: 3000, nickname: "사용자1" }
```

### `get_top_rankers(limit)`
상위 N명의 랭커 조회

```typescript
import { getTopRankers } from '@/services/leaderboardService';

const topRankers = await getTopRankers(10);
```

### `get_recent_donations(limit)`
최근 N개의 기부 내역 조회

```typescript
import { getRecentDonations } from '@/services/donationService';

const recent = await getRecentDonations(10);
```

### `check_nickname_available(nickname)`
닉네임 사용 가능 여부 확인

```typescript
import { checkNicknameAvailable } from '@/services/userService';

const isAvailable = await checkNicknameAvailable('테스터');
```

### `get_leaderboard_stats()`
리더보드 전체 통계 조회

```typescript
import { getLeaderboardStats } from '@/services/leaderboardService';

const stats = await getLeaderboardStats();
// { total_users, total_donations_count, total_amount_donated, average_donation }
```

## 🔄 트리거

### `trigger_update_user_donation_stats`
기부 발생 시 사용자 통계 자동 업데이트

- **트리거 조건**: `donations` 테이블에 INSERT 발생
- **동작**:
  1. `users.total_donated` 증가
  2. `users.last_donation_at` 업데이트
  3. 첫 기부일 경우 `first_donation_at` 설정 및 `badge_earned = true`

### `update_users_updated_at`
사용자 정보 수정 시 `updated_at` 자동 업데이트

## 📦 서비스 레이어

### 사용자 서비스 (`userService.ts`)
```typescript
- getUserByNickname(nickname)
- getUserById(userId)
- createUser(user)
- updateUser(userId, updates)
- checkNicknameAvailable(nickname)
- getUserRank(userId)
```

### 기부 서비스 (`donationService.ts`)
```typescript
- createDonation(donation)
- getDonationByReceipt(receiptToken)
- getUserDonations(userId)
- getRecentDonations(limit)
- isFirstDonation(userId)
```

### 리더보드 서비스 (`leaderboardService.ts`)
```typescript
- getTopRankers(limit)
- getLeaderboard(limit, offset)
- getLeaderboardStats()
- getRankingsAroundUser(userId, range)
- subscribeToLeaderboard(callback)
```

## 🧪 테스트 데이터

샘플 데이터 삽입 (선택사항):

```sql
-- 테스트 사용자
INSERT INTO users (nickname, total_donated, first_donation_at, last_donation_at, badge_earned)
VALUES
  ('테스터1', 5000, NOW(), NOW(), true),
  ('테스터2', 3000, NOW(), NOW(), false),
  ('테스터3', 1000, NOW(), NOW(), false);

-- 테스트 기부
INSERT INTO donations (user_id, nickname, amount, receipt_token)
SELECT u.id, u.nickname, 1000, 'test_receipt_' || u.nickname
FROM users u;
```

## 📚 추가 리소스

- [Supabase 공식 문서](https://supabase.com/docs)
- [React Native 가이드](https://supabase.com/docs/guides/getting-started/quickstarts/react-native)
- [RLS 가이드](https://supabase.com/docs/guides/auth/row-level-security)

## 🚨 문제 해결

### 환경 변수 로드 안됨
```bash
npm start -- --clear
```

### RLS 정책 오류
- SQL Editor에서 `002_rls_policies.sql` 재실행
- Table Editor에서 RLS 토글 확인

### 연결 실패
- `.env` 파일의 URL과 Key 확인
- Supabase 프로젝트 상태 확인 (대시보드)

---

**상세 가이드**: [SETUP_GUIDE.md](SETUP_GUIDE.md) 참조
