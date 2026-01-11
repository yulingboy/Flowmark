import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SearchEngine } from '@/types';
import { addToHistory, removeFromHistory } from '@/utils/searchHistory';
import { DEFAULTS } from '@/constants';

interface SearchState {
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

const DEFAULT_SEARCH = {
  searchEngine: DEFAULTS.SEARCH_ENGINE as SearchEngine,
  searchInNewTab: true,
  autoFocusSearch: true,
  showSearchSuggestions: true,
  searchHistoryEnabled: false,
  searchHistory: [] as string[],
};

export const useSearchStore = create<SearchState>()(
  persist(
    (set) => ({
      ...DEFAULT_SEARCH,
      
      updateSearchEngine: (engine) => set({ searchEngine: engine }),
      updateSearchInNewTab: (value) => set({ searchInNewTab: value }),
      updateAutoFocusSearch: (value) => set({ autoFocusSearch: value }),
      updateShowSearchSuggestions: (value) => set({ showSearchSuggestions: value }),
      updateSearchHistoryEnabled: (value) => set({ searchHistoryEnabled: value }),
      addSearchHistory: (query) =>
        set((state) => ({
          searchHistory: state.searchHistoryEnabled 
            ? addToHistory(state.searchHistory, query)
            : state.searchHistory,
        })),
      removeSearchHistoryItem: (query) =>
        set((state) => ({
          searchHistory: removeFromHistory(state.searchHistory, query),
        })),
      clearSearchHistory: () => set({ searchHistory: [] }),
      resetSearch: () => set(DEFAULT_SEARCH),
    }),
    { name: 'newtab-search' }
  )
);
