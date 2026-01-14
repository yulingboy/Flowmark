import { useCallback } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { usePluginStore } from '../../store';
import { useHabitStore } from './store';
import type { HabitConfig } from './types';
import { PLUGIN_ID, DEFAULT_CONFIG, getTodayString } from './types';

export function useHabit() {
  const { habits, addHabit, removeHabit, updateHabit, toggleCheck, incrementCount, decrementCount } = useHabitStore();
  const storedConfig = usePluginStore(
    useShallow(state => state.pluginConfigs[PLUGIN_ID] || {})
  );
  const config: HabitConfig = { ...DEFAULT_CONFIG, ...storedConfig };

  /** 检查今天是否已完成 */
  const isCompletedToday = useCallback((id: string) => {
    const habit = habits.find(h => h.id === id);
    if (!habit) return false;
    const current = habit.records[getTodayString()] || 0;
    const target = habit.type === 'count' ? (habit.targetCount || 1) : 1;
    return current >= target;
  }, [habits]);

  return {
    habits,
    config,
    addHabit,
    removeHabit,
    updateHabit,
    toggleCheck,
    incrementCount,
    decrementCount,
    isCompletedToday,
  };
}
