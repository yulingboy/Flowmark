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

/**
 * 验证并修复插件数据
 */
function validateAndRepairPluginData(data: unknown): { pluginConfigs: Record<string, PluginConfig>; pluginData: Record<string, Record<string, unknown>>; errors: string[] } {
  const errors: string[] = [];
  let pluginConfigs: Record<string, PluginConfig> = {};
  let pluginData: Record<string, Record<string, unknown>> = {};

  if (!data || typeof data !== 'object') {
    errors.push('插件数据格式无效，已重置');
    return { pluginConfigs, pluginData, errors };
  }

  const d = data as Record<string, unknown>;

  // 验证 pluginConfigs
  if (d.pluginConfigs && typeof d.pluginConfigs === 'object') {
    pluginConfigs = d.pluginConfigs as Record<string, PluginConfig>;
  } else if (d.pluginConfigs !== undefined) {
    errors.push('pluginConfigs 格式无效，已重置');
  }

  // 验证 pluginData
  if (d.pluginData && typeof d.pluginData === 'object') {
    pluginData = d.pluginData as Record<string, Record<string, unknown>>;
  } else if (d.pluginData !== undefined) {
    errors.push('pluginData 格式无效，已重置');
  }

  return { pluginConfigs, pluginData, errors };
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
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('插件数据加载失败:', error);
          return;
        }
        if (state) {
          const result = validateAndRepairPluginData(state);
          if (result.errors.length > 0) {
            console.warn('插件数据已修复:', result.errors);
            state.pluginConfigs = result.pluginConfigs;
            state.pluginData = result.pluginData;
          }
        }
      }
    }
  )
);
