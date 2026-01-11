import { useCallback, useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { usePluginStore } from '../../store';
import type { Habit, HabitConfig, HabitType } from './types';
import { PLUGIN_ID, DEFAULT_CONFIG, getTodayString, generateId, HABIT_COLORS } from './types';

export function useHabit() {
  const rawData = usePluginStore(
    useShallow(state => state.pluginData[PLUGIN_ID] || {})
  );
  const habits: Habit[] = useMemo(() => {
    const raw = (rawData as Record<string, unknown>).habits as Habit[] || [];
    // 兼容旧数据：将 boolean 记录转换为 number
    return raw.map(h => ({
      ...h,
      type: h.type || 'check',
      records: Object.fromEntries(
        Object.entries(h.records).map(([k, v]) => [k, typeof v === 'boolean' ? (v ? 1 : 0) : v])
      )
    }));
  }, [rawData]);
  const storedConfig = usePluginStore(
    useShallow(state => state.pluginConfigs[PLUGIN_ID] || {})
  );
  const config: HabitConfig = { ...DEFAULT_CONFIG, ...storedConfig };

  /** 添加习惯 */
  const addHabit = useCallback((
    name: string, 
    color?: string,
    type: HabitType = 'check',
    targetCount?: number
  ) => {
    const newHabit: Habit = {
      id: generateId(),
      name,
      color: color || HABIT_COLORS[Math.floor(Math.random() * HABIT_COLORS.length)],
      createdAt: Date.now(),
      type,
      targetCount: type === 'count' ? (targetCount || 1) : undefined,
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

  /** 打卡型：切换打卡状态 */
  const toggleCheck = useCallback((id: string, date?: string) => {
    const dateStr = date || getTodayString();
    const newHabits = habits.map(h => {
      if (h.id !== id) return h;
      const newRecords = { ...h.records };
      const current = newRecords[dateStr] || 0;
      // 打卡型：0 -> 1，1 -> 0
      newRecords[dateStr] = current > 0 ? 0 : 1;
      return { ...h, records: newRecords };
    });
    usePluginStore.getState().setPluginData(PLUGIN_ID, 'habits', newHabits);
  }, [habits]);

  /** 计数型：增加计数 */
  const incrementCount = useCallback((id: string, date?: string) => {
    const dateStr = date || getTodayString();
    const newHabits = habits.map(h => {
      if (h.id !== id) return h;
      const newRecords = { ...h.records };
      const current = newRecords[dateStr] || 0;
      newRecords[dateStr] = current + 1;
      return { ...h, records: newRecords };
    });
    usePluginStore.getState().setPluginData(PLUGIN_ID, 'habits', newHabits);
  }, [habits]);

  /** 计数型：减少计数 */
  const decrementCount = useCallback((id: string, date?: string) => {
    const dateStr = date || getTodayString();
    const newHabits = habits.map(h => {
      if (h.id !== id) return h;
      const newRecords = { ...h.records };
      const current = newRecords[dateStr] || 0;
      newRecords[dateStr] = Math.max(0, current - 1);
      return { ...h, records: newRecords };
    });
    usePluginStore.getState().setPluginData(PLUGIN_ID, 'habits', newHabits);
  }, [habits]);

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
