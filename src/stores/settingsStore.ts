import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SearchEngine } from '@/types';
import { addToHistory, removeFromHistory } from '@/utils/searchHistory';
import { DEFAULTS } from '@/constants';

interface SettingsState {
  // 常规设置
  openInNewTab: boolean;
  showClock: boolean;
  showSearch: boolean;
  showShortcuts: boolean;
  language: 'zh-CN' | 'en-US';
  
  // 搜索设置
  searchEngine: SearchEngine;
  searchInNewTab: boolean;
  autoFocusSearch: boolean;
  showSearchSuggestions: boolean;
  searchHistoryEnabled: boolean;
  searchHistory: string[];
  
  // 壁纸设置
  backgroundUrl: string;
  backgroundBlur: number;
  backgroundOverlay: number;
  
  // 时间日期设置
  showSeconds: boolean;
  show24Hour: boolean;
  showLunar: boolean;
  showDate: boolean;
  showWeekday: boolean;
  showYear: boolean;
  clockColor: string;
  clockFontSize: 'small' | 'medium' | 'large';
  
  // Actions - 常规
  updateOpenInNewTab: (value: boolean) => void;
  updateShowClock: (value: boolean) => void;
  updateShowSearch: (value: boolean) => void;
  updateShowShortcuts: (value: boolean) => void;
  updateLanguage: (value: 'zh-CN' | 'en-US') => void;
  resetAllSettings: () => void;
  
  // Actions - 搜索
  updateSearchEngine: (engine: SearchEngine) => void;
  updateSearchInNewTab: (value: boolean) => void;
  updateAutoFocusSearch: (value: boolean) => void;
  updateShowSearchSuggestions: (value: boolean) => void;
  updateSearchHistoryEnabled: (value: boolean) => void;
  addSearchHistory: (query: string) => void;
  removeSearchHistoryItem: (query: string) => void;
  clearSearchHistory: () => void;
  
  // Actions - 壁纸
  updateBackgroundUrl: (url: string) => void;
  updateBackgroundBlur: (value: number) => void;
  updateBackgroundOverlay: (value: number) => void;
  resetBackground: () => void;
  
  // Actions - 时间日期
  updateShowSeconds: (value: boolean) => void;
  updateShow24Hour: (value: boolean) => void;
  updateShowLunar: (value: boolean) => void;
  updateShowDate: (value: boolean) => void;
  updateShowWeekday: (value: boolean) => void;
  updateShowYear: (value: boolean) => void;
  updateClockColor: (value: string) => void;
  updateClockFontSize: (value: 'small' | 'medium' | 'large') => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      // 常规设置
      openInNewTab: true,
      showClock: true,
      showSearch: true,
      showShortcuts: true,
      language: DEFAULTS.LANGUAGE,
      
      // 搜索设置
      searchEngine: DEFAULTS.SEARCH_ENGINE,
      searchInNewTab: true,
      autoFocusSearch: true,
      showSearchSuggestions: true,
      searchHistoryEnabled: false,
      searchHistory: [],
      
      // 壁纸设置
      backgroundUrl: DEFAULTS.BACKGROUND_URL,
      backgroundBlur: DEFAULTS.BACKGROUND_BLUR,
      backgroundOverlay: DEFAULTS.BACKGROUND_OVERLAY,
      
      // 时间日期设置
      showSeconds: true,
      show24Hour: true,
      showLunar: true,
      showDate: true,
      showWeekday: true,
      showYear: false,
      clockColor: DEFAULTS.CLOCK_COLOR,
      clockFontSize: DEFAULTS.CLOCK_FONT_SIZE,

      // Actions - 常规
      updateOpenInNewTab: (value) => set({ openInNewTab: value }),
      updateShowClock: (value) => set({ showClock: value }),
      updateShowSearch: (value) => set({ showSearch: value }),
      updateShowShortcuts: (value) => set({ showShortcuts: value }),
      updateLanguage: (value) => set({ language: value }),
      resetAllSettings: () => set({
        openInNewTab: true,
        showClock: true,
        showSearch: true,
        showShortcuts: true,
        language: DEFAULTS.LANGUAGE,
        searchEngine: DEFAULTS.SEARCH_ENGINE,
        searchInNewTab: true,
        autoFocusSearch: true,
        showSearchSuggestions: true,
        searchHistoryEnabled: false,
        searchHistory: [],
        backgroundUrl: DEFAULTS.BACKGROUND_URL,
        backgroundBlur: DEFAULTS.BACKGROUND_BLUR,
        backgroundOverlay: DEFAULTS.BACKGROUND_OVERLAY,
        showSeconds: true,
        show24Hour: true,
        showLunar: true,
        showDate: true,
        showWeekday: true,
        showYear: false,
        clockColor: DEFAULTS.CLOCK_COLOR,
        clockFontSize: DEFAULTS.CLOCK_FONT_SIZE,
      }),
      
      // Actions - 搜索
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
      
      // Actions - 壁纸
      updateBackgroundUrl: (url) => set({ backgroundUrl: url }),
      updateBackgroundBlur: (value) => set({ backgroundBlur: value }),
      updateBackgroundOverlay: (value) => set({ backgroundOverlay: value }),
      resetBackground: () => set({ 
        backgroundUrl: DEFAULTS.BACKGROUND_URL, 
        backgroundBlur: DEFAULTS.BACKGROUND_BLUR, 
        backgroundOverlay: DEFAULTS.BACKGROUND_OVERLAY 
      }),
      
      // Actions - 时间日期
      updateShowSeconds: (value) => set({ showSeconds: value }),
      updateShow24Hour: (value) => set({ show24Hour: value }),
      updateShowLunar: (value) => set({ showLunar: value }),
      updateShowDate: (value) => set({ showDate: value }),
      updateShowWeekday: (value) => set({ showWeekday: value }),
      updateShowYear: (value) => set({ showYear: value }),
      updateClockColor: (value) => set({ clockColor: value }),
      updateClockFontSize: (value) => set({ clockFontSize: value }),
    }),
    {
      name: 'newtab-settings',
    }
  )
);
