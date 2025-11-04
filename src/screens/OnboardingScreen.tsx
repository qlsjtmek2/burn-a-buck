/**
 * Onboarding Screen
 *
 * 앱 최초 실행 시 표시되는 온보딩 화면
 * 3개의 슬라이드로 구성된 인트로 화면
 */

import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import type { OnboardingScreenProps } from '../types/navigation';
import { setOnboardingCompleted } from '../utils/onboarding';
import { colors } from '../theme/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/**
 * 온보딩 슬라이드 데이터
 */
interface OnboardingSlide {
  key: string;
  titleKey: string;
  subtitleKey: string;
  descriptionKey: string;
  emoji?: string;
}

const SLIDES: OnboardingSlide[] = [
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
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

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

  /**
   * 다음 슬라이드로 이동
   */
  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      const nextIndex = currentIndex + 1;
      scrollViewRef.current?.scrollTo({
        x: nextIndex * SCREEN_WIDTH,
        animated: true,
      });
      setCurrentIndex(nextIndex);
    } else {
      handleComplete();
    }
  };

  /**
   * 스크롤 위치 변경 시 현재 인덱스 업데이트
   */
  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SCREEN_WIDTH);
    if (index !== currentIndex && index >= 0 && index < SLIDES.length) {
      setCurrentIndex(index);
    }
  };

  /**
   * 페이지 인디케이터 렌더링
   */
  const renderPagination = () => {
    return (
      <View style={styles.pagination}>
        {SLIDES.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              index === currentIndex && styles.paginationDotActive,
            ]}
          />
        ))}
      </View>
    );
  };

  /**
   * 슬라이드 렌더링
   */
  const renderSlide = (slide: OnboardingSlide, index: number) => {
    return (
      <View key={slide.key} style={styles.slide}>
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

  const isLastSlide = currentIndex === SLIDES.length - 1;

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
        {SLIDES.map((slide, index) => renderSlide(slide, index))}
      </ScrollView>

      {/* 페이지 인디케이터 */}
      {renderPagination()}

      {/* 하단 버튼 영역 */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleNext}
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
            onPress={handleComplete}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={t('onboarding.button.skip')}
          >
            <Text style={styles.skipButtonText}>{t('onboarding.button.skip')}</Text>
          </TouchableOpacity>
        )}
      </View>
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
    fontSize: 80,
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: colors.primary,
    width: 24,
  },
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
    color: colors.textOnPrimary,
    fontSize: 18,
    fontWeight: '600',
  },
  skipButton: {
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  skipButtonText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default OnboardingScreen;
