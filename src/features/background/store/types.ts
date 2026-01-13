/**
 * Background Store 类型定义
 */

export interface BackgroundState {
  backgroundUrl: string;
  backgroundBlur: number;
  backgroundOverlay: number;
  
  updateBackgroundUrl: (url: string) => void;
  updateBackgroundBlur: (value: number) => void;
  updateBackgroundOverlay: (value: number) => void;
  resetBackground: () => void;
}
