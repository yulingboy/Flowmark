/**
 * 时钟模块类型定义
 */
import type { ClockData } from '@/types';

/** 扩展的时钟数据 */
export interface ExtendedClockData extends ClockData {
  year: string;
  showLunar: boolean;
  showDate: boolean;
  showWeekday: boolean;
  showYear: boolean;
  clockColor: string;
  clockFontSize: 'small' | 'medium' | 'large';
}

/** 时钟组件 Props */
export interface ClockProps {
  className?: string;
}

/** 时钟 Store 状态 */
export interface ClockState {
  showSeconds: boolean;
  show24Hour: boolean;
  showLunar: boolean;
  showDate: boolean;
  showWeekday: boolean;
  showYear: boolean;
  clockColor: string;
  clockFontSize: 'small' | 'medium' | 'large';
  
  updateShowSeconds: (value: boolean) => void;
  updateShow24Hour: (value: boolean) => void;
  updateShowLunar: (value: boolean) => void;
  updateShowDate: (value: boolean) => void;
  updateShowWeekday: (value: boolean) => void;
  updateShowYear: (value: boolean) => void;
  updateClockColor: (value: string) => void;
  updateClockFontSize: (value: 'small' | 'medium' | 'large') => void;
  resetClock: () => void;
}
