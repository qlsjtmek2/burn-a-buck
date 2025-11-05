/**
 * Donation Complete Screen
 *
 * 기부 완료 화면
 * Phase 9 구현 완료:
 * - 감사 메시지 UI with animations
 * - 최초 기부자 배지
 * - 축하 애니메이션 (별빛 효과)
 */

import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import type { DonationCompleteScreenProps } from '../../../types/navigation';
import { colors, typography } from '../../../theme';
import ThankYouMessage from '../components/ThankYouMessage';
import FirstDonorBadge from '../components/FirstDonorBadge';
import CelebrationAnimation from '../components/CelebrationAnimation';
import { ShareBottomSheet, useShare } from '../../share';
import type { ShareData } from '../../../types/share';

const DonationCompleteScreen: React.FC<DonationCompleteScreenProps> = ({
  navigation,
  route,
}) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { donation, isFirstDonation, rank, totalDonated } = route.params;

  // Share hook
  const { isBottomSheetVisible, showBottomSheet, hideBottomSheet, handleShare: shareToplatform } = useShare();

  // Prepare share data
  const shareData: ShareData = useMemo(
    () => ({
      nickname: donation.nickname,
      rank,
      totalAmount: totalDonated || donation.amount,
      donationCount: undefined, // Not available in this screen
    }),
    [donation, rank, totalDonated]
  );

  /**
   * 메인 화면으로 돌아가기
   */
  const handleBackToMain = async () => {
    // React Query 캐시 무효화 (메인 화면 즉시 업데이트)
    console.log('[DonationCompleteScreen] Invalidating cache before navigation...');
    await queryClient.invalidateQueries({ queryKey: ['leaderboard', 'top'] });
    await queryClient.invalidateQueries({ queryKey: ['donations', 'recent'] });
    await queryClient.invalidateQueries({ queryKey: ['leaderboard', 'full'] });

    navigation.navigate('Main');
  };

  /**
   * 공유 버튼 클릭 - Bottom Sheet 표시
   */
  const handleShareButtonPress = () => {
    showBottomSheet();
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

        {/* Rank Card */}
        {rank && (
          <View style={styles.statsCard}>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>{t('donationComplete.rank.label')}</Text>
              <Text style={styles.rankValue}>
                {t('donationComplete.rank.value', { rank })}
              </Text>
            </View>
          </View>
        )}

        {/* Amount Card - Total and current donation */}
        <View style={styles.statsCard}>
          {/* Total Donated */}
          {totalDonated && (
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>{t('donationComplete.totalDonated.label')}</Text>
              <Text style={styles.totalDonatedValue}>
                {t('donationComplete.totalDonated.amount', { amount: totalDonated.toLocaleString() })}
              </Text>
            </View>
          )}

          {/* This Donation */}
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>{t('donationComplete.donation.label')}</Text>
            <Text style={styles.donationValue}>
              {t('donationComplete.donation.amount', { amount: donation.amount.toLocaleString() })}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.shareButton} onPress={handleShareButtonPress}>
          <Text style={styles.shareButtonText}>{t('donationComplete.button.share')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={handleBackToMain}>
          <Text style={styles.backButtonText}>{t('donationComplete.button.backToMain')}</Text>
        </TouchableOpacity>
      </View>

      {/* Share Bottom Sheet */}
      <ShareBottomSheet
        visible={isBottomSheetVisible}
        onDismiss={hideBottomSheet}
        onSelectPlatform={(platform) => shareToplatform(platform, shareData)}
      />
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
  statsCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
    minWidth: 280,
    width: '100%',
    maxWidth: 400,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  statLabel: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
  },
  rankValue: {
    ...typography.displaySmall,
    color: colors.primary,
    fontWeight: 'bold',
  },
  totalDonatedValue: {
    ...typography.headlineMedium,
    color: colors.success,
  },
  donationValue: {
    ...typography.headlineMedium,
    color: colors.text,
  },
  footer: {
    padding: 24,
    alignItems: 'center',
  },
  shareButton: {
    backgroundColor: colors.accent,
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  shareButtonText: {
    ...typography.button,
    color: colors.textOnPrimary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  backButtonText: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    textDecorationLine: 'underline',
    fontSize: 14,
  },
});

export default DonationCompleteScreen;
