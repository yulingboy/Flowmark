/**
 * 插件模块内部类型定义
 * 注意：公共插件类型在 @/types/plugins.ts 中定义
 */
import type { PluginConfig } from '@/types';

/** 插件 Store 状态 */
export interface PluginState {
  pluginConfigs: Record<string, PluginConfig>;
  pluginData: Record<string, Record<string, unknown>>;
  
  getPluginConfig: <T = PluginConfig>(pluginId: string) => T;
  setPluginConfig: (pluginId: string, config: Partial<PluginConfig>) => void;
  getPluginData: <T>(pluginId: string, key: string) => T | null;
  setPluginData: <T>(pluginId: string, key: string, value: T) => void;
}

/** 插件卡片 Props */
export interface PluginCardProps {
  pluginId: string;
  size: '1x1' | '2x2' | '2x4';
}
