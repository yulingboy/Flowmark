/**
 * 搜索模块类型定义
 */
import type { SearchEngine } from '@/types';

/** 搜索组件 Props */
export interface SearchProps {
  placeholder?: string;
  className?: string;
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

/** 搜索 Store 状态 */
export interface SearchState {
  searchEngine: SearchEngine;
  searchInNewTab: boolean;
  autoFocusSearch: boolean;
  showSearchSuggestions: boolean;
  searchHistoryEnabled: boolean;
  searchHistory: string[];
  
  updateSearchEngine: (engine: SearchEngine) => void;
  updateSearchInNewTab: (value: boolean) => void;
  updateAutoFocusSearch: (value: boolean) => void;
  updateShowSearchSuggestions: (value: boolean) => void;
  updateSearchHistoryEnabled: (value: boolean) => void;
  addSearchHistory: (query: string) => void;
  removeSearchHistoryItem: (query: string) => void;
  clearSearchHistory: () => void;
  resetSearch: () => void;
}

/** 搜索建议项 */
export interface SearchSuggestion {
  type: 'history' | 'suggestion' | 'url';
  text: string;
  url?: string;
}
