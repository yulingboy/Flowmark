import { useState, useCallback } from 'react';
import type { ShortcutItem } from '@/types';

export interface ModalsState {
  isSettingsOpen: boolean;
  isAddShortcutOpen: boolean;
  isAddFolderOpen: boolean;
  editingShortcut: ShortcutItem | null;
}

export function useModals() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAddShortcutOpen, setIsAddShortcutOpen] = useState(false);
  const [isAddFolderOpen, setIsAddFolderOpen] = useState(false);
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

  /** 检查是否有任何弹窗打开 */
  const hasOpenModal = isSettingsOpen || isAddShortcutOpen || isAddFolderOpen;

  /** 关闭当前打开的弹窗（用于 Escape 键） */
  const closeCurrentModal = useCallback(() => {
    if (isSettingsOpen) setIsSettingsOpen(false);
    else if (isAddShortcutOpen) { setIsAddShortcutOpen(false); setEditingShortcut(null); }
    else if (isAddFolderOpen) setIsAddFolderOpen(false);
  }, [isSettingsOpen, isAddShortcutOpen, isAddFolderOpen]);

  return {
    isSettingsOpen,
    isAddShortcutOpen,
    isAddFolderOpen,
    editingShortcut,
    hasOpenModal,
    openSettings,
    closeSettings,
    openAddShortcut,
    closeAddShortcut,
    openEditShortcut,
    openAddFolder,
    closeAddFolder,
    closeCurrentModal,
  };
}
