import { useCallback } from 'react';
import { useHabitStore } from './store';
import { getTodayString } from './types';

export function useHabit() {
  const { habits, config, addHabit, removeHabit, updateHabit, toggleCheck, incrementCount, decrementCount } = useHabitStore();

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
