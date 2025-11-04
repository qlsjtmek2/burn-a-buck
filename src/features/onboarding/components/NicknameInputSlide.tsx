/**
 * Nickname Input Slide
 *
 * 온보딩 마지막 단계의 닉네임 입력 슬라이드
 * NicknameScreen의 TextField 스타일 사용 (아이콘 없음)
 */

import React from 'react';
import { View, Text, TextInput, StyleSheet, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors, typography } from '../../../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface NicknameInputSlideProps {
  index: number;
  onNicknameChange: (nickname: string) => void;
  nickname: string;
}

export const NicknameInputSlide: React.FC<NicknameInputSlideProps> = ({
  index,
  onNicknameChange,
  nickname,
}) => {
  const { t } = useTranslation();

  const charCount = nickname.length;
  const maxChars = 12;
  const isValid = charCount >= 2 && charCount <= maxChars;

  return (
    <View style={styles.slide}>
      <View style={styles.slideContent}>
        {/* 제목 */}
        <Text style={styles.title}>{t('nickname.title')}</Text>

        {/* 부제목 */}
        <Text style={styles.subtitle}>{t('nickname.subtitle')}</Text>

        {/* 닉네임 입력 필드 - NicknameScreen 스타일 */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={nickname}
            onChangeText={onNicknameChange}
            placeholder={t('nickname.placeholder')}
            placeholderTextColor={colors.textDisabled}
            maxLength={maxChars}
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus
          />

          {/* 글자 수 표시 */}
          <Text
            style={[
              styles.charCount,
              !isValid && charCount > 0 && styles.charCountError,
            ]}
          >
            {t('nickname.charCount', { current: charCount, max: maxChars })}
          </Text>

          {/* 유효성 검증 메시지 */}
          {charCount > 0 && !isValid && (
            <Text style={styles.validationMessage}>
              {charCount < 2
                ? t('nickname.validation.tooShort')
                : t('nickname.validation.tooLong')}
            </Text>
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
  charCount: {
    ...typography.bodyMedium,
    color: colors.textDisabled,
    textAlign: 'right',
    marginTop: 8,
  },
  charCountError: {
    color: colors.error,
  },
  validationMessage: {
    ...typography.bodySmall,
    color: colors.error,
    marginTop: 4,
    textAlign: 'center',
  },
  hint: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
});
