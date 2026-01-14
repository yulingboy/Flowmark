import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { HitokotoCache, HitokotoConfig } from './types';

const DEFAULT_CONFIG: HitokotoConfig = {
  types: ['a', 'b', 'c', 'd', 'i'],
  autoRefresh: false,
  refreshInterval: 30,
};

interface HitokotoState {
  cache: HitokotoCache | null;
  config: HitokotoConfig;
  setCache: (cache: HitokotoCache) => void;
  setConfig: (config: Partial<HitokotoConfig>) => void;
}

export const useHitokotoStore = create<HitokotoState>()(
  persist(
    (set) => ({
      cache: null,
      config: DEFAULT_CONFIG,
      setCache: (cache) => set({ cache }),
      setConfig: (newConfig) => set((state) => ({ 
        config: { ...state.config, ...newConfig } 
      }))
    }),
    { name: 'hitokoto-plugin-data' }
  )
);
