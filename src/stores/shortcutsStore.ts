import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ShortcutEntry, ShortcutItem, ShortcutSize } from '@/types';
import { createShortcutFolder, isShortcutFolder } from '@/types';
import { getFaviconUrl } from '@/utils/favicon';

// 默认快捷入口数据
const defaultShortcuts: ShortcutEntry[] = [
  { id: '1', name: '爱奇艺', url: 'https://www.iqiyi.com', icon: getFaviconUrl('https://www.iqiyi.com'), size: '1x1', openMode: 'popup' },
  { id: '2', name: '芒果TV', url: 'https://www.mgtv.com', icon: getFaviconUrl('https://www.mgtv.com'), size: '1x1' },
  { id: '3', name: '抖音', url: 'https://www.douyin.com', icon: getFaviconUrl('https://www.douyin.com'), size: '1x1' },
  { id: '4', name: '微博', url: 'https://weibo.com', icon: getFaviconUrl('https://weibo.com'), size: '1x1' },
  { id: '5', name: '优酷', url: 'https://www.youku.com', icon: getFaviconUrl('https://www.youku.com'), size: '1x1' },
  { id: '6', name: '哔哩哔哩', url: 'https://www.bilibili.com', icon: getFaviconUrl('https://www.bilibili.com'), size: '1x1' },
  { id: '7', name: '维基百科', url: 'https://zh.wikipedia.org', icon: getFaviconUrl('https://zh.wikipedia.org'), size: '1x1', openMode: 'popup' },
  { id: '8', name: '百度', url: 'https://www.baidu.com', icon: getFaviconUrl('https://www.baidu.com'), size: '1x1', openMode: 'popup' },
  createShortcutFolder('folder-1', [
    { id: 'f1-1', name: 'GitHub', url: 'https://github.com', icon: getFaviconUrl('https://github.com'), openMode: 'popup' },
    { id: 'f1-2', name: 'GitLab', url: 'https://gitlab.com', icon: getFaviconUrl('https://gitlab.com') },
    { id: 'f1-3', name: 'VS Code', url: 'https://code.visualstudio.com', icon: getFaviconUrl('https://code.visualstudio.com'), openMode: 'popup' },
    { id: 'f1-4', name: 'NPM', url: 'https://www.npmjs.com', icon: getFaviconUrl('https://www.npmjs.com') },
  ], '开发工具', '2x2'),
];

interface ShortcutsState {
  shortcuts: ShortcutEntry[];
  editingItem: ShortcutItem | null;
  
  // Batch edit state
  batchEditMode: boolean;
  selectedIds: Set<string>;
  
  // Actions
  setShortcuts: (shortcuts: ShortcutEntry[]) => void;
  addShortcut: (shortcut: Omit<ShortcutItem, 'id'>) => void;
  updateShortcut: (id: string, data: Partial<ShortcutItem>) => void;
  deleteShortcut: (id: string) => void;
  resizeShortcut: (id: string, size: ShortcutSize) => void;
  setEditingItem: (item: ShortcutItem | null) => void;
  moveToFolder: (itemId: string, folderId: string) => void;
  
  // Batch edit actions
  toggleBatchEdit: () => void;
  toggleSelection: (id: string) => void;
  selectAll: () => void;
  clearSelection: () => void;
  batchDelete: () => void;
  batchMoveToFolder: (folderId: string) => void;
}

export const useShortcutsStore = create<ShortcutsState>()(
  persist(
    (set) => ({
      shortcuts: defaultShortcuts,
      editingItem: null,
      batchEditMode: false,
      selectedIds: new Set<string>(),

      setShortcuts: (shortcuts) => set({ shortcuts }),

      addShortcut: (shortcut) => set((state) => ({
        shortcuts: [...state.shortcuts, {
          ...shortcut,
          id: `shortcut-${Date.now()}`,
          size: shortcut.size || '1x1',
        }],
      })),

      updateShortcut: (id, data) => set((state) => ({
        shortcuts: state.shortcuts.map((s) => {
          if (s.id === id && !isShortcutFolder(s)) {
            return { ...s, ...data };
          }
          return s;
        }),
      })),

      deleteShortcut: (id) => set((state) => ({
        shortcuts: state.shortcuts.filter((s) => s.id !== id),
      })),

      resizeShortcut: (id, size) => set((state) => ({
        shortcuts: state.shortcuts.map((s) => {
          if (s.id === id && !isShortcutFolder(s)) {
            return { ...s, size };
          }
          return s;
        }),
      })),

      setEditingItem: (item) => set({ editingItem: item }),

      moveToFolder: (itemId, folderId) => set((state) => {
        const itemToMove = state.shortcuts.find((s) => s.id === itemId && !isShortcutFolder(s)) as ShortcutItem | undefined;
        if (!itemToMove) return state;

        const newShortcuts = state.shortcuts
          .filter((s) => s.id !== itemId)
          .map((s) => {
            if (s.id === folderId && isShortcutFolder(s)) {
              return { ...s, items: [...s.items, itemToMove] };
            }
            return s;
          });

        return { shortcuts: newShortcuts };
      }),

      // Batch edit actions
      toggleBatchEdit: () => set((state) => ({
        batchEditMode: !state.batchEditMode,
        selectedIds: new Set<string>(),
      })),

      toggleSelection: (id) => set((state) => {
        const newSelected = new Set(state.selectedIds);
        if (newSelected.has(id)) {
          newSelected.delete(id);
        } else {
          newSelected.add(id);
        }
        return { selectedIds: newSelected };
      }),

      selectAll: () => set((state) => {
        const allIds = state.shortcuts
          .filter((s) => !isShortcutFolder(s))
          .map((s) => s.id);
        return { selectedIds: new Set(allIds) };
      }),

      clearSelection: () => set({ selectedIds: new Set<string>() }),

      batchDelete: () => set((state) => ({
        shortcuts: state.shortcuts.filter((s) => !state.selectedIds.has(s.id)),
        selectedIds: new Set<string>(),
      })),

      batchMoveToFolder: (folderId) => set((state) => {
        const itemsToMove = state.shortcuts.filter(
          (s) => state.selectedIds.has(s.id) && !isShortcutFolder(s)
        ) as ShortcutItem[];
        
        if (itemsToMove.length === 0) return state;

        const newShortcuts = state.shortcuts
          .filter((s) => !state.selectedIds.has(s.id))
          .map((s) => {
            if (s.id === folderId && isShortcutFolder(s)) {
              return { ...s, items: [...s.items, ...itemsToMove] };
            }
            return s;
          });

        return { shortcuts: newShortcuts, selectedIds: new Set<string>() };
      }),
    }),
    {
      name: 'shortcuts-storage',
      partialize: (state) => ({ shortcuts: state.shortcuts }),
    }
  )
);
