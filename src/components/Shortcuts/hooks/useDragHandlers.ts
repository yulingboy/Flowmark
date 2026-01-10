import type { DragStartEvent, DragEndEvent, DragMoveEvent } from '@dnd-kit/core';
import { GridManager, pixelToGrid, gridToPixel, getGridSpan } from '../utils/gridUtils';
import type { ShortcutEntry, ShortcutItem } from '@/types';
import { isShortcutFolder } from '@/types';

interface DragHandlersOptions {
  items: ShortcutEntry[];
  setItems: React.Dispatch<React.SetStateAction<ShortcutEntry[]>>;
  itemsMap: Map<string, ShortcutEntry>;
  columns: number;
  unit: number;
  gap: number;
  setActiveId: (id: string | null) => void;
  setDragOverFolderId: (id: string | null) => void;
  setAnimatingItemId: (id: string | null) => void;
  onShortcutsChange?: (shortcuts: ShortcutEntry[]) => void;
}

export function createDragHandlers({
  items,
  setItems,
  itemsMap,
  columns,
  unit,
  gap,
  setActiveId,
  setDragOverFolderId,
  setAnimatingItemId,
  onShortcutsChange,
}: DragHandlersOptions) {

  // 拖拽开始
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    setAnimatingItemId(null);
  };

  // 拖拽移动 - 检测是否悬停在文件夹上
  const handleDragMove = (event: DragMoveEvent) => {
    const { active, delta } = event;
    const draggedItemId = active.id as string;
    const draggedItem = itemsMap.get(draggedItemId);
    
    if (!draggedItem || isShortcutFolder(draggedItem)) {
      setDragOverFolderId(null);
      return;
    }

    const currentPos = draggedItem.position || { x: 0, y: 0 };
    const dragPos = {
      x: currentPos.x + delta.x,
      y: currentPos.y + delta.y,
    };

    const dragGrid = pixelToGrid(dragPos.x, dragPos.y, unit, gap);

    // 检查是否悬停在某个文件夹上
    let hoveredFolderId: string | null = null;
    for (const item of items) {
      if (item.id === draggedItemId || !isShortcutFolder(item)) continue;
      
      const folderPos = item.position || { x: 0, y: 0 };
      const folderGrid = pixelToGrid(folderPos.x, folderPos.y, unit, gap);
      const folderSpan = getGridSpan(item.size || '1x1');
      
      if (
        dragGrid.col >= folderGrid.col &&
        dragGrid.col < folderGrid.col + folderSpan.colSpan &&
        dragGrid.row >= folderGrid.row &&
        dragGrid.row < folderGrid.row + folderSpan.rowSpan
      ) {
        hoveredFolderId = item.id;
        break;
      }
    }

    setDragOverFolderId(hoveredFolderId);
  };

  // 拖拽结束
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;
    const draggedItemId = active.id as string;
    
    setActiveId(null);
    setDragOverFolderId(null);

    const draggedItem = itemsMap.get(draggedItemId);
    if (!draggedItem) return;

    const currentPos = draggedItem.position || { x: 0, y: 0 };
    const newPixelPos = {
      x: currentPos.x + delta.x,
      y: currentPos.y + delta.y,
    };

    const targetGrid = pixelToGrid(newPixelPos.x, newPixelPos.y, unit, gap);
    const { colSpan, rowSpan } = getGridSpan(draggedItem.size || '1x1');

    // 检查是否拖到文件夹上
    if (!isShortcutFolder(draggedItem)) {
      for (const item of items) {
        if (item.id === draggedItemId || !isShortcutFolder(item)) continue;
        
        const folderPos = item.position || { x: 0, y: 0 };
        const folderGrid = pixelToGrid(folderPos.x, folderPos.y, unit, gap);
        const folderSpan = getGridSpan(item.size || '1x1');
        
        if (
          targetGrid.col >= folderGrid.col &&
          targetGrid.col < folderGrid.col + folderSpan.colSpan &&
          targetGrid.row >= folderGrid.row &&
          targetGrid.row < folderGrid.row + folderSpan.rowSpan
        ) {
          // 拖入文件夹
          const newItems = items
            .filter(i => i.id !== draggedItemId)
            .map(i => {
              if (i.id === item.id && isShortcutFolder(i)) {
                return {
                  ...i,
                  items: [...i.items, draggedItem as ShortcutItem],
                };
              }
              return i;
            });

          setItems(newItems);
          onShortcutsChange?.(newItems);
          return;
        }
      }
    }

    // 检查目标网格位置是否可用
    const manager = new GridManager(columns, unit, gap);
    manager.initFromItems(items, draggedItemId);
    
    const targetCol = Math.max(0, targetGrid.col);
    const targetRow = Math.max(0, targetGrid.row);
    const canPlaceAtTarget = manager.canPlace(targetCol, targetRow, colSpan, rowSpan);
    
    // 如果目标位置被占用，返回原位置
    if (!canPlaceAtTarget) {
      const originalGrid = pixelToGrid(currentPos.x, currentPos.y, unit, gap);
      const originalPos = gridToPixel(originalGrid.col, originalGrid.row, unit, gap);
      
      const dropPos = {
        x: currentPos.x + delta.x,
        y: currentPos.y + delta.y,
      };
      
      const intermediateItems = items.map(item => {
        if (item.id === draggedItemId) {
          return { ...item, position: dropPos };
        }
        return item;
      });
      setItems(intermediateItems);
      
      requestAnimationFrame(() => {
        setAnimatingItemId(draggedItemId);
        const finalItems = intermediateItems.map(item => {
          if (item.id === draggedItemId) {
            return { ...item, position: originalPos };
          }
          return item;
        });
        setItems(finalItems);
        setTimeout(() => setAnimatingItemId(null), 250);
      });
      return;
    }
    
    // 目标位置可用，移动到目标位置
    const finalPos = gridToPixel(targetCol, targetRow, unit, gap);
    const dropPos = {
      x: currentPos.x + delta.x,
      y: currentPos.y + delta.y,
    };
    
    const needsSnapAnimation = 
      Math.abs(dropPos.x - finalPos.x) > 5 || 
      Math.abs(dropPos.y - finalPos.y) > 5;

    if (needsSnapAnimation) {
      const intermediateItems = items.map(item => {
        if (item.id === draggedItemId) {
          return { ...item, position: dropPos };
        }
        return item;
      });
      setItems(intermediateItems);
      
      requestAnimationFrame(() => {
        setAnimatingItemId(draggedItemId);
        const finalItems = intermediateItems.map(item => {
          if (item.id === draggedItemId) {
            return { ...item, position: finalPos };
          }
          return item;
        });
        setItems(finalItems);
        onShortcutsChange?.(finalItems);
        setTimeout(() => setAnimatingItemId(null), 250);
      });
    } else {
      const newItems = items.map(item => {
        if (item.id === draggedItemId) {
          return { ...item, position: finalPos };
        }
        return item;
      });
      setItems(newItems);
      onShortcutsChange?.(newItems);
    }
  };

  return {
    handleDragStart,
    handleDragMove,
    handleDragEnd,
  };
}
