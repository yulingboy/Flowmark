/**
 * 通用组件类型定义
 */
import type { ReactNode } from 'react';

/** Modal 位置缓存 */
export interface ModalPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** MacModal Props */
export interface MacModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  width?: number;
  height?: number;
}

/** IframeModal Props */
export interface IframeModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title?: string;
  rememberPosition?: boolean;
  minSize?: { width: number; height: number };
  maxSize?: { width: number; height: number };
}

/** 错误边界 Props */
export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/** 错误边界状态 */
export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}
