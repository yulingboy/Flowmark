import { GridManager, pixelToGrid, gridToPixel, getGridSpan } from '../utils/gridUtils';
import type { ShortcutEntry, ShortcutFolder as ShortcutFolderType, ShortcutItem } from '@/types';
import { isShortcutFolder } from '@/types';

interface FolderHandlersOptions {
  items: ShortcutEntry[];
  setItems: React.Dispatch<React.SetStateAction<ShortcutEntry[]>>;
  itemsMap: Map<string, ShortcutEntry>;
  columns: number;
  unit: number;
  gap: number;
  setOpenFolder: (folder: ShortcutFolderType | null) => void;
  onShortcutsChange?: (shortcuts: ShortcutEntry[]) => void;
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

  // 打开文件夹
  const handleFolderOpen = (folder: ShortcutFolderType) => {
    setOpenFolder(folder);
  };

  // 关闭文件夹
  const handleCloseFolder = () => {
    setOpenFolder(null);
  };

  // 文件夹内容变化
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

  // 从文件夹拖出项目
  const handleItemDragOut = (folderId: string, item: ShortcutItem) => {
    const folder = itemsMap.get(folderId);
    const folderPos = folder?.position || { x: 0, y: 0 };
    
    // 先从文件夹中移除该项目
    const newItems = items.map(i => {
      if (i.id === folderId && isShortcutFolder(i)) {
        return { ...i, items: i.items.filter(fi => fi.id !== item.id) };
      }
      return i;
    });
    
    // 使用 GridManager 找到文件夹附近的空位
    const manager = new GridManager(columns, unit, gap);
    manager.initFromItems(newItems);
    
    const folderGrid = pixelToGrid(folderPos.x, folderPos.y, unit, gap);
    const { colSpan, rowSpan } = getGridSpan(item.size || '1x1');
    
    // 尝试在文件夹右边找位置
    let targetPos = manager.findNearestAvailable(
      folderGrid.col + 1, 
      folderGrid.row, 
      colSpan, 
      rowSpan
    );
    
    // 如果右边没有，从文件夹位置开始找最近的空位
    if (!targetPos) {
      targetPos = manager.findNearestAvailable(
        folderGrid.col, 
        folderGrid.row, 
        colSpan, 
        rowSpan
      );
    }
    
    const finalPos = targetPos 
      ? gridToPixel(targetPos.col, targetPos.row, unit, gap)
      : { x: folderPos.x + unit + gap, y: folderPos.y };
    
    // 在空位放置拖出的项目
    const itemWithPos: ShortcutItem = {
      ...item,
      position: finalPos,
    };
    
    newItems.push(itemWithPos);
    setItems(newItems);
    onShortcutsChange?.(newItems);
    setOpenFolder(null);
  };

  return {
    handleFolderOpen,
    handleCloseFolder,
    handleFolderItemsChange,
    handleItemDragOut,
  };
}
