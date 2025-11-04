/**
 * Thank You Message Component
 *
 * 기부 완료 후 표시되는 감사 메시지 컴포넌트
 * - 애니메이션: Fade in + Scale up
 * - 최초 기부 여부에 따라 다른 메시지 표시
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import { colors, typography } from '../../../theme';

interface ThankYouMessageProps {
  nickname: string;
  isFirstDonation: boolean;
}

const ThankYouMessage: React.FC<ThankYouMessageProps> = ({
  nickname,
  isFirstDonation,
}) => {
  const { t } = useTranslation();

  // Animation values
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);

  useEffect(() => {
    // Fade in + Scale up animation
    opacity.value = withSpring(1, { damping: 15, stiffness: 100 });
    scale.value = withSequence(
      withSpring(1.1, { damping: 10, stiffness: 200 }),
      withSpring(1, { damping: 15, stiffness: 100 })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      {/* Title with emoji */}
      <Text style={styles.title}>
        {t(isFirstDonation ? 'donationComplete.title.first' : 'donationComplete.title.normal')}
      </Text>

      {/* Thank you message */}
      <Text style={styles.message}>
        {t('donationComplete.message', { nickname })}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    ...typography.headlineLarge,
    color: colors.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    ...typography.titleMedium,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 28,
  },
});

export default ThankYouMessage;
