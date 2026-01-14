/**
 * 管理搜索输入状态和处理函数的 Hook
 */
import { useState, useCallback, type ChangeEvent } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { useSearchStore } from '../store';
import { performSearch } from '../utils/search';
import { useUrlDetection } from './useUrlDetection';

export interface UseSearchInputReturn {
  query: string;
  setQuery: (value: string) => void;
  debouncedQuery: string;
  isUrl: boolean;
  isFocused: boolean;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleFocus: () => void;
  handleBlur: () => void;
  handleSearch: () => void;
}

/**
 * 管理搜索输入状态和处理函数的自定义 Hook
 * 
 * @param debounceMs - 防抖延迟（毫秒，默认：300）
 * @param inputRef - 输入元素的引用
 * @returns 包含查询状态和处理函数的对象
 * 
 * @example
 * const {
 *   query,
 *   handleInputChange,
 *   handleSearch,
 *   isUrl
 * } = useSearchInput(300, inputRef);
 */
export function useSearchInput(
  debounceMs: number = 300,
  _inputRef?: React.RefObject<HTMLInputElement | null>
): UseSearchInputReturn {
  const { searchEngine, searchInNewTab, addSearchHistory } = useSearchStore();
  
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  
  const debouncedQuery = useDebounce(query, debounceMs);
  const { isUrl, normalizeUrl } = useUrlDetection(query);
  
  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  }, []);
  
  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);
  
  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);
  
  const handleSearch = useCallback(() => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;
    
    // 如果是 URL，直接导航
    if (isUrl) {
      const url = normalizeUrl(trimmedQuery);
      window.open(url, searchInNewTab ? '_blank' : '_self');
      return;
    }
    
    // 否则执行搜索并添加到历史
    addSearchHistory(trimmedQuery);
    performSearch(trimmedQuery, searchEngine, searchInNewTab);
  }, [query, isUrl, normalizeUrl, searchEngine, searchInNewTab, addSearchHistory]);
  
  return {
    query,
    setQuery,
    debouncedQuery,
    isUrl,
    isFocused,
    handleInputChange,
    handleFocus,
    handleBlur,
    handleSearch,
  };
}
