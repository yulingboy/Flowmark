import { useDraggable } from '@dnd-kit/core';
import { ShortcutCard } from './ShortcutCard';
import { ShortcutFolder } from './ShortcutFolder';
import { PluginCard } from './PluginCard';
import type { ShortcutFolder as ShortcutFolderType, ShortcutItem, CardSize, GridItem } from '@/types';
import type { PixelPosition } from '@/types';
import { isShortcutFolder, isPluginCard } from '@/types';
import type { GridItemWithRenderPosition } from '../hooks/useShortcutItems';

interface GridConfig {
  columns: number;
  rows: number;
  unit: number;
  gap: number;
}

interface DraggableItemProps {
  entry: GridItemWithRenderPosition;
  position: PixelPosition;
  size: { width: number; height: number };
  gridConfig: GridConfig;
  onOpen?: (folder: ShortcutFolderType) => void;
  onEdit?: (item: ShortcutItem) => void;
  onDelete?: (item: ShortcutItem) => void;
  onResize?: (item: GridItem, size: CardSize) => void;
  onRemove?: (item: GridItem) => void;
  isDropTarget: boolean;
  isDragging: boolean;
  shouldAnimate: boolean;
  batchEditMode?: boolean;
  isSelected?: boolean;
  onToggleSelect?: (id: string) => void;
}

export function DraggableItem({ 
  entry, position, size, gridConfig, onOpen, onEdit, onDelete, onResize, onRemove,
  isDropTarget, isDragging, shouldAnimate, batchEditMode = false, isSelected = false, onToggleSelect,
}: DraggableItemProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: entry.id,
    disabled: batchEditMode,
  });

  const style = {
    position: 'absolute' as const,
    left: position.x, top: position.y, width: size.width, height: size.height,
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
        <ShortcutFolder folder={entry} onOpen={onOpen} onResize={(folder, s) => onResize?.(folder, s)}
          isDropTarget={isDropTarget} gridConfig={gridConfig} position={position} />
      ) : isPluginCard(entry) ? (
        <PluginCard item={entry} onResize={(item, s) => onResize?.(item, s)} onRemove={(item) => onRemove?.(item)}
          batchEditMode={batchEditMode} isSelected={isSelected} onToggleSelect={onToggleSelect} gridConfig={gridConfig} position={position} />
      ) : (
        <ShortcutCard item={entry} onEdit={onEdit} onDelete={onDelete} onResize={(item, s) => onResize?.(item, s)}
          batchEditMode={batchEditMode} isSelected={isSelected} onToggleSelect={onToggleSelect} gridConfig={gridConfig} position={position} />
      )}
    </div>
  );
}
