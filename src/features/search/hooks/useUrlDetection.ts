/**
 * Hook for URL detection and normalization
 */
import { useMemo } from 'react';
import { isValidUrl, normalizeUrl } from '../utils/urlValidation';

export interface UseUrlDetectionReturn {
  isUrl: boolean;
  normalizeUrl: (url: string) => string;
}

/**
 * Custom hook for detecting and normalizing URLs
 * 
 * @param query - The search query to check
 * @returns Object containing isUrl boolean and normalizeUrl function
 * 
 * @example
 * const { isUrl, normalizeUrl } = useUrlDetection(query);
 * if (isUrl) {
 *   const url = normalizeUrl(query);
 *   window.open(url, '_blank');
 * }
 */
export function useUrlDetection(query: string): UseUrlDetectionReturn {
  const isUrl = useMemo(() => isValidUrl(query), [query]);
  
  return {
    isUrl,
    normalizeUrl,
  };
}
