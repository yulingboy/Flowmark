import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { WeatherCache, WeatherConfig } from './types';

const DEFAULT_CONFIG: WeatherConfig = {
  location: 'Beijing',
  unit: 'celsius',
  updateInterval: 30
};

interface WeatherState {
  weatherCache: WeatherCache | null;
  config: WeatherConfig;
  setWeatherCache: (cache: WeatherCache) => void;
  setConfig: (config: Partial<WeatherConfig>) => void;
}

export const useWeatherStore = create<WeatherState>()(
  persist(
    (set) => ({
      weatherCache: null,
      config: DEFAULT_CONFIG,
      setWeatherCache: (cache) => set({ weatherCache: cache }),
      setConfig: (newConfig) => set((state) => ({ 
        config: { ...state.config, ...newConfig } 
      }))
    }),
    { name: 'weather-plugin-data' }
  )
);
