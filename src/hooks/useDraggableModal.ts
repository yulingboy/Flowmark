import { useState, useEffect, useCallback, useRef } from 'react';

interface UseDraggableModalOptions {
  initialPosition?: { x: number; y: number };
  constrainToViewport?: boolean;
  disabled?: boolean;
}

interface UseDraggableModalReturn {
  position: { x: number; y: number };
  isDragging: boolean;
  handleMouseDown: (e: React.MouseEvent) => void;
  resetPosition: () => void;
}

/**
 * 可拖拽弹窗 Hook
 * 提供统一的拖拽逻辑，用于 Modal 和 IframeModal 组件
 */
export function useDraggableModal(options: UseDraggableModalOptions = {}): UseDraggableModalReturn {
  const {
    initialPosition = { x: 0, y: 0 },
    constrainToViewport = false,
    disabled = false,
  } = options;

  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, posX: 0, posY: 0 });

  // 重置位置
  const resetPosition = useCallback(() => {
    setPosition(initialPosition);
  }, [initialPosition]);

  // 鼠标按下开始拖拽
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (disabled) return;
    e.stopPropagation();
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      posX: position.x,
      posY: position.y,
    };
  }, [disabled, position]);

  // 处理拖拽移动和释放
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      let newX = dragStartRef.current.posX + (e.clientX - dragStartRef.current.x);
      let newY = dragStartRef.current.posY + (e.clientY - dragStartRef.current.y);

      // 边界约束
      if (constrainToViewport) {
        const maxX = window.innerWidth / 2;
        const maxY = window.innerHeight / 2;
        newX = Math.max(-maxX, Math.min(maxX, newX));
        newY = Math.max(-maxY, Math.min(maxY, newY));
      }

      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, constrainToViewport]);

  return {
    position,
    isDragging,
    handleMouseDown,
    resetPosition,
  };
}
