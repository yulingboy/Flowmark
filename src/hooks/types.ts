/**
 * Hooks 模块类型定义
 */

/** 右键菜单状态 */
export interface ContextMenuState {
  isOpen: boolean;
  x: number;
  y: number;
}

/** 键盘快捷键选项 */
export interface KeyboardShortcutsOptions {
  searchRef: React.RefObject<HTMLInputElement | null>;
  hasOpenModal: boolean;
  onEscape?: () => void;
  onOpenSettings?: () => void;
  onOpenAddShortcut?: () => void;
}

/** 弹窗状态管理 */
export interface ModalsState {
  isSettingsOpen: boolean;
  isAddShortcutOpen: boolean;
  isAddFolderOpen: boolean;
  isWallpaperOpen: boolean;
  editingShortcut: unknown | null;
  hasOpenModal: boolean;
}
