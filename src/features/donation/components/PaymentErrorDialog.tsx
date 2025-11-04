/**
 * Payment Error Dialog
 *
 * 결제 에러 다이얼로그
 */

import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal } from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors, typography } from '../../../theme';
import type { PaymentError } from '../../../types/payment';
import { PAYMENT_ERROR_CODES } from '../../../constants/payment';

interface PaymentErrorDialogProps {
  /** 표시 여부 */
  visible: boolean;
  /** 에러 정보 */
  error: PaymentError | null;
  /** 닫기 콜백 */
  onClose: () => void;
  /** 재시도 콜백 (선택사항) */
  onRetry?: () => void;
}

/**
 * 결제 에러 다이얼로그 컴포넌트
 */
export const PaymentErrorDialog: React.FC<PaymentErrorDialogProps> = ({
  visible,
  error,
  onClose,
  onRetry,
}) => {
  const { t } = useTranslation();

  if (!visible || !error) {
    return null;
  }

  // 사용자 취소는 다이얼로그를 표시하지 않음
  if (error.code === PAYMENT_ERROR_CODES.USER_CANCELLED) {
    return null;
  }

  // 재시도 가능 여부 (네트워크 에러 등)
  const canRetry = [
    PAYMENT_ERROR_CODES.NETWORK_ERROR,
    PAYMENT_ERROR_CODES.INIT_FAILED,
    PAYMENT_ERROR_CODES.PRODUCT_NOT_FOUND,
    PAYMENT_ERROR_CODES.PURCHASE_FAILED,
  ].includes(error.code as any);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          {/* 아이콘 */}
          <View style={styles.iconContainer}>
            <Text style={styles.iconText}>⚠️</Text>
          </View>

          {/* 제목 */}
          <Text style={styles.title}>{t('payment.error.title')}</Text>

          {/* 메시지 */}
          <Text style={styles.message}>{error.message}</Text>

          {/* 에러 코드 (디버깅용) */}
          {__DEV__ && (
            <Text style={styles.debugInfo}>Error Code: {error.code}</Text>
          )}

          {/* 버튼 */}
          <View style={styles.buttonContainer}>
            {canRetry && onRetry && (
              <TouchableOpacity
                style={[styles.button, styles.retryButton]}
                onPress={onRetry}
                activeOpacity={0.8}
              >
                <Text style={[styles.buttonText, styles.retryButtonText]}>
                  {t('payment.error.retry')}
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.button, styles.closeButton]}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Text style={[styles.buttonText, styles.closeButtonText]}>
                {canRetry ? t('payment.error.cancel') : t('payment.error.close')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  dialog: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.errorAlpha[10],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconText: {
    ...typography.headlineLarge,
  },
  title: {
    ...typography.leaderboardName,
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  debugInfo: {
    ...typography.debugInfo,
    color: colors.error,
    textAlign: 'center',
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginTop: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryButton: {
    backgroundColor: colors.primary,
  },
  closeButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonText: {
    ...typography.labelLarge,
  },
  retryButtonText: {
    color: colors.textOnPrimary,
  },
  closeButtonText: {
    color: colors.text,
  },
});

export default PaymentErrorDialog;
