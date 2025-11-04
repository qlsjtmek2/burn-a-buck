/**
 * Main Screen
 *
 * 메인 화면 - 기부 버튼 및 리더보드
 * Phase 7에서 상세 구현 예정
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { MainScreenProps } from '../types/navigation';
import { colors } from '../theme/colors';

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

      {/* Content */}
      <View style={styles.content}>
        {/* TODO: Phase 7에서 구현 */}
        {/* - 리더보드 (Top Ranker, Recent Donations) */}
        {/* - 통계 표시 */}

        <Text style={styles.placeholder}>
          {t('main.leaderboard.placeholder')}
        </Text>
        <Text style={styles.placeholderSubtitle}>
          {t('main.leaderboard.placeholderSubtitle')}
        </Text>
      </View>

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
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  placeholder: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  placeholderSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
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
    color: colors.textOnPrimary,
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default MainScreen;
