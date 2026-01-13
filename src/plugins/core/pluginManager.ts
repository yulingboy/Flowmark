import type { Plugin, PluginAPI, PluginConfig } from '@/types';
import { usePluginStore } from '../store';
import { createPluginAPI } from './pluginAPI';

class PluginManager {
  private plugins: Map<string, Plugin> = new Map();
  private pluginAPIs: Map<string, PluginAPI> = new Map();

  register(plugin: Plugin): void {
    const { id } = plugin.metadata;
    
    if (this.plugins.has(id)) return;

    this.plugins.set(id, plugin);
    
    const api = createPluginAPI(id, plugin.defaultConfig);
    this.pluginAPIs.set(id, api);

    const store = usePluginStore.getState();
    if (!store.pluginConfigs[id] && plugin.defaultConfig) {
      store.setPluginConfig(id, plugin.defaultConfig);
    }
  }

  getPlugin(pluginId: string): Plugin | undefined {
    return this.plugins.get(pluginId);
  }

  getPluginAPI(pluginId: string): PluginAPI | undefined {
    return this.pluginAPIs.get(pluginId);
  }

  getPlugins(): Plugin[] {
    return Array.from(this.plugins.values());
  }

  getPluginConfig(pluginId: string): PluginConfig {
    return usePluginStore.getState().getPluginConfig(pluginId);
  }

  setPluginConfig(pluginId: string, config: Partial<PluginConfig>): void {
    usePluginStore.getState().setPluginConfig(pluginId, config);
  }
}

export const pluginManager = new PluginManager();
