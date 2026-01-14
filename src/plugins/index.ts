// 插件系统入口
// 删除此目录即可完全移除插件功能

// 内部类型
export type { PluginState } from './types';

// 核心
export { pluginManager } from './core/pluginManager';
export type { PluginValidationResult, PluginRegistrationResult } from './core/pluginManager';
export { pluginLifecycleManager } from './core/pluginLifecycle';
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
  PluginLifecycle,
  CardSize
} from '@/types';
