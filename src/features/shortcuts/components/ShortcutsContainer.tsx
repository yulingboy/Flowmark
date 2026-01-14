import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { useState } from 'react';
import { DraggableItem } from './DraggableItem';
import { ShortcutCard } from './ShortcutCard';
import { ShortcutFolder } from './ShortcutFolder';
import { FolderPopup } from './FolderPopup';
import { PluginCard } from './PluginCard';
import { getItemSize, canResizeItem, GridManager, pixelToGrid, getGridSpan, TEXT_HEIGHT } from '@/utils/gridUtils';
import { useShortcutItems } from '../hooks/useShortcutItems';
import { createDragHandlers } from '../hooks/useDragHandlers';
import { createFolderHandlers } from '../hooks/useFolderHandlers';
import type { ShortcutFolder as ShortcutFolderType, ShortcutItem, ShortcutSize, GridItem } from '@/types';
import { isShortcutFolder, isPluginCard } from '@/types';
import { useShortcutsStore } from '../store';

interface ShortcutsContainerProps {
  shortcuts: GridItem[];
  onShortcutsChange?: (shortcuts: GridItem[]) => void;
  onEditShortcut?: (item: ShortcutItem) => void;
  onDeleteShortcut?: (item: ShortcutItem) => void;
  className?: string;
  columns?: number;
  rows?: number;
  unit?: number;
  gap?: number;
}

export function ShortcutsContainer({
  shortcuts, onShortcutsChange, onEditShortcut, onDeleteShortcut, className = '',
  columns = 4, rows = 3, unit = 64, gap = 16,
}: ShortcutsContainerProps) {
  const [openFolder, setOpenFolder] = useState<ShortcutFolderType | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [dragOverFolderId, setDragOverFolderId] = useState<string | null>(null);
  const [animatingItemId, setAnimatingItemId] = useState<string | null>(null);

  const batchEditMode = useShortcutsStore((state) => state.batchEditMode);
  const selectedIds = useShortcutsStore((state) => state.selectedIds);
  const toggleSelection = useShortcutsStore((state) => state.toggleSelection);

  const { items, setItems, itemsMap } = useShortcutItems({ shortcuts, columns, rows, unit, gap });

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const activeItem = activeId ? itemsMap.get(activeId) : null;
  const activeItemSize = activeItem ? getItemSize(activeItem, unit, gap) : null;

  const { handleDragStart, handleDragMove, handleDragEnd, handleDragCancel } = createDragHandlers({
    items, setItems, itemsMap, columns, rows, unit, gap,
    setActiveId, setDragOverFolderId, setAnimatingItemId, onShortcutsChange,
  });

  const { handleFolderOpen, handleCloseFolder, handleFolderItemsChange, handleItemDragOut } = createFolderHandlers({
    items, setItems, itemsMap, columns, rows, unit, gap, setOpenFolder, onShortcutsChange,
  });

  /**
   * 处理卡片尺寸调整
   * 
   * 验证流程：
   * 1. 边界验证：检查新尺寸是否会超出网格边界（4行限制）
   * 2. 碰撞验证：检查新尺寸是否会与其他卡片重叠
   * 
   * 如果任一验证失败，拒绝操作，保持原尺寸不变
   */
  const handleResizeItem = (item: GridItem, size: ShortcutSize) => {
    const position = item.position || { x: 0, y: 0 };
    
    // 边界验证：检查新尺寸是否会超出网格边界
    if (!canResizeItem(position, size, { columns, rows, unit, gap })) {
      console.warn(`Cannot resize item ${item.id} to ${size}: would overflow grid boundaries`);
      return; // 拒绝操作，保持原尺寸
    }
    
    // 碰撞验证：检查新尺寸是否会与其他卡片冲突
    const { col, row } = pixelToGrid(position.x, position.y, unit, gap);
    const { colSpan, rowSpan } = getGridSpan(size);
    const manager = new GridManager(columns, rows, unit, gap);
    manager.initFromItems(items, item.id); // 排除当前卡片自身
    
    if (!manager.canPlace(col, row, colSpan, rowSpan)) {
      console.warn(`Cannot resize item ${item.id} to ${size}: would collide with other items`);
      return; // 拒绝操作，保持原尺寸
    }
    
    // 验证通过，更新尺寸
    const newItems = items.map(s => (s.id === item.id ? { ...s, size } : s));
    setItems(newItems);
    onShortcutsChange?.(newItems);
  };

  const handleRemoveItem = (item: GridItem) => {
    const newItems = items.filter(s => s.id !== item.id);
    setItems(newItems);
    onShortcutsChange?.(newItems);
  };

  const hGap = gap + TEXT_HEIGHT;  // 水平间距包含文字高度
  const containerWidth = columns * unit + (columns - 1) * hGap;
  const containerHeight = rows * (unit + TEXT_HEIGHT) + (rows - 1) * gap;

  return (
    <div className={`relative ${className}`}>
      <DndContext sensors={sensors} modifiers={[restrictToWindowEdges]}
        onDragStart={handleDragStart} onDragMove={handleDragMove} onDragEnd={handleDragEnd} onDragCancel={handleDragCancel}>
        <div style={{ position: 'relative', width: containerWidth, height: containerHeight }}>
          {items.map((entry) => {
            const pos = entry.position || { x: 0, y: 0 };
            const size = getItemSize(entry, unit, gap);
            return (
              <DraggableItem key={entry.id} entry={entry} position={pos} size={size} gridConfig={{ columns, rows, unit, gap }}
                onOpen={handleFolderOpen} onEdit={onEditShortcut} onDelete={onDeleteShortcut} onResize={handleResizeItem} onRemove={handleRemoveItem}
                isDropTarget={dragOverFolderId === entry.id} isDragging={activeId === entry.id} shouldAnimate={animatingItemId === entry.id}
                batchEditMode={batchEditMode} isSelected={selectedIds.has(entry.id)} onToggleSelect={toggleSelection} />
            );
          })}
        </div>
        <DragOverlay dropAnimation={null}>
          {activeItem && activeItemSize ? (
            <div style={{ width: activeItemSize.width, height: activeItemSize.height, opacity: 0.9, transform: 'scale(1.05)', cursor: 'grabbing' }}>
              {isShortcutFolder(activeItem) ? <ShortcutFolder folder={activeItem} />
                : isPluginCard(activeItem) ? <PluginCard item={activeItem} />
                : <ShortcutCard item={activeItem as ShortcutItem} />}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
      {openFolder && (
        <FolderPopup folder={openFolder} onClose={handleCloseFolder}
          onItemsChange={(newItems) => handleFolderItemsChange(openFolder.id, newItems)}
          onItemDragOut={(item) => handleItemDragOut(openFolder.id, item)} />
      )}
    </div>
  );
}
