/**
 * Payment Service
 *
 * Google Play In-App Purchase 결제 서비스
 * react-native-iap v14.x 사용
 */

import {
  initConnection,
  endConnection,
  getProducts,
  requestPurchase,
  finishTransaction,
  purchaseUpdatedListener,
  purchaseErrorListener,
  type Purchase as IAPPurchase,
  type PurchaseError as IAPPurchaseError,
} from 'react-native-iap';
import { Platform } from 'react-native';
import type {
  Product,
  Purchase,
  PurchaseResult,
  PurchaseError,
  PurchaseErrorCode,
  ReceiptValidationResult,
} from '@/types/payment.types';

// 상품 ID 설정
export const PRODUCT_IDS = {
  DONATION_1000: Platform.OS === 'android' ? 'donate_1000won' : 'donate_1000won_ios',
};

/**
 * IAP 연결 초기화
 */
export const initializeIAP = async (): Promise<boolean> => {
  try {
    const connected = await initConnection();
    console.log('IAP connection initialized:', connected);
    return connected;
  } catch (err) {
    console.error('Failed to initialize IAP connection:', err);
    return false;
  }
};

/**
 * IAP 연결 종료
 */
export const terminateIAP = async (): Promise<void> => {
  try {
    await endConnection();
    console.log('IAP connection terminated');
  } catch (err) {
    console.error('Failed to terminate IAP connection:', err);
  }
};

/**
 * 상품 정보 조회
 */
export const getProductInfo = async (productId: string): Promise<Product | null> => {
  try {
    const products = await fetchProducts({ skus: [productId] });

    if (!products || products.length === 0) {
      console.warn('Product not found:', productId);
      return null;
    }

    const product = products[0];

    return {
      productId: product.productId || productId,
      type: 'inapp',
      title: product.title || '',
      description: product.description || '',
      price: String(product.price || '0'),
      currency: product.currency || 'KRW',
      localizedPrice: product.localizedPrice || product.price?.toString() || '₩1,000',
    };
  } catch (err) {
    console.error('Failed to get product info:', err);
    return null;
  }
};

/**
 * 구매 시작
 */
export const purchaseProduct = async (productId: string): Promise<PurchaseResult> => {
  try {
    // 구매 요청
    const purchase = await requestPurchase({ skus: [productId] });

    // 구매 성공
    return {
      success: true,
      purchase: mapIAPPurchase(purchase),
    };
  } catch (err: unknown) {
    console.error('Purchase failed:', err);

    const error = err as IAPPurchaseError;
    return {
      success: false,
      error: mapPurchaseError(error),
    };
  }
};

/**
 * 구매 완료 처리 (영수증 소비)
 */
export const finalizePurchase = async (purchase: Purchase): Promise<void> => {
  try {
    await finishTransaction({
      purchase: {
        productId: purchase.productId,
        transactionId: purchase.transactionId,
        purchaseToken: purchase.purchaseToken,
      },
      isConsumable: true, // 소모성 상품 (기부)
    });

    console.log('Purchase finalized:', purchase.productId);
  } catch (err) {
    console.error('Failed to finalize purchase:', err);
    throw err;
  }
};

/**
 * 영수증 기본 검증 (클라이언트 측)
 *
 * ⚠️ 주의: 실제 서비스에서는 서버에서 Google Play Developer API를 통해 검증해야 합니다.
 * 클라이언트 검증은 기본적인 무결성 체크만 수행합니다.
 */
export const validateReceiptClient = (purchase: Purchase): ReceiptValidationResult => {
  try {
    // Android: purchaseToken 및 signature 확인
    if (Platform.OS === 'android') {
      if (!purchase.purchaseToken || !purchase.signatureAndroid) {
        return {
          isValid: false,
          error: 'Missing purchase token or signature',
        };
      }

      // 기본 검증 (실제로는 서버에서 서명 검증 필요)
      return {
        isValid: true,
        productId: purchase.productId,
        purchaseToken: purchase.purchaseToken,
        purchaseTime: purchase.transactionDate,
      };
    }

    // iOS: transactionReceipt 확인
    if (Platform.OS === 'ios') {
      if (!purchase.transactionReceipt) {
        return {
          isValid: false,
          error: 'Missing transaction receipt',
        };
      }

      return {
        isValid: true,
        productId: purchase.productId,
        purchaseToken: purchase.transactionReceipt,
        purchaseTime: purchase.transactionDate,
      };
    }

    return {
      isValid: false,
      error: 'Unsupported platform',
    };
  } catch (err) {
    console.error('Receipt validation failed:', err);
    return {
      isValid: false,
      error: err instanceof Error ? err.message : 'Unknown validation error',
    };
  }
};

/**
 * 구매 업데이트 리스너 등록
 */
export const setupPurchaseListeners = (
  onPurchaseUpdate: (purchase: Purchase) => void,
  onPurchaseError: (error: PurchaseError) => void
): (() => void) => {
  // 구매 완료 리스너
  const purchaseUpdateSubscription = purchaseUpdatedListener((purchase: IAPPurchase) => {
    console.log('Purchase updated:', purchase);
    onPurchaseUpdate(mapIAPPurchase(purchase));
  });

  // 구매 에러 리스너
  const purchaseErrorSubscription = purchaseErrorListener((error: IAPPurchaseError) => {
    console.error('Purchase error:', error);
    onPurchaseError(mapPurchaseError(error));
  });

  // Cleanup 함수 반환
  return () => {
    purchaseUpdateSubscription.remove();
    purchaseErrorSubscription.remove();
  };
};

/**
 * IAP Purchase를 내부 Purchase 타입으로 변환
 */
const mapIAPPurchase = (purchase: IAPPurchase): Purchase => ({
  productId: purchase.productId,
  transactionId: purchase.transactionId || '',
  transactionDate: purchase.transactionDate || Date.now(),
  transactionReceipt: purchase.transactionReceipt || '',
  purchaseToken: purchase.purchaseToken || '',
  dataAndroid: purchase.dataAndroid,
  signatureAndroid: purchase.signatureAndroid,
  purchaseStateAndroid: purchase.purchaseStateAndroid,
  originalTransactionDateIOS: purchase.originalTransactionDateIOS,
  originalTransactionIdentifierIOS: purchase.originalTransactionIdentifierIOS,
});

/**
 * IAP PurchaseError를 내부 PurchaseError 타입으로 변환
 */
const mapPurchaseError = (error: IAPPurchaseError): PurchaseError => {
  let code: PurchaseErrorCode = 'E_UNKNOWN' as PurchaseErrorCode;

  const errorCode = String(error.code);

  if (errorCode.includes('E_USER_CANCELLED') || errorCode.includes('USER_CANCELED')) {
    code = 'E_USER_CANCELLED' as PurchaseErrorCode;
  } else if (errorCode.includes('E_ALREADY_OWNED') || errorCode.includes('ITEM_ALREADY_OWNED')) {
    code = 'E_ALREADY_OWNED' as PurchaseErrorCode;
  } else if (errorCode.includes('E_NETWORK_ERROR') || errorCode.includes('NETWORK')) {
    code = 'E_NETWORK_ERROR' as PurchaseErrorCode;
  }

  return {
    code,
    message: error.message || 'Unknown purchase error',
    debugMessage: error.message,
  };
};

/**
 * 구매 토큰 추출
 * (Supabase에 저장할 고유 식별자)
 */
export const extractPurchaseToken = (purchase: Purchase): string => {
  if (Platform.OS === 'android') {
    return purchase.purchaseToken;
  }
  // iOS는 transactionId를 사용
  return purchase.transactionId;
};
