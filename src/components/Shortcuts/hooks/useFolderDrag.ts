import { useState, useRef, useEffect } from 'react';
import type { ShortcutEntry, ShortcutItem, ShortcutFolder } from '@/types';
import { isShortcutFolder } from '@/types';
import {
  calculateDragOffset,
  setupDragData,
  createThrottledPositionUpdater,
  canSwap,
} from '../utils/dragUtils';

interface UseFolderDragProps {
  items: ShortcutEntry[];
  setItems: React.Dispatch<React.SetStateAction<ShortcutEntry[]>>;
  sortOrder: string[];
  setSortOrder: React.Dispatch<React.SetStateAction<string[]>>;
  openFolder: ShortcutFolder | null;
  setOpenFolder: React.Dispatch<React.SetStateAction<ShortcutFolder | null>>;
  onShortcutsChange?: (shortcuts: ShortcutEntry[]) => void;
}

export function useFolderDrag({
  items,
  setItems,
  sortOrder,
  setSortOrder,
  openFolder,
  setOpenFolder,
  onShortcutsChange,
}: UseFolderDragProps) {
  const [draggedFolderItem, setDraggedFolderItem] = useState<ShortcutItem | null>(null);
  const [dragFromFolder, setDragFromFolder] = useState<string | null>(null);
  const [dragPosition, setDragPosition] = useState<{ x: number; y: number } | null>(null);
  const [folderDragOverId, setFolderDragOverId] = useState<string | null>(null);
  
  const folderLastSwapTime = useRef<number>(0);
  const dragOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  
  // 使用 RAF 节流的位置更新器
  const positionUpdater = useRef(createThrottledPositionUpdater(setDragPosition));
  
  // 清理 RAF
  useEffect(() => {
    return () => {
      positionUpdater.current.cancel();
    };
  }, []);

  const handleFolderItemDragStart = (e: React.DragEvent, item: ShortcutItem, folderId: string) => {
    e.stopPropagation();
    dragOffset.current = calculateDragOffset(e, e.currentTarget as HTMLElement);
    
    setDraggedFolderItem(item);
    setDragFromFolder(folderId);
    setupDragData(e, item.id);
  };

  const handleFolderItemDrag = (e: React.DragEvent) => {
    if (e.clientX === 0 && e.clientY === 0) return;
    // 使用 RAF 节流，避免每帧都触发状态更新
    positionUpdater.current.updatePosition(e.clientX, e.clientY);
  };

  const handleFolderItemDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!draggedFolderItem || targetId === draggedFolderItem.id || !openFolder) return;
    
    setFolderDragOverId(targetId);
    
    // 使用节流检查，避免过于频繁的交换
    if (!canSwap(folderLastSwapTime.current)) return;
    
    const currentItems = openFolder.items;
    const draggedIndex = currentItems.findIndex(i => i.id === draggedFolderItem.id);
    const targetIndex = currentItems.findIndex(i => i.id === targetId);
    
    if (draggedIndex !== -1 && targetIndex !== -1 && draggedIndex !== targetIndex) {
      folderLastSwapTime.current = Date.now();
      
      const newFolderItems = [...currentItems];
      newFolderItems.splice(draggedIndex, 1);
      newFolderItems.splice(targetIndex, 0, draggedFolderItem);
      
      const updatedFolder = { ...openFolder, items: newFolderItems };
      setOpenFolder(updatedFolder);
      
      const newItems = items.map(item => {
        if (item.id === openFolder.id && isShortcutFolder(item)) {
          return updatedFolder;
        }
        return item;
      });
      setItems(newItems);
    }
  };

  const handlePopupDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (draggedFolderItem && openFolder) {
      onShortcutsChange?.(items);
    }
    
    setDraggedFolderItem(null);
    setDragFromFolder(null);
    setDragPosition(null);
    setFolderDragOverId(null);
  };

  const handlePopupDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleBackdropDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    if (draggedFolderItem && dragFromFolder) {
      const newItems = items.map(item => {
        if (item.id === dragFromFolder && isShortcutFolder(item)) {
          return {
            ...item,
            items: item.items.filter(i => i.id !== draggedFolderItem.id),
          };
        }
        return item;
      });
      
      newItems.push(draggedFolderItem);
      
      const newOrder = [...sortOrder, draggedFolderItem.id];
      
      setItems(newItems);
      setSortOrder(newOrder);
      onShortcutsChange?.(newItems);
      
      // 关闭文件夹弹窗
      setOpenFolder(null);
    }
    
    // 取消未执行的 RAF
    positionUpdater.current.cancel();
    setDraggedFolderItem(null);
    setDragFromFolder(null);
    setDragPosition(null);
  };

  const handleFolderItemDragEnd = () => {
    // 取消未执行的 RAF
    positionUpdater.current.cancel();
    setDraggedFolderItem(null);
    setDragFromFolder(null);
    setDragPosition(null);
    setFolderDragOverId(null);
  };

  return {
    draggedFolderItem,
    dragPosition,
    dragOffset,
    folderDragOverId,
    handleFolderItemDragStart,
    handleFolderItemDrag,
    handleFolderItemDragOver,
    handlePopupDrop,
    handlePopupDragOver,
    handleBackdropDrop,
    handleFolderItemDragEnd,
  };
}
