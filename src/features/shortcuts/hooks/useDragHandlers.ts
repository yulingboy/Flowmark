import type { DragStartEvent, DragEndEvent, DragMoveEvent } from '@dnd-kit/core';
import { GridManager, pixelToGrid, gridToPixel, getGridSpan } from '@/utils/gridUtils';
import type { ShortcutItem, GridItem, GridPosition } from '@/types';
import { isShortcutFolder, isPluginCard } from '@/types';
import type { GridItemWithRenderPosition } from './useShortcutItems';

interface DragHandlersOptions {
  items: GridItemWithRenderPosition[];
  setItems: React.Dispatch<React.SetStateAction<GridItemWithRenderPosition[]>>;
  itemsMap: Map<string, GridItemWithRenderPosition>;
  columns: number;
  rows: number;
  unit: number;
  gap: number;
  setActiveId: (id: string | null) => void;
  setDragOverFolderId: (id: string | null) => void;
  setAnimatingItemId: (id: string | null) => void;
  onShortcutsChange?: (shortcuts: GridItem[]) => void;
}

export function createDragHandlers({
  items,
  setItems,
  itemsMap,
  columns,
  rows,
  unit,
  gap,
  setActiveId,
  setDragOverFolderId,
  setAnimatingItemId,
  onShortcutsChange,
}: DragHandlersOptions) {

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    setAnimatingItemId(null);
    document.body.style.overflow = 'hidden';
  };

  const handleDragMove = (event: DragMoveEvent) => {
    const { active, delta } = event;
    const draggedItemId = active.id as string;
    const draggedItem = itemsMap.get(draggedItemId);
    
    if (!draggedItem || isShortcutFolder(draggedItem) || isPluginCard(draggedItem)) {
      setDragOverFolderId(null);
      return;
    }

    // 使用 _renderPosition 进行像素计算
    const currentPos = draggedItem._renderPosition;
    const dragPos = { x: currentPos.x + delta.x, y: currentPos.y + delta.y };
    const dragGrid = pixelToGrid(dragPos.x, dragPos.y, unit, gap);

    let hoveredFolderId: string | null = null;
    for (const item of items) {
      if (item.id === draggedItemId || !isShortcutFolder(item)) continue;
      
      // 使用 _renderPosition 进行像素计算
      const folderPos = item._renderPosition;
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;
    const draggedItemId = active.id as string;
    
    setActiveId(null);
    setDragOverFolderId(null);
    document.body.style.overflow = '';

    const draggedItem = itemsMap.get(draggedItemId);
    if (!draggedItem) return;

    // 使用 _renderPosition 进行像素计算
    const currentPos = draggedItem._renderPosition;
    const newPixelPos = { x: currentPos.x + delta.x, y: currentPos.y + delta.y };
    const targetGrid = pixelToGrid(newPixelPos.x, newPixelPos.y, unit, gap);
    const { colSpan, rowSpan } = getGridSpan(draggedItem.size || '1x1');

    if (!isShortcutFolder(draggedItem) && !isPluginCard(draggedItem)) {
      for (const item of items) {
        if (item.id === draggedItemId || !isShortcutFolder(item)) continue;
        
        // 使用 _renderPosition 进行像素计算
        const folderPos = item._renderPosition;
        const folderGrid = pixelToGrid(folderPos.x, folderPos.y, unit, gap);
        const folderSpan = getGridSpan(item.size || '1x1');
        
        if (
          targetGrid.col >= folderGrid.col &&
          targetGrid.col < folderGrid.col + folderSpan.colSpan &&
          targetGrid.row >= folderGrid.row &&
          targetGrid.row < folderGrid.row + folderSpan.rowSpan
        ) {
          const newItems = items
            .filter(i => i.id !== draggedItemId)
            .map(i => {
              if (i.id === item.id && isShortcutFolder(i)) {
                return { ...i, items: [...i.items, draggedItem as ShortcutItem] };
              }
              return i;
            });

          setItems(newItems);
          // 移除 _renderPosition 后传递给外部回调
          const itemsForStorage = newItems.map(({ _renderPosition, ...rest }) => rest) as GridItem[];
          onShortcutsChange?.(itemsForStorage);
          return;
        }
      }
    }

    const isOutOfBounds = 
      targetGrid.col < 0 || targetGrid.row < 0 || 
      targetGrid.col + colSpan > columns || targetGrid.row + rowSpan > rows;

    const manager = new GridManager(columns, rows, unit, gap);
    manager.initFromItems(items, draggedItemId);
    
    const targetCol = Math.max(0, Math.min(targetGrid.col, columns - colSpan));
    const targetRow = Math.max(0, Math.min(targetGrid.row, rows - rowSpan));
    const canPlaceAtTarget = !isOutOfBounds && manager.canPlace(targetCol, targetRow, colSpan, rowSpan);
    
    if (!canPlaceAtTarget) {
      // 无法放置，回弹到原位置
      const originalGrid = draggedItem.position || { col: 0, row: 0 };
      const originalPos = gridToPixel(originalGrid.col, originalGrid.row, unit, gap);
      const dropPos = { x: currentPos.x + delta.x, y: currentPos.y + delta.y };
      
      // 先设置到拖拽结束位置（用于动画起点）
      const intermediateItems = items.map(item => 
        item.id === draggedItemId ? { ...item, _renderPosition: dropPos } : item
      );
      setItems(intermediateItems);
      
      requestAnimationFrame(() => {
        setAnimatingItemId(draggedItemId);
        // 动画回弹到原位置
        const finalItems = intermediateItems.map(item => 
          item.id === draggedItemId ? { ...item, _renderPosition: originalPos } : item
        );
        setItems(finalItems);
        setTimeout(() => setAnimatingItemId(null), 250);
      });
      return;
    }
    
    // 计算最终的网格位置和像素位置
    const finalGridPos: GridPosition = { col: targetCol, row: targetRow };
    const finalPixelPos = gridToPixel(targetCol, targetRow, unit, gap);
    const dropPos = { x: currentPos.x + delta.x, y: currentPos.y + delta.y };
    
    const needsSnapAnimation = 
      Math.abs(dropPos.x - finalPixelPos.x) > 5 || Math.abs(dropPos.y - finalPixelPos.y) > 5;

    if (needsSnapAnimation) {
      // 先设置到拖拽结束位置（用于动画起点）
      const intermediateItems = items.map(item => 
        item.id === draggedItemId ? { ...item, _renderPosition: dropPos } : item
      );
      setItems(intermediateItems);
      
      requestAnimationFrame(() => {
        setAnimatingItemId(draggedItemId);
        // 动画吸附到网格位置，同时更新 position 为 GridPosition
        const finalItems = intermediateItems.map(item => 
          item.id === draggedItemId 
            ? { ...item, position: finalGridPos, _renderPosition: finalPixelPos } 
            : item
        );
        setItems(finalItems);
        // 移除 _renderPosition 后传递给外部回调
        const itemsForStorage = finalItems.map(({ _renderPosition, ...rest }) => rest) as GridItem[];
        onShortcutsChange?.(itemsForStorage);
        setTimeout(() => setAnimatingItemId(null), 250);
      });
    } else {
      // 直接更新位置，position 存储 GridPosition
      const newItems = items.map(item => 
        item.id === draggedItemId 
          ? { ...item, position: finalGridPos, _renderPosition: finalPixelPos } 
          : item
      );
      setItems(newItems);
      // 移除 _renderPosition 后传递给外部回调
      const itemsForStorage = newItems.map(({ _renderPosition, ...rest }) => rest) as GridItem[];
      onShortcutsChange?.(itemsForStorage);
    }
  };

  const handleDragCancel = () => {
    setActiveId(null);
    setDragOverFolderId(null);
    setAnimatingItemId(null);
    document.body.style.overflow = '';
  };

  return { handleDragStart, handleDragMove, handleDragEnd, handleDragCancel };
}
