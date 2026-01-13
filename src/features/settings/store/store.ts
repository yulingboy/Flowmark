import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULTS } from '@/constants';
import type { GeneralState } from './types';

const DEFAULT_GENERAL = {
  openInNewTab: true,
  showClock: true,
  showSearch: true,
  showShortcuts: true,
  language: DEFAULTS.LANGUAGE as 'zh-CN' | 'en-US',
};

export const useGeneralStore = create<GeneralState>()(
  persist(
    (set) => ({
      ...DEFAULT_GENERAL,
      
      updateOpenInNewTab: (value) => set({ openInNewTab: value }),
      updateShowClock: (value) => set({ showClock: value }),
      updateShowSearch: (value) => set({ showSearch: value }),
      updateShowShortcuts: (value) => set({ showShortcuts: value }),
      updateLanguage: (value) => set({ language: value }),
      resetGeneral: () => set(DEFAULT_GENERAL),
    }),
    { name: 'newtab-general' }
  )
);
