import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PluginConfig } from '@/types';

interface PluginState {
  pluginConfigs: Record<string, PluginConfig>;
  pluginData: Record<string, Record<string, unknown>>;
  setPluginConfig: (pluginId: string, config: Partial<PluginConfig>) => void;
  getPluginConfig: (pluginId: string) => PluginConfig;
  resetPluginConfig: (pluginId: string, defaultConfig?: PluginConfig) => void;
  getPluginData: <T>(pluginId: string, key: string) => T | null;
  setPluginData: <T>(pluginId: string, key: string, value: T) => void;
}

export const usePluginStore = create<PluginState>()(
  persist(
    (set, get) => ({
      pluginConfigs: {},
      pluginData: {},

      setPluginConfig: (pluginId, config) => {
        set(state => ({
          pluginConfigs: {
            ...state.pluginConfigs,
            [pluginId]: { ...state.pluginConfigs[pluginId], ...config }
          }
        }));
      },

      getPluginConfig: (pluginId) => get().pluginConfigs[pluginId] || {},

      resetPluginConfig: (pluginId, defaultConfig) => {
        set(state => ({
          pluginConfigs: {
            ...state.pluginConfigs,
            [pluginId]: defaultConfig || {}
          }
        }));
      },

      getPluginData: <T>(pluginId: string, key: string): T | null => {
        const data = get().pluginData[pluginId];
        return data ? (data[key] as T) : null;
      },

      setPluginData: <T>(pluginId: string, key: string, value: T) => {
        set(state => ({
          pluginData: {
            ...state.pluginData,
            [pluginId]: { ...state.pluginData[pluginId], [key]: value }
          }
        }));
      }
    }),
    {
      name: 'plugin-data',
      partialize: (state) => ({
        pluginConfigs: state.pluginConfigs,
        pluginData: state.pluginData
      })
    }
  )
);
