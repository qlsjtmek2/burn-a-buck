/**
 * Nickname Screen
 *
 * 닉네임 입력 화면
 * Phase 10에서 상세 구현 예정
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NicknameScreenProps } from '../../../types/navigation';
import { saveNickname } from '../../../utils/donationStorage';
import { colors, typography } from '../../../theme';

const NicknameScreen: React.FC<NicknameScreenProps> = ({
  navigation,
  route,
}) => {
  const { t } = useTranslation();
  const [nickname, setNickname] = useState('');
  const { donation, isFirstDonation } = route.params || {};

  /**
   * 닉네임 저장 및 완료 화면으로 이동
   */
  const handleSubmit = async () => {
    if (nickname.trim().length < 2) {
      // Placeholder: Full validation in Phase 10
      // See: CLAUDE.md - Phase 10 (Nickname validation)
      Alert.alert(t('dialog.error.title'), t('nickname.validation.tooShort'));
      return;
    }

    try {
      // 닉네임 저장
      await saveNickname(nickname.trim());

      // 완료 화면으로 이동
      navigation.navigate('DonationComplete', {
        donation: donation || {
          nickname: nickname.trim(),
          amount: 1000,
          receiptToken: 'temp-receipt-token',
          transactionId: 'temp-transaction-id',
          platform: 'android',
        },
        isFirstDonation: isFirstDonation || false,
      });
    } catch (error) {
      console.error('[NicknameScreen] Failed to save nickname:', error);
      Alert.alert(t('dialog.error.title'), t('common.error'));
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <Text style={styles.title}>{t('nickname.title')}</Text>
        <Text style={styles.subtitle}>{t('nickname.subtitle')}</Text>

        {/*
          Placeholder: Full implementation in Phase 10
          - Nickname validation (2-12 chars, duplicate check)
          - Duplicate nickname confirmation dialog
          - Auto-fill saved nickname
          See: CLAUDE.md - Phase 10
        */}

        <TextInput
          style={styles.input}
          value={nickname}
          onChangeText={setNickname}
          placeholder={t('nickname.placeholder')}
          placeholderTextColor={colors.textDisabled}
          maxLength={12}
          autoFocus
        />

        <Text style={styles.charCount}>
          {t('nickname.charCount', { current: nickname.length, max: 12 })}
        </Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.button,
            nickname.trim().length < 2 && styles.buttonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={nickname.trim().length < 2}
        >
          <Text style={styles.buttonText}>{t('nickname.button.submit')}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    ...typography.headlineMedium,
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    ...typography.bodyLarge,
    color: colors.textSecondary,
    marginBottom: 32,
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
  footer: {
    padding: 24,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: colors.border,
  },
  buttonText: {
    ...typography.button,
    color: colors.textOnPrimary,
  },
});

export default NicknameScreen;
