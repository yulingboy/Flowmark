import type { ShortcutEntry, ShortcutItem } from '@/types';
import { isShortcutFolder } from '@/types';
import { ShortcutCard } from './ShortcutCard';
import { ShortcutFolder } from './ShortcutFolder';

interface DragPreviewProps {
  draggedItem: ShortcutEntry | null;
  dragPosition: { x: number; y: number } | null;
  dragOffset: { x: number; y: number };
  draggedSize: { width: number; height: number };
}

export function DragPreview({
  draggedItem,
  dragPosition,
  dragOffset,
  draggedSize,
}: DragPreviewProps) {
  if (!draggedItem || !dragPosition) return null;

  return (
    <div
      style={{
        position: 'fixed',
        left: dragPosition.x - dragOffset.x,
        top: dragPosition.y - dragOffset.y,
        width: draggedSize.width,
        height: draggedSize.height,
        pointerEvents: 'none',
        zIndex: 1000,
        opacity: 0.9,
        transform: 'scale(1.02)',
        transformOrigin: `${dragOffset.x}px ${dragOffset.y}px`,
      }}
    >
      {isShortcutFolder(draggedItem) ? (
        <ShortcutFolder folder={draggedItem} />
      ) : (
        <ShortcutCard item={draggedItem} />
      )}
    </div>
  );
}

interface FolderItemDragPreviewProps {
  draggedFolderItem: ShortcutItem | null;
  dragPosition: { x: number; y: number } | null;
  dragOffset: { x: number; y: number };
}

export function FolderItemDragPreview({
  draggedFolderItem,
  dragPosition,
  dragOffset,
}: FolderItemDragPreviewProps) {
  if (!draggedFolderItem || !dragPosition) return null;

  return (
    <div
      style={{
        position: 'fixed',
        left: dragPosition.x - dragOffset.x,
        top: dragPosition.y - dragOffset.y,
        width: 64,
        height: 84,
        pointerEvents: 'none',
        zIndex: 1001,
        opacity: 0.9,
        transform: 'scale(1.02)',
      }}
    >
      <ShortcutCard item={draggedFolderItem} />
    </div>
  );
}
