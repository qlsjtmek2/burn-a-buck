/**
 * Main Screen
 *
 * 메인 화면 - 기부 버튼 및 리더보드
 */

import React, { useCallback, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { MainScreenProps } from '../../../types/navigation';
import { colors, typography } from '../../../theme';
import { TopRankersSection } from '../components/TopRankersSection';
import { RecentDonationsSection } from '../components/RecentDonationsSection';
import { useDonationPayment } from '../../donation/hooks/useDonationPayment';
import { PaymentLoadingDialog } from '../../donation/components/PaymentLoadingDialog';
import { PaymentErrorDialog } from '../../donation/components/PaymentErrorDialog';
import { STORAGE_KEYS } from '../../../constants/storage';
import { getNickname } from '../../../utils/nickname';

const MainScreen: React.FC<MainScreenProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const [nickname, setNickname] = useState<string>('');

  // 결제 플로우 관리 hook
  const { status, isLoading, error, startPayment, clearError } = useDonationPayment();

  /**
   * 닉네임 로드
   */
  useEffect(() => {
    const loadNickname = async () => {
      const savedNickname = await getNickname();
      if (savedNickname) {
        setNickname(savedNickname);
      }
    };

    loadNickname();
  }, []);

  /**
   * 기부 버튼 클릭 핸들러
   * useDonationPayment hook을 통해 전체 결제 플로우 시작
   */
  const handleDonation = useCallback(async () => {
    try {
      await startPayment();
    } catch (err) {
      // 에러는 hook 내부에서 처리됨
      console.error('[MainScreen] Payment error:', err);
    }
  }, [startPayment]);

  /**
   * 에러 다이얼로그 재시도 핸들러
   */
  const handleRetry = useCallback(async () => {
    clearError();
    await handleDonation();
  }, [clearError, handleDonation]);

  /**
   * 개발용: AsyncStorage 초기화
   * __DEV__ 플래그로 프로덕션 빌드에서는 자동으로 제거됨
   */
  const handleResetStorage = useCallback(async () => {
    Alert.alert(
      '🔧 개발용 초기화',
      '어떤 데이터를 초기화하시겠습니까?',
      [
        {
          text: '온보딩만 초기화',
          onPress: async () => {
            await AsyncStorage.removeItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
            Alert.alert('✅ 완료', '온보딩 플래그가 삭제되었습니다.\n앱을 재시작하세요.');
          },
        },
        {
          text: '모든 데이터 초기화',
          onPress: async () => {
            await AsyncStorage.clear();
            Alert.alert('✅ 완료', '모든 데이터가 삭제되었습니다.\n앱을 재시작하세요.');
          },
          style: 'destructive',
        },
        {
          text: '취소',
          style: 'cancel',
        },
      ]
    );
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerEmoji}>🗑️</Text>

        {nickname && (
          <Text style={styles.headerGreeting}>
            {t('main.header.greeting', { nickname })}
          </Text>
        )}

        {/* 개발용 초기화 버튼 - 프로덕션 빌드에서 자동 제거 */}
        {__DEV__ && (
          <TouchableOpacity
            style={styles.devButton}
            onPress={handleResetStorage}
            activeOpacity={0.7}
          >
            <Text style={styles.devButtonText}>🔧</Text>
          </TouchableOpacity>
        )}
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
        <TouchableOpacity
          style={styles.donationButton}
          onPress={handleDonation}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          <Text style={styles.donationButtonText}>
            {t('main.button.donate')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Payment Loading Dialog */}
      <PaymentLoadingDialog visible={isLoading} status={status} />

      {/* Payment Error Dialog */}
      <PaymentErrorDialog
        visible={!!error && status === 'error'}
        error={error}
        onClose={clearError}
        onRetry={handleRetry}
      />
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerEmoji: {
    fontSize: 24,
    position: 'absolute',
    left: 24,
    top: 48,
  },
  headerGreeting: {
    ...typography.titleMedium,
    color: colors.textPrimary,
  },
  devButton: {
    position: 'absolute',
    right: 24,
    top: 48,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.error + '20', // 20% opacity
    justifyContent: 'center',
    alignItems: 'center',
  },
  devButtonText: {
    fontSize: 18,
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
