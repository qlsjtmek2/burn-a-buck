/**
 * Donation Storage Utilities
 *
 * 기부 관련 AsyncStorage 유틸리티
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/storage';

/**
 * 첫 기부 여부 확인
 *
 * @returns 첫 기부 여부 (true: 첫 기부, false: 재기부)
 */
export const checkFirstDonation = async (): Promise<boolean> => {
  try {
    const firstDonationDate = await AsyncStorage.getItem(STORAGE_KEYS.FIRST_DONATION);
    return !firstDonationDate;
  } catch (err) {
    console.error('[donationStorage] Failed to check first donation:', err);
    return true; // 에러 시 첫 기부로 간주
  }
};

/**
 * 첫 기부 날짜 저장
 */
export const markFirstDonation = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.FIRST_DONATION, new Date().toISOString());
  } catch (err) {
    console.error('[donationStorage] Failed to mark first donation:', err);
  }
};

/**
 * 저장된 닉네임 가져오기
 *
 * @returns 저장된 닉네임 (없으면 null)
 */
export const getSavedNickname = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.SAVED_NICKNAME);
  } catch (err) {
    console.error('[donationStorage] Failed to get saved nickname:', err);
    return null;
  }
};

/**
 * 닉네임 저장
 *
 * @param nickname - 저장할 닉네임
 */
export const saveNickname = async (nickname: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.SAVED_NICKNAME, nickname);
  } catch (err) {
    console.error('[donationStorage] Failed to save nickname:', err);
  }
};

/**
 * 저장된 닉네임 삭제
 */
export const clearSavedNickname = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.SAVED_NICKNAME);
  } catch (err) {
    console.error('[donationStorage] Failed to clear saved nickname:', err);
  }
};
