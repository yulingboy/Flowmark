/**
 * Image 组件类型定义
 */
import type { CSSProperties, ReactNode } from 'react';

/** 懒加载图片 Props */
export interface LazyImageProps {
  src: string;
  alt: string;
  placeholder?: string;
  fallback?: string;
  className?: string;
  style?: CSSProperties;
  preload?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

/** 懒加载背景图片 Props */
export interface LazyBackgroundProps {
  src: string;
  placeholder?: string;
  fallback?: string;
  className?: string;
  style?: CSSProperties;
  preload?: boolean;
  children?: ReactNode;
}
