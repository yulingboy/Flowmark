/**
 * Background Store 类型定义
 */

/** 背景类型：图片或纯色 */
export type BackgroundType = 'image' | 'color';

export interface BackgroundState {
  /** 背景类型 */
  backgroundType: BackgroundType;
  /** 背景图片 URL */
  backgroundUrl: string;
  /** 背景颜色（支持 hex、rgb、渐变等） */
  backgroundColor: string;
  /** 模糊程度 */
  backgroundBlur: number;
  /** 遮罩透明度 */
  backgroundOverlay: number;
  
  updateBackgroundType: (type: BackgroundType) => void;
  updateBackgroundUrl: (url: string) => void;
  updateBackgroundColor: (color: string) => void;
  updateBackgroundBlur: (value: number) => void;
  updateBackgroundOverlay: (value: number) => void;
  resetBackground: () => void;
}
