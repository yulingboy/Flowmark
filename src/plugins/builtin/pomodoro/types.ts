export const PLUGIN_ID = 'pomodoro';

/** 番茄钟状态 */
export type PomodoroStatus = 'idle' | 'working' | 'shortBreak' | 'longBreak' | 'paused';

/** 番茄钟数据 */
export interface PomodoroData {
  status: PomodoroStatus;
  timeLeft: number; // 剩余秒数
  completedPomodoros: number;
  totalPomodoros: number;
  startedAt: number | null;
  pausedAt: number | null;
}

/** 番茄钟配置 */
export interface PomodoroConfig {
  workDuration: number; // 工作时长（分钟）
  shortBreakDuration: number; // 短休息时长（分钟）
  longBreakDuration: number; // 长休息时长（分钟）
  longBreakInterval: number; // 几个番茄后长休息
  autoStartBreak: boolean; // 自动开始休息
  autoStartWork: boolean; // 自动开始工作
  soundEnabled: boolean; // 声音提醒
}

/** 默认配置 */
export const DEFAULT_CONFIG: PomodoroConfig = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  longBreakInterval: 4,
  autoStartBreak: false,
  autoStartWork: false,
  soundEnabled: true,
};

/** 状态显示名称 */
export const STATUS_NAMES: Record<PomodoroStatus, string> = {
  idle: '准备开始',
  working: '专注中',
  shortBreak: '短休息',
  longBreak: '长休息',
  paused: '已暂停',
};

/** 状态颜色 - 简约风格 */
export const STATUS_COLORS: Record<PomodoroStatus, string> = {
  idle: 'bg-black/20',
  working: 'bg-black/20',
  shortBreak: 'bg-black/20',
  longBreak: 'bg-black/20',
  paused: 'bg-black/20',
};

/** 状态强调色 */
export const STATUS_ACCENT: Record<PomodoroStatus, string> = {
  idle: '#6b7280',
  working: '#ef4444',
  shortBreak: '#22c55e',
  longBreak: '#3b82f6',
  paused: '#eab308',
};

/** 格式化时间 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
