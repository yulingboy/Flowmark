/**
 * Hook for handling keyboard navigation through search history
 */
import { useState, useCallback, type KeyboardEvent } from 'react';

export interface UseKeyboardNavigationReturn {
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  handleKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
}

/**
 * Custom hook for handling keyboard navigation
 * 
 * @param filteredHistory - Array of filtered history items
 * @param onSelect - Callback when an item is selected with Enter
 * @param onSearch - Callback when Enter is pressed without selection
 * @param onClose - Callback when Escape is pressed
 * @returns Object containing selected index and keyboard handler
 * 
 * @example
 * const { selectedIndex, handleKeyDown } = useKeyboardNavigation(
 *   filteredHistory,
 *   handleSelectHistory,
 *   handleSearch,
 *   closeHistory
 * );
 */
export function useKeyboardNavigation(
  filteredHistory: string[],
  onSelect: (item: string) => void,
  onSearch: () => void,
  onClose: () => void
): UseKeyboardNavigationReturn {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    const historyLength = filteredHistory.length;
    
    if (e.key === 'Enter') {
      if (selectedIndex >= 0 && selectedIndex < historyLength) {
        onSelect(filteredHistory[selectedIndex]);
        setSelectedIndex(-1);
      } else {
        onSearch();
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => prev < historyLength - 1 ? prev + 1 : prev);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Escape') {
      onClose();
      setSelectedIndex(-1);
    }
  }, [filteredHistory, selectedIndex, onSelect, onSearch, onClose]);
  
  return {
    selectedIndex,
    setSelectedIndex,
    handleKeyDown,
  };
}
