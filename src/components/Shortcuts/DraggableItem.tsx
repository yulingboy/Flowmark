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
  isDropTarget,
  isDragging,
  shouldAnimate,
  batchEditMode = false,
  isSelected = false,
  onToggleSelect,
}: DraggableItemProps) {
  // 弹窗模式不需要拖拽，批量编辑模式也禁用拖拽
  const isPopupMode = !isShortcutFolder(entry) && entry.openMode === 'popup';
  
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: entry.id,
    disabled: isPopupMode || batchEditMode,
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
    cursor: batchEditMode ? 'pointer' : (isPopupMode ? 'pointer' : 'grab'),
    touchAction: 'none',
    zIndex: isDragging ? 1000 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...(isPopupMode || batchEditMode ? {} : { ...attributes, ...listeners })}>
      {isShortcutFolder(entry) ? (
        <ShortcutFolder
          folder={entry}
          onOpen={onOpen}
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
