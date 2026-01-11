import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { useState } from 'react';
import { DraggableItem } from './DraggableItem';
import { ShortcutCard } from './ShortcutCard';
import { ShortcutFolder } from './ShortcutFolder';
import { FolderPopup } from './FolderPopup';
import { getItemSize } from './utils/gridUtils';
import { useShortcutItems } from './hooks/useShortcutItems';
import { createDragHandlers } from './hooks/useDragHandlers';
import { createFolderHandlers } from './hooks/useFolderHandlers';
import type { ShortcutEntry, ShortcutFolder as ShortcutFolderType, ShortcutItem, ShortcutSize } from '@/types';
import { isShortcutFolder } from '@/types';

interface ShortcutsContainerProps {
  shortcuts: ShortcutEntry[];
  onShortcutsChange?: (shortcuts: ShortcutEntry[]) => void;
  onEditShortcut?: (item: ShortcutItem) => void;
  onDeleteShortcut?: (item: ShortcutItem) => void;
  className?: string;
  columns?: number;
  rows?: number;
  unit?: number;
  gap?: number;
}

export function ShortcutsContainer({
  shortcuts,
  onShortcutsChange,
  onEditShortcut,
  onDeleteShortcut,
  className = '',
  columns = 4,
  rows = 3,
  unit = 64,
  gap = 16,
}: ShortcutsContainerProps) {
  const [openFolder, setOpenFolder] = useState<ShortcutFolderType | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [dragOverFolderId, setDragOverFolderId] = useState<string | null>(null);
  const [animatingItemId, setAnimatingItemId] = useState<string | null>(null);

  // 使用自定义 hooks 管理项目状态
  const { items, setItems, itemsMap } = useShortcutItems({
    shortcuts,
    columns,
    unit,
    gap,
  });

  // 配置拖拽传感器
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  // 获取当前拖拽的元素
  const activeItem = activeId ? itemsMap.get(activeId) : null;
  const activeItemSize = activeItem ? getItemSize(activeItem, unit, gap) : null;

  // 创建拖拽处理函数
  const { handleDragStart, handleDragMove, handleDragEnd, handleDragCancel } = createDragHandlers({
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
  });

  // 创建文件夹处理函数
  const { 
    handleFolderOpen, 
    handleCloseFolder, 
    handleFolderItemsChange, 
    handleItemDragOut 
  } = createFolderHandlers({
    items,
    setItems,
    itemsMap,
    columns,
    unit,
    gap,
    setOpenFolder,
    onShortcutsChange,
  });

  // 调整标签大小（在内部处理，保留位置信息）
  const handleResizeShortcut = (item: ShortcutItem, size: ShortcutSize) => {
    const newItems = items.map(s => {
      if (s.id === item.id && !isShortcutFolder(s)) {
        return { ...s, size };
      }
      return s;
    });
    setItems(newItems);
    onShortcutsChange?.(newItems);
  };

  // 计算容器尺寸（基于配置的行列数）
  const containerWidth = columns * unit + (columns - 1) * gap;
  const containerHeight = rows * unit + (rows - 1) * gap;

  return (
    <div className={`relative ${className}`}>
      <DndContext
        sensors={sensors}
        modifiers={[restrictToWindowEdges]}
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div
          style={{
            position: 'relative',
            width: containerWidth,
            height: containerHeight,
          }}
        >
          {items.map((entry) => {
            const pos = entry.position || { x: 0, y: 0 };
            const size = getItemSize(entry, unit, gap);
            const isDropTarget = dragOverFolderId === entry.id;
            const isDragging = activeId === entry.id;

            return (
              <DraggableItem
                key={entry.id}
                entry={entry}
                position={pos}
                size={size}
                onOpen={handleFolderOpen}
                onEdit={onEditShortcut}
                onDelete={onDeleteShortcut}
                onResize={handleResizeShortcut}
                isDropTarget={isDropTarget}
                isDragging={isDragging}
                shouldAnimate={animatingItemId === entry.id}
              />
            );
          })}
        </div>

        <DragOverlay dropAnimation={null}>
          {activeItem && activeItemSize ? (
            <div
              style={{
                width: activeItemSize.width,
                height: activeItemSize.height,
                opacity: 0.9,
                transform: 'scale(1.05)',
                cursor: 'grabbing',
              }}
            >
              {isShortcutFolder(activeItem) ? (
                <ShortcutFolder folder={activeItem} />
              ) : (
                <ShortcutCard item={activeItem} />
              )}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {openFolder && (
        <FolderPopup
          folder={openFolder}
          onClose={handleCloseFolder}
          onItemsChange={(newItems) => handleFolderItemsChange(openFolder.id, newItems)}
          onItemDragOut={(item) => handleItemDragOut(openFolder.id, item)}
        />
      )}
    </div>
  );
}
