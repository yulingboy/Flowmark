import { useState, useRef, useCallback, useEffect } from 'react';
import type { ShortcutEntry, ShortcutItem } from '@/types';
import { isShortcutFolder } from '@/types';
import { getGridSpan, TEXT_HEIGHT } from '../utils/gridUtils';
import {
  calculateDragOffset,
  setupDragData,
  createThrottledPositionUpdater,
  canSwap,
} from '../utils/dragUtils';

interface UseDragAndDropProps {
  items: ShortcutEntry[];
  setItems: React.Dispatch<React.SetStateAction<ShortcutEntry[]>>;
  sortOrder: string[];
  setSortOrder: React.Dispatch<React.SetStateAction<string[]>>;
  itemsMap: Map<string, ShortcutEntry>;
  onShortcutsChange?: (shortcuts: ShortcutEntry[]) => void;
  unit: number;
  gap: number;
}

export function useDragAndDrop({
  items,
  setItems,
  sortOrder,
  setSortOrder,
  itemsMap,
  onShortcutsChange,
  unit,
  gap,
}: UseDragAndDropProps) {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [dragPosition, setDragPosition] = useState<{ x: number; y: number } | null>(null);
  
  const lastSwapTime = useRef<number>(0);
  const dragOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  
  // 使用 RAF 节流的位置更新器
  const positionUpdater = useRef(createThrottledPositionUpdater(setDragPosition));
  
  // 清理 RAF
  useEffect(() => {
    return () => {
      positionUpdater.current.cancel();
    };
  }, []);

  const getDraggedItemSize = useCallback(() => {
    const item = itemsMap.get(draggedId || '');
    if (!item) return { width: unit, height: unit + TEXT_HEIGHT };
    const size = item.size || '1x1';
    const { colSpan, rowSpan } = getGridSpan(size);
    return {
      width: colSpan * unit + (colSpan - 1) * gap,
      height: rowSpan * unit + (rowSpan - 1) * gap + TEXT_HEIGHT,
    };
  }, [draggedId, itemsMap, unit, gap]);

  const handleDragStart = (e: React.DragEvent, entry: ShortcutEntry) => {
    dragOffset.current = calculateDragOffset(e, e.currentTarget as HTMLElement);
    setDraggedId(entry.id);
    setupDragData(e, entry.id);
  };

  const handleDrag = (e: React.DragEvent) => {
    if (e.clientX === 0 && e.clientY === 0) return;
    // 使用 RAF 节流，避免每帧都触发状态更新
    positionUpdater.current.updatePosition(e.clientX, e.clientY);
  };

  const handleDragEnd = () => {
    // 取消未执行的 RAF
    positionUpdater.current.cancel();
    
    const newItems = sortOrder
      .map(id => itemsMap.get(id))
      .filter((item): item is ShortcutEntry => item !== undefined);
    
    setItems(newItems);
    onShortcutsChange?.(newItems);
    
    setDraggedId(null);
    setDragOverId(null);
    setDragPosition(null);
  };

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    if (!draggedId || targetId === draggedId) return;
    
    setDragOverId(targetId);
    
    // 使用节流检查，避免过于频繁的交换
    if (!canSwap(lastSwapTime.current)) return;
    
    const draggedItem = itemsMap.get(draggedId);
    const targetItem = itemsMap.get(targetId);
    if (!draggedItem || !targetItem) return;
    
    if (isShortcutFolder(targetItem) && !isShortcutFolder(draggedItem)) {
      return;
    }
    
    const oldIndex = sortOrder.indexOf(draggedId);
    const newIndex = sortOrder.indexOf(targetId);
    
    if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
      lastSwapTime.current = Date.now();
      const newOrder = [...sortOrder];
      newOrder.splice(oldIndex, 1);
      newOrder.splice(newIndex, 0, draggedId);
      setSortOrder(newOrder);
    }
  };

  const handleDragLeave = () => {
    setDragOverId(null);
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    
    if (!draggedId || draggedId === targetId) return;

    const draggedItem = itemsMap.get(draggedId);
    const targetItem = itemsMap.get(targetId);
    if (!draggedItem || !targetItem) return;

    if (isShortcutFolder(targetItem) && !isShortcutFolder(draggedItem)) {
      const newOrder = sortOrder.filter(id => id !== draggedId);
      setSortOrder(newOrder);
      
      const newItems = items
        .filter(item => item.id !== draggedId)
        .map(item => {
          if (item.id === targetId && isShortcutFolder(item)) {
            return {
              ...item,
              items: [...item.items, draggedItem as ShortcutItem],
            };
          }
          return item;
        });
      
      setItems(newItems);
      onShortcutsChange?.(newItems);
      
      setDraggedId(null);
      setDragOverId(null);
      setDragPosition(null);
    }
  };

  const isDraggingToFolder = (entryId: string) => {
    if (!draggedId || !dragOverId) return false;
    const draggedItem = itemsMap.get(draggedId);
    const overItem = itemsMap.get(dragOverId);
    return (
      dragOverId === entryId &&
      draggedItem &&
      !isShortcutFolder(draggedItem) &&
      overItem &&
      isShortcutFolder(overItem)
    );
  };

  return {
    draggedId,
    dragOverId,
    dragPosition,
    dragOffset,
    getDraggedItemSize,
    handleDragStart,
    handleDrag,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    isDraggingToFolder,
  };
}
