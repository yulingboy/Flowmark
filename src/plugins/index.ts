// 插件系统入口
// 删除此目录即可完全移除插件功能

// 内部类型
export type { PluginState } from './types';

// 核心
export { usePluginStore } from './store';
export { createPluginAPI } from './pluginAPI';
export { registerBuiltinPlugins, builtinPlugins } from './builtin';
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
