/**
 * Main Screen
 *
 * 메인 화면 - 기부 버튼 및 리더보드
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { MainScreenProps } from '../types/navigation';
import { colors, typography } from '../theme';
import { TopRankersSection } from '../components/leaderboard/TopRankersSection';
import { RecentDonationsSection } from '../components/leaderboard/RecentDonationsSection';

const MainScreen: React.FC<MainScreenProps> = ({ navigation }) => {
  const { t } = useTranslation();
  /**
   * 기부 버튼 클릭 핸들러
   * TODO: Phase 8에서 결제 플로우 연동
   */
  const handleDonation = () => {
    // 임시: 닉네임 화면으로 이동
    navigation.navigate('Nickname', {});
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('main.header.title')}</Text>
      </View>

      {/* Content - 스크롤 가능한 리더보드 섹션들 */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Rankers (1~3등) */}
        <TopRankersSection />

        {/* Recent Donations (최근 10명) */}
        <RecentDonationsSection />
      </ScrollView>

      {/* Donation Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.donationButton} onPress={handleDonation}>
          <Text style={styles.donationButtonText}>
            {t('main.button.donate')}
          </Text>
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
  header: {
    paddingTop: 48,
    paddingHorizontal: 24,
    paddingBottom: 16,
    backgroundColor: colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    ...typography.headlineSmall,
    color: colors.primary,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 24,
    paddingBottom: 16,
  },
  footer: {
    padding: 24,
  },
  donationButton: {
    backgroundColor: colors.accent,
    paddingVertical: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  donationButtonText: {
    ...typography.leaderboardName,
    color: colors.textOnPrimary,
  },
});

export default MainScreen;
