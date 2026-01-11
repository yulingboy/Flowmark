import { useDraggable } from '@dnd-kit/core';
import { ShortcutCard } from './ShortcutCard';
import { ShortcutFolder } from './ShortcutFolder';
import type { ShortcutEntry, ShortcutFolder as ShortcutFolderType, Position } from '@/types';
import { isShortcutFolder } from '@/types';

interface DraggableItemProps {
  entry: ShortcutEntry;
  position: Position;
  size: { width: number; height: number };
  onOpen?: (folder: ShortcutFolderType) => void;
  isDropTarget: boolean;
  isDragging: boolean;
  shouldAnimate: boolean;
}

export function DraggableItem({ 
  entry, 
  position,
  size,
  onOpen,
  isDropTarget,
  isDragging,
  shouldAnimate,
}: DraggableItemProps) {
  // 弹窗模式不需要拖拽
  const isPopupMode = !isShortcutFolder(entry) && entry.openMode === 'popup';
  
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: entry.id,
    disabled: isPopupMode,
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
    cursor: isPopupMode ? 'pointer' : 'grab',
    touchAction: 'none',
    zIndex: isDragging ? 1000 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...(isPopupMode ? {} : { ...attributes, ...listeners })}>
      {isShortcutFolder(entry) ? (
        <ShortcutFolder
          folder={entry}
          onOpen={onOpen}
          isDropTarget={isDropTarget}
        />
      ) : (
        <ShortcutCard item={entry} />
      )}
    </div>
  );
}
