import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULTS } from '@/constants';
import type { ClockState } from './types';

const DEFAULT_CLOCK = {
  showSeconds: true,
  show24Hour: true,
  showLunar: true,
  showDate: true,
  showWeekday: true,
  showYear: false,
  clockColor: DEFAULTS.CLOCK_COLOR,
  clockFontSize: DEFAULTS.CLOCK_FONT_SIZE as 'small' | 'medium' | 'large',
};

export const useClockStore = create<ClockState>()(
  persist(
    (set) => ({
      ...DEFAULT_CLOCK,
      
      updateShowSeconds: (value) => set({ showSeconds: value }),
      updateShow24Hour: (value) => set({ show24Hour: value }),
      updateShowLunar: (value) => set({ showLunar: value }),
      updateShowDate: (value) => set({ showDate: value }),
      updateShowWeekday: (value) => set({ showWeekday: value }),
      updateShowYear: (value) => set({ showYear: value }),
      updateClockColor: (value) => set({ clockColor: value }),
      updateClockFontSize: (value) => set({ clockFontSize: value }),
      resetClock: () => set(DEFAULT_CLOCK),
    }),
    { name: 'newtab-clock' }
  )
);
