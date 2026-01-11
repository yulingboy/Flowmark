export const PLUGIN_ID = 'habit';

/** 习惯数据 */
export interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  createdAt: number;
  /** 打卡记录，key 为日期字符串 YYYY-MM-DD */
  records: Record<string, boolean>;
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

/** 预设图标 */
export const HABIT_ICONS = ['💪', '📚', '🏃', '💧', '🧘', '✍️', '🎯', '⏰', '🥗', '😴', '🎨', '🎵'];

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
export function getStreak(records: Record<string, boolean>): number {
  const today = new Date();
  let streak = 0;
  
  for (let i = 0; i < 365; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    
    if (records[dateStr]) {
      streak++;
    } else if (i > 0) {
      // 如果不是今天且没打卡，中断连续
      break;
    }
  }
  
  return streak;
}

/** 获取本周打卡情况 */
export function getWeekRecords(records: Record<string, boolean>): boolean[] {
  const today = new Date();
  const dayOfWeek = today.getDay() || 7; // 周日为7
  const result: boolean[] = [];
  
  for (let i = dayOfWeek - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    result.push(!!records[dateStr]);
  }
  
  // 补齐到7天
  while (result.length < 7) {
    result.push(false);
  }
  
  return result;
}

/** 生成唯一ID */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
