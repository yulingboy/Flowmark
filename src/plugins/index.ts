// 插件系统入口
// 删除此目录即可完全移除插件功能

// 核心
export { registerBuiltinPlugins, builtinPlugins } from './builtin';

// 类型从 @/types 重导出，保持向后兼容
export { isPluginCard } from '@/types';
export type { 
  Plugin, 
  PluginConfig, 
  PluginMetadata,
  PluginCardItem,
  PluginSize,
  CardSize
} from '@/types';
