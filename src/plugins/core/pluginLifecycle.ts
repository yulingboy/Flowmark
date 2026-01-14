/**
 * 插件生命周期管理器
 * 负责管理插件的挂载、卸载和配置变更
 */
import type { PluginConfig } from '@/types';
import { pluginManager } from './pluginManager';

class PluginLifecycleManager {
  /** 已挂载的插件 ID 集合 */
  private mountedPlugins = new Set<string>();

  /**
   * 挂载插件
   * @param pluginId 插件 ID
   */
  async mountPlugin(pluginId: string): Promise<void> {
    const plugin = pluginManager.getPlugin(pluginId);
    if (!plugin) {
      console.warn(`插件 ${pluginId} 未找到，无法挂载`);
      return;
    }

    if (this.mountedPlugins.has(pluginId)) {
      return; // 已挂载，跳过
    }

    try {
      await plugin.onMount?.();
      this.mountedPlugins.add(pluginId);
    } catch (error) {
      console.error(`插件 ${pluginId} 挂载失败:`, error);
    }
  }

  /**
   * 卸载插件
   * @param pluginId 插件 ID
   */
  async unmountPlugin(pluginId: string): Promise<void> {
    const plugin = pluginManager.getPlugin(pluginId);
    if (!plugin) {
      return;
    }

    if (!this.mountedPlugins.has(pluginId)) {
      return; // 未挂载，跳过
    }

    try {
      await plugin.onUnmount?.();
      this.mountedPlugins.delete(pluginId);
    } catch (error) {
      console.error(`插件 ${pluginId} 卸载失败:`, error);
    }
  }

  /**
   * 通知插件配置变更
   * @param pluginId 插件 ID
   * @param oldConfig 旧配置
   * @param newConfig 新配置
   */
  notifyConfigChange(pluginId: string, oldConfig: PluginConfig, newConfig: PluginConfig): void {
    const plugin = pluginManager.getPlugin(pluginId);
    if (!plugin || !this.mountedPlugins.has(pluginId)) {
      return;
    }

    try {
      plugin.onConfigChange?.(oldConfig, newConfig);
    } catch (error) {
      console.error(`插件 ${pluginId} 配置变更处理失败:`, error);
    }
  }

  /**
   * 启用插件
   * @param pluginId 插件 ID
   */
  async enablePlugin(pluginId: string): Promise<void> {
    const plugin = pluginManager.getPlugin(pluginId);
    if (!plugin) {
      return;
    }

    try {
      plugin.onEnable?.();
      await this.mountPlugin(pluginId);
    } catch (error) {
      console.error(`插件 ${pluginId} 启用失败:`, error);
    }
  }

  /**
   * 禁用插件
   * @param pluginId 插件 ID
   */
  async disablePlugin(pluginId: string): Promise<void> {
    const plugin = pluginManager.getPlugin(pluginId);
    if (!plugin) {
      return;
    }

    try {
      await this.unmountPlugin(pluginId);
      plugin.onDisable?.();
    } catch (error) {
      console.error(`插件 ${pluginId} 禁用失败:`, error);
    }
  }

  /**
   * 检查插件是否已挂载
   * @param pluginId 插件 ID
   */
  isMounted(pluginId: string): boolean {
    return this.mountedPlugins.has(pluginId);
  }

  /**
   * 获取已挂载的插件数量
   */
  getMountedCount(): number {
    return this.mountedPlugins.size;
  }

  /**
   * 挂载所有已注册的插件
   */
  async mountAllPlugins(): Promise<void> {
    const plugins = pluginManager.getPlugins();
    for (const plugin of plugins) {
      await this.mountPlugin(plugin.metadata.id);
    }
  }

  /**
   * 卸载所有插件
   */
  async unmountAllPlugins(): Promise<void> {
    const mountedIds = Array.from(this.mountedPlugins);
    for (const pluginId of mountedIds) {
      await this.unmountPlugin(pluginId);
    }
  }
}

export const pluginLifecycleManager = new PluginLifecycleManager();
