import type { PluginAPI, PluginConfig } from '@/types';
import { usePluginStore } from './store';

/**
 * 创建插件 API
 * @param pluginId 插件 ID
 * @param defaultConfig 默认配置
 * @returns 插件 API 实例
 */
export function createPluginAPI(pluginId: string, defaultConfig?: PluginConfig): PluginAPI {
  return {
    getConfig: <T = PluginConfig>(): T => {
      const config = usePluginStore.getState().getPluginConfig(pluginId);
      return { ...defaultConfig, ...config } as T;
    },

    setConfig: (config: Partial<PluginConfig>) => {
      usePluginStore.getState().setPluginConfig(pluginId, config);
    }
  };
}
