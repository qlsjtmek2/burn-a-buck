# Google Play Console 인앱 상품 설정 가이드

"천원 쓰레기통" 앱의 Google Play In-App Purchase 설정 가이드입니다.

## 📋 사전 준비

1. Google Play Console 계정
2. 앱 등록 완료 (번들 ID: 예: `com.burna buck`)
3. 테스트 기기 또는 실제 기기

## 🚀 Step 1: Google Play Console 접속

1. https://play.google.com/console 접속
2. 앱 선택

## 💰 Step 2: 인앱 상품 생성

### 2.1 상품 섹션 이동

1. 좌측 메뉴에서 **수익 창출** > **상품** > **인앱 상품** 클릭
2. "상품 만들기" 버튼 클릭

### 2.2 상품 정보 입력

#### 기본 정보

| 필드 | 값 |
|------|-----|
| **상품 ID** | `donate_1000won` |
| **이름** | `천원 기부` |
| **설명** | `착한 일에 천원을 기부합니다` |
| **상품 유형** | `관리형 상품` (Managed Product) |
| **기본 가격** | `₩1,000` |

#### 상세 설정

- **상태**: 활성 (Active)
- **기본 언어**: 한국어 (ko-KR)
- **통화**: KRW (원화)

### 2.3 번역 추가 (선택사항)

영어권 사용자를 위한 번역:

| Language | Title | Description |
|----------|-------|-------------|
| English (en-US) | Donate ₩1,000 | Donate one thousand won for a good cause |

### 2.4 저장 및 활성화

1. "저장" 버튼 클릭
2. 상태를 "활성"으로 변경

⚠️ **주의**: 상품이 활성화되기까지 몇 시간이 걸릴 수 있습니다.

## 🧪 Step 3: 테스트 설정

### 3.1 라이선스 테스터 추가

1. **설정** > **라이선스 테스트** 이동
2. "라이선스 테스터 추가" 클릭
3. 테스트 Gmail 계정 입력
4. "변경사항 저장"

### 3.2 테스트 계정 설정

라이선스 테스터로 추가된 계정은:
- ✅ 실제 결제 없이 테스트 가능
- ✅ 즉시 구매 가능 (검토 대기 없음)
- ✅ 무제한 테스트 구매

### 3.3 테스트 방법

```typescript
// 앱에서 테스트
import { executeDonationFlow } from '@/services/donationFlowService';

const result = await executeDonationFlow(userId, nickname);

if (result.success) {
  console.log('Donation successful!');
  console.log('Is first donation:', result.isFirstDonation);
  console.log('User:', result.user);
} else {
  console.error('Donation failed:', result.error);
}
```

## 🔒 Step 4: 영수증 검증 (중요)

### 4.1 서버 측 검증 필요성

⚠️ **보안 주의사항**:
- 클라이언트 검증만으로는 부정 결제를 막을 수 없습니다
- 실제 서비스에서는 **서버에서 Google Play Developer API**를 통해 검증해야 합니다

### 4.2 Google Play Developer API 설정

1. **Google Cloud Console** 접속
2. 프로젝트 선택 또는 생성
3. **API 및 서비스** > **라이브러리** 이동
4. "Google Play Android Developer API" 검색 및 활성화
5. **사용자 인증 정보** 생성 (서비스 계정)

### 4.3 서비스 계정 권한 설정

1. Google Play Console > **사용자 및 권한** 이동
2. "사용자 초대" 클릭
3. 서비스 계정 이메일 입력
4. 권한 설정:
   - ✅ **재무 데이터 보기**
   - ✅ **주문 및 구독 관리**

### 4.4 서버 측 검증 예시 (참고용)

```typescript
// 서버 측 (Node.js + Express)
import { google } from 'googleapis';

const androidpublisher = google.androidpublisher('v3');

async function verifyPurchase(packageName, productId, purchaseToken) {
  const auth = new google.auth.GoogleAuth({
    keyFile: 'path/to/service-account-key.json',
    scopes: ['https://www.googleapis.com/auth/androidpublisher'],
  });

  const authClient = await auth.getClient();

  const response = await androidpublisher.purchases.products.get({
    auth: authClient,
    packageName,
    productId,
    token: purchaseToken,
  });

  return {
    purchaseState: response.data.purchaseState, // 0 = Purchased
    consumptionState: response.data.consumptionState, // 0 = Yet to be consumed
    orderId: response.data.orderId,
  };
}
```

## 📊 Step 5: 주문 및 구독 관리

### 5.1 구매 내역 확인

1. **수익 창출** > **주문 관리** 이동
2. 실시간 구매 내역 확인 가능

### 5.2 환불 처리

사용자가 환불 요청 시:
1. **주문 관리**에서 해당 주문 찾기
2. "환불" 버튼 클릭
3. Supabase에서 해당 기부 내역 처리 (별도 로직 필요)

### 5.3 통계 확인

- **수익 창출** > **수익 보고서**
- 일별/월별 수익 확인
- 상품별 판매 현황

## 🧩 Step 6: 앱 코드 통합

### 6.1 상품 ID 설정

`src/services/paymentService.ts`에서 상품 ID 확인:

```typescript
export const PRODUCT_IDS = {
  DONATION_1000: 'donate_1000won', // Android
};
```

### 6.2 기부 플로우 사용

```typescript
import { executeDonationFlow } from '@/services/donationFlowService';
import { initializeIAP } from '@/services/paymentService';

// 앱 시작 시 IAP 초기화
useEffect(() => {
  initializeIAP();
}, []);

// 기부 버튼 클릭 시
const handleDonate = async () => {
  const result = await executeDonationFlow(userId, nickname);

  if (result.success) {
    // 성공 화면으로 이동
    navigation.navigate('ThankYou', {
      isFirstTime: result.isFirstDonation,
    });
  } else {
    // 에러 처리
    Alert.alert('기부 실패', result.error);
  }
};
```

## 🚨 문제 해결

### 상품을 찾을 수 없음

**원인:**
- 상품이 아직 활성화되지 않음
- 상품 ID 오타

**해결:**
- Google Play Console에서 상품 상태 확인 (활성화까지 몇 시간 소요)
- 상품 ID가 정확한지 확인

### 테스트 구매가 실제 결제됨

**원인:**
- 라이선스 테스터에 계정이 추가되지 않음

**해결:**
- Google Play Console > 설정 > 라이선스 테스트에서 계정 확인
- 테스터 계정으로 로그인 후 재시도

### 구매 후 영수증이 저장되지 않음

**원인:**
- Supabase 연결 문제
- RLS 정책 문제

**해결:**
- Supabase 연결 확인
- RLS 정책에서 INSERT 권한 확인
- 로그 확인 (`console.log` in donationFlowService.ts)

### 중복 결제 발생

**원인:**
- 영수증 토큰 중복 체크 로직 오류

**해결:**
- `donations` 테이블의 `receipt_token` 컬럼이 UNIQUE인지 확인
- 중복 체크 로직 확인 (`getDonationByReceipt`)

## ✅ 체크리스트

설정 완료 후 다음 항목들을 확인하세요:

- [ ] Google Play Console에서 상품 생성 완료
- [ ] 상품 ID: `donate_1000won`
- [ ] 가격: ₩1,000
- [ ] 상태: 활성
- [ ] 라이선스 테스터 계정 추가
- [ ] 앱에서 상품 조회 성공
- [ ] 테스트 구매 성공
- [ ] Supabase에 기부 내역 저장 확인
- [ ] 사용자 통계 자동 업데이트 확인

## 📚 참고 자료

- [Google Play Console 공식 문서](https://support.google.com/googleplay/android-developer)
- [In-App Purchase 가이드](https://developer.android.com/google/play/billing/integrate)
- [react-native-iap 문서](https://github.com/dooboolab-community/react-native-iap)

---

**다음 단계**: Phase 4 - 내비게이션 구조 및 i18n 설정
