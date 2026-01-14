import type { Plugin, PluginAPI, PluginConfig } from '@/types';
import { usePluginStore } from '../store';
import { createPluginAPI } from './pluginAPI';

/** 插件验证结果 */
export interface PluginValidationResult {
  isValid: boolean;
  errors: string[];
}

/** 插件注册结果 */
export interface PluginRegistrationResult {
  success: boolean;
  errors?: string[];
}

class PluginManager {
  private plugins: Map<string, Plugin> = new Map();
  private pluginAPIs: Map<string, PluginAPI> = new Map();

  /**
   * 验证插件结构
   * @param plugin 待验证的插件
   * @returns 验证结果
   */
  validatePlugin(plugin: unknown): PluginValidationResult {
    const errors: string[] = [];

    if (!plugin || typeof plugin !== 'object') {
      errors.push('插件必须是一个对象');
      return { isValid: false, errors };
    }

    const p = plugin as Partial<Plugin>;

    // 验证 metadata
    if (!p.metadata) {
      errors.push('缺少 metadata 字段');
    } else {
      if (!p.metadata.id || typeof p.metadata.id !== 'string') {
        errors.push('缺少有效的 metadata.id');
      }
      if (!p.metadata.name || typeof p.metadata.name !== 'string') {
        errors.push('缺少有效的 metadata.name');
      }
      if (!p.metadata.version || typeof p.metadata.version !== 'string') {
        errors.push('缺少有效的 metadata.version');
      }
    }

    // 验证 renderCard（如果存在）
    if (p.renderCard !== undefined && typeof p.renderCard !== 'function') {
      errors.push('renderCard 必须是一个函数');
    }

    // 验证 renderModal（如果存在）
    if (p.renderModal !== undefined && typeof p.renderModal !== 'function') {
      errors.push('renderModal 必须是一个函数');
    }

    // 验证 supportedSizes（如果存在）
    if (p.supportedSizes !== undefined) {
      if (!Array.isArray(p.supportedSizes)) {
        errors.push('supportedSizes 必须是一个数组');
      } else {
        const validSizes = ['1x1', '2x2', '2x4'];
        for (const size of p.supportedSizes) {
          if (!validSizes.includes(size)) {
            errors.push(`不支持的尺寸: ${size}`);
          }
        }
      }
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * 注册插件
   * @param plugin 待注册的插件
   * @returns 注册结果
   */
  register(plugin: Plugin): PluginRegistrationResult {
    try {
      // 验证插件结构
      const validation = this.validatePlugin(plugin);
      if (!validation.isValid) {
        console.error(`插件验证失败:`, validation.errors);
        return { success: false, errors: validation.errors };
      }

      const { id } = plugin.metadata;
      
      // 检查是否已注册
      if (this.plugins.has(id)) {
        return { success: true }; // 已注册，静默返回成功
      }

      // 注册插件
      this.plugins.set(id, plugin);
      
      // 创建插件 API
      const api = createPluginAPI(id, plugin.defaultConfig);
      this.pluginAPIs.set(id, api);

      // 初始化配置
      const store = usePluginStore.getState();
      if (!store.pluginConfigs[id] && plugin.defaultConfig) {
        store.setPluginConfig(id, plugin.defaultConfig);
      }

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`插件注册失败 [${plugin?.metadata?.id || 'unknown'}]:`, errorMessage);
      return { success: false, errors: [errorMessage] };
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

  /**
   * 获取已注册的插件数量
   */
  getPluginCount(): number {
    return this.plugins.size;
  }

  /**
   * 检查插件是否已注册
   */
  hasPlugin(pluginId: string): boolean {
    return this.plugins.has(pluginId);
  }
}

export const pluginManager = new PluginManager();
