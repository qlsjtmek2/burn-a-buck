/**
 * i18next Configuration
 *
 * React Native 앱의 다국어 지원 설정
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/storage';

// 번역 리소스
import koTranslation from '../locales/ko/translation.json';
import enTranslation from '../locales/en/translation.json';

/**
 * 지원 언어 목록
 */
export const SUPPORTED_LANGUAGES = {
  ko: 'Korean',
  en: 'English',
} as const;

export type SupportedLanguage = keyof typeof SUPPORTED_LANGUAGES;

/**
 * 번역 리소스 객체
 */
const resources = {
  ko: {
    translation: koTranslation,
  },
  en: {
    translation: enTranslation,
  },
};

/**
 * 디바이스 언어 감지
 *
 * @returns 디바이스의 언어 코드 (ko 또는 en, 지원하지 않는 언어는 ko로 폴백)
 */
export function getDeviceLanguage(): SupportedLanguage {
  const locales = Localization.getLocales();
  const deviceLanguage = locales[0]?.languageCode;

  console.log('[i18n] Device locales:', locales);
  console.log('[i18n] Detected language:', deviceLanguage);

  // 지원하는 언어인지 확인
  if (deviceLanguage === 'ko' || deviceLanguage === 'en') {
    return deviceLanguage;
  }

  // 지원하지 않는 언어는 한국어로 폴백
  return 'ko';
}

/**
 * 저장된 언어 설정 불러오기
 *
 * @returns 저장된 언어 코드 또는 null
 */
export async function getSavedLanguage(): Promise<SupportedLanguage | null> {
  try {
    const savedLanguage = await AsyncStorage.getItem(STORAGE_KEYS.APP_LANGUAGE);
    if (savedLanguage === 'ko' || savedLanguage === 'en') {
      return savedLanguage;
    }
    return null;
  } catch (error) {
    console.error('[i18n] Failed to get saved language:', error);
    return null;
  }
}

/**
 * 언어 설정 저장
 *
 * @param language - 저장할 언어 코드
 */
export async function saveLanguage(language: SupportedLanguage): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.APP_LANGUAGE, language);
    console.log('[i18n] Language saved:', language);
  } catch (error) {
    console.error('[i18n] Failed to save language:', error);
  }
}

/**
 * 초기 언어 결정
 *
 * 1. AsyncStorage에 저장된 언어가 있으면 사용
 * 2. 없으면 디바이스 언어 사용
 * 3. 지원하지 않는 언어는 한국어로 폴백
 */
async function getInitialLanguage(): Promise<SupportedLanguage> {
  const savedLanguage = await getSavedLanguage();

  if (savedLanguage) {
    console.log('[i18n] Using saved language:', savedLanguage);
    return savedLanguage;
  }

  const deviceLanguage = getDeviceLanguage();
  console.log('[i18n] Using device language:', deviceLanguage);

  // 디바이스 언어를 저장 (다음에는 바로 사용)
  await saveLanguage(deviceLanguage);

  return deviceLanguage;
}

/**
 * i18next 초기화
 *
 * React Native 앱 시작 시 호출
 */
export async function initializeI18n(): Promise<void> {
  const initialLanguage = await getInitialLanguage();

  await i18n
    .use(initReactI18next) // React i18next 바인딩
    .init({
      resources,
      lng: initialLanguage, // 초기 언어
      fallbackLng: 'ko', // 폴백 언어
      compatibilityJSON: 'v3', // React Native에서 중요: Intl API 없이 작동
      interpolation: {
        escapeValue: false, // React에서는 XSS 방지가 기본
      },
      react: {
        useSuspense: false, // React Native에서는 Suspense 사용 안 함
      },
    });

  console.log('[i18n] Initialized with language:', initialLanguage);
}

/**
 * 언어 변경
 *
 * @param language - 변경할 언어 코드
 */
export async function changeLanguage(
  language: SupportedLanguage
): Promise<void> {
  try {
    await i18n.changeLanguage(language);
    await saveLanguage(language);
    console.log('[i18n] Language changed to:', language);
  } catch (error) {
    console.error('[i18n] Failed to change language:', error);
    throw error;
  }
}

/**
 * 현재 언어 가져오기
 */
export function getCurrentLanguage(): SupportedLanguage {
  return i18n.language as SupportedLanguage;
}

export default i18n;
