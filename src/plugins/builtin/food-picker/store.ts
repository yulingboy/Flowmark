import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FoodPickerConfig } from './types';
import { DEFAULT_CONFIG } from './types';

interface FoodPickerState {
  config: FoodPickerConfig;
  setConfig: (config: Partial<FoodPickerConfig>) => void;
}

export const useFoodPickerStore = create<FoodPickerState>()(
  persist(
    (set) => ({
      config: DEFAULT_CONFIG,
      setConfig: (newConfig) => set((state) => ({ 
        config: { ...state.config, ...newConfig } 
      }))
    }),
    { name: 'food-picker-plugin-data' }
  )
);
