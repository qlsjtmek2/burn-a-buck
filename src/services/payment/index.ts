/**
 * Payment Service (Platform Router)
 *
 * 플랫폼별 IAP 구현을 라우팅하는 진입점
 */

// Export constants
export * from './constants';

// Export validation functions
export * from './validation';

// Export IAP functions (platform-specific)
export {
  initializeIAP,
  terminateIAP,
  getProductInfo,
  purchaseProduct,
  finalizePurchase,
  setupPurchaseListeners,
} from './iap.native'; // React Native automatically picks .native.ts on mobile, .web.ts on web

// Re-export validation functions explicitly for backward compatibility
export { validateReceiptClient, extractPurchaseToken } from './validation';

// Re-export constants explicitly for backward compatibility
export { PRODUCT_IDS } from './constants';
