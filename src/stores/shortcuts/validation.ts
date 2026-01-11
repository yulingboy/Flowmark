import type { GridItem, ShortcutEntry, ShortcutFolder, ShortcutItem, ShortcutSize, PluginCardItem } from '@/types';
import type { ValidationResult } from './types';

// 验证单个快捷方式
export function validateShortcutItem(item: unknown): item is ShortcutItem {
  if (!item || typeof item !== 'object') return false;
  const s = item as Record<string, unknown>;
  return (
    typeof s.id === 'string' && s.id.length > 0 &&
    typeof s.name === 'string' &&
    typeof s.url === 'string' &&
    typeof s.icon === 'string'
  );
}

// 验证并修复快捷方式数据
export function validateAndRepairShortcuts(shortcuts: unknown[]): ValidationResult {
  const errors: string[] = [];
  const seenIds = new Set<string>();
  const repairedItems: GridItem[] = [];
  let removedCount = 0;

  for (const item of shortcuts) {
    if (!item || typeof item !== 'object') {
      removedCount++;
      errors.push('移除无效项目');
      continue;
    }

    const s = item as Record<string, unknown>;
    
    // 检查重复 ID
    if (typeof s.id === 'string' && seenIds.has(s.id)) {
      removedCount++;
      errors.push(`移除重复 ID: ${s.id}`);
      continue;
    }

    // 处理文件夹
    if (s.isFolder === true) {
      const folder = s as unknown as ShortcutFolder;
      if (!folder.id || !folder.name) {
        removedCount++;
        errors.push('移除无效文件夹');
        continue;
      }
      // 验证文件夹内的项目
      const validItems = (folder.items || []).filter(validateShortcutItem);
      seenIds.add(folder.id);
      repairedItems.push({
        ...folder,
        items: validItems,
        size: folder.size || '2x2',
      });
      continue;
    }

    // 处理插件卡片
    if (s.isPlugin === true) {
      const plugin = s as unknown as PluginCardItem;
      if (!plugin.id || !plugin.pluginId) {
        removedCount++;
        errors.push('移除无效插件卡片');
        continue;
      }
      seenIds.add(plugin.id);
      repairedItems.push({
        ...plugin,
        size: plugin.size || '2x2',
      });
      continue;
    }

    // 处理普通快捷方式
    if (!validateShortcutItem(s)) {
      // 尝试修复
      const repaired: ShortcutEntry = {
        id: (s.id as string) || `repaired-${Date.now()}-${Math.random()}`,
        name: (s.name as string) || '未命名',
        url: (s.url as string) || 'https://example.com',
        icon: (s.icon as string) || '',
        size: ((s.size as ShortcutSize) || '1x1'),
        openMode: (s.openMode as 'tab' | 'popup') || 'tab',
      };
      
      if (!seenIds.has(repaired.id)) {
        seenIds.add(repaired.id);
        repairedItems.push(repaired);
        errors.push(`修复快捷方式: ${repaired.name}`);
      }
      continue;
    }

    seenIds.add(s.id as string);
    repairedItems.push(s as GridItem);
  }

  return {
    isValid: errors.length === 0,
    repairedItems,
    removedCount,
    errors,
  };
}
