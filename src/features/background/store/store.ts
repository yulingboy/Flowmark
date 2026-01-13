import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULTS } from '@/constants';
import type { BackgroundState } from './types';

const DEFAULT_BACKGROUND = {
  backgroundUrl: DEFAULTS.BACKGROUND_URL,
  backgroundBlur: DEFAULTS.BACKGROUND_BLUR,
  backgroundOverlay: DEFAULTS.BACKGROUND_OVERLAY,
};

export const useBackgroundStore = create<BackgroundState>()(
  persist(
    (set) => ({
      ...DEFAULT_BACKGROUND,
      
      updateBackgroundUrl: (url) => set({ backgroundUrl: url }),
      updateBackgroundBlur: (value) => set({ backgroundBlur: value }),
      updateBackgroundOverlay: (value) => set({ backgroundOverlay: value }),
      resetBackground: () => set(DEFAULT_BACKGROUND),
    }),
    { name: 'newtab-background' }
  )
);
