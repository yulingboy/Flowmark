/**
 * validation 模块单元测试
 */
import { describe, it, expect } from 'vitest';
import { validateShortcutItem, validateAndRepairShortcuts } from '../validation';
import type { ShortcutItem, ShortcutFolder, PluginCardItem, GridItem } from '@/types';

describe('validation', () => {
  describe('validateShortcutItem', () => {
    it('应该验证有效的快捷方式项', () => {
      const item: ShortcutItem = {
        id: 'test-1',
        name: 'Test',
        url: 'https://test.com',
        icon: '🔗',
      };
      expect(validateShortcutItem(item)).toBe(true);
    });

    it('应该拒绝 null', () => {
      expect(validateShortcutItem(null)).toBe(false);
    });

    it('应该拒绝 undefined', () => {
      expect(validateShortcutItem(undefined)).toBe(false);
    });

    it('应该拒绝非对象类型', () => {
      expect(validateShortcutItem('string')).toBe(false);
      expect(validateShortcutItem(123)).toBe(false);
      expect(validateShortcutItem(true)).toBe(false);
    });

    it('应该拒绝缺少 id 的项', () => {
      const item = {
        name: 'Test',
        url: 'https://test.com',
        icon: '🔗',
      };
      expect(validateShortcutItem(item)).toBe(false);
    });

    it('应该拒绝空 id', () => {
      const item = {
        id: '',
        name: 'Test',
        url: 'https://test.com',
        icon: '🔗',
      };
      expect(validateShortcutItem(item)).toBe(false);
    });

    it('应该拒绝缺少 name 的项', () => {
      const item = {
        id: 'test-1',
        url: 'https://test.com',
        icon: '🔗',
      };
      expect(validateShortcutItem(item)).toBe(false);
    });

    it('应该拒绝缺少 url 的项', () => {
      const item = {
        id: 'test-1',
        name: 'Test',
        icon: '🔗',
      };
      expect(validateShortcutItem(item)).toBe(false);
    });

    it('应该拒绝缺少 icon 的项', () => {
      const item = {
        id: 'test-1',
        name: 'Test',
        url: 'https://test.com',
      };
      expect(validateShortcutItem(item)).toBe(false);
    });

    it('应该接受包含额外字段的有效项', () => {
      const item = {
        id: 'test-1',
        name: 'Test',
        url: 'https://test.com',
        icon: '🔗',
        size: '2x2',
        openMode: 'tab',
        position: { x: 0, y: 0 },
      };
      expect(validateShortcutItem(item)).toBe(true);
    });
  });

  describe('validateAndRepairShortcuts', () => {
    it('应该验证有效的快捷方式列表', () => {
      const shortcuts: GridItem[] = [
        {
          id: 'test-1',
          name: 'Test 1',
          url: 'https://test1.com',
          icon: '🔗',
        },
        {
          id: 'test-2',
          name: 'Test 2',
          url: 'https://test2.com',
          icon: '🔗',
        },
      ];
      const result = validateAndRepairShortcuts(shortcuts);
      expect(result.isValid).toBe(true);
      expect(result.repairedItems).toHaveLength(2);
      expect(result.errors).toHaveLength(0);
      expect(result.removedCount).toBe(0);
    });

    it('应该移除无效项目', () => {
      const shortcuts = [
        {
          id: 'test-1',
          name: 'Test 1',
          url: 'https://test1.com',
          icon: '🔗',
        },
        null,
        'invalid',
        123,
      ];
      const result = validateAndRepairShortcuts(shortcuts);
      expect(result.isValid).toBe(false);
      expect(result.repairedItems).toHaveLength(1);
      expect(result.removedCount).toBe(3);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('应该移除重复 ID 的项', () => {
      const shortcuts: GridItem[] = [
        {
          id: 'test-1',
          name: 'Test 1',
          url: 'https://test1.com',
          icon: '🔗',
        },
        {
          id: 'test-1',
          name: 'Test 1 Duplicate',
          url: 'https://test1-dup.com',
          icon: '🔗',
        },
      ];
      const result = validateAndRepairShortcuts(shortcuts);
      expect(result.isValid).toBe(false);
      expect(result.repairedItems).toHaveLength(1);
      expect(result.removedCount).toBe(1);
      expect(result.errors).toContain('移除重复 ID: test-1');
    });

    it('应该验证文件夹', () => {
      const shortcuts: GridItem[] = [
        {
          id: 'folder-1',
          name: 'My Folder',
          isFolder: true,
          items: [
            {
              id: 'item-1',
              name: 'Item 1',
              url: 'https://item1.com',
              icon: '🔗',
            },
          ],
        } as ShortcutFolder,
      ];
      const result = validateAndRepairShortcuts(shortcuts);
      expect(result.isValid).toBe(true);
      expect(result.repairedItems).toHaveLength(1);
      const folder = result.repairedItems[0] as ShortcutFolder;
      expect(folder.isFolder).toBe(true);
      expect(folder.items).toHaveLength(1);
    });

    it('应该移除无效文件夹', () => {
      const shortcuts = [
        {
          isFolder: true,
          // 缺少 id 和 name
        },
      ];
      const result = validateAndRepairShortcuts(shortcuts);
      expect(result.isValid).toBe(false);
      expect(result.repairedItems).toHaveLength(0);
      expect(result.removedCount).toBe(1);
      expect(result.errors).toContain('移除无效文件夹');
    });

    it('应该过滤文件夹中的无效项', () => {
      const shortcuts: GridItem[] = [
        {
          id: 'folder-1',
          name: 'My Folder',
          isFolder: true,
          items: [
            {
              id: 'item-1',
              name: 'Item 1',
              url: 'https://item1.com',
              icon: '🔗',
            },
            {
              id: 'invalid',
              // 缺少必要字段
            } as ShortcutItem,
          ],
        } as ShortcutFolder,
      ];
      const result = validateAndRepairShortcuts(shortcuts);
      expect(result.isValid).toBe(true);
      const folder = result.repairedItems[0] as ShortcutFolder;
      expect(folder.items).toHaveLength(1);
    });

    it('应该为文件夹设置默认尺寸', () => {
      const shortcuts: GridItem[] = [
        {
          id: 'folder-1',
          name: 'My Folder',
          isFolder: true,
          items: [],
        } as ShortcutFolder,
      ];
      const result = validateAndRepairShortcuts(shortcuts);
      expect(result.repairedItems[0].size).toBe('2x2');
    });

    it('应该验证插件卡片', () => {
      const shortcuts: GridItem[] = [
        {
          id: 'plugin-test',
          pluginId: 'test-plugin',
          name: 'Test Plugin',
          icon: '🔌',
          isPlugin: true,
        } as PluginCardItem,
      ];
      const result = validateAndRepairShortcuts(shortcuts);
      expect(result.isValid).toBe(true);
      expect(result.repairedItems).toHaveLength(1);
      const plugin = result.repairedItems[0] as PluginCardItem;
      expect(plugin.isPlugin).toBe(true);
      expect(plugin.pluginId).toBe('test-plugin');
    });

    it('应该移除无效插件卡片', () => {
      const shortcuts = [
        {
          isPlugin: true,
          // 缺少 id 和 pluginId
        },
      ];
      const result = validateAndRepairShortcuts(shortcuts);
      expect(result.isValid).toBe(false);
      expect(result.repairedItems).toHaveLength(0);
      expect(result.removedCount).toBe(1);
      expect(result.errors).toContain('移除无效插件卡片');
    });

    it('应该为插件卡片设置默认尺寸', () => {
      const shortcuts: GridItem[] = [
        {
          id: 'plugin-test',
          pluginId: 'test-plugin',
          name: 'Test Plugin',
          icon: '🔌',
          isPlugin: true,
        } as PluginCardItem,
      ];
      const result = validateAndRepairShortcuts(shortcuts);
      expect(result.repairedItems[0].size).toBe('2x2');
    });

    it('应该修复缺少字段的快捷方式', () => {
      const shortcuts = [
        {
          id: 'test-1',
          // 缺少其他必要字段
        },
      ];
      const result = validateAndRepairShortcuts(shortcuts);
      expect(result.isValid).toBe(false);
      expect(result.repairedItems).toHaveLength(1);
      const repaired = result.repairedItems[0] as ShortcutItem;
      expect(repaired.id).toBe('test-1');
      expect(repaired.name).toBe('未命名');
      expect(repaired.url).toBe('https://example.com');
      expect(repaired.size).toBe('1x1');
      expect(result.errors.some(e => e.includes('修复快捷方式'))).toBe(true);
    });

    it('应该为修复的项生成唯一 ID', () => {
      const shortcuts = [
        {
          // 完全缺少 id
          name: 'Test',
        },
      ];
      const result = validateAndRepairShortcuts(shortcuts);
      expect(result.repairedItems).toHaveLength(1);
      expect(result.repairedItems[0].id).toMatch(/^repaired-/);
    });

    it('应该跳过已存在 ID 的修复项', () => {
      const shortcuts = [
        {
          id: 'test-1',
          name: 'Valid',
          url: 'https://test.com',
          icon: '🔗',
        },
        {
          id: 'test-1',
          // 重复 ID，缺少字段
        },
      ];
      const result = validateAndRepairShortcuts(shortcuts);
      expect(result.repairedItems).toHaveLength(1);
      expect(result.repairedItems[0].name).toBe('Valid');
    });

    it('应该处理空数组', () => {
      const result = validateAndRepairShortcuts([]);
      expect(result.isValid).toBe(true);
      expect(result.repairedItems).toHaveLength(0);
      expect(result.errors).toHaveLength(0);
      expect(result.removedCount).toBe(0);
    });

    it('应该处理混合类型的数组', () => {
      const shortcuts: GridItem[] = [
        {
          id: 'shortcut-1',
          name: 'Shortcut',
          url: 'https://test.com',
          icon: '🔗',
        },
        {
          id: 'folder-1',
          name: 'Folder',
          isFolder: true,
          items: [],
        } as ShortcutFolder,
        {
          id: 'plugin-1',
          pluginId: 'test',
          name: 'Plugin',
          icon: '🔌',
          isPlugin: true,
        } as PluginCardItem,
      ];
      const result = validateAndRepairShortcuts(shortcuts);
      expect(result.isValid).toBe(true);
      expect(result.repairedItems).toHaveLength(3);
    });
  });
});
