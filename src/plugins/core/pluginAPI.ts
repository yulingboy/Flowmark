import type { PluginAPI, PluginConfig } from '@/types';
import { usePluginStore } from '../store';
import { pluginLifecycleManager } from './pluginLifecycle';

export function createPluginAPI(pluginId: string, defaultConfig?: PluginConfig): PluginAPI {
  return {
    getConfig: <T = PluginConfig>(): T => {
      const config = usePluginStore.getState().getPluginConfig(pluginId);
      return { ...defaultConfig, ...config } as T;
    },

    setConfig: (config: Partial<PluginConfig>) => {
      const store = usePluginStore.getState();
      const oldConfig = { ...defaultConfig, ...store.getPluginConfig(pluginId) };
      store.setPluginConfig(pluginId, config);
      const newConfig = { ...defaultConfig, ...store.getPluginConfig(pluginId) };
      
      // 通知配置变更
      pluginLifecycleManager.notifyConfigChange(pluginId, oldConfig, newConfig);
    },

    getStorage: <T>(key: string): T | null => {
      return usePluginStore.getState().getPluginData<T>(pluginId, key);
    },

    setStorage: <T>(key: string, value: T) => {
      usePluginStore.getState().setPluginData(pluginId, key, value);
    }
  };
}
