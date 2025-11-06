/**
 * Onboarding Hook
 *
 * 온보딩 스크롤 로직 관리
 */

import React, { useRef, useState, useCallback } from 'react';
import { ScrollView, Dimensions, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import type { OnboardingSlideData } from '../components/OnboardingSlide';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface UseOnboardingOptions {
  slides: OnboardingSlideData[];
  totalSlides: number;
  onComplete: () => void;
}

interface UseOnboardingReturn {
  scrollViewRef: React.RefObject<ScrollView>;
  currentIndex: number;
  isLastSlide: boolean;
  handleNext: () => void;
  handleScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

export const useOnboarding = ({
  slides,
  totalSlides,
  onComplete,
}: UseOnboardingOptions): UseOnboardingReturn => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const isLastSlide = currentIndex === totalSlides - 1;

  /**
   * ScrollView 마운트 시 초기 위치를 명시적으로 0으로 설정
   */
  React.useEffect(() => {
    // 다음 프레임에서 실행하여 레이아웃 완료 후 스크롤 위치 설정
    const timer = setTimeout(() => {
      scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: false });
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  /**
   * 다음 슬라이드로 이동
   */
  const handleNext = useCallback(() => {
    if (currentIndex < totalSlides - 1) {
      const nextIndex = currentIndex + 1;
      scrollViewRef.current?.scrollTo({
        x: nextIndex * SCREEN_WIDTH,
        animated: true,
      });
      setCurrentIndex(nextIndex);
    } else {
      onComplete();
    }
  }, [currentIndex, totalSlides, onComplete]);

  /**
   * 스크롤 위치 변경 시 현재 인덱스 업데이트
   */
  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      const index = Math.round(offsetX / SCREEN_WIDTH);
      if (index !== currentIndex && index >= 0 && index < totalSlides) {
        setCurrentIndex(index);
      }
    },
    [currentIndex, totalSlides]
  );

  return {
    scrollViewRef,
    currentIndex,
    isLastSlide,
    handleNext,
    handleScroll,
  };
};
