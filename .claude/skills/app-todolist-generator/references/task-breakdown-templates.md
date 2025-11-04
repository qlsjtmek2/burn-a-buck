# Task Breakdown Templates

다양한 앱 타입별로 작업을 분해하는 템플릿입니다. 각 템플릿은 프로젝트 설정부터 배포까지 전체 개발 과정을 단계별로 정리했습니다.

## Table of Contents

- [Todo App Template](#todo-app-template)
- [Blog App Template](#blog-app-template)
- [E-commerce App Template](#e-commerce-app-template)
- [Chat App Template](#chat-app-template)
- [Weather App Template](#weather-app-template)
- [Generic App Template](#generic-app-template)

---

## Todo App Template

### Phase 1: 프로젝트 설정
1. React Native/React 프로젝트 초기화
2. 필수 패키지 설치
   - Zustand (상태 관리)
   - React Query (서버 상태)
   - React Navigation (모바일) / React Router (웹)
   - UI 라이브러리 (React Native Paper / shadcn/ui)
3. 프로젝트 구조 설정

### Phase 2: 백엔드 설정
1. Supabase/Firebase 프로젝트 생성
2. 데이터베이스 테이블 생성
   - `todos` 테이블 (id, title, description, completed, user_id, created_at)
3. RLS (Row Level Security) 정책 설정
4. API 클라이언트 설정

### Phase 3: 인증 구현
1. 로그인 화면 UI
2. 회원가입 화면 UI
3. 인증 상태 관리 (Zustand)
4. Protected Routes 설정

### Phase 4: Todo CRUD 구현
1. Todo 목록 조회 (useTodos hook)
2. Todo 생성 (useCreateTodo hook)
3. Todo 수정 (useUpdateTodo hook)
4. Todo 삭제 (useDeleteTodo hook)
5. Todo 완료 토글 기능

### Phase 5: UI/UX 개선
1. Loading states (Skeleton UI)
2. Error handling (Error boundaries, Toast)
3. Empty states
4. Pull-to-refresh (모바일)
5. 애니메이션

### Phase 6: 추가 기능
1. 검색 기능
2. 필터링 (완료/미완료)
3. 정렬 (날짜, 제목)
4. 카테고리/태그

### Phase 7: 테스트 및 배포
1. 기능 테스트
2. 성능 최적화
3. 빌드 및 배포

---

## Blog App Template

### Phase 1: 프로젝트 설정
1. React/Next.js 프로젝트 초기화
2. 필수 패키지 설치
   - TanStack Query
   - React Router / Next.js routing
   - MDX 또는 Rich Text Editor
   - UI 라이브러리
3. 프로젝트 구조 설정

### Phase 2: 백엔드 설정
1. Supabase 프로젝트 생성
2. 데이터베이스 스키마
   - `posts` (id, title, content, slug, author_id, published_at)
   - `categories` (id, name, slug)
   - `tags` (id, name)
   - `post_tags` (post_id, tag_id)
3. Storage 버킷 생성 (이미지 업로드)
4. RLS 정책

### Phase 3: 인증 및 권한
1. 로그인/회원가입
2. 역할 기반 권한 (admin, author, reader)
3. Protected routes (admin only)

### Phase 4: 포스트 CRUD
1. 포스트 목록 (pagination)
2. 포스트 상세 보기
3. 포스트 작성 (Rich Text Editor)
4. 포스트 수정
5. 포스트 삭제
6. 이미지 업로드

### Phase 5: 카테고리 및 태그
1. 카테고리 관리
2. 태그 시스템
3. 카테고리/태그별 필터링

### Phase 6: 검색 및 필터
1. 전체 텍스트 검색
2. 카테고리 필터
3. 태그 필터
4. 정렬 (날짜, 조회수)

### Phase 7: SEO 및 성능
1. Meta tags (Open Graph, Twitter Cards)
2. Sitemap 생성
3. Image optimization
4. Code splitting

### Phase 8: 배포
1. 빌드 최적화
2. Vercel/Netlify 배포

---

## E-commerce App Template

### Phase 1: 프로젝트 설정
(동일)

### Phase 2: 백엔드 설정
1. Supabase 프로젝트 생성
2. 데이터베이스 스키마
   - `products` (id, name, description, price, stock, images)
   - `categories`
   - `cart_items` (user_id, product_id, quantity)
   - `orders` (id, user_id, total, status, created_at)
   - `order_items` (order_id, product_id, quantity, price)
3. Storage (상품 이미지)

### Phase 3: 상품 관리
1. 상품 목록 (grid view)
2. 상품 상세
3. 상품 검색
4. 카테고리 필터
5. 가격 범위 필터

### Phase 4: 장바구니
1. 장바구니 추가
2. 장바구니 조회
3. 수량 변경
4. 항목 삭제
5. 총액 계산

### Phase 5: 주문 처리
1. 주문 생성
2. 결제 통합 (Stripe/Toss Payments)
3. 주문 내역 조회
4. 주문 상태 관리

### Phase 6: 인증 및 프로필
1. 로그인/회원가입
2. 프로필 관리
3. 주소 관리
4. 주문 내역

### Phase 7: 관리자 대시보드
1. 상품 관리 (CRUD)
2. 주문 관리
3. 통계 및 리포트

### Phase 8: 배포
(동일)

---

## Chat App Template

### Phase 1: 프로젝트 설정
(동일)

### Phase 2: 백엔드 설정
1. Supabase 프로젝트 생성
2. 데이터베이스 스키마
   - `users` (id, username, avatar, status)
   - `channels` (id, name, type)
   - `messages` (id, channel_id, user_id, content, created_at)
   - `channel_members` (channel_id, user_id)
3. Realtime 구독 설정

### Phase 3: 인증
1. 로그인/회원가입
2. 프로필 설정

### Phase 4: 채팅 기능
1. 채널 목록
2. 채널 생성/삭제
3. 메시지 전송
4. 메시지 수신 (Realtime)
5. 읽음 표시

### Phase 5: 추가 기능
1. 이미지/파일 전송
2. 타이핑 인디케이터
3. 온라인 상태 표시
4. 푸시 알림

### Phase 6: UI/UX
1. 메시지 그룹핑 (날짜별)
2. 무한 스크롤
3. 이모지 picker
4. 다크 모드

### Phase 7: 배포
(동일)

---

## Weather App Template

### Phase 1: 프로젝트 설정
(동일)

### Phase 2: API 통합
1. OpenWeatherMap API 키 발급
2. API 클라이언트 설정
3. 위치 권한 요청 (모바일)

### Phase 3: 날씨 데이터 조회
1. 현재 날씨
2. 시간별 예보
3. 주간 예보
4. 위치 검색

### Phase 4: UI 구현
1. 메인 화면 (현재 날씨)
2. 상세 정보 (습도, 풍속, 체감온도)
3. 시간별 예보 carousel
4. 주간 예보 리스트
5. 날씨 아이콘 및 배경

### Phase 5: 추가 기능
1. 여러 지역 저장
2. 위치 자동 감지
3. 단위 변환 (섭씨/화씨)
4. 날씨 알림

### Phase 6: 오프라인 지원
1. 마지막 조회 데이터 캐싱
2. 오프라인 모드 UI

### Phase 7: 배포
(동일)

---

## Generic App Template

범용 앱 개발 흐름입니다. 요구사항에 따라 단계를 추가/제거할 수 있습니다.

### Phase 1: 프로젝트 설정
1. 플랫폼 선택 (Mobile/Web)
2. 프레임워크 설정 (React Native/React)
3. 필수 패키지 설치
4. 프로젝트 구조 구성

### Phase 2: 백엔드 설정
1. BaaS 선택 (Supabase/Firebase)
2. 데이터베이스 스키마 설계
3. 인증 설정 (선택 사항)
4. API 클라이언트 설정

### Phase 3: 핵심 기능 구현
1. 메인 화면 UI
2. CRUD 기능 (필요 시)
3. 데이터 조회 및 표시
4. 사용자 상호작용

### Phase 4: UI/UX 개선
1. 로딩 상태
2. 에러 처리
3. 빈 상태
4. 반응형 디자인

### Phase 5: 추가 기능
(요구사항에 따라)
- 검색
- 필터링
- 정렬
- 알림
- 오프라인 지원

### Phase 6: 테스트 및 최적화
1. 기능 테스트
2. 성능 최적화
3. 접근성 개선

### Phase 7: 배포
1. 빌드 설정
2. 환경 변수 설정
3. 배포 (App Store/Google Play/Vercel/Netlify)

---

## 공통 Best Practices

### 개발 단계별 체크리스트

**프로젝트 설정 단계:**
- [ ] Git 저장소 초기화
- [ ] .gitignore 설정
- [ ] ESLint/Prettier 설정
- [ ] TypeScript 설정
- [ ] 환경 변수 설정 (.env)

**개발 단계:**
- [ ] Feature-based 폴더 구조
- [ ] TypeScript 타입 정의
- [ ] 에러 핸들링
- [ ] 로딩 상태 처리
- [ ] Optimistic updates (필요 시)

**배포 전 체크리스트:**
- [ ] 모든 기능 테스트
- [ ] 성능 최적화 (이미지, 코드 splitting)
- [ ] SEO 설정 (웹)
- [ ] 앱 아이콘 및 스플래시 (모바일)
- [ ] 환경 변수 production 설정
- [ ] 빌드 테스트

---

**참조:**
- React Native 개발 가이드
- React Best Practices
- Supabase Documentation
- Firebase Documentation
