import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PomodoroData } from './types';
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
  setData: (data: PomodoroData) => void;
}

export const usePomodoroStore = create<PomodoroState>()(
  persist(
    (set) => ({
      data: DEFAULT_DATA,
      setData: (data) => set({ data })
    }),
    { name: 'pomodoro-plugin-data' }
  )
);
