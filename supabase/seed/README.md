# Supabase 테스트 데이터 생성 가이드

리더보드 테스트를 위한 샘플 데이터를 생성하는 방법입니다.

## 📁 사용 가능한 스크립트

### 1. `reset_and_seed.sql` ⭐ **추천**
**빠른 초기화 + 간단한 테스트 데이터 (5명)**

- **용도**: 빠른 개발 및 테스트
- **특징**: 한 번에 초기화 + 데이터 생성
- **데이터**: 5명의 사용자, 2~10회 기부

### 2. `test_data.sql`
**풍부한 테스트 데이터 (12명)**

- **용도**: UI 테스트, 스크롤 동작 확인
- **특징**: 다양한 순위 및 기부 패턴
- **데이터**: 12명의 사용자, 1~10회 기부

### 3. `clean_test_data.sql`
**데이터베이스 완전 초기화**

- **용도**: 모든 데이터 삭제
- **주의**: ⚠️ 돌이킬 수 없습니다!

---

## 📋 테스트 데이터 개요

- **총 12명의 사용자**
- **총 48개의 기부 내역**
- **총 기부 금액**: ₩48,000
- **기부 횟수**: 1회 ~ 10회 (다양한 순위 생성)

### 사용자 목록

| 순위 | 닉네임 | 기부 횟수 | 총 기부 금액 |
|------|--------|-----------|--------------|
| 1위 | 천원왕 | 10회 | ₩10,000 |
| 2위 | 기부천사 | 8회 | ₩8,000 |
| 3위 | 선행러 | 6회 | ₩6,000 |
| 4위 | 착한사람 | 5회 | ₩5,000 |
| 5위 | 익명의기부자 | 4회 | ₩4,000 |
| 6위 | 행복전도사 | 3회 | ₩3,000 |
| 7위 | 나눔이 | 3회 | ₩3,000 |
| 8위 | 따뜻한마음 | 2회 | ₩2,000 |
| 9위 | 감사합니다 | 2회 | ₩2,000 |
| 10위 | 좋은하루 | 1회 | ₩1,000 |
| 11위 | 첫기부 | 1회 | ₩1,000 |
| 12위 | 응원합니다 | 1회 | ₩1,000 |

## 🚀 테스트 데이터 생성 방법

### 1. Supabase Dashboard 접속

1. [Supabase Dashboard](https://app.supabase.com) 접속
2. 프로젝트 선택
3. 좌측 메뉴에서 **SQL Editor** 클릭

### 2. 테스트 데이터 생성

1. `test_data.sql` 파일 내용 복사
2. SQL Editor에 붙여넣기
3. **RUN** 버튼 클릭 (또는 `Cmd/Ctrl + Enter`)
4. 실행 완료 후 하단에 결과 확인

### 3. 결과 확인

SQL 실행 후 다음과 같은 결과가 나타나야 합니다:

```
SUCCESS
12 rows affected
```

리더보드 조회 결과:

```sql
SELECT * FROM leaderboard ORDER BY rank LIMIT 10;
```

| rank | nickname | total_donated | donation_count |
|------|----------|---------------|----------------|
| 1 | 천원왕 | 10000 | 10 |
| 2 | 기부천사 | 8000 | 8 |
| 3 | 선행러 | 6000 | 6 |
| ... | ... | ... | ... |

## 🧹 테스트 데이터 삭제 방법

### 1. SQL Editor에서 실행

1. `clean_test_data.sql` 파일 내용 복사
2. SQL Editor에 붙여넣기
3. **RUN** 버튼 클릭

### 2. 결과 확인

삭제 후 다음 쿼리로 확인:

```sql
SELECT COUNT(*) FROM leaderboard;
-- 결과: 0
```

## ⚠️ 주의사항

### RLS (Row Level Security) 정책

테스트 데이터 생성 스크립트는 **SQL Editor에서 직접 실행**해야 합니다.

- ✅ **SQL Editor**: RLS를 우회하여 데이터 삽입 가능
- ❌ **TypeScript 스크립트**: RLS 정책으로 인해 실패 (anon 키 사용)

### 데이터 삭제 시 주의

- `clean_test_data.sql`은 **모든 사용자와 기부 내역을 삭제**합니다
- 실제 프로덕션 환경에서는 절대 사용하지 마세요
- 테스트 환경에서만 사용하세요

## 🔍 트러블슈팅

### 문제: "new row violates row-level security policy"

**원인**: TypeScript 스크립트로 실행하려고 시도했습니다.

**해결**: Supabase Dashboard의 SQL Editor에서 `test_data.sql` 실행

### 문제: "duplicate key value violates unique constraint"

**원인**: 이미 동일한 닉네임의 사용자가 존재합니다.

**해결**: `clean_test_data.sql`로 기존 데이터 삭제 후 재실행

### 문제: 트리거가 작동하지 않음

**확인 사항**:
1. `001_initial_schema.sql` 마이그레이션이 정상 실행되었는지 확인
2. `update_user_donation_stats` 트리거가 존재하는지 확인:

```sql
SELECT * FROM pg_trigger WHERE tgname = 'trigger_update_user_donation_stats';
```

## 📊 앱에서 확인하기

테스트 데이터 생성 후:

1. React Native 앱 실행: `npm start`
2. 메인 화면에서 리더보드 확인
3. 12명의 사용자가 순위별로 표시되어야 함

## 🔗 관련 파일

- `test_data.sql` - 테스트 데이터 생성 스크립트
- `clean_test_data.sql` - 테스트 데이터 삭제 스크립트
- `../migrations/001_initial_schema.sql` - 초기 스키마 및 트리거
- `../../scripts/test-supabase.ts` - 연결 테스트 스크립트

## ✅ 체크리스트

테스트 데이터 생성 전:

- [ ] 마이그레이션 001, 002, 003 실행 완료
- [ ] Supabase 연결 테스트 통과 (`npm run test:supabase`)
- [ ] SQL Editor 접속 확인

테스트 데이터 생성 후:

- [ ] 리더보드 조회 성공
- [ ] 12명의 사용자 확인
- [ ] 통계 정보 확인 (총 48회 기부, ₩48,000)
- [ ] 앱에서 리더보드 화면 확인
