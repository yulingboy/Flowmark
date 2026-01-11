import { useDraggable } from '@dnd-kit/core';
import { ShortcutCard } from './ShortcutCard';
import { ShortcutFolder } from './ShortcutFolder';
import type { ShortcutEntry, ShortcutFolder as ShortcutFolderType, ShortcutItem, ShortcutSize, Position } from '@/types';
import { isShortcutFolder } from '@/types';

interface DraggableItemProps {
  entry: ShortcutEntry;
  position: Position;
  size: { width: number; height: number };
  onOpen?: (folder: ShortcutFolderType) => void;
  onEdit?: (item: ShortcutItem) => void;
  onDelete?: (item: ShortcutItem) => void;
  onResize?: (item: ShortcutItem, size: ShortcutSize) => void;
  onResizeFolder?: (folder: ShortcutFolderType, size: ShortcutSize) => void;
  isDropTarget: boolean;
  isDragging: boolean;
  shouldAnimate: boolean;
  batchEditMode?: boolean;
  isSelected?: boolean;
  onToggleSelect?: (id: string) => void;
}

export function DraggableItem({ 
  entry, 
  position,
  size,
  onOpen,
  onEdit,
  onDelete,
  onResize,
  onResizeFolder,
  isDropTarget,
  isDragging,
  shouldAnimate,
  batchEditMode = false,
  isSelected = false,
  onToggleSelect,
}: DraggableItemProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: entry.id,
    disabled: batchEditMode, // 只在批量编辑模式禁用拖拽，popup 模式通过 PointerSensor 的 distance 区分点击和拖拽
  });

  const style = {
    position: 'absolute' as const,
    left: position.x,
    top: position.y,
    width: size.width,
    height: size.height,
    transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
    transition: shouldAnimate ? 'left 0.2s ease-out, top 0.2s ease-out' : 'none',
    opacity: isDragging ? 0.3 : 1,
    cursor: batchEditMode ? 'pointer' : 'grab',
    touchAction: 'none',
    zIndex: isDragging ? 1000 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...(batchEditMode ? {} : { ...attributes, ...listeners })}>
      {isShortcutFolder(entry) ? (
        <ShortcutFolder
          folder={entry}
          onOpen={onOpen}
          onResize={onResizeFolder}
          isDropTarget={isDropTarget}
        />
      ) : (
        <ShortcutCard 
          item={entry} 
          onEdit={onEdit}
          onDelete={onDelete}
          onResize={onResize}
          batchEditMode={batchEditMode}
          isSelected={isSelected}
          onToggleSelect={onToggleSelect}
        />
      )}
    </div>
  );
}
