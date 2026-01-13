import type { DragStartEvent, DragEndEvent, DragMoveEvent } from '@dnd-kit/core';
import { GridManager, pixelToGrid, gridToPixel, getGridSpan } from '@/utils/gridUtils';
import type { ShortcutItem, GridItem } from '@/types';
import { isShortcutFolder, isPluginCard } from '@/types';

interface DragHandlersOptions {
  items: GridItem[];
  setItems: React.Dispatch<React.SetStateAction<GridItem[]>>;
  itemsMap: Map<string, GridItem>;
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

    const currentPos = draggedItem.position || { x: 0, y: 0 };
    const dragPos = { x: currentPos.x + delta.x, y: currentPos.y + delta.y };
    const dragGrid = pixelToGrid(dragPos.x, dragPos.y, unit, gap);

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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;
    const draggedItemId = active.id as string;
    
    setActiveId(null);
    setDragOverFolderId(null);
    document.body.style.overflow = '';

    const draggedItem = itemsMap.get(draggedItemId);
    if (!draggedItem) return;

    const currentPos = draggedItem.position || { x: 0, y: 0 };
    const newPixelPos = { x: currentPos.x + delta.x, y: currentPos.y + delta.y };
    const targetGrid = pixelToGrid(newPixelPos.x, newPixelPos.y, unit, gap);
    const { colSpan, rowSpan } = getGridSpan(draggedItem.size || '1x1');

    if (!isShortcutFolder(draggedItem) && !isPluginCard(draggedItem)) {
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
          const newItems = items
            .filter(i => i.id !== draggedItemId)
            .map(i => {
              if (i.id === item.id && isShortcutFolder(i)) {
                return { ...i, items: [...i.items, draggedItem as ShortcutItem] };
              }
              return i;
            });

          setItems(newItems);
          onShortcutsChange?.(newItems);
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
      const originalGrid = pixelToGrid(currentPos.x, currentPos.y, unit, gap);
      const originalPos = gridToPixel(originalGrid.col, originalGrid.row, unit, gap);
      const dropPos = { x: currentPos.x + delta.x, y: currentPos.y + delta.y };
      
      const intermediateItems = items.map(item => 
        item.id === draggedItemId ? { ...item, position: dropPos } : item
      );
      setItems(intermediateItems);
      
      requestAnimationFrame(() => {
        setAnimatingItemId(draggedItemId);
        const finalItems = intermediateItems.map(item => 
          item.id === draggedItemId ? { ...item, position: originalPos } : item
        );
        setItems(finalItems);
        setTimeout(() => setAnimatingItemId(null), 250);
      });
      return;
    }
    
    const finalPos = gridToPixel(targetCol, targetRow, unit, gap);
    const dropPos = { x: currentPos.x + delta.x, y: currentPos.y + delta.y };
    
    const needsSnapAnimation = 
      Math.abs(dropPos.x - finalPos.x) > 5 || Math.abs(dropPos.y - finalPos.y) > 5;

    if (needsSnapAnimation) {
      const intermediateItems = items.map(item => 
        item.id === draggedItemId ? { ...item, position: dropPos } : item
      );
      setItems(intermediateItems);
      
      requestAnimationFrame(() => {
        setAnimatingItemId(draggedItemId);
        const finalItems = intermediateItems.map(item => 
          item.id === draggedItemId ? { ...item, position: finalPos } : item
        );
        setItems(finalItems);
        onShortcutsChange?.(finalItems);
        setTimeout(() => setAnimatingItemId(null), 250);
      });
    } else {
      const newItems = items.map(item => 
        item.id === draggedItemId ? { ...item, position: finalPos } : item
      );
      setItems(newItems);
      onShortcutsChange?.(newItems);
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
