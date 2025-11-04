/**
 * Nickname Input Slide
 *
 * 온보딩 마지막 단계의 닉네임 입력 슬라이드
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Alert } from 'react-native';
import { TextInput } from 'react-native-paper';
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
  const [isFocused, setIsFocused] = useState(false);

  const charCount = nickname.length;
  const maxChars = 12;
  const isValid = charCount >= 2 && charCount <= maxChars;

  return (
    <View style={styles.slide}>
      <View style={styles.slideContent}>
        {/* 이모지 */}
        <Text style={styles.emoji} accessibilityLabel={`Slide ${index + 1}`}>
          👤
        </Text>

        {/* 제목 */}
        <Text style={styles.title}>{t('nickname.title')}</Text>

        {/* 부제목 */}
        <Text style={styles.subtitle}>{t('nickname.subtitle')}</Text>

        {/* 닉네임 입력 필드 */}
        <View style={styles.inputContainer}>
          <TextInput
            mode="outlined"
            label={t('nickname.placeholder')}
            value={nickname}
            onChangeText={onNicknameChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            maxLength={maxChars}
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.input}
            outlineColor={colors.border}
            activeOutlineColor={colors.primary}
            textColor={colors.text}
            placeholderTextColor={colors.textSecondary}
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
  emoji: {
    ...typography.onboardingEmoji,
    marginBottom: 32,
  },
  title: {
    ...typography.headlineLarge,
    color: colors.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.onboardingSubtitle,
    color: colors.text,
    marginBottom: 32,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 16,
  },
  input: {
    backgroundColor: colors.surface,
    fontSize: 16,
  },
  charCount: {
    ...typography.bodySmall,
    color: colors.textSecondary,
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
