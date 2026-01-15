// 插件系统入口
// 删除此目录即可完全移除插件功能

// 核心
export { registerBuiltinPlugins, builtinPlugins } from './builtin';

// 类型重导出
export { isPluginCard } from '@/types';
export type { 
  Plugin, 
  PluginConfig, 
  PluginMetadata,
  PluginCardItem,
  PluginSize,
  CardSize
} from '@/types';
