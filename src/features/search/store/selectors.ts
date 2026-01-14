/**
 * 搜索 store 的记忆化选择器
 */
import { useSearchStore } from './store';
import type { SearchState } from './types';

/**
 * 选择搜索配置
 */
export const selectSearchConfig = (state: SearchState) => ({
  searchEngine: state.searchEngine,
  searchInNewTab: state.searchInNewTab,
  autoFocusSearch: state.autoFocusSearch,
  showSearchSuggestions: state.showSearchSuggestions,
  searchHistoryEnabled: state.searchHistoryEnabled,
});

/**
 * 选择搜索历史
 */
export const selectSearchHistory = (state: SearchState) => state.searchHistory;

/**
 * 选择搜索引擎
 */
export const selectSearchEngine = (state: SearchState) => state.searchEngine;

/**
 * 选择历史记录启用状态
 */
export const selectHistoryEnabled = (state: SearchState) => state.searchHistoryEnabled;

/**
 * 获取搜索配置的 Hook
 */
export function useSearchConfig() {
  return useSearchStore(selectSearchConfig);
}

/**
 * 获取搜索历史的 Hook
 */
export function useSearchHistoryData() {
  return useSearchStore(selectSearchHistory);
}
