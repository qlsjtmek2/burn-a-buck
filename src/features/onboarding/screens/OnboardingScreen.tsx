/**
 * Onboarding Screen
 *
 * 앱 최초 실행 시 표시되는 온보딩 화면
 * 2개의 슬라이드로 구성된 인트로 화면
 */

import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import type { OnboardingScreenProps } from '../../../types/navigation';
import { setOnboardingCompleted } from '../../../utils/onboarding';
import { colors } from '../../../theme';
import { OnboardingSlide, type OnboardingSlideData } from '../components/OnboardingSlide';
import { OnboardingPagination } from '../components/OnboardingPagination';
import { OnboardingActions } from '../components/OnboardingActions';
import { useOnboarding } from '../hooks/useOnboarding';

/**
 * 온보딩 슬라이드 데이터
 */
const SLIDES: OnboardingSlideData[] = [
  {
    key: 'welcome',
    titleKey: 'onboarding.slides.welcome.title',
    subtitleKey: 'onboarding.slides.welcome.subtitle',
    descriptionKey: 'onboarding.slides.welcome.description',
    emoji: '🗑️',
  },
  {
    key: 'support',
    titleKey: 'onboarding.slides.support.title',
    subtitleKey: 'onboarding.slides.support.subtitle',
    descriptionKey: 'onboarding.slides.support.description',
    emoji: '🎁',
  },
];

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ navigation }) => {
  /**
   * 온보딩 완료 처리 및 메인 화면으로 이동
   */
  const handleComplete = async () => {
    try {
      await setOnboardingCompleted();
      navigation.replace('Main');
    } catch (error) {
      console.error('[OnboardingScreen] Failed to complete onboarding:', error);
    }
  };

  const { scrollViewRef, currentIndex, isLastSlide, handleNext, handleScroll } = useOnboarding({
    slides: SLIDES,
    onComplete: handleComplete,
  });

  return (
    <View style={styles.container}>
      {/* 슬라이드 ScrollView */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
        bounces={false}
      >
        {SLIDES.map((slide, index) => (
          <OnboardingSlide key={slide.key} slide={slide} index={index} />
        ))}
      </ScrollView>

      {/* 페이지 인디케이터 */}
      <OnboardingPagination currentIndex={currentIndex} total={SLIDES.length} />

      {/* 하단 버튼 영역 */}
      <OnboardingActions
        isLastSlide={isLastSlide}
        onNext={handleNext}
        onSkip={handleComplete}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
});

export default OnboardingScreen;
