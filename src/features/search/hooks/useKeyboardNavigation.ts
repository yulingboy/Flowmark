/**
 * 处理搜索历史键盘导航的 Hook
 */
import { useState, useCallback, type KeyboardEvent } from 'react';

export interface UseKeyboardNavigationReturn {
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  handleKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
}

/**
 * 处理键盘导航的自定义 Hook
 * 
 * @param filteredHistory - 过滤后的历史记录数组
 * @param onSelect - 按 Enter 选择项时的回调
 * @param onSearch - 未选择项时按 Enter 的回调
 * @param onClose - 按 Escape 时的回调
 * @returns 包含选中索引和键盘处理函数的对象
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
