import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ShortcutItem, CardSize, PluginCardItem } from '@/types';
import { isShortcutFolder, isPluginCard } from '@/types';
import { GRID } from '@/constants';

import { SHORTCUTS_LIMIT } from './types';
import type { ShortcutsState } from './types';
import { validateAndRepairShortcuts } from './validation';
import { createFolder, defaultShortcuts } from './defaults';
import { GridManager, getGridSpan } from '@/utils/gridUtils';
import { migrateShortcuts } from './migration';

export const useShortcutsStore = create<ShortcutsState>()(
  persist(
    (set, get) => ({
      shortcuts: defaultShortcuts,
      editingItem: null,

      setShortcuts: (shortcuts) => set({ shortcuts }),

      addShortcut: (shortcut) => {
        const state = get();
        if (state.shortcuts.length >= SHORTCUTS_LIMIT) return false;
        
        const newId = `shortcut-${Date.now()}`;
        if (state.shortcuts.some(s => s.id === newId)) return false;
        
        set({ shortcuts: [...state.shortcuts, { ...shortcut, id: newId, size: shortcut.size || '1x1' }] });
        return true;
      },

      addFolder: (name) => {
        const state = get();
        if (state.shortcuts.length >= SHORTCUTS_LIMIT) return false;
        set({ shortcuts: [...state.shortcuts, createFolder(`folder-${Date.now()}`, [], name)] });
        return true;
      },

      addPluginCard: (pluginId, name, icon, size = '2x2', supportedSizes) => {
        const state = get();
        // 检查是否已存在相同插件
        if (state.shortcuts.some(s => isPluginCard(s) && s.pluginId === pluginId)) return false;
        // 检查数量限制
        if (state.shortcuts.length >= SHORTCUTS_LIMIT) return false;
        
        // 使用 GridManager 检查是否有足够空间
        const gridManager = new GridManager(GRID.COLUMNS, GRID.ROWS, GRID.UNIT, GRID.GAP);
        gridManager.initFromItems(state.shortcuts);
        
        // 尝试的尺寸列表：首选尺寸 + 支持的其他尺寸（按面积从大到小排序）
        const sizesToTry: CardSize[] = [size];
        if (supportedSizes) {
          // 按面积从大到小排序
          const sortedSizes = [...supportedSizes]
            .filter(s => s !== size)
            .sort((a, b) => {
              const aSpan = getGridSpan(a);
              const bSpan = getGridSpan(b);
              return (bSpan.colSpan * bSpan.rowSpan) - (aSpan.colSpan * aSpan.rowSpan);
            });
          sizesToTry.push(...sortedSizes);
        }
        
        // 尝试每个尺寸
        for (const trySize of sizesToTry) {
          const { colSpan, rowSpan } = getGridSpan(trySize);
          const position = gridManager.findNearestAvailable(0, 0, colSpan, rowSpan);
          
          if (position) {
            // 直接存储网格坐标（col, row）
            const pluginCard: PluginCardItem = { 
              id: `plugin-${pluginId}`, 
              pluginId, 
              name, 
              icon, 
              size: trySize, 
              position: { col: position.col, row: position.row },
              isPlugin: true 
            };
            set({ shortcuts: [...state.shortcuts, pluginCard] });
            return true;
          }
        }
        
        // 所有尺寸都无法插入
        return false;
      },

      updateShortcut: (id, data) => set((state) => ({
        shortcuts: state.shortcuts.map((s) => (s.id === id && !isShortcutFolder(s) ? { ...s, ...data } : s)),
      })),

      deleteItem: (ids) => set((state) => {
        const idSet = Array.isArray(ids) ? new Set(ids) : new Set([ids]);
        return { shortcuts: state.shortcuts.filter((s) => !idSet.has(s.id)) };
      }),

      resizeItem: (id, size) => set((state) => ({
        shortcuts: state.shortcuts.map((s) => (s.id === id ? { ...s, size } : s)),
      })),

      setEditingItem: (item) => set({ editingItem: item }),

      moveToFolder: (itemId, folderId) => set((state) => {
        const item = state.shortcuts.find((s) => s.id === itemId && !isShortcutFolder(s)) as ShortcutItem | undefined;
        if (!item) return state;

        return {
          shortcuts: state.shortcuts
            .filter((s) => s.id !== itemId)
            .map((s) => (s.id === folderId && isShortcutFolder(s) ? { ...s, items: [...s.items, item] } : s)),
        };
      }),

      dissolveFolder: (folderId) => set((state) => {
        const folder = state.shortcuts.find((s) => s.id === folderId && isShortcutFolder(s));
        if (!folder || !isShortcutFolder(folder)) return state;

        return {
          shortcuts: [
            ...state.shortcuts.filter((s) => s.id !== folderId),
            ...folder.items.map((item) => ({ ...item, size: '1x1' as CardSize })),
          ],
        };
      }),

      isAtLimit: () => get().shortcuts.length >= SHORTCUTS_LIMIT,

      validateAndRepair: () => {
        const state = get();
        const result = validateAndRepairShortcuts(state.shortcuts);
        if (!result.isValid) {
          console.warn('快捷方式数据已修复:', result.errors);
          set({ shortcuts: result.repairedItems });
        }
        return result;
      },
    }),
    {
      name: 'shortcuts-storage',
      partialize: (state) => ({ shortcuts: state.shortcuts }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // 使用默认网格配置进行数据迁移（将旧的像素坐标转换为网格坐标）
          const gridConfig = { columns: GRID.COLUMNS, rows: GRID.ROWS, unit: GRID.UNIT, gap: GRID.GAP };
          const migratedShortcuts = migrateShortcuts(state.shortcuts, gridConfig);
          
          // 验证并修复迁移后的数据
          const result = validateAndRepairShortcuts(migratedShortcuts);
          if (!result.isValid) {
            console.warn('快捷方式数据已修复:', result.errors);
          }
          
          // 更新 state 为迁移并验证后的数据
          state.shortcuts = result.repairedItems;
        }
      },
    }
  )
);
