import type { GridItem, ShortcutItem, ShortcutSize } from '@/types';

export const SHORTCUTS_LIMIT = 200;

export interface ValidationResult {
  isValid: boolean;
  repairedItems: GridItem[];
  removedCount: number;
  errors: string[];
}

export interface ShortcutsState {
  shortcuts: GridItem[];
  editingItem: ShortcutItem | null;
  batchEditMode: boolean;
  selectedIds: Set<string>;
  
  setShortcuts: (shortcuts: GridItem[]) => void;
  addShortcut: (shortcut: Omit<ShortcutItem, 'id'>) => boolean;
  addFolder: (name: string) => boolean;
  addPluginCard: (pluginId: string, name: string, icon: string, size?: ShortcutSize, supportedSizes?: ShortcutSize[]) => boolean;
  updateShortcut: (id: string, data: Partial<ShortcutItem>) => void;
  deleteItem: (ids: string | string[]) => void;
  resizeItem: (id: string, size: ShortcutSize) => void;
  setEditingItem: (item: ShortcutItem | null) => void;
  moveToFolder: (itemId: string, folderId: string) => void;
  dissolveFolder: (folderId: string) => void;
  
  toggleBatchEdit: () => void;
  toggleSelection: (id: string) => void;
  selectAll: () => void;
  clearSelection: () => void;
  batchMoveToFolder: (folderId: string) => void;
  
  isAtLimit: () => boolean;
  validateAndRepair: () => ValidationResult;
}
