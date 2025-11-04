/**
 * Nickname Input Slide
 *
 * 온보딩 마지막 단계의 닉네임 입력 슬라이드
 * NicknameScreen의 TextField 스타일 사용 (아이콘 없음)
 */

import React from 'react';
import { View, Text, TextInput, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors, typography } from '../../../theme';
import { useNicknameValidation } from '../hooks/useNicknameValidation';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface NicknameInputSlideProps {
  index: number;
  onNicknameChange: (nickname: string) => void;
  nickname: string;
  onValidationChange: (isValid: boolean) => void;
}

export const NicknameInputSlide: React.FC<NicknameInputSlideProps> = ({
  index,
  onNicknameChange,
  nickname,
  onValidationChange,
}) => {
  const { t } = useTranslation();

  const charCount = nickname.length;
  const maxChars = 12;

  // Use validation hook with debounced duplicate check
  const {
    isChecking,
    isDuplicate,
    lengthError,
    hasError,
    isValid,
    checkError,
    retry,
  } = useNicknameValidation({ nickname });

  // Notify parent component of validation state changes
  React.useEffect(() => {
    onValidationChange(isValid);
  }, [isValid, onValidationChange]);

  return (
    <View style={styles.slide}>
      <View style={styles.slideContent}>
        {/* 제목 */}
        <Text style={styles.title}>{t('nickname.title')}</Text>

        {/* 부제목 */}
        <Text style={styles.subtitle}>{t('nickname.subtitle')}</Text>

        {/* 닉네임 입력 필드 - NicknameScreen 스타일 */}
        <View style={styles.inputContainer}>
          {/* 글자 수 표시 (TextField 위) */}
          <Text
            style={[
              styles.charCount,
              hasError && charCount > 0 && styles.charCountError,
            ]}
          >
            {t('nickname.charCount', { current: charCount, max: maxChars })}
          </Text>

          <TextInput
            style={[styles.input, hasError && styles.inputError]}
            value={nickname}
            onChangeText={onNicknameChange}
            placeholder={t('nickname.placeholder')}
            placeholderTextColor={colors.textDisabled}
            maxLength={maxChars}
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus
          />

          {/* 에러 메시지 영역 (TextField 바로 아래 왼쪽) */}
          {charCount > 0 && (
            <View style={styles.errorContainer}>
              {/* 길이 검증 에러 */}
              {lengthError && (
                <Text style={styles.errorMessage}>{lengthError}</Text>
              )}

              {/* 중복 검증 에러 */}
              {isDuplicate && (
                <Text style={styles.errorMessage}>
                  {t('nickname.validation.duplicate')}
                </Text>
              )}

              {/* 중복 확인 중 인디케이터 */}
              {isChecking && (
                <Text style={styles.checkingMessage}>
                  {t('nickname.validation.checking')}
                </Text>
              )}

              {/* 네트워크 에러 + 재시도 버튼 */}
              {checkError && (
                <View style={styles.errorWithRetry}>
                  <Text style={styles.errorMessage}>
                    {t('nickname.validation.checkFailed')}
                  </Text>
                  <TouchableOpacity onPress={retry} style={styles.retryButton}>
                    <Text style={styles.retryButtonText}>
                      {t('common.retry')}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        </View>

        {/* 안내 문구 */}
        <Text style={styles.hint}>
          {t('onboarding.nickname.hint')}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  slide: {
    width: SCREEN_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  slideContent: {
    alignItems: 'center',
    maxWidth: 400,
    width: '100%',
  },
  title: {
    ...typography.headlineLarge,
    color: colors.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.onboardingSubtitle,
    color: colors.textSecondary,
    marginBottom: 32,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 16,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    ...typography.titleMedium,
    color: colors.text,
  },
  inputError: {
    borderColor: colors.error,
  },
  charCount: {
    ...typography.bodyMedium,
    color: colors.textDisabled,
    textAlign: 'right',
    marginBottom: 4,
  },
  charCountError: {
    color: colors.error,
  },
  errorContainer: {
    marginTop: 6,
    minHeight: 20,
    alignItems: 'flex-start',
  },
  errorMessage: {
    ...typography.bodySmall,
    color: colors.error,
    textAlign: 'left',
    marginTop: 2,
  },
  checkingMessage: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textAlign: 'left',
    marginTop: 2,
  },
  errorWithRetry: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  retryButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  retryButtonText: {
    ...typography.bodySmall,
    color: colors.surface,
    fontWeight: '600',
  },
  hint: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
});
