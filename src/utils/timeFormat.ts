/**
 * Time Format Utilities
 *
 * 시간 포맷팅 유틸리티 함수들
 */

/**
 * 상대적 시간 표시 (X분 전, X시간 전 등)
 * @param dateString - ISO 8601 날짜 문자열
 * @returns 상대적 시간 문자열
 */
export const getTimeAgo = (dateString: string | null): string => {
  if (!dateString) return '';

  const now = new Date();
  const past = new Date(dateString);
  const diffMs = now.getTime() - past.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffSeconds < 60) {
    return '방금 전';
  } else if (diffMinutes < 60) {
    return `${diffMinutes}분 전`;
  } else if (diffHours < 24) {
    return `${diffHours}시간 전`;
  } else if (diffDays < 7) {
    return `${diffDays}일 전`;
  } else if (diffWeeks < 4) {
    return `${diffWeeks}주 전`;
  } else {
    return `${diffMonths}개월 전`;
  }
};

/**
 * 금액 포맷팅 (천 단위 콤마)
 * @param amount - 금액
 * @returns 포맷된 금액 문자열 (예: "1,000")
 */
export const formatAmount = (amount: number | null | undefined): string => {
  if (amount == null || isNaN(amount)) {
    return '0';
  }
  return amount.toLocaleString('ko-KR');
};

/**
 * 순위 포맷팅
 * @param rank - 순위
 * @returns 포맷된 순위 문자열 (예: "1위")
 */
export const formatRank = (rank: number): string => {
  return `${rank}위`;
};
