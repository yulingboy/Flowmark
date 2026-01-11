import { GridManager, pixelToGrid, gridToPixel, findValidPositionInBounds } from '../utils/gridUtils';
import type { GridConfig } from '../utils/gridUtils';
import type { ShortcutFolder as ShortcutFolderType, ShortcutItem, ShortcutSize, GridItem } from '@/types';
import { isShortcutFolder } from '@/types';

interface FolderHandlersOptions {
  items: GridItem[];
  setItems: React.Dispatch<React.SetStateAction<GridItem[]>>;
  itemsMap: Map<string, GridItem>;
  columns: number;
  rows: number;  // 添加 rows 参数
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
  rows,
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
    
    // 从文件夹中移除项目
    const newItems = items.map(i => {
      if (i.id === folderId && isShortcutFolder(i)) {
        return { ...i, items: i.items.filter(fi => fi.id !== item.id) };
      }
      return i;
    });
    
    const manager = new GridManager(columns, rows, unit, gap);
    manager.initFromItems(newItems);
    
    const folderGrid = pixelToGrid(folderPos.x, folderPos.y, unit, gap);
    const gridConfig: GridConfig = { columns, rows, unit, gap };
    const occupiedCells = manager.getOccupiedCells();
    
    // 使用边界感知的位置查找
    let targetPos = findValidPositionInBounds(
      folderGrid.col + 1,
      folderGrid.row,
      item.size || '1x1',
      gridConfig,
      occupiedCells
    );
    
    let finalItem = item;
    
    // 如果找不到有效位置，尝试降级为 1x1
    if (!targetPos && item.size !== '1x1') {
      targetPos = findValidPositionInBounds(
        folderGrid.col + 1,
        folderGrid.row,
        '1x1',
        gridConfig,
        occupiedCells
      );
      if (targetPos) {
        finalItem = { ...item, size: '1x1' as ShortcutSize };
        console.info(`Item ${item.id} resized from ${item.size} to 1x1 due to boundary constraints`);
      }
    }
    
    // 如果仍然找不到位置，拒绝操作
    if (!targetPos) {
      console.warn(`Cannot place item ${item.id}: no valid position available within grid boundaries`);
      return; // 保持在文件夹中
    }
    
    const finalPos = gridToPixel(targetPos.col, targetPos.row, unit, gap);
    const itemWithPos: ShortcutItem = { ...finalItem, position: finalPos };
    
    newItems.push(itemWithPos);
    setItems(newItems);
    onShortcutsChange?.(newItems);
    setOpenFolder(null);
  };

  return { handleFolderOpen, handleCloseFolder, handleFolderItemsChange, handleItemDragOut };
}
