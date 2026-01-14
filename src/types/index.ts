/**
 * 统一类型导出
 * 所有类型定义从此文件导出，确保类型定义的唯一性
 */

// 核心类型
export type { CardSize, OpenMode, Position, SearchEngine, ClockData } from './core';

// 快捷方式类型
export type { 
  ShortcutItem, 
  ShortcutFolder, 
  ShortcutEntry,
  ShortcutSize 
} from './shortcuts';

// 插件类型
export type {
  PluginMetadata,
  PluginConfig,
  PluginConfigSchemaItem,
  PluginConfigSchema,
  PluginSize,
  Plugin,
  PluginCardItem
} from './plugins';

// 类型守卫（统一从 guards.ts 导出）
export { isShortcutFolder, isShortcutItem, isPluginCard } from './guards';

// 网格项目（快捷方式条目或插件卡片）
import type { ShortcutEntry } from './shortcuts';
import type { PluginCardItem } from './plugins';
export type GridItem = ShortcutEntry | PluginCardItem;
