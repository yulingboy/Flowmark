/**
 * Search Store 类型定义
 */
import type { SearchEngine } from '@/types';

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
