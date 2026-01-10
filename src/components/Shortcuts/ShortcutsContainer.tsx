import { useState, useRef, useMemo } from 'react';
import { ShortcutCard } from './ShortcutCard';
import { ShortcutFolder } from './ShortcutFolder';
import { DragPreview, FolderItemDragPreview } from './DragPreview';
import { FolderPopup } from './FolderPopup';
import { useDragAndDrop } from './hooks/useDragAndDrop';
import { useFolderDrag } from './hooks/useFolderDrag';
import { calculatePositions } from './utils/gridUtils';
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
  const [items, setItems] = useState<ShortcutEntry[]>(shortcuts);
  const [sortOrder, setSortOrder] = useState<string[]>(shortcuts.map(s => s.id));
  const [openFolder, setOpenFolder] = useState<ShortcutFolderType | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);

  // 创建 id -> item 的映射
  const itemsMap = useMemo(() => {
    const map = new Map<string, ShortcutEntry>();
    items.forEach(item => map.set(item.id, item));
    return map;
  }, [items]);

  // 计算每个元素的目标位置
  const positions = useMemo(() => {
    return calculatePositions(sortOrder, itemsMap, columns, unit, gap);
  }, [sortOrder, itemsMap, columns, unit, gap]);

  // 主拖拽逻辑
  const {
    draggedId,
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
  } = useDragAndDrop({
    items,
    setItems,
    sortOrder,
    setSortOrder,
    itemsMap,
    onShortcutsChange,
    unit,
    gap,
  });

  // 文件夹内拖拽逻辑
  const folderDrag = useFolderDrag({
    items,
    setItems,
    sortOrder,
    setSortOrder,
    openFolder,
    setOpenFolder,
    onShortcutsChange,
  });

  const handleFolderOpen = (folder: ShortcutFolderType) => {
    setOpenFolder(folder);
  };

  const handleCloseFolder = () => {
    setOpenFolder(null);
  };

  // 计算容器尺寸
  const containerSize = useMemo(() => {
    let maxX = 0;
    let maxY = 0;
    positions.forEach((pos) => {
      maxX = Math.max(maxX, pos.x + pos.width);
      maxY = Math.max(maxY, pos.y + pos.height);
    });
    return { width: maxX, height: maxY };
  }, [positions]);

  const draggedItem = draggedId ? itemsMap.get(draggedId) : null;
  const draggedSize = getDraggedItemSize();

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* 容器 */}
      <div
        style={{
          position: 'relative',
          width: containerSize.width,
          height: containerSize.height,
        }}
      >
        {items.map((entry) => {
          const pos = positions.get(entry.id);
          if (!pos) return null;
          
          const isDropTarget = isDraggingToFolder(entry.id);
          const isDragging = draggedId === entry.id;

          return (
            <div
              key={entry.id}
              draggable
              onDragStart={(e) => handleDragStart(e, entry)}
              onDrag={handleDrag}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => handleDragOver(e, entry.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, entry.id)}
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: pos.width,
                height: pos.height,
                transform: `translate(${pos.x}px, ${pos.y}px)`,
                transition: draggedId ? 'transform 0.2s ease-out' : 'none',
                opacity: isDragging ? 0.3 : 1,
                cursor: 'grab',
                zIndex: isDragging ? 0 : 1,
              }}
            >
              {isShortcutFolder(entry) ? (
                <ShortcutFolder
                  folder={entry}
                  onOpen={handleFolderOpen}
                  isDropTarget={isDropTarget}
                />
              ) : (
                <ShortcutCard item={entry} />
              )}
            </div>
          );
        })}
      </div>

      {/* 拖拽预览 */}
      <DragPreview
        draggedItem={draggedItem || null}
        dragPosition={dragPosition}
        dragOffset={dragOffset.current}
        draggedSize={draggedSize}
      />

      {/* 从文件夹拖出的预览 */}
      <FolderItemDragPreview
        draggedFolderItem={folderDrag.draggedFolderItem}
        dragPosition={folderDrag.dragPosition}
        dragOffset={folderDrag.dragOffset.current}
      />

      {/* 文件夹展开弹窗 */}
      {openFolder && (
        <FolderPopup
          folder={openFolder}
          onClose={handleCloseFolder}
          onBackdropDrop={folderDrag.handleBackdropDrop}
          onPopupDrop={folderDrag.handlePopupDrop}
          onPopupDragOver={folderDrag.handlePopupDragOver}
          onItemDragStart={folderDrag.handleFolderItemDragStart}
          onItemDrag={folderDrag.handleFolderItemDrag}
          onItemDragEnd={folderDrag.handleFolderItemDragEnd}
          onItemDragOver={folderDrag.handleFolderItemDragOver}
          draggedFolderItem={folderDrag.draggedFolderItem}
        />
      )}
    </div>
  );
}
