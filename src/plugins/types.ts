/**
 * 插件类型定义
 * 从统一类型模块重新导出，保持向后兼容
 */

// 从统一类型模块导入并重新导出
export type { CardSize, Position } from '@/types/core';

export type {
  PluginMetadata,
  PluginConfig,
  PluginConfigSchemaItem,
  PluginConfigSchema,
  PluginSize,
  PluginAPI,
  Plugin,
  PluginCardItem
} from '@/types/plugins';

export { isPluginCard } from '@/types/plugins';
