/**
 * 背景模块类型定义
 */

/** 背景组件 Props */
export interface BackgroundProps {
  imageUrl: string;
  className?: string;
}

/** 背景 Store 状态 */
export interface BackgroundState {
  backgroundUrl: string;
  backgroundBlur: number;
  backgroundOverlay: number;
  
  updateBackgroundUrl: (url: string) => void;
  updateBackgroundBlur: (value: number) => void;
  updateBackgroundOverlay: (value: number) => void;
  resetBackground: () => void;
}
