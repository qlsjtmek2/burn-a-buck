/**
 * Onboarding Screen
 *
 * 앱 최초 실행 시 표시되는 온보딩 화면
 * 2개의 슬라이드 + 닉네임 입력으로 구성
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { OnboardingScreenProps } from '../../../types/navigation';
import { setOnboardingCompleted } from '../../../utils/onboarding';
import { saveNickname } from '../../../utils/nickname';
import { colors } from '../../../theme';
import { OnboardingSlide, type OnboardingSlideData } from '../components/OnboardingSlide';
import { NicknameInputSlide } from '../components/NicknameInputSlide';
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
  const { t } = useTranslation();
  const [nickname, setNickname] = useState('');
  const [isNicknameValid, setIsNicknameValid] = useState(false);

  const totalSlides = SLIDES.length + 1; // 일반 슬라이드 + 닉네임 슬라이드

  /**
   * 온보딩 완료 처리 및 메인 화면으로 이동
   */
  const handleComplete = async () => {
    // 닉네임 유효성 검증 (블록 제출)
    if (!isNicknameValid) {
      Alert.alert(
        t('dialog.error.title'),
        t('nickname.validation.invalid')
      );
      return;
    }

    try {
      // 닉네임 저장 (trim 적용)
      const trimmedNickname = nickname.trim();
      await saveNickname(trimmedNickname);

      // 온보딩 완료 플래그 저장
      await setOnboardingCompleted();

      // 메인 화면으로 이동
      navigation.replace('Main');
    } catch (error) {
      console.error('[OnboardingScreen] Failed to complete onboarding:', error);
      Alert.alert(
        t('dialog.error.title'),
        t('common.error')
      );
    }
  };

  const { scrollViewRef, currentIndex, isLastSlide, handleNext, handleScroll } = useOnboarding({
    slides: SLIDES,
    totalSlides,
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
        {/* 일반 슬라이드 */}
        {SLIDES.map((slide, index) => (
          <OnboardingSlide key={slide.key} slide={slide} index={index} />
        ))}

        {/* 닉네임 입력 슬라이드 */}
        <NicknameInputSlide
          index={SLIDES.length}
          nickname={nickname}
          onNicknameChange={setNickname}
          onValidationChange={setIsNicknameValid}
        />
      </ScrollView>

      {/* 페이지 인디케이터 */}
      <OnboardingPagination currentIndex={currentIndex} total={totalSlides} />

      {/* 하단 버튼 영역 */}
      <OnboardingActions
        isLastSlide={isLastSlide}
        onNext={handleNext}
        onSkip={handleComplete}
        disabled={isLastSlide && !isNicknameValid}
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
