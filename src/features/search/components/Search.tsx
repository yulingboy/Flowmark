/**
 * Main search component with input, history, and keyboard navigation
 */
import { useRef } from 'react';
import { useSearchStore } from '../store';
import { useClickOutside } from '@/hooks/useClickOutside';
import { useSearchInput } from '../hooks/useSearchInput';
import { useSearchHistory } from '../hooks/useSearchHistory';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';
import { SearchInput } from './SearchInput';
import { SearchHistoryDropdown } from './SearchHistoryDropdown';
import type { SearchEngine } from '@/types';

interface SearchProps {
  placeholder?: string;
  className?: string;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  debounceMs?: number;
}

/**
 * Search component with integrated history and keyboard navigation
 * 
 * @param placeholder - Placeholder text for input
 * @param className - Additional CSS classes
 * @param inputRef - External ref for input element
 * @param debounceMs - Debounce delay in milliseconds
 * @returns Search component
 */
export function Search({ 
  placeholder = '搜索...', 
  className = '', 
  inputRef, 
  debounceMs = 300 
}: SearchProps) {
  const { searchEngine, searchHistoryEnabled, updateSearchEngine } = useSearchStore();
  
  const containerRef = useRef<HTMLDivElement>(null);
  const internalInputRef = useRef<HTMLInputElement>(null);
  const actualInputRef = inputRef || internalInputRef;

  // 使用自定义 hooks 管理状态和逻辑
  const {
    query,
    setQuery,
    debouncedQuery,
    isUrl,
    isFocused,
    handleInputChange,
    handleFocus,
    handleBlur,
    handleSearch,
  } = useSearchInput(debounceMs, actualInputRef);

  const {
    filteredHistory,
    showHistory,
    setShowHistory,
    handleSelectHistory,
    handleRemoveHistoryItem,
    closeHistory,
  } = useSearchHistory(query, debouncedQuery, setQuery, actualInputRef);

  const { selectedIndex, handleKeyDown } = useKeyboardNavigation(
    filteredHistory,
    handleSelectHistory,
    handleSearch,
    closeHistory
  );

  // 点击外部关闭历史记录
  useClickOutside(containerRef, closeHistory);

  // 组合焦点处理
  const handleInputFocus = () => {
    handleFocus();
    setShowHistory(true);
  };

  // 处理搜索引擎切换
  const handleEngineChange = (engine: SearchEngine) => {
    updateSearchEngine(engine);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <SearchInput
        value={query}
        onChange={handleInputChange}
        onSearch={handleSearch}
        onKeyDown={handleKeyDown}
        onFocus={handleInputFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        searchEngine={searchEngine}
        onEngineChange={handleEngineChange}
        isUrl={isUrl}
        isFocused={isFocused}
        inputRef={actualInputRef}
      />

      {/* 历史记录下拉 */}
      {showHistory && searchHistoryEnabled && filteredHistory.length > 0 && (
        <SearchHistoryDropdown
          items={filteredHistory}
          query={debouncedQuery}
          selectedIndex={selectedIndex}
          onSelect={handleSelectHistory}
          onRemove={handleRemoveHistoryItem}
          onClearAll={() => {
            useSearchStore.getState().clearSearchHistory();
          }}
        />
      )}
    </div>
  );
}
