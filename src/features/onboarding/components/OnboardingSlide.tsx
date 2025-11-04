/**
 * Onboarding Slide
 *
 * 개별 온보딩 슬라이드 컴포넌트
 */

import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors, typography } from '../../../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export interface OnboardingSlideData {
  key: string;
  titleKey: string;
  subtitleKey: string;
  descriptionKey: string;
  emoji?: string;
}

interface OnboardingSlideProps {
  slide: OnboardingSlideData;
  index: number;
}

export const OnboardingSlide: React.FC<OnboardingSlideProps> = ({ slide, index }) => {
  const { t } = useTranslation();

  return (
    <View style={styles.slide}>
      <View style={styles.slideContent}>
        {/* 이모지 */}
        {slide.emoji && (
          <Text style={styles.emoji} accessibilityLabel={`Slide ${index + 1}`}>
            {slide.emoji}
          </Text>
        )}

        {/* 제목 */}
        <Text style={styles.title}>{t(slide.titleKey)}</Text>

        {/* 부제목 */}
        <Text style={styles.subtitle}>{t(slide.subtitleKey)}</Text>

        {/* 설명 */}
        <Text style={styles.description}>{t(slide.descriptionKey)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  slide: {
    width: SCREEN_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  slideContent: {
    alignItems: 'center',
    maxWidth: 400,
  },
  emoji: {
    ...typography.onboardingEmoji,
    marginBottom: 32,
  },
  title: {
    ...typography.headlineLarge,
    color: colors.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.onboardingSubtitle,
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    ...typography.bodyLarge,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
