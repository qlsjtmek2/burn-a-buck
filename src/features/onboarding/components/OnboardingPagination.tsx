/**
 * Onboarding Pagination
 *
 * 페이지 인디케이터 컴포넌트
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../../../theme';

interface OnboardingPaginationProps {
  currentIndex: number;
  total: number;
}

export const OnboardingPagination: React.FC<OnboardingPaginationProps> = ({
  currentIndex,
  total,
}) => {
  return (
    <View style={styles.pagination}>
      {Array.from({ length: total }).map((_, index) => (
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

const styles = StyleSheet.create({
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
});
