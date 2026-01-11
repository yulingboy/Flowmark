import { GridManager, pixelToGrid, gridToPixel, getGridSpan } from '../utils/gridUtils';
import type { ShortcutFolder as ShortcutFolderType, ShortcutItem, GridItem } from '@/types';
import { isShortcutFolder } from '@/types';

interface FolderHandlersOptions {
  items: GridItem[];
  setItems: React.Dispatch<React.SetStateAction<GridItem[]>>;
  itemsMap: Map<string, GridItem>;
  columns: number;
  unit: number;
  gap: number;
  setOpenFolder: (folder: ShortcutFolderType | null) => void;
  onShortcutsChange?: (shortcuts: GridItem[]) => void;
}

export function createFolderHandlers({
  items,
  setItems,
  itemsMap,
  columns,
  unit,
  gap,
  setOpenFolder,
  onShortcutsChange,
}: FolderHandlersOptions) {

  const handleFolderOpen = (folder: ShortcutFolderType) => {
    setOpenFolder(folder);
  };

  const handleCloseFolder = () => {
    setOpenFolder(null);
  };

  const handleFolderItemsChange = (folderId: string, newFolderItems: ShortcutItem[]) => {
    const newItems = items.map(item => {
      if (item.id === folderId && isShortcutFolder(item)) {
        return { ...item, items: newFolderItems };
      }
      return item;
    });
    setItems(newItems);
    onShortcutsChange?.(newItems);
    
    const updatedFolder = newItems.find(i => i.id === folderId);
    if (updatedFolder && isShortcutFolder(updatedFolder)) {
      setOpenFolder(updatedFolder);
    }
  };

  const handleItemDragOut = (folderId: string, item: ShortcutItem) => {
    const folder = itemsMap.get(folderId);
    const folderPos = folder?.position || { x: 0, y: 0 };
    
    const newItems = items.map(i => {
      if (i.id === folderId && isShortcutFolder(i)) {
        return { ...i, items: i.items.filter(fi => fi.id !== item.id) };
      }
      return i;
    });
    
    const manager = new GridManager(columns, unit, gap);
    manager.initFromItems(newItems);
    
    const folderGrid = pixelToGrid(folderPos.x, folderPos.y, unit, gap);
    const { colSpan, rowSpan } = getGridSpan(item.size || '1x1');
    
    let targetPos = manager.findNearestAvailable(folderGrid.col + 1, folderGrid.row, colSpan, rowSpan);
    
    if (!targetPos) {
      targetPos = manager.findNearestAvailable(folderGrid.col, folderGrid.row, colSpan, rowSpan);
    }
    
    const finalPos = targetPos 
      ? gridToPixel(targetPos.col, targetPos.row, unit, gap)
      : { x: folderPos.x + unit + gap, y: folderPos.y };
    
    const itemWithPos: ShortcutItem = { ...item, position: finalPos };
    
    newItems.push(itemWithPos);
    setItems(newItems);
    onShortcutsChange?.(newItems);
    setOpenFolder(null);
  };

  return { handleFolderOpen, handleCloseFolder, handleFolderItemsChange, handleItemDragOut };
}
