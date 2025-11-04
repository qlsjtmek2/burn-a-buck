/**
 * Nickname Utilities
 *
 * 닉네임 저장 및 로드 유틸리티
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/storage';

/**
 * 닉네임 저장
 */
export const saveNickname = async (nickname: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.SAVED_NICKNAME, nickname);
  } catch (error) {
    console.error('[saveNickname] Failed to save nickname:', error);
    throw error;
  }
};

/**
 * 닉네임 로드
 */
export const getNickname = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.SAVED_NICKNAME);
  } catch (error) {
    console.error('[getNickname] Failed to load nickname:', error);
    return null;
  }
};

/**
 * 닉네임 삭제
 */
export const deleteNickname = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.SAVED_NICKNAME);
  } catch (error) {
    console.error('[deleteNickname] Failed to delete nickname:', error);
    throw error;
  }
};
