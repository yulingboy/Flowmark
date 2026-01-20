import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULTS } from '@/constants';
import type { BackgroundState } from './types';

const DEFAULT_BACKGROUND = {
  backgroundType: 'image' as const,
  backgroundUrl: DEFAULTS.BACKGROUND_URL,
  backgroundColor: '#1e293b',
  backgroundBlur: DEFAULTS.BACKGROUND_BLUR,
  backgroundOverlay: DEFAULTS.BACKGROUND_OVERLAY,
};

export const useBackgroundStore = create<BackgroundState>()(
  persist(
    (set) => ({
      ...DEFAULT_BACKGROUND,
      
      updateBackgroundType: (type) => set({ backgroundType: type }),
      updateBackgroundUrl: (url) => set({ backgroundUrl: url, backgroundType: 'image' }),
      updateBackgroundColor: (color) => set({ backgroundColor: color, backgroundType: 'color' }),
      updateBackgroundBlur: (value) => set({ backgroundBlur: value }),
      updateBackgroundOverlay: (value) => set({ backgroundOverlay: value }),
      resetBackground: () => set(DEFAULT_BACKGROUND),
    }),
    { name: 'newtab-background' }
  )
);
