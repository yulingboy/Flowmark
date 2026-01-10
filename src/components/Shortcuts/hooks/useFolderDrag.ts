import { useState, useRef } from 'react';
import type { ShortcutEntry, ShortcutItem, ShortcutFolder } from '@/types';
import { isShortcutFolder } from '@/types';

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

  const handleFolderItemDragStart = (e: React.DragEvent, item: ShortcutItem, folderId: string) => {
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    
    setDraggedFolderItem(item);
    setDragFromFolder(folderId);
    
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', item.id);
    
    const img = new Image();
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    e.dataTransfer.setDragImage(img, 0, 0);
  };

  const handleFolderItemDrag = (e: React.DragEvent) => {
    if (e.clientX === 0 && e.clientY === 0) return;
    setDragPosition({ x: e.clientX, y: e.clientY });
  };

  const handleFolderItemDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!draggedFolderItem || targetId === draggedFolderItem.id || !openFolder) return;
    
    setFolderDragOverId(targetId);
    
    const now = Date.now();
    if (now - folderLastSwapTime.current < 200) return;
    
    const currentItems = openFolder.items;
    const draggedIndex = currentItems.findIndex(i => i.id === draggedFolderItem.id);
    const targetIndex = currentItems.findIndex(i => i.id === targetId);
    
    if (draggedIndex !== -1 && targetIndex !== -1 && draggedIndex !== targetIndex) {
      folderLastSwapTime.current = now;
      
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
      
      const updatedFolder = newItems.find(i => i.id === dragFromFolder);
      if (updatedFolder && isShortcutFolder(updatedFolder)) {
        setOpenFolder(updatedFolder);
      }
      
      setOpenFolder(null);
    }
    
    setDraggedFolderItem(null);
    setDragFromFolder(null);
    setDragPosition(null);
  };

  const handleFolderItemDragEnd = () => {
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
