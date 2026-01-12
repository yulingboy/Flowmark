import { useState, useCallback } from 'react';
import type { ShortcutItem } from '@/types';

export interface ModalsState {
  isSettingsOpen: boolean;
  isAddShortcutOpen: boolean;
  isAddFolderOpen: boolean;
  isWallpaperOpen: boolean;
  editingShortcut: ShortcutItem | null;
}

export function useModals() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAddShortcutOpen, setIsAddShortcutOpen] = useState(false);
  const [isAddFolderOpen, setIsAddFolderOpen] = useState(false);
  const [isWallpaperOpen, setIsWallpaperOpen] = useState(false);
  const [editingShortcut, setEditingShortcut] = useState<ShortcutItem | null>(null);

  const openSettings = useCallback(() => setIsSettingsOpen(true), []);
  const closeSettings = useCallback(() => setIsSettingsOpen(false), []);

  const openAddShortcut = useCallback(() => setIsAddShortcutOpen(true), []);
  const closeAddShortcut = useCallback(() => {
    setIsAddShortcutOpen(false);
    setEditingShortcut(null);
  }, []);

  const openEditShortcut = useCallback((item: ShortcutItem) => {
    setEditingShortcut(item);
    setIsAddShortcutOpen(true);
  }, []);

  const openAddFolder = useCallback(() => setIsAddFolderOpen(true), []);
  const closeAddFolder = useCallback(() => setIsAddFolderOpen(false), []);

  const openWallpaper = useCallback(() => setIsWallpaperOpen(true), []);
  const closeWallpaper = useCallback(() => setIsWallpaperOpen(false), []);

  /** 检查是否有任何弹窗打开 */
  const hasOpenModal = isSettingsOpen || isAddShortcutOpen || isAddFolderOpen || isWallpaperOpen;

  /** 关闭当前打开的弹窗（用于 Escape 键） */
  const closeCurrentModal = useCallback(() => {
    if (isSettingsOpen) setIsSettingsOpen(false);
    else if (isAddShortcutOpen) { setIsAddShortcutOpen(false); setEditingShortcut(null); }
    else if (isAddFolderOpen) setIsAddFolderOpen(false);
    else if (isWallpaperOpen) setIsWallpaperOpen(false);
  }, [isSettingsOpen, isAddShortcutOpen, isAddFolderOpen, isWallpaperOpen]);

  return {
    // 状态
    isSettingsOpen,
    isAddShortcutOpen,
    isAddFolderOpen,
    isWallpaperOpen,
    editingShortcut,
    hasOpenModal,
    // 操作
    openSettings,
    closeSettings,
    openAddShortcut,
    closeAddShortcut,
    openEditShortcut,
    openAddFolder,
    closeAddFolder,
    openWallpaper,
    closeWallpaper,
    closeCurrentModal,
  };
}
