import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { HitokotoCache } from './types';

interface HitokotoState {
  cache: HitokotoCache | null;
  setCache: (cache: HitokotoCache) => void;
}

export const useHitokotoStore = create<HitokotoState>()(
  persist(
    (set) => ({
      cache: null,
      setCache: (cache) => set({ cache })
    }),
    { name: 'hitokoto-plugin-data' }
  )
);
