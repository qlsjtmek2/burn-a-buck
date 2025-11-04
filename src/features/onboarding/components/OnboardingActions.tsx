/**
 * Onboarding Actions
 *
 * 온보딩 하단 버튼 영역 (다음/시작/건너뛰기)
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors, typography } from '../../../theme';

interface OnboardingActionsProps {
  isLastSlide: boolean;
  onNext: () => void;
  onSkip: () => void;
}

export const OnboardingActions: React.FC<OnboardingActionsProps> = ({
  isLastSlide,
  onNext,
  onSkip,
}) => {
  const { t } = useTranslation();

  return (
    <View style={styles.footer}>
      <TouchableOpacity
        style={styles.button}
        onPress={onNext}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={
          isLastSlide ? t('onboarding.button.start') : t('onboarding.button.next')
        }
      >
        <Text style={styles.buttonText}>
          {isLastSlide ? t('onboarding.button.start') : t('onboarding.button.next')}
        </Text>
      </TouchableOpacity>

      {/* Skip 버튼 (마지막 슬라이드가 아닐 때만 표시) */}
      {!isLastSlide && (
        <TouchableOpacity
          style={styles.skipButton}
          onPress={onSkip}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={t('onboarding.button.skip')}
        >
          <Text style={styles.skipButtonText}>{t('onboarding.button.skip')}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    paddingTop: 12,
  },
  button: {
    backgroundColor: colors.accent,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    ...typography.button,
    color: colors.textOnPrimary,
  },
  skipButton: {
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  skipButtonText: {
    ...typography.onboardingSkip,
    color: colors.textSecondary,
  },
});
