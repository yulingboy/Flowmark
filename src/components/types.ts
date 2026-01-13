/**
 * 通用组件类型定义
 */
import type { ReactNode } from 'react';

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
