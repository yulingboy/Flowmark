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
export { isShortcutFolder, isShortcutItem } from './shortcuts';

// 插件类型
export type {
  PluginMetadata,
  PluginConfig,
  PluginConfigSchemaItem,
  PluginConfigSchema,
  PluginSize,
  PluginAPI,
  Plugin,
  PluginCardItem
} from './plugins';
export { isPluginCard } from './plugins';

// 网格项目（快捷方式条目或插件卡片）
import type { ShortcutEntry } from './shortcuts';
import type { PluginCardItem } from './plugins';
export type GridItem = ShortcutEntry | PluginCardItem;
