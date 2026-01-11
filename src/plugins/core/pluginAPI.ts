import type { PluginAPI, PluginConfig } from '../types';
import { usePluginStore } from '../store';

export function createPluginAPI(pluginId: string, defaultConfig?: PluginConfig): PluginAPI {
  return {
    getConfig: <T = PluginConfig>(): T => {
      const config = usePluginStore.getState().getPluginConfig(pluginId);
      return { ...defaultConfig, ...config } as T;
    },

    setConfig: (config: Partial<PluginConfig>) => {
      usePluginStore.getState().setPluginConfig(pluginId, config);
    },

    getStorage: <T>(key: string): T | null => {
      return usePluginStore.getState().getPluginData<T>(pluginId, key);
    },

    setStorage: <T>(key: string, value: T) => {
      usePluginStore.getState().setPluginData(pluginId, key, value);
    }
  };
}
