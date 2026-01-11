export const PLUGIN_ID = 'habit';

/** 习惯类型 */
export type HabitType = 'check' | 'count';

/** 习惯数据 */
export interface Habit {
  id: string;
  name: string;
  color: string;
  createdAt: number;
  /** 习惯类型：check=打卡型，count=计数型 */
  type: HabitType;
  /** 计数型习惯的每日目标次数 */
  targetCount?: number;
  /** 打卡记录，key 为日期字符串 YYYY-MM-DD，value 为完成次数 */
  records: Record<string, number>;
}

/** 习惯配置 */
export interface HabitConfig {
  showStreak: boolean;
}

/** 习惯缓存 */
export interface HabitData {
  habits: Habit[];
}

/** 默认配置 */
export const DEFAULT_CONFIG: HabitConfig = {
  showStreak: true,
};

/** 预设颜色 */
export const HABIT_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', 
  '#14b8a6', '#3b82f6', '#8b5cf6', '#ec4899'
];

/** 获取今天的日期字符串 */
export function getTodayString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

/** 获取连续打卡天数 */
export function getStreak(records: Record<string, number>, targetCount = 1): number {
  const today = new Date();
  let streak = 0;
  
  for (let i = 0; i < 365; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    
    const count = records[dateStr] || 0;
    if (count >= targetCount) {
      streak++;
    } else if (i > 0) {
      // 如果不是今天且没完成目标，中断连续
      break;
    }
  }
  
  return streak;
}

/** 获取本周打卡情况 */
export function getWeekRecords(records: Record<string, number>, targetCount = 1): boolean[] {
  const today = new Date();
  const dayOfWeek = today.getDay() || 7; // 周日为7
  const result: boolean[] = [];
  
  for (let i = dayOfWeek - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const count = records[dateStr] || 0;
    result.push(count >= targetCount);
  }
  
  // 补齐到7天
  while (result.length < 7) {
    result.push(false);
  }
  
  return result;
}

/** 检查习惯今日是否完成 */
export function isHabitCompleted(habit: Habit): boolean {
  const todayCount = habit.records[getTodayString()] || 0;
  const target = habit.type === 'count' ? (habit.targetCount || 1) : 1;
  return todayCount >= target;
}

/** 获取习惯今日进度 */
export function getHabitProgress(habit: Habit): { current: number; target: number } {
  const current = habit.records[getTodayString()] || 0;
  const target = habit.type === 'count' ? (habit.targetCount || 1) : 1;
  return { current, target };
}

/** 生成唯一ID */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
