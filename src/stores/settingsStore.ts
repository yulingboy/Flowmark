import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SearchEngine } from '@/types';
import { addToHistory, removeFromHistory } from '@/utils/searchHistory';

interface SettingsState {
  backgroundUrl: string;
  searchEngine: SearchEngine;
  searchHistory: string[];
  
  // Actions
  updateBackgroundUrl: (url: string) => void;
  updateSearchEngine: (engine: SearchEngine) => void;
  addSearchHistory: (query: string) => void;
  removeSearchHistoryItem: (query: string) => void;
  clearSearchHistory: () => void;
}

const DEFAULT_BACKGROUND = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80';

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      backgroundUrl: DEFAULT_BACKGROUND,
      searchEngine: 'bing',
      searchHistory: [],

      updateBackgroundUrl: (url) => set({ backgroundUrl: url }),
      
      updateSearchEngine: (engine) => set({ searchEngine: engine }),
      
      addSearchHistory: (query) =>
        set((state) => ({
          searchHistory: addToHistory(state.searchHistory, query),
        })),
      
      removeSearchHistoryItem: (query) =>
        set((state) => ({
          searchHistory: removeFromHistory(state.searchHistory, query),
        })),
      
      clearSearchHistory: () => set({ searchHistory: [] }),
    }),
    {
      name: 'newtab-settings',
    }
  )
);
