import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FlipClockConfig } from './types';
import { DEFAULT_CONFIG } from './types';

interface FlipClockState {
  config: FlipClockConfig;
  setConfig: (config: Partial<FlipClockConfig>) => void;
}

export const useFlipClockStore = create<FlipClockState>()(
  persist(
    (set) => ({
      config: DEFAULT_CONFIG,
      setConfig: (newConfig) => set((state) => ({ 
        config: { ...state.config, ...newConfig } 
      }))
    }),
    { name: 'flip-clock-plugin-data' }
  )
);
