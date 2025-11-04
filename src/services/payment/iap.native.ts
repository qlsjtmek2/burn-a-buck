/**
 * IAP Service (Native)
 *
 * Google Play / App Store In-App Purchase 래퍼
 */

import {
  initConnection,
  endConnection,
  getProducts as fetchProducts,
  requestPurchase,
  finishTransaction,
  purchaseUpdatedListener,
  purchaseErrorListener,
  type Purchase as IAPPurchase,
  type PurchaseError as IAPPurchaseError,
} from 'react-native-iap';
import type {
  Product,
  Purchase,
  PurchaseResult,
  PaymentError,
  PurchaseErrorCode,
} from '../../types/payment';

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

    // purchase가 void, 배열, 또는 단일 객체일 수 있음 처리
    if (!purchase) {
      return {
        success: false,
        error: {
          code: 'E_UNKNOWN',
          message: 'Purchase returned empty',
        },
      };
    }

    // 배열인 경우 첫 번째 요소 사용
    const purchaseData = Array.isArray(purchase) ? purchase[0] : purchase;

    if (!purchaseData) {
      return {
        success: false,
        error: {
          code: 'E_UNKNOWN',
          message: 'Purchase data is empty',
        },
      };
    }

    // 구매 성공
    return {
      success: true,
      purchase: mapIAPPurchase(purchaseData),
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
        transactionDate: purchase.transactionDate,
        transactionReceipt: purchase.transactionReceipt,
        purchaseToken: purchase.purchaseToken,
      } as IAPPurchase,
      isConsumable: true, // 소모성 상품 (기부)
    });

    console.log('Purchase finalized:', purchase.productId);
  } catch (err) {
    console.error('Failed to finalize purchase:', err);
    throw err;
  }
};

/**
 * 구매 업데이트 리스너 등록
 */
export const setupPurchaseListeners = (
  onPurchaseUpdate: (purchase: Purchase) => void,
  onPurchaseError: (error: PaymentError) => void
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

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * IAP Purchase를 내부 Purchase 타입으로 변환
 */
const mapIAPPurchase = (purchase: IAPPurchase): Purchase => ({
  productId: purchase.productId,
  transactionId: purchase.transactionId || '',
  transactionDate: typeof purchase.transactionDate === 'number'
    ? purchase.transactionDate
    : Date.now(),
  transactionReceipt: purchase.transactionReceipt || '',
  purchaseToken: purchase.purchaseToken || '',
  dataAndroid: purchase.dataAndroid,
  signatureAndroid: purchase.signatureAndroid,
  purchaseStateAndroid: purchase.purchaseStateAndroid,
  originalTransactionDateIOS: purchase.originalTransactionDateIOS
    ? String(purchase.originalTransactionDateIOS)
    : undefined,
  originalTransactionIdentifierIOS: purchase.originalTransactionIdentifierIOS,
});

/**
 * IAP PurchaseError를 내부 PurchaseError 타입으로 변환
 */
const mapPurchaseError = (error: IAPPurchaseError): PaymentError => {
  let code: PurchaseErrorCode | string = 'E_UNKNOWN';

  const errorCode = String(error.code);

  if (errorCode.includes('E_USER_CANCELLED') || errorCode.includes('USER_CANCELED')) {
    code = 'E_USER_CANCELLED';
  } else if (errorCode.includes('E_ALREADY_OWNED') || errorCode.includes('ITEM_ALREADY_OWNED')) {
    code = 'E_ALREADY_OWNED';
  } else if (errorCode.includes('E_NETWORK_ERROR') || errorCode.includes('NETWORK')) {
    code = 'E_NETWORK_ERROR';
  }

  return {
    code,
    message: error.message || 'Unknown purchase error',
    debugMessage: error.message,
  };
};
