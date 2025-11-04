/**
 * Donation Complete Screen
 *
 * 기부 완료 화면
 * Phase 9 구현 완료:
 * - 감사 메시지 UI with animations
 * - 최초 기부자 배지
 * - 축하 애니메이션 (별빛 효과)
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { DonationCompleteScreenProps } from '../../../types/navigation';
import { colors, typography } from '../../../theme';
import ThankYouMessage from '../components/ThankYouMessage';
import FirstDonorBadge from '../components/FirstDonorBadge';
import CelebrationAnimation from '../components/CelebrationAnimation';

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
   * Placeholder: Social share implementation in Phase 12
   * See: CLAUDE.md - Phase 12 (Social sharing)
   */
  const handleShare = () => {
    console.log('[DonationCompleteScreen] Share feature - Coming in Phase 12');
  };

  return (
    <View style={styles.container}>
      {/* Celebration animation (only for first donation) */}
      {isFirstDonation && <CelebrationAnimation />}

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Thank You Message */}
        <ThankYouMessage
          nickname={donation.nickname}
          isFirstDonation={isFirstDonation}
        />

        {/* First Donor Badge (only for first donation) */}
        {isFirstDonation && <FirstDonorBadge />}

        {/* Rank Display */}
        {rank && (
          <View style={styles.rankContainer}>
            <Text style={styles.rankLabel}>{t('donationComplete.rank.label')}</Text>
            <Text style={styles.rankValue}>
              {t('donationComplete.rank.value', { rank })}
            </Text>
          </View>
        )}

        {/* Donation Amount */}
        <View style={styles.donationInfo}>
          <Text style={styles.donationLabel}>{t('donationComplete.donation.label')}</Text>
          <Text style={styles.donationAmount}>
            {t('donationComplete.donation.amount', { amount: donation.amount.toLocaleString() })}
          </Text>
        </View>
      </ScrollView>

      {/* Action Buttons */}
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
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    paddingTop: 48,
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
    ...typography.bodyMedium,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  rankValue: {
    ...typography.displaySmall,
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
    ...typography.bodyMedium,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  donationAmount: {
    ...typography.headlineMedium,
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
    ...typography.button,
    color: colors.textOnPrimary,
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
    ...typography.button,
    color: colors.primary,
  },
});

export default DonationCompleteScreen;
