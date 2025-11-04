/**
 * Payment Service Platform Router
 *
 * Platform-specific implementation resolver
 * - React Native: Automatically resolves to payment.native.ts
 * - Web: Automatically resolves to payment.web.ts
 *
 * This file provides TypeScript type definitions only.
 * Actual implementation is platform-specific.
 */

// Re-export from platform-specific implementation
// React Native Metro bundler will automatically resolve:
// - payment.native.ts for Android/iOS
// - payment.web.ts for web
export * from './payment.native';
