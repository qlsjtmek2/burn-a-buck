import { useEffect, useRef } from 'react';

/**
 * usePrevious Hook
 *
 * 이전 렌더링의 값을 추적하는 훅
 * React Query의 데이터 변경 감지에 유용
 *
 * @param value - 추적할 값
 * @returns 이전 값 (첫 렌더링에서는 undefined)
 *
 * @example
 * const previousData = usePrevious(data);
 * useEffect(() => {
 *   if (previousData && data && previousData.length < data.length) {
 *     // 새 항목이 추가됨
 *   }
 * }, [data]);
 */
export const usePrevious = <T,>(value: T): T | undefined => {
  const ref = useRef<T | undefined>(undefined);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};
