/**
 * First Donor Badge Component
 *
 * 최초 기부자에게 보여주는 배지 컴포넌트
 * - 애니메이션: Bounce + Fade in
 * - Google Play 배지 연동 준비 (Phase 17.5)
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withSequence,
} from 'react-native-reanimated';
import { colors, typography } from '../../../theme';

const FirstDonorBadge: React.FC = () => {
  const { t } = useTranslation();

  // Animation values
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0);
  const rotate = useSharedValue(0);

  useEffect(() => {
    // Delayed entrance animation
    opacity.value = withDelay(300, withSpring(1, { damping: 15 }));

    // Bounce scale animation
    scale.value = withDelay(
      300,
      withSequence(
        withSpring(1.2, { damping: 8, stiffness: 200 }),
        withSpring(0.95, { damping: 10, stiffness: 180 }),
        withSpring(1, { damping: 12, stiffness: 150 })
      )
    );

    // Subtle rotation for emphasis
    rotate.value = withDelay(
      300,
      withSequence(
        withSpring(-5, { damping: 10 }),
        withSpring(5, { damping: 10 }),
        withSpring(0, { damping: 15 })
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { scale: scale.value },
      { rotate: `${rotate.value}deg` },
    ] as any, // Type assertion for transform array with rotate string interpolation
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      {/* Badge icon */}
      <View style={styles.badgeIcon}>
        <Text style={styles.badgeEmoji}>🏆</Text>
      </View>

      {/* Badge text */}
      <Text style={styles.badgeText}>
        {t('donationComplete.badge.earned')}
      </Text>

      {/* Badge subtitle */}
      <Text style={styles.badgeSubtitle}>
        최초 기부자
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: colors.gold, // Gold border for first donor
    shadowColor: colors.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  badgeIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: colors.gold,
  },
  badgeEmoji: {
    fontSize: 48,
  },
  badgeText: {
    ...typography.titleLarge,
    color: colors.primary,
    marginBottom: 4,
  },
  badgeSubtitle: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
  },
});

export default FirstDonorBadge;
