// Common components barrel export

// Modal 组件
export { MacModal, IframeModal, useModalBehavior } from './Modal';
export type { 
  ModalPosition, 
  MacModalProps, 
  IframeModalProps, 
  UseModalBehaviorOptions, 
  UseModalBehaviorResult 
} from './Modal';

// Menu 组件
export { ContextMenu } from './Menu';
export type { ContextMenuItem, ContextMenuProps } from './Menu';

// Image 组件
export { LazyImage, LazyBackground, ProgressiveImage, ProgressiveBackground } from './Image';
export type { LazyImageProps, LazyBackgroundProps, ProgressiveImageProps, ProgressiveBackgroundProps } from './Image';

// 图标库
export * from './icons';

// 错误边界
export { ErrorBoundary } from './ErrorBoundary';
export type { ErrorBoundaryProps, ErrorBoundaryState } from './types';
