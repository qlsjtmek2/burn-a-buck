/**
 * Onboarding Hook
 *
 * 온보딩 스크롤 로직 관리
 */

import { useRef, useState, useCallback } from 'react';
import { ScrollView, Dimensions, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import type { OnboardingSlideData } from '../components/OnboardingSlide';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface UseOnboardingOptions {
  slides: OnboardingSlideData[];
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
  onComplete,
}: UseOnboardingOptions): UseOnboardingReturn => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const isLastSlide = currentIndex === slides.length - 1;

  /**
   * 다음 슬라이드로 이동
   */
  const handleNext = useCallback(() => {
    if (currentIndex < slides.length - 1) {
      const nextIndex = currentIndex + 1;
      scrollViewRef.current?.scrollTo({
        x: nextIndex * SCREEN_WIDTH,
        animated: true,
      });
      setCurrentIndex(nextIndex);
    } else {
      onComplete();
    }
  }, [currentIndex, slides.length, onComplete]);

  /**
   * 스크롤 위치 변경 시 현재 인덱스 업데이트
   */
  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      const index = Math.round(offsetX / SCREEN_WIDTH);
      if (index !== currentIndex && index >= 0 && index < slides.length) {
        setCurrentIndex(index);
      }
    },
    [currentIndex, slides.length]
  );

  return {
    scrollViewRef,
    currentIndex,
    isLastSlide,
    handleNext,
    handleScroll,
  };
};
