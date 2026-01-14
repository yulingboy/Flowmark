/**
 * Hook for managing search input state and handlers
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
 * Custom hook for managing search input state and handlers
 * 
 * @param debounceMs - Debounce delay in milliseconds (default: 300)
 * @param inputRef - Reference to the input element
 * @returns Object containing query state and handler functions
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
