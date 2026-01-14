import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { WeatherCache } from './types';

interface WeatherState {
  weatherCache: WeatherCache | null;
  setWeatherCache: (cache: WeatherCache) => void;
}

export const useWeatherStore = create<WeatherState>()(
  persist(
    (set) => ({
      weatherCache: null,
      setWeatherCache: (cache) => set({ weatherCache: cache })
    }),
    { name: 'weather-plugin-data' }
  )
);
