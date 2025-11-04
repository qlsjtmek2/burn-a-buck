# Phase 3: Google Play 인앱 결제 설정 - 완료 요약

## ✅ 완료된 작업

### 1. react-native-iap 패키지 설치 ✓
- **버전**: v14.4.35
- **상태**: 이미 설치되어 있었음
- **확인 방법**: `package.json` 확인

### 2. Google Play Console 가이드 작성 ✓
- **파일**: `claudedocs/google-play-iap-setup.md`
- **내용**:
  - 인앱 상품 등록 단계별 가이드
  - Product ID: `donate_1000won` (₩1,000)
  - 라이선스 테스터 설정 방법
  - 서비스 계정 키 생성 및 권한 부여
  - 영수증 검증을 위한 Google Play Developer API 설정
  - 테스트 및 배포 체크리스트

### 3. 결제 시스템 타입 및 인터페이스 정의 ✓

#### 3-1. 상수 정의 (`src/constants/payment.ts`)
- `PRODUCT_IDS`: Android/iOS 인앱 상품 ID
- `DONATION_AMOUNT`: 기부 금액 (₩1,000)
- `PAYMENT_RETRY_CONFIG`: 재시도 설정
- `PAYMENT_ERROR_CODES`: 에러 코드 정의
- `PAYMENT_ERROR_MESSAGES`: 에러 메시지 (한국어)

#### 3-2. 타입 정의 (`src/types/payment.ts`)
- `PaymentStatus`: 결제 상태 타입
- `PaymentError`: 결제 에러 인터페이스
- `ReceiptInfo`: 영수증 정보
- `ReceiptValidationResult`: 영수증 검증 결과
- `DonationInfo`: 기부 정보
- `PaymentResult`: 결제 결과
- `IPaymentService`: 결제 서비스 인터페이스
- `DonationRecord`: Supabase donations 테이블 타입
- `UserRecord`: Supabase users 테이블 타입

### 4. 결제 서비스 구현 (`src/services/payment.ts`) ✓

#### 4-1. PaymentService 클래스
```typescript
class PaymentService implements IPaymentService {
  async initialize(): Promise<void>
  async cleanup(): Promise<void>
  async getProducts(): Promise<ProductPurchase[]>
  async purchaseDonation(nickname: string): Promise<PaymentResult>
  async validateReceipt(purchase: Purchase): Promise<ReceiptValidationResult>
  async restorePurchases(): Promise<number>
  async finalizePurchase(purchase: Purchase, nickname: string): Promise<PaymentResult>
}
```

#### 4-2. 주요 기능

##### A. 초기화 및 정리
- `initialize()`: react-native-iap 연결 초기화, 리스너 등록
- `cleanup()`: 연결 종료, 리스너 제거

##### B. 상품 조회
- `getProducts()`: Google Play 인앱 상품 정보 조회
- 플랫폼별 상품 ID 자동 선택 (Android/iOS)

##### C. 구매 플로우
- `purchaseDonation(nickname)`: 기부 결제 시작
  1. 상품 ID 선택
  2. `requestPurchase()` 호출
  3. `finalizePurchase()` 호출 (영수증 검증 및 저장)
  4. `finishTransaction()` 호출 (거래 완료)

##### D. 영수증 검증
- `validateReceipt(purchase)`: 영수증 유효성 검증
  - Android: `transactionReceipt`에서 `purchaseToken` 추출
  - iOS: `transactionReceipt` 그대로 사용
  - 영수증 정보 구성 및 반환

##### E. Supabase 저장 (중복 방지 포함)
- `finalizePurchase()`: 영수증 검증 후 Supabase 저장
- `saveDonationToSupabase()`:
  1. **중복 결제 확인**: `receipt_token`으로 기존 기부 조회
  2. 중복 시 `DUPLICATE_PAYMENT` 에러 발생
  3. 현재 사용자 세션 가져오기
  4. 첫 기부 여부 확인 (AsyncStorage)
  5. `donations` 테이블에 저장
  6. `users` 테이블 업데이트 (총 기부 금액, 배지 등)
  7. AsyncStorage에 첫 기부 플래그 저장

##### F. 에러 처리 및 재시도
- `purchaseWithRetry()`: 재시도 로직이 포함된 결제 함수
  - 최대 3회 재시도
  - Exponential backoff (1s → 2s → 4s)
  - 사용자 취소 및 중복 결제는 재시도하지 않음

#### 4-3. 싱글톤 인스턴스
```typescript
export const paymentService = new PaymentService();
export function purchaseWithRetry(nickname: string): Promise<PaymentResult>
```

---

## 📂 생성된 파일

```
src/
├── constants/
│   └── payment.ts           # 결제 상수 (Product ID, 에러 코드, 메시지)
├── types/
│   └── payment.ts           # 결제 타입 정의
└── services/
    └── payment.ts           # 결제 서비스 구현

claudedocs/
├── google-play-iap-setup.md    # Google Play Console 설정 가이드
└── phase3-payment-summary.md   # 이 파일
```

---

## 🔗 통합 요약

### Supabase 통합

#### donations 테이블 저장
```typescript
{
  user_id: string | null,        // 현재 사용자 ID (없으면 null)
  nickname: string,               // 기부자 닉네임
  amount: 1000,                   // 기부 금액
  receipt_token: string,          // 영수증 토큰 (중복 방지용)
  transaction_id: string,         // 거래 ID
  platform: 'android' | 'ios'    // 플랫폼
}
```

#### users 테이블 업데이트
```typescript
{
  id: string,                     // 사용자 ID
  nickname: string,               // 닉네임
  total_donated: number,          // 총 기부 금액 (+1000)
  first_donation_at: string,      // 첫 기부 시간 (신규 시)
  last_donation_at: string,       // 마지막 기부 시간 (업데이트)
  badge_earned: boolean           // 배지 획득 여부 (첫 기부 시 true)
}
```

### 에러 처리

#### 에러 코드
- `E_USER_CANCELLED`: 사용자 취소
- `E_INIT_FAILED`: 초기화 실패
- `E_PRODUCT_NOT_FOUND`: 상품 없음
- `E_PURCHASE_FAILED`: 구매 실패
- `E_RECEIPT_VALIDATION_FAILED`: 영수증 검증 실패
- `E_NETWORK_ERROR`: 네트워크 오류
- `E_DUPLICATE_PAYMENT`: 중복 결제
- `E_UNKNOWN_ERROR`: 알 수 없는 오류

#### 재시도 전략
- 최대 3회 재시도
- Exponential backoff: 1s → 2s → 4s
- 재시도 제외 에러: 사용자 취소, 중복 결제

---

## 🎯 사용 예시

### 기본 사용법

```typescript
import { paymentService, purchaseWithRetry } from '@/services/payment';

// 1. 앱 시작 시 초기화
useEffect(() => {
  paymentService.initialize();
  return () => {
    paymentService.cleanup();
  };
}, []);

// 2. 결제 버튼 클릭 시
const handleDonation = async () => {
  try {
    const result = await purchaseWithRetry('사용자닉네임');

    if (result.success) {
      console.log('기부 완료!', result.donation);
      console.log('첫 기부:', result.isFirstDonation);

      // 성공 화면으로 이동
      navigation.navigate('ThankYou', {
        isFirstDonation: result.isFirstDonation,
        donation: result.donation,
      });
    }
  } catch (error: any) {
    if (error.code === 'E_USER_CANCELLED') {
      console.log('사용자가 결제를 취소했습니다.');
    } else {
      Alert.alert('결제 오류', error.message);
    }
  }
};
```

### React Query 통합

```typescript
import { useMutation } from '@tanstack/react-query';
import { purchaseWithRetry } from '@/services/payment';

const useDonation = () => {
  return useMutation({
    mutationFn: (nickname: string) => purchaseWithRetry(nickname),
    onSuccess: (result) => {
      // 성공 처리
    },
    onError: (error: any) => {
      // 에러 처리
    },
  });
};

// 사용
const { mutate, isPending } = useDonation();
mutate('닉네임');
```

---

## ⚠️ 주의사항

### 1. 환경 변수 설정
`.env` 파일에 Supabase URL 및 Anon Key 설정 필요:
```env
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1...
```

### 2. Google Play Console 설정 필수
- 인앱 상품 `donate_1000won` (₩1,000) 등록
- 서비스 계정 생성 및 권한 부여 (영수증 검증용)
- 라이선스 테스터 추가 (테스트용)

### 3. 테스트
- **Sandbox 환경**: 라이선스 테스터 계정으로 테스트 (실제 결제 안 됨)
- **Internal Testing**: EAS Build로 AAB 생성 후 내부 테스트 트랙 배포
- **영수증 검증**: 서비스 계정 키가 Supabase Edge Function에 설정되어야 함

### 4. 보안
- 서비스 계정 JSON 키는 **절대 Git에 커밋하지 말 것**
- `.gitignore`에 `*.json` 추가
- Supabase Edge Function 환경 변수로만 관리

---

## 🚀 다음 단계

### Phase 4: 네비게이션 구조 구현
- React Navigation 설정
- 스택 네비게이터 구성
- 화면 전환 로직

### Phase 5: i18n 다국어 지원
- i18next 설정
- 한국어/영어 번역 파일
- 언어 자동 감지

### Phase 6-7: 화면 구현
- Onboarding 화면
- 메인 화면 (기부 버튼)
- 결제 플로우 연동

---

## 📚 관련 문서

- [Google Play Console 설정 가이드](./google-play-iap-setup.md)
- [react-native-iap 공식 문서](https://react-native-iap.dooboolab.com/)
- [Supabase 문서](https://supabase.com/docs)
- [전체 개발 계획](./burn-a-buck-plan.md)

---

**작성일**: 2025-11-03
**Phase**: 3/18 완료
**진행률**: 16.7% (3/18 phases)
