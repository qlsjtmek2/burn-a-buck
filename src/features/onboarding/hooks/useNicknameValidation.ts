import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { checkNicknameAvailable } from '../../../services/userService';

interface UseNicknameValidationProps {
  nickname: string;
  debounceMs?: number;
}

interface UseNicknameValidationResult {
  // Validation state
  isChecking: boolean;
  isDuplicate: boolean;
  lengthError: string | null;

  // Computed flags
  hasError: boolean;
  isValid: boolean;

  // Error handling
  checkError: Error | null;
  retry: () => void;
}

/**
 * Custom hook for nickname validation with debounced duplicate check
 *
 * @param props - nickname and optional debounce delay
 * @returns validation state and computed flags
 */
export const useNicknameValidation = ({
  nickname,
  debounceMs = 500,
}: UseNicknameValidationProps): UseNicknameValidationResult => {
  const { t } = useTranslation();
  const [debouncedNickname, setDebouncedNickname] = useState(nickname);

  // Debounce nickname input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedNickname(nickname);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [nickname, debounceMs]);

  // Length validation (synchronous)
  const lengthError = getLengthError(nickname, t);

  // Skip duplicate check if nickname has length errors or is empty
  const shouldCheckDuplicate =
    !lengthError && debouncedNickname.length >= 2 && debouncedNickname.length <= 12;

  // Duplicate check (async, debounced)
  const {
    data: isAvailable,
    isLoading: isChecking,
    error: checkError,
    refetch: retry,
  } = useQuery({
    queryKey: ['nicknameAvailable', debouncedNickname],
    queryFn: () => checkNicknameAvailable(debouncedNickname),
    enabled: shouldCheckDuplicate,
    retry: 3, // Retry 3 times on network error
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    staleTime: 0, // Always check fresh data
    gcTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Compute duplicate flag
  const isDuplicate = shouldCheckDuplicate && isAvailable === false;

  // Compute overall validation flags
  const hasError = Boolean(lengthError || isDuplicate || checkError);
  const isValid = !hasError && !isChecking && nickname.length >= 2;

  return {
    isChecking,
    isDuplicate,
    lengthError,
    hasError,
    isValid,
    checkError: checkError as Error | null,
    retry,
  };
};

/**
 * Get length validation error message
 */
function getLengthError(nickname: string, t: (key: string) => string): string | null {
  if (nickname.length === 0) {
    return null; // Don't show error for empty input
  }

  if (nickname.length < 2) {
    return t('nickname.validation.tooShort');
  }

  if (nickname.length > 12) {
    return t('nickname.validation.tooLong');
  }

  return null;
}
