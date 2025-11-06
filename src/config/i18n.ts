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
import deTranslation from '../locales/de-DE/translation.json';
import esUSTranslation from '../locales/es-US/translation.json';
import esESTranslation from '../locales/es-ES/translation.json';
import enUSTranslation from '../locales/en-US/translation.json';
import enGBTranslation from '../locales/en-GB/translation.json';
import itTranslation from '../locales/it-IT/translation.json';
import jaTranslation from '../locales/ja-JP/translation.json';
import ptBRTranslation from '../locales/pt-BR/translation.json';
import ptPTTranslation from '../locales/pt-PT/translation.json';
import frCATranslation from '../locales/fr-CA/translation.json';
import frFRTranslation from '../locales/fr-FR/translation.json';

/**
 * 지원 언어 목록
 */
export const SUPPORTED_LANGUAGES = {
  'ko-KR': '한국어',
  'de-DE': 'Deutsch',
  'es-US': 'Español (Estados Unidos)',
  'es-ES': 'Español (España)',
  'en-US': 'English (United States)',
  'en-GB': 'English (United Kingdom)',
  'it-IT': 'Italiano',
  'ja-JP': '日本語',
  'pt-BR': 'Português (Brasil)',
  'pt-PT': 'Português (Portugal)',
  'fr-CA': 'Français (Canada)',
  'fr-FR': 'Français (France)',
} as const;

export type SupportedLanguage = keyof typeof SUPPORTED_LANGUAGES;

/**
 * 번역 리소스 객체
 */
const resources = {
  'ko-KR': {
    translation: koTranslation,
  },
  'de-DE': {
    translation: deTranslation,
  },
  'es-US': {
    translation: esUSTranslation,
  },
  'es-ES': {
    translation: esESTranslation,
  },
  'en-US': {
    translation: enUSTranslation,
  },
  'en-GB': {
    translation: enGBTranslation,
  },
  'it-IT': {
    translation: itTranslation,
  },
  'ja-JP': {
    translation: jaTranslation,
  },
  'pt-BR': {
    translation: ptBRTranslation,
  },
  'pt-PT': {
    translation: ptPTTranslation,
  },
  'fr-CA': {
    translation: frCATranslation,
  },
  'fr-FR': {
    translation: frFRTranslation,
  },
  // 하위 호환성을 위한 레거시 키 (ko, en)
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
 * @returns 디바이스의 로케일 코드 (지원하지 않는 언어는 ko-KR로 폴백)
 */
export function getDeviceLanguage(): SupportedLanguage {
  const locales = Localization.getLocales();
  const locale = locales[0];
  const languageTag = locale?.languageTag; // e.g., "ko-KR", "en-US", "de-DE"

  console.log('[i18n] Device locales:', locales);
  console.log('[i18n] Detected language tag:', languageTag);

  // 정확한 로케일 매칭 (언어 + 지역)
  if (languageTag && languageTag in SUPPORTED_LANGUAGES) {
    return languageTag as SupportedLanguage;
  }

  // 언어 코드만으로 매칭 (지역 무시)
  const languageCode = locale?.languageCode; // e.g., "ko", "en", "de"
  const regionCode = locale?.regionCode; // e.g., "KR", "US", "DE"

  console.log('[i18n] Language code:', languageCode, 'Region code:', regionCode);

  // 언어별 기본 로케일 매핑
  const languageDefaults: Record<string, SupportedLanguage> = {
    ko: 'ko-KR',
    de: 'de-DE',
    es: 'es-ES', // 스페인어는 스페인을 기본으로
    en: 'en-US', // 영어는 미국을 기본으로
    it: 'it-IT',
    ja: 'ja-JP',
    pt: 'pt-BR', // 포르투갈어는 브라질을 기본으로
    fr: 'fr-FR', // 프랑스어는 프랑스를 기본으로
  };

  if (languageCode && languageCode in languageDefaults) {
    const defaultLocale = languageDefaults[languageCode];
    console.log('[i18n] Using default locale for language:', defaultLocale);
    return defaultLocale;
  }

  // 지원하지 않는 언어는 한국어로 폴백
  console.log('[i18n] Unsupported language, falling back to ko-KR');
  return 'ko-KR';
}

/**
 * 저장된 언어 설정 불러오기
 *
 * @returns 저장된 언어 코드 또는 null
 */
export async function getSavedLanguage(): Promise<SupportedLanguage | null> {
  try {
    const savedLanguage = await AsyncStorage.getItem(STORAGE_KEYS.APP_LANGUAGE);

    // 저장된 언어가 지원하는 언어인지 확인
    if (savedLanguage && savedLanguage in SUPPORTED_LANGUAGES) {
      return savedLanguage as SupportedLanguage;
    }

    // 하위 호환성: 이전 버전에서 'ko' 또는 'en'으로 저장했을 경우
    if (savedLanguage === 'ko') {
      return 'ko-KR';
    }
    if (savedLanguage === 'en') {
      return 'en-US';
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
      fallbackLng: 'ko-KR', // 폴백 언어
      compatibilityJSON: 'v3' as any, // React Native에서 중요: Intl API 없이 작동 (타입 v4이지만 v3 필요)
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
