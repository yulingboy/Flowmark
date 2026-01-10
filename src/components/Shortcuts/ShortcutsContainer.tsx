import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { useState } from 'react';
import { DraggableItem } from './DraggableItem';
import { ShortcutCard } from './ShortcutCard';
import { ShortcutFolder } from './ShortcutFolder';
import { FolderPopup } from './FolderPopup';
import { getItemSize } from './utils/gridUtils';
import { useShortcutItems, useContainerSize } from './hooks/useShortcutItems';
import { createDragHandlers } from './hooks/useDragHandlers';
import { createFolderHandlers } from './hooks/useFolderHandlers';
import type { ShortcutEntry, ShortcutFolder as ShortcutFolderType } from '@/types';
import { isShortcutFolder } from '@/types';

interface ShortcutsContainerProps {
  shortcuts: ShortcutEntry[];
  onShortcutsChange?: (shortcuts: ShortcutEntry[]) => void;
  className?: string;
  columns?: number;
  unit?: number;
  gap?: number;
}

export function ShortcutsContainer({
  shortcuts,
  onShortcutsChange,
  className = '',
  columns = 10,
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
  const { handleDragStart, handleDragMove, handleDragEnd } = createDragHandlers({
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

  // 计算容器尺寸
  const containerSize = useContainerSize(
    items, 
    unit, 
    gap, 
    (item) => getItemSize(item, unit, gap)
  );

  return (
    <div className={`relative ${className}`}>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
      >
        <div
          style={{
            position: 'relative',
            width: containerSize.width,
            height: containerSize.height,
            minHeight: 300,
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
