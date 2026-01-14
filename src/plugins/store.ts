import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PluginConfig } from '@/types';

interface PluginState {
  pluginConfigs: Record<string, PluginConfig>;
  setPluginConfig: (pluginId: string, config: Partial<PluginConfig>) => void;
  getPluginConfig: (pluginId: string) => PluginConfig;
  resetPluginConfig: (pluginId: string, defaultConfig?: PluginConfig) => void;
}

/**
 * 验证并修复插件配置数据
 */
function validateAndRepairPluginConfigs(data: unknown): { pluginConfigs: Record<string, PluginConfig>; errors: string[] } {
  const errors: string[] = [];
  let pluginConfigs: Record<string, PluginConfig> = {};

  if (!data || typeof data !== 'object') {
    errors.push('插件配置数据格式无效，已重置');
    return { pluginConfigs, errors };
  }

  const d = data as Record<string, unknown>;

  // 验证 pluginConfigs
  if (d.pluginConfigs && typeof d.pluginConfigs === 'object') {
    pluginConfigs = d.pluginConfigs as Record<string, PluginConfig>;
  } else if (d.pluginConfigs !== undefined) {
    errors.push('pluginConfigs 格式无效，已重置');
  }

  return { pluginConfigs, errors };
}

export const usePluginStore = create<PluginState>()(
  persist(
    (set, get) => ({
      pluginConfigs: {},

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
      }
    }),
    {
      name: 'plugin-configs',
      partialize: (state) => ({
        pluginConfigs: state.pluginConfigs
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('插件配置加载失败:', error);
          return;
        }
        if (state) {
          const result = validateAndRepairPluginConfigs(state);
          if (result.errors.length > 0) {
            console.warn('插件配置已修复:', result.errors);
            state.pluginConfigs = result.pluginConfigs;
          }
        }
      }
    }
  )
);
