import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { useState } from 'react';
import { DraggableItem } from './DraggableItem';
import { ShortcutCard } from './ShortcutCard';
import { ShortcutFolder } from './ShortcutFolder';
import { FolderPopup } from './FolderPopup';
import { PluginCard } from '@/plugins';
import { getItemSize } from '../utils/gridUtils';
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

  const { items, setItems, itemsMap } = useShortcutItems({ shortcuts, columns, unit, gap });

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const activeItem = activeId ? itemsMap.get(activeId) : null;
  const activeItemSize = activeItem ? getItemSize(activeItem, unit, gap) : null;

  const { handleDragStart, handleDragMove, handleDragEnd, handleDragCancel } = createDragHandlers({
    items, setItems, itemsMap, columns, rows, unit, gap,
    setActiveId, setDragOverFolderId, setAnimatingItemId, onShortcutsChange,
  });

  const { handleFolderOpen, handleCloseFolder, handleFolderItemsChange, handleItemDragOut } = createFolderHandlers({
    items, setItems, itemsMap, columns, unit, gap, setOpenFolder, onShortcutsChange,
  });

  const handleResizeItem = (item: GridItem, size: ShortcutSize) => {
    const newItems = items.map(s => (s.id === item.id ? { ...s, size } : s));
    setItems(newItems);
    onShortcutsChange?.(newItems);
  };

  const handleRemoveItem = (item: GridItem) => {
    const newItems = items.filter(s => s.id !== item.id);
    setItems(newItems);
    onShortcutsChange?.(newItems);
  };

  const containerWidth = columns * unit + (columns - 1) * gap;
  const containerHeight = rows * unit + (rows - 1) * gap;

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
