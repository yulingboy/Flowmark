/**
 * Modal 组件类型定义
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

/** useModalBehavior Options */
export interface UseModalBehaviorOptions {
  isOpen: boolean;
  onClose: () => void;
  enableDrag?: boolean;
  enableFullscreen?: boolean;
  enableClickOutside?: boolean;
  enableEscapeKey?: boolean;
  initialPosition?: { x: number; y: number };
}

/** useModalBehavior Result */
export interface UseModalBehaviorResult {
  position: { x: number; y: number };
  setPosition: (pos: { x: number; y: number }) => void;
  isFullscreen: boolean;
  setIsFullscreen: (value: boolean) => void;
  toggleFullscreen: () => void;
  isDragging: boolean;
  handlePointerDown: (e: React.PointerEvent) => void;
  modalRef: React.RefObject<HTMLDivElement | null>;
  reset: () => void;
}
