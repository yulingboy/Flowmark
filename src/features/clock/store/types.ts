/**
 * Clock Store 类型定义
 */

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
