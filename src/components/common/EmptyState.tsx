import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

interface EmptyStateProps {
  /** 아이콘 (이모지) */
  icon: string;
  /** 제목 */
  title: string;
  /** 메시지 */
  message: string;
}

/**
 * 빈 상태를 표시하는 재사용 가능한 컴포넌트
 *
 * 데이터가 없을 때 사용자에게 안내 메시지와 아이콘을 표시합니다.
 *
 * @example
 * ```tsx
 * <EmptyState
 *   icon="🗑️"
 *   title="아직 랭커가 없어요"
 *   message="첫 번째로 기부하고\n명예의 전당에 등록하세요!"
 * />
 * ```
 */
export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, message }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 48,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    ...typography.titleLarge,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});
