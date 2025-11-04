# Phase 7: 메인 화면 구현 - 완료 요약

## 📋 구현 완료 항목

### ✅ 작업 21-25: 메인 UI

1. **메인 화면 레이아웃 설계** ✅
   - 후원 버튼을 하단에 고정 배치 (눈에 잘 띄도록)
   - 리더보드를 스크롤 가능한 콘텐츠 영역에 배치
   - RefreshControl로 pull-to-refresh 기능 추가

2. **후원 버튼 UI 구현** ✅
   - 큰 사이즈 (paddingVertical: 20, fontSize: 20)
   - Accent 색상 (`colors.accent` - amber-400)
   - 플랫폼별 그림자 효과 (iOS: shadowOpacity 0.3, Android: elevation 5)

3. **Top Ranker 리더보드 섹션 구현** ✅
   - 1위: 금색 테두리 (`colors.gold`)
   - 2위: 은색 테두리 (`colors.silver`)
   - 3위: 동색 테두리 (`colors.bronze`)
   - "🏆 이달의 쓰레기왕" 타이틀

4. **최근 후원 리더보드 섹션 구현** ✅
   - 최근 10명 표시
   - 상대적 시간 표시 (X분 전, X시간 전, X일 전 등)
   - "💸 최근 기부" 타이틀

5. **리더보드 데이터 조회 API 연동** ✅
   - React Query의 `useQuery` 훅 사용
   - 30초마다 자동 리프레시 (`refetchInterval: 30000`)
   - Pull-to-refresh로 수동 새로고침 가능

---

## 📁 생성/수정된 파일

### 새로 생성된 파일

1. **`src/utils/timeFormat.ts`** (새 파일)
   - `getTimeAgo()`: 상대적 시간 포맷팅 (X분 전, X시간 전)
   - `formatAmount()`: 금액 포맷팅 (천 단위 콤마)
   - `formatRank()`: 순위 포맷팅

### 수정된 파일

1. **`src/screens/MainScreen.tsx`**
   - 완전히 재구성
   - React Query로 데이터 조회 (Top Ranker, Recent Donations)
   - 로딩 상태 처리 (ActivityIndicator)
   - RefreshControl로 새로고침
   - 플랫폼별 스타일링 (iOS shadow, Android elevation)
   - 금/은/동 테두리 효과 적용

2. **`src/services/leaderboardService.ts`**
   - `getRecentDonations()` 함수 추가
   - 최근 기부 데이터를 `LeaderboardEntry` 형태로 변환

3. **`src/locales/ko/translation.json`**
   - `main.leaderboard.topRanker`: "🏆 이달의 쓰레기왕"
   - `main.leaderboard.recentDonations`: "💸 최근 기부"
   - `main.leaderboard.totalAmount`: "총 {{amount}}원"
   - `main.leaderboard.timeAgo`: 상대적 시간 번역 추가

4. **`src/locales/en/translation.json`**
   - 영어 번역 추가 (한국어와 동일한 키 구조)

---

## 🎨 UI 디자인 특징

### 색상 사용

- **Primary (amber-500)**: 헤더 타이틀, 순위 숫자, 금액
- **Accent (amber-400)**: 후원 버튼 (눈에 잘 띄는 CTA)
- **Gold/Silver/Bronze**: 1~3위 테두리 색상
- **Background**: gray-50 (밝은 배경)
- **Surface**: white (카드 배경)

### 레이아웃 구조

```
┌─────────────────────────────────┐
│ Header (고정)                    │
│ "천원 쓰레기통"                  │
├─────────────────────────────────┤
│ ScrollView (스크롤 가능)         │
│                                 │
│ 🏆 이달의 쓰레기왕                │
│ ┌───────────────────────────┐   │
│ │ 1위 (금색 테두리)          │   │
│ └───────────────────────────┘   │
│ ┌───────────────────────────┐   │
│ │ 2위 (은색 테두리)          │   │
│ └───────────────────────────┘   │
│ ┌───────────────────────────┐   │
│ │ 3위 (동색 테두리)          │   │
│ └───────────────────────────┘   │
│                                 │
│ 💸 최근 기부                      │
│ ┌───────────────────────────┐   │
│ │ 닉네임       시간   금액   │   │
│ └───────────────────────────┘   │
│ ... (최근 10개)                  │
│                                 │
├─────────────────────────────────┤
│ Footer (고정)                    │
│ ┌───────────────────────────┐   │
│ │ 여기에 천원 버리기 (버튼)  │   │
│ └───────────────────────────┘   │
└─────────────────────────────────┘
```

---

## 🔧 기술적 구현 세부사항

### React Query 설정

```typescript
// Top Ranker 조회 (상위 3명)
useQuery({
  queryKey: ['topRankers'],
  queryFn: () => getTopRankers(3),
  refetchInterval: 30000, // 30초마다 자동 새로고침
});

// 최근 기부 조회 (최근 10개)
useQuery({
  queryKey: ['recentDonations'],
  queryFn: () => getRecentDonations(10),
  refetchInterval: 30000, // 30초마다 자동 새로고침
});
```

### 플랫폼별 스타일링

```typescript
// iOS와 Android에서 그림자 효과 다르게 적용
...Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  android: {
    elevation: 5,
  },
})
```

### 순위별 테두리 색상

```typescript
const getBorderColor = (rank: number): string => {
  switch (rank) {
    case 1: return colors.gold;    // 금색
    case 2: return colors.silver;  // 은색
    case 3: return colors.bronze;  // 동색
    default: return colors.border;
  }
};
```

### 상대적 시간 포맷팅

```typescript
// "방금 전", "5분 전", "2시간 전", "3일 전" 등
export const getTimeAgo = (dateString: string | null): string => {
  // ... 로직 구현
};
```

---

## 🧪 테스트 가이드

### 1. 앱 실행

```bash
# 캐시 클리어 후 실행 (권장)
npm run fresh-android

# 또는 일반 실행
npm run android
```

### 2. 확인할 사항

#### UI 확인
- [ ] 헤더에 "천원 쓰레기통" 타이틀 표시
- [ ] "🏆 이달의 쓰레기왕" 섹션 표시
- [ ] "💸 최근 기부" 섹션 표시
- [ ] 하단에 "여기에 천원 버리기" 버튼 표시

#### 데이터 로딩 확인
- [ ] 로딩 중 ActivityIndicator 표시
- [ ] 데이터 없을 때 "아직 기부 내역이 없습니다" 메시지 표시
- [ ] Pull-to-refresh로 새로고침 가능

#### 스타일 확인
- [ ] 1위: 금색 테두리
- [ ] 2위: 은색 테두리
- [ ] 3위: 동색 테두리
- [ ] 후원 버튼: 큰 사이즈, 밝은 amber 색상, 그림자 효과

#### 기능 확인
- [ ] 후원 버튼 클릭 시 닉네임 화면으로 이동
- [ ] 스크롤 가능
- [ ] 30초마다 자동 새로고침 (데이터가 있는 경우)

### 3. Supabase 데이터 확인

현재는 Supabase에 실제 데이터가 없을 수 있으므로 "아직 기부 내역이 없습니다" 메시지가 표시될 수 있습니다.

**테스트 데이터 추가 방법** (Supabase Dashboard):

1. Supabase Dashboard → Table Editor 이동
2. `users` 테이블에 테스트 사용자 추가
3. `donations` 테이블에 테스트 기부 추가
4. 앱에서 새로고침 (pull-to-refresh)

---

## 🎯 다음 단계 (Phase 8)

Phase 7이 완료되었습니다! 다음은 **Phase 8: Google Play In-App Purchase 통합**입니다.

Phase 8에서 할 일:
1. react-native-iap 라이브러리 설정
2. Google Play Console에서 인앱 상품 등록
3. 결제 플로우 구현
4. 영수증 검증
5. Supabase와 연동

---

## 📝 참고사항

### 타입 에러

TypeScript 타입 체크 시 일부 에러가 있지만, 이는 Phase 3의 결제 관련 파일에서 발생하는 것으로 메인 화면 구현과는 무관합니다.

**메인 화면 관련 파일의 타입 에러: 0개** ✅

### 파일 구조

```
src/
├── screens/
│   └── MainScreen.tsx              ✅ 완전히 재구현
├── services/
│   └── leaderboardService.ts       ✅ getRecentDonations 추가
├── utils/
│   └── timeFormat.ts               ✅ 새로 생성
└── locales/
    ├── ko/
    │   └── translation.json        ✅ 번역 추가
    └── en/
        └── translation.json        ✅ 번역 추가
```

---

## ✨ 성과

- **React Query 활용**: 자동 캐싱, 자동 리프레시, 에러 처리
- **플랫폼별 최적화**: iOS와 Android 각각에 맞는 그림자 효과
- **사용자 경험**: Pull-to-refresh, 로딩 상태, 빈 화면 처리
- **접근성**: 색상 대비, 텍스트 크기, 터치 영역
- **국제화**: 한국어/영어 지원

---

**Phase 7 완료! 🎉**

모든 요구사항이 구현되었으며, 앱을 실행하여 메인 화면을 확인할 수 있습니다.
