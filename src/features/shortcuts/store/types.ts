import type { GridItem, ShortcutItem, CardSize } from '@/types';

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
  
  setShortcuts: (shortcuts: GridItem[]) => void;
  addShortcut: (shortcut: Omit<ShortcutItem, 'id'>) => boolean;
  addFolder: (name: string) => boolean;
  addPluginCard: (pluginId: string, name: string, icon: string, size?: CardSize, supportedSizes?: CardSize[]) => boolean;
  updateShortcut: (id: string, data: Partial<ShortcutItem>) => void;
  deleteItem: (ids: string | string[]) => void;
  resizeItem: (id: string, size: CardSize) => void;
  setEditingItem: (item: ShortcutItem | null) => void;
  moveToFolder: (itemId: string, folderId: string) => void;
  dissolveFolder: (folderId: string) => void;
  
  isAtLimit: () => boolean;
  validateAndRepair: () => ValidationResult;
}
