/**
 * Memoized selectors for search store
 */
import { useSearchStore } from './store';
import type { SearchState } from './types';

/**
 * Select search configuration
 */
export const selectSearchConfig = (state: SearchState) => ({
  searchEngine: state.searchEngine,
  searchInNewTab: state.searchInNewTab,
  autoFocusSearch: state.autoFocusSearch,
  showSearchSuggestions: state.showSearchSuggestions,
  searchHistoryEnabled: state.searchHistoryEnabled,
});

/**
 * Select search history
 */
export const selectSearchHistory = (state: SearchState) => state.searchHistory;

/**
 * Select search engine
 */
export const selectSearchEngine = (state: SearchState) => state.searchEngine;

/**
 * Select history enabled status
 */
export const selectHistoryEnabled = (state: SearchState) => state.searchHistoryEnabled;

/**
 * Hook to get search configuration
 */
export function useSearchConfig() {
  return useSearchStore(selectSearchConfig);
}

/**
 * Hook to get search history
 */
export function useSearchHistoryData() {
  return useSearchStore(selectSearchHistory);
}
