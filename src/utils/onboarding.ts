/**
 * Onboarding Utilities
 *
 * 온보딩 플로우 관리를 위한 유틸리티 함수
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/storage';

/**
 * 온보딩 완료 여부 확인
 *
 * @returns Promise<boolean> - 온보딩 완료 시 true
 */
export async function checkOnboardingCompleted(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
    return value === 'true';
  } catch (error) {
    console.error('[Onboarding] Failed to check onboarding status:', error);
    return false;
  }
}

/**
 * 온보딩 완료 플래그 저장
 *
 * @returns Promise<void>
 */
export async function setOnboardingCompleted(): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, 'true');
    console.log('[Onboarding] Onboarding marked as completed');
  } catch (error) {
    console.error('[Onboarding] Failed to save onboarding status:', error);
    throw error;
  }
}

/**
 * 온보딩 상태 초기화 (개발/테스트용)
 *
 * @returns Promise<void>
 */
export async function resetOnboarding(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
    console.log('[Onboarding] Onboarding status reset');
  } catch (error) {
    console.error('[Onboarding] Failed to reset onboarding status:', error);
    throw error;
  }
}

/**
 * 저장된 닉네임 가져오기
 *
 * @returns Promise<string | null> - 저장된 닉네임 또는 null
 */
export async function getSavedNickname(): Promise<string | null> {
  try {
    const nickname = await AsyncStorage.getItem(STORAGE_KEYS.SAVED_NICKNAME);
    return nickname;
  } catch (error) {
    console.error('[Onboarding] Failed to get saved nickname:', error);
    return null;
  }
}

/**
 * 닉네임 저장
 *
 * @param nickname - 저장할 닉네임
 * @returns Promise<void>
 */
export async function saveNickname(nickname: string): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.SAVED_NICKNAME, nickname);
    console.log('[Onboarding] Nickname saved:', nickname);
  } catch (error) {
    console.error('[Onboarding] Failed to save nickname:', error);
    throw error;
  }
}

/**
 * 저장된 닉네임 삭제
 *
 * @returns Promise<void>
 */
export async function clearSavedNickname(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.SAVED_NICKNAME);
    console.log('[Onboarding] Saved nickname cleared');
  } catch (error) {
    console.error('[Onboarding] Failed to clear saved nickname:', error);
    throw error;
  }
}
