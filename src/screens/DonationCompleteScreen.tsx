/**
 * Donation Complete Screen
 *
 * 기부 완료 화면
 * Phase 11에서 상세 구현 예정
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { DonationCompleteScreenProps } from '../types/navigation';
import { colors } from '../theme/colors';

const DonationCompleteScreen: React.FC<DonationCompleteScreenProps> = ({
  navigation,
  route,
}) => {
  const { t } = useTranslation();
  const { donation, isFirstDonation, rank } = route.params;

  /**
   * 메인 화면으로 돌아가기
   */
  const handleBackToMain = () => {
    navigation.navigate('Main');
  };

  /**
   * 공유하기
   * TODO: Phase 12에서 구현
   */
  const handleShare = () => {
    // Phase 12에서 소셜 공유 기능 구현
    console.log('[DonationCompleteScreen] Share feature - Coming in Phase 12');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Thank You Message */}
        <Text style={styles.title}>
          {t(isFirstDonation ? 'donationComplete.title.first' : 'donationComplete.title.normal')}
        </Text>

        <Text style={styles.message}>
          {t('donationComplete.message', { nickname: donation.nickname })}
        </Text>

        {/* TODO: Phase 11에서 구현 */}
        {/* - 첫 기부 시 배지 애니메이션 */}
        {/* - 현재 순위 표시 */}
        {/* - 총 기부 금액 표시 */}

        {rank && (
          <View style={styles.rankContainer}>
            <Text style={styles.rankLabel}>{t('donationComplete.rank.label')}</Text>
            <Text style={styles.rankValue}>
              {t('donationComplete.rank.value', { rank })}
            </Text>
          </View>
        )}

        <View style={styles.donationInfo}>
          <Text style={styles.donationLabel}>{t('donationComplete.donation.label')}</Text>
          <Text style={styles.donationAmount}>
            {t('donationComplete.donation.amount', { amount: donation.amount.toLocaleString() })}
          </Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Text style={styles.shareButtonText}>{t('donationComplete.button.share')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={handleBackToMain}>
          <Text style={styles.backButtonText}>{t('donationComplete.button.backToMain')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 18,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 32,
  },
  rankContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    minWidth: 200,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  rankLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  rankValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.primary,
  },
  donationInfo: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
    minWidth: 200,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  donationLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  donationAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
  },
  footer: {
    padding: 24,
  },
  shareButton: {
    backgroundColor: colors.secondary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  shareButtonText: {
    color: colors.textOnPrimary,
    fontSize: 18,
    fontWeight: '600',
  },
  backButton: {
    backgroundColor: colors.surface,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  backButtonText: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '600',
  },
});

export default DonationCompleteScreen;
