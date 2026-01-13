// 插件系统入口
// 删除此目录即可完全移除插件功能

// 内部类型
export type { PluginState, PluginCardProps } from './types';

// 核心
export { pluginManager } from './core/pluginManager';
export { usePluginStore } from './store';
export { registerBuiltinPlugins } from './builtin';
export { PluginCard } from './components/PluginCard';

// 类型从 @/types 重导出，保持向后兼容
export { isPluginCard } from '@/types';
export type { 
  Plugin, 
  PluginAPI, 
  PluginConfig, 
  PluginMetadata,
  PluginCardItem,
  PluginSize,
  CardSize
} from '@/types';
