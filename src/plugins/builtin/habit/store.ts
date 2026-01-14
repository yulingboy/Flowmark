import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Habit, HabitType } from './types';
import { generateId, getTodayString, HABIT_COLORS } from './types';

interface HabitState {
  habits: Habit[];
  addHabit: (name: string, color?: string, type?: HabitType, targetCount?: number) => void;
  removeHabit: (id: string) => void;
  updateHabit: (id: string, updates: Partial<Omit<Habit, 'id' | 'createdAt'>>) => void;
  toggleCheck: (id: string, date?: string) => void;
  incrementCount: (id: string, date?: string) => void;
  decrementCount: (id: string, date?: string) => void;
}

export const useHabitStore = create<HabitState>()(
  persist(
    (set) => ({
      habits: [],

      addHabit: (name, color, type = 'check', targetCount) => {
        const newHabit: Habit = {
          id: generateId(),
          name,
          color: color || HABIT_COLORS[Math.floor(Math.random() * HABIT_COLORS.length)],
          createdAt: Date.now(),
          type,
          targetCount: type === 'count' ? (targetCount || 1) : undefined,
          records: {},
        };
        set(state => ({ habits: [...state.habits, newHabit] }));
      },

      removeHabit: (id) => {
        set(state => ({ habits: state.habits.filter(h => h.id !== id) }));
      },

      updateHabit: (id, updates) => {
        set(state => ({
          habits: state.habits.map(h => h.id === id ? { ...h, ...updates } : h)
        }));
      },

      toggleCheck: (id, date) => {
        const dateStr = date || getTodayString();
        set(state => ({
          habits: state.habits.map(h => {
            if (h.id !== id) return h;
            const newRecords = { ...h.records };
            const current = newRecords[dateStr] || 0;
            newRecords[dateStr] = current > 0 ? 0 : 1;
            return { ...h, records: newRecords };
          })
        }));
      },

      incrementCount: (id, date) => {
        const dateStr = date || getTodayString();
        set(state => ({
          habits: state.habits.map(h => {
            if (h.id !== id) return h;
            const newRecords = { ...h.records };
            const current = newRecords[dateStr] || 0;
            newRecords[dateStr] = current + 1;
            return { ...h, records: newRecords };
          })
        }));
      },

      decrementCount: (id, date) => {
        const dateStr = date || getTodayString();
        set(state => ({
          habits: state.habits.map(h => {
            if (h.id !== id) return h;
            const newRecords = { ...h.records };
            const current = newRecords[dateStr] || 0;
            newRecords[dateStr] = Math.max(0, current - 1);
            return { ...h, records: newRecords };
          })
        }));
      }
    }),
    { name: 'habit-plugin-data' }
  )
);
