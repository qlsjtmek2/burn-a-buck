/**
 * Celebration Animation Component
 *
 * 최초 기부 완료 시 표시되는 축하 애니메이션
 * - 별빛/불꽃놀이 효과
 * - 자동으로 페이드 아웃
 */

import React, { useEffect } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  withRepeat,
  Easing,
} from 'react-native-reanimated';
import { colors } from '../../../theme';

const { width, height } = Dimensions.get('window');

interface StarProps {
  delay: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  size: number;
}

/**
 * Single star particle component
 */
const Star: React.FC<StarProps> = ({ delay, startX, startY, endX, endY, size }) => {
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(startX);
  const translateY = useSharedValue(startY);
  const scale = useSharedValue(0);

  useEffect(() => {
    // Fade in and scale up
    opacity.value = withDelay(
      delay,
      withSequence(
        withTiming(1, { duration: 200 }),
        withDelay(800, withTiming(0, { duration: 400 }))
      )
    );

    scale.value = withDelay(
      delay,
      withSequence(
        withTiming(1, { duration: 200, easing: Easing.out(Easing.cubic) }),
        withDelay(800, withTiming(0.5, { duration: 400 }))
      )
    );

    // Move outward
    translateX.value = withDelay(
      delay,
      withTiming(endX, {
        duration: 1200,
        easing: Easing.out(Easing.quad),
      })
    );

    translateY.value = withDelay(
      delay,
      withTiming(endY, {
        duration: 1200,
        easing: Easing.in(Easing.quad),
      })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ] as any, // Type assertion for transform array
  }));

  return (
    <Animated.View
      style={[
        styles.star,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
        animatedStyle,
      ]}
    />
  );
};

/**
 * Main celebration animation container
 */
const CelebrationAnimation: React.FC = () => {
  // Generate random stars
  const stars = Array.from({ length: 20 }, (_, i) => {
    const angle = (Math.PI * 2 * i) / 20; // Evenly distribute in circle
    const distance = 150 + Math.random() * 100; // Random distance

    return {
      key: i,
      delay: Math.random() * 300, // Stagger animation
      startX: width / 2,
      startY: height / 2,
      endX: width / 2 + Math.cos(angle) * distance,
      endY: height / 2 + Math.sin(angle) * distance,
      size: 8 + Math.random() * 8, // Random size 8-16px
    };
  });

  return (
    <>
      {stars.map((star) => (
        <Star
          key={star.key}
          delay={star.delay}
          startX={star.startX}
          startY={star.startY}
          endX={star.endX}
          endY={star.endY}
          size={star.size}
        />
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  star: {
    position: 'absolute',
    backgroundColor: colors.accent,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default CelebrationAnimation;
