/**
 * Payment Loading Dialog
 *
 * 결제 진행 중 로딩 다이얼로그
 */

import React from 'react';
import { StyleSheet, View, Text, Modal, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors, typography } from '../theme';
import type { PaymentStatus } from '../types/payment';

interface PaymentLoadingDialogProps {
  /** 표시 여부 */
  visible: boolean;
  /** 현재 결제 상태 */
  status: PaymentStatus;
}

/**
 * 결제 로딩 다이얼로그 컴포넌트
 */
export const PaymentLoadingDialog: React.FC<PaymentLoadingDialogProps> = ({
  visible,
  status,
}) => {
  const { t } = useTranslation();

  if (!visible) {
    return null;
  }

  // 상태별 메시지 매핑
  const getStatusMessage = (): string => {
    switch (status) {
      case 'initializing':
        return t('payment.loading.initializing');
      case 'loading_products':
        return t('payment.loading.loadingProducts');
      case 'purchasing':
        return t('payment.loading.purchasing');
      case 'validating':
        return t('payment.loading.validating');
      case 'saving':
        return t('payment.loading.saving');
      default:
        return t('payment.loading.processing');
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => {}}
    >
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          {/* 로딩 인디케이터 */}
          <ActivityIndicator size="large" color={colors.primary} />

          {/* 상태 메시지 */}
          <Text style={styles.message}>{getStatusMessage()}</Text>

          {/* 힌트 */}
          <Text style={styles.hint}>{t('payment.loading.hint')}</Text>
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
    padding: 32,
    width: '100%',
    maxWidth: 300,
    alignItems: 'center',
  },
  message: {
    ...typography.titleSmall,
    color: colors.text,
    marginTop: 16,
    textAlign: 'center',
  },
  hint: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
});

export default PaymentLoadingDialog;
