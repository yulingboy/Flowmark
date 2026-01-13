import { useState, useEffect, useRef, useCallback } from 'react';

export interface UseModalBehaviorOptions {
  isOpen: boolean;
  onClose: () => void;
  enableDrag?: boolean;
  enableFullscreen?: boolean;
  enableClickOutside?: boolean;
  enableEscapeKey?: boolean;
  initialPosition?: { x: number; y: number };
}

export interface UseModalBehaviorResult {
  // 位置状态
  position: { x: number; y: number };
  setPosition: (pos: { x: number; y: number }) => void;
  
  // 全屏状态
  isFullscreen: boolean;
  setIsFullscreen: (value: boolean) => void;
  toggleFullscreen: () => void;
  
  // 拖拽状态
  isDragging: boolean;
  handlePointerDown: (e: React.PointerEvent) => void;
  
  // Refs
  modalRef: React.RefObject<HTMLDivElement | null>;
  
  // 重置
  reset: () => void;
}

/**
 * Modal 行为 Hook
 * 封装弹窗的通用行为：拖拽、全屏、ESC 关闭、点击外部关闭
 */
export function useModalBehavior(options: UseModalBehaviorOptions): UseModalBehaviorResult {
  const {
    isOpen,
    onClose,
    enableDrag = true,
    enableFullscreen = true,
    enableClickOutside = true,
    enableEscapeKey = true,
    initialPosition = { x: 0, y: 0 },
  } = options;

  const modalRef = useRef<HTMLDivElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, posX: 0, posY: 0 });
  const prevIsOpenRef = useRef(isOpen);


  // 重置状态
  const reset = useCallback(() => {
    setPosition(initialPosition);
    setIsFullscreen(false);
  }, [initialPosition]);

  // 打开时重置状态
  useEffect(() => {
    if (isOpen && !prevIsOpenRef.current) {
      reset();
    }
    prevIsOpenRef.current = isOpen;
  }, [isOpen, reset]);

  // 切换全屏
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev);
  }, []);

  // 拖拽开始
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (!enableDrag || isFullscreen) return;
    e.stopPropagation();
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY, posX: position.x, posY: position.y };
  }, [enableDrag, isFullscreen, position]);

  // 拖拽移动和结束
  useEffect(() => {
    if (!isDragging) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({
        x: dragStartRef.current.posX + (e.clientX - dragStartRef.current.x),
        y: dragStartRef.current.posY + (e.clientY - dragStartRef.current.y),
      });
    };
    
    const handleMouseUp = () => setIsDragging(false);
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // ESC 键处理
  useEffect(() => {
    if (!enableEscapeKey || !isOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (enableFullscreen && isFullscreen) {
          setIsFullscreen(false);
        } else {
          onClose();
        }
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, enableEscapeKey, enableFullscreen, isFullscreen]);

  // 点击外部关闭
  useEffect(() => {
    if (!enableClickOutside || !isOpen || isFullscreen) return;
    
    const handleClickOutside = (e: MouseEvent) => {
      // 只响应左键点击
      if (e.button !== 0) return;
      if (!isDragging && modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose, enableClickOutside, isFullscreen, isDragging]);

  return {
    position,
    setPosition,
    isFullscreen,
    setIsFullscreen,
    toggleFullscreen,
    isDragging,
    handlePointerDown,
    modalRef,
    reset,
  };
}
