import { useCallback } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { usePluginStore } from '../../store';
import type { Habit, HabitConfig } from './types';
import { PLUGIN_ID, DEFAULT_CONFIG, getTodayString, generateId, HABIT_ICONS, HABIT_COLORS } from './types';

export function useHabit() {
  const rawData = usePluginStore(
    useShallow(state => state.pluginData[PLUGIN_ID] || {})
  );
  const habits: Habit[] = (rawData as Record<string, unknown>).habits as Habit[] || [];
  const storedConfig = usePluginStore(
    useShallow(state => state.pluginConfigs[PLUGIN_ID] || {})
  );
  const config: HabitConfig = { ...DEFAULT_CONFIG, ...storedConfig };

  /** 添加习惯 */
  const addHabit = useCallback((name: string, icon?: string, color?: string) => {
    const newHabit: Habit = {
      id: generateId(),
      name,
      icon: icon || HABIT_ICONS[Math.floor(Math.random() * HABIT_ICONS.length)],
      color: color || HABIT_COLORS[Math.floor(Math.random() * HABIT_COLORS.length)],
      createdAt: Date.now(),
      records: {},
    };
    
    const newHabits = [...habits, newHabit];
    usePluginStore.getState().setPluginData(PLUGIN_ID, 'habits', newHabits);
  }, [habits]);

  /** 删除习惯 */
  const removeHabit = useCallback((id: string) => {
    const newHabits = habits.filter(h => h.id !== id);
    usePluginStore.getState().setPluginData(PLUGIN_ID, 'habits', newHabits);
  }, [habits]);

  /** 更新习惯 */
  const updateHabit = useCallback((id: string, updates: Partial<Omit<Habit, 'id' | 'createdAt'>>) => {
    const newHabits = habits.map(h => 
      h.id === id ? { ...h, ...updates } : h
    );
    usePluginStore.getState().setPluginData(PLUGIN_ID, 'habits', newHabits);
  }, [habits]);

  /** 打卡/取消打卡 */
  const toggleCheck = useCallback((id: string, date?: string) => {
    const dateStr = date || getTodayString();
    const newHabits = habits.map(h => {
      if (h.id !== id) return h;
      const newRecords = { ...h.records };
      if (newRecords[dateStr]) {
        delete newRecords[dateStr];
      } else {
        newRecords[dateStr] = true;
      }
      return { ...h, records: newRecords };
    });
    usePluginStore.getState().setPluginData(PLUGIN_ID, 'habits', newHabits);
  }, [habits]);

  /** 检查今天是否已打卡 */
  const isCheckedToday = useCallback((id: string) => {
    const habit = habits.find(h => h.id === id);
    if (!habit) return false;
    return !!habit.records[getTodayString()];
  }, [habits]);

  return {
    habits,
    config,
    addHabit,
    removeHabit,
    updateHabit,
    toggleCheck,
    isCheckedToday,
  };
}
