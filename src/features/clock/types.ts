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

// ClockState 定义在 store/types.ts 中
