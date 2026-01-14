import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SearchEngine } from '@/types';
import { addToHistory, removeFromHistory } from '../utils/searchHistory';
import { validateAndSanitize } from '../utils/sanitization';
import { DEFAULTS } from '@/constants';
import type { SearchState } from './types';

const DEFAULT_SEARCH = {
  searchEngine: DEFAULTS.SEARCH_ENGINE as SearchEngine,
  searchInNewTab: true,
  autoFocusSearch: true,
  showSearchSuggestions: true,
  searchHistoryEnabled: false,
  searchHistory: [] as string[],
};

/**
 * 错误日志记录
 */
function logError(type: string, error: unknown, context?: string) {
  console.error('[Search Module]', type, context || '', error);
}

export const useSearchStore = create<SearchState>()(
  persist(
    (set) => ({
      ...DEFAULT_SEARCH,
      
      updateSearchEngine: (engine) => set({ searchEngine: engine }),
      updateSearchInNewTab: (value) => set({ searchInNewTab: value }),
      updateAutoFocusSearch: (value) => set({ autoFocusSearch: value }),
      updateShowSearchSuggestions: (value) => set({ showSearchSuggestions: value }),
      updateSearchHistoryEnabled: (value) => set({ searchHistoryEnabled: value }),
      addSearchHistory: (query) => {
        try {
          // 验证和清理输入
          const sanitized = validateAndSanitize(query);
          if (!sanitized) return;
          
          set((state) => ({
            searchHistory: state.searchHistoryEnabled 
              ? addToHistory(state.searchHistory, sanitized)
              : state.searchHistory,
          }));
        } catch (error) {
          logError('HISTORY_ERROR', error, 'Failed to add search history');
        }
      },
      removeSearchHistoryItem: (query) => {
        try {
          set((state) => ({
            searchHistory: removeFromHistory(state.searchHistory, query),
          }));
        } catch (error) {
          logError('HISTORY_ERROR', error, 'Failed to remove search history item');
        }
      },
      clearSearchHistory: () => {
        try {
          set({ searchHistory: [] });
        } catch (error) {
          logError('HISTORY_ERROR', error, 'Failed to clear search history');
        }
      },
      resetSearch: () => set(DEFAULT_SEARCH),
    }),
    { 
      name: 'newtab-search',
      onRehydrateStorage: () => (_state, error) => {
        if (error) {
          logError('STORAGE_ERROR', error, 'Failed to load search state from storage');
        }
      },
    }
  )
);
