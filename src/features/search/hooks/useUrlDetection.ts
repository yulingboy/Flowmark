/**
 * URL 检测和规范化的 Hook
 */
import { useMemo } from 'react';
import { isValidUrl, normalizeUrl } from '../utils/urlValidation';

export interface UseUrlDetectionReturn {
  isUrl: boolean;
  normalizeUrl: (url: string) => string;
}

/**
 * 检测和规范化 URL 的自定义 Hook
 * 
 * @param query - 要检查的搜索查询
 * @returns 包含 isUrl 布尔值和 normalizeUrl 函数的对象
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
