/**
 * Hook for managing search history filtering and selection
 */
import { useMemo, useCallback, useState } from 'react';
import { useSearchStore } from '../store';

export interface UseSearchHistoryReturn {
  filteredHistory: string[];
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  showHistory: boolean;
  setShowHistory: (show: boolean) => void;
  handleSelectHistory: (item: string) => void;
  handleRemoveHistoryItem: (item: string) => void;
  closeHistory: () => void;
}

/**
 * Custom hook for managing search history filtering and selection
 * 
 * @param query - Current search query
 * @param debouncedQuery - Debounced search query for filtering
 * @param setQuery - Function to update query state
 * @param inputRef - Reference to the input element
 * @returns Object containing filtered history and handler functions
 * 
 * @example
 * const {
 *   filteredHistory,
 *   selectedIndex,
 *   handleSelectHistory
 * } = useSearchHistory(query, debouncedQuery, setQuery, inputRef);
 */
export function useSearchHistory(
  _query: string,
  debouncedQuery: string,
  setQuery: (value: string) => void,
  inputRef?: React.RefObject<HTMLInputElement | null>
): UseSearchHistoryReturn {
  const { searchHistory, removeSearchHistoryItem } = useSearchStore();
  
  const [showHistory, setShowHistory] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  // 过滤并排序历史记录（匹配项排在前面）
  const filteredHistory = useMemo(() => {
    if (!debouncedQuery.trim()) return searchHistory;
    const lowerQuery = debouncedQuery.toLowerCase();
    return searchHistory
      .filter((item: string) => item.toLowerCase().includes(lowerQuery))
      .sort((a: string, b: string) => {
        const aIndex = a.toLowerCase().indexOf(lowerQuery);
        const bIndex = b.toLowerCase().indexOf(lowerQuery);
        return aIndex - bIndex;
      });
  }, [searchHistory, debouncedQuery]);
  
  const closeHistory = useCallback(() => {
    setShowHistory(false);
    setSelectedIndex(-1);
  }, []);
  
  const handleSelectHistory = useCallback((item: string) => {
    setQuery(item);
    setShowHistory(false);
    setSelectedIndex(-1);
    inputRef?.current?.focus();
  }, [setQuery, inputRef]);
  
  const handleRemoveHistoryItem = useCallback((item: string) => {
    removeSearchHistoryItem(item);
  }, [removeSearchHistoryItem]);
  
  return {
    filteredHistory,
    selectedIndex,
    setSelectedIndex,
    showHistory,
    setShowHistory,
    handleSelectHistory,
    handleRemoveHistoryItem,
    closeHistory,
  };
}
