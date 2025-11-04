/**
 * Error Handler
 *
 * 중앙화된 에러 처리 유틸리티
 * - 일관된 에러 메시지 포맷
 * - i18n 지원
 * - 로깅 (향후 Sentry 통합 준비)
 */

import { Alert } from 'react-native';
import i18n from '../config/i18n';
import type { PaymentError, PurchaseErrorCode } from '../types/payment';

// ============================================================================
// Error Message Mapping
// ============================================================================

/**
 * 결제 에러 코드별 i18n 키 매핑
 */
const PAYMENT_ERROR_KEYS: Record<string, { title: string; message: string }> = {
  E_USER_CANCELLED: {
    title: 'payment.error.cancelled.title',
    message: 'payment.error.cancelled.message',
  },
  E_NETWORK_ERROR: {
    title: 'payment.error.network.title',
    message: 'payment.error.network.message',
  },
  E_ALREADY_OWNED: {
    title: 'payment.error.alreadyOwned.title',
    message: 'payment.error.alreadyOwned.message',
  },
  E_RECEIPT_VALIDATION_FAILED: {
    title: 'payment.error.validation.title',
    message: 'payment.error.validation.message',
  },
  E_UNKNOWN: {
    title: 'payment.error.unknown.title',
    message: 'payment.error.unknown.message',
  },
};

/**
 * 일반 에러 키
 */
const GENERAL_ERROR_KEYS = {
  title: 'error.general.title',
  message: 'error.general.message',
};

// ============================================================================
// Error Handler Functions
// ============================================================================

/**
 * 결제 에러 정보 추출
 *
 * @param error - PaymentError 객체
 * @returns 사용자에게 표시할 제목과 메시지
 */
export const getPaymentErrorInfo = (
  error: PaymentError | null | undefined
): { title: string; message: string } => {
  if (!error) {
    return {
      title: i18n.t(GENERAL_ERROR_KEYS.title),
      message: i18n.t(GENERAL_ERROR_KEYS.message),
    };
  }

  const errorKeys = PAYMENT_ERROR_KEYS[error.code] || PAYMENT_ERROR_KEYS.E_UNKNOWN;

  return {
    title: i18n.t(errorKeys.title),
    message: i18n.t(errorKeys.message),
  };
};

/**
 * 결제 에러 Alert 표시
 *
 * @param error - PaymentError 객체
 * @param onDismiss - Alert 닫기 콜백
 */
export const showPaymentErrorAlert = (
  error: PaymentError | null | undefined,
  onDismiss?: () => void
): void => {
  const { title, message } = getPaymentErrorInfo(error);

  Alert.alert(title, message, [
    {
      text: i18n.t('common.ok'),
      onPress: onDismiss,
    },
  ]);
};

/**
 * 일반 에러 Alert 표시
 *
 * @param message - 에러 메시지 (또는 i18n 키)
 * @param onDismiss - Alert 닫기 콜백
 */
export const showErrorAlert = (message: string, onDismiss?: () => void): void => {
  const title = i18n.t(GENERAL_ERROR_KEYS.title);
  const errorMessage = i18n.exists(message) ? i18n.t(message) : message;

  Alert.alert(title, errorMessage, [
    {
      text: i18n.t('common.ok'),
      onPress: onDismiss,
    },
  ]);
};

/**
 * 확인 다이얼로그 표시
 *
 * @param title - 제목 (또는 i18n 키)
 * @param message - 메시지 (또는 i18n 키)
 * @param onConfirm - 확인 콜백
 * @param onCancel - 취소 콜백
 */
export const showConfirmDialog = (
  title: string,
  message: string,
  onConfirm: () => void,
  onCancel?: () => void
): void => {
  const dialogTitle = i18n.exists(title) ? i18n.t(title) : title;
  const dialogMessage = i18n.exists(message) ? i18n.t(message) : message;

  Alert.alert(dialogTitle, dialogMessage, [
    {
      text: i18n.t('common.cancel'),
      style: 'cancel',
      onPress: onCancel,
    },
    {
      text: i18n.t('common.ok'),
      onPress: onConfirm,
    },
  ]);
};

// ============================================================================
// Error Logging
// ============================================================================

/**
 * 에러 로깅 (향후 Sentry 통합)
 *
 * @param context - 에러 발생 컨텍스트
 * @param error - 에러 객체
 * @param metadata - 추가 메타데이터
 */
export const logError = (
  context: string,
  error: unknown,
  metadata?: Record<string, unknown>
): void => {
  const errorMessage = error instanceof Error ? error.message : String(error);

  console.error(`[${context}] Error:`, errorMessage);

  if (metadata) {
    console.error(`[${context}] Metadata:`, metadata);
  }

  // Placeholder: Sentry integration in Phase 17
  // See: CLAUDE.md - Phase 17 (Production monitoring)
  // Sentry.captureException(error, {
  //   tags: { context },
  //   extra: metadata,
  // });
};

/**
 * 결제 에러 로깅
 *
 * @param error - PaymentError 객체
 * @param metadata - 추가 메타데이터
 */
export const logPaymentError = (
  error: PaymentError,
  metadata?: Record<string, unknown>
): void => {
  logError('Payment', error, {
    code: error.code,
    message: error.message,
    debugMessage: error.debugMessage,
    ...metadata,
  });
};

// ============================================================================
// Error Boundary Helpers
// ============================================================================

/**
 * 안전한 비동기 함수 실행 래퍼
 *
 * @param fn - 실행할 비동기 함수
 * @param context - 에러 컨텍스트
 * @param onError - 에러 처리 콜백
 */
export const safeAsync = async <T>(
  fn: () => Promise<T>,
  context: string,
  onError?: (error: unknown) => void
): Promise<T | null> => {
  try {
    return await fn();
  } catch (error) {
    logError(context, error);

    if (onError) {
      onError(error);
    }

    return null;
  }
};
