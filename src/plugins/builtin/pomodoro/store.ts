import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PomodoroData, PomodoroConfig } from './types';
import { DEFAULT_CONFIG } from './types';

const DEFAULT_DATA: PomodoroData = {
  status: 'idle',
  timeLeft: DEFAULT_CONFIG.workDuration * 60,
  completedPomodoros: 0,
  totalPomodoros: 0,
  startedAt: null,
  pausedAt: null,
};

interface PomodoroState {
  data: PomodoroData;
  config: PomodoroConfig;
  setData: (data: PomodoroData) => void;
  setConfig: (config: Partial<PomodoroConfig>) => void;
}

export const usePomodoroStore = create<PomodoroState>()(
  persist(
    (set) => ({
      data: DEFAULT_DATA,
      config: DEFAULT_CONFIG,
      setData: (data) => set({ data }),
      setConfig: (newConfig) => set((state) => ({ 
        config: { ...state.config, ...newConfig } 
      }))
    }),
    { name: 'pomodoro-plugin-data' }
  )
);
