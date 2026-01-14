/**
 * 插件系统相关类型定义
 */
import type { ReactNode } from 'react';
import type { CardSize, Position } from './core';

// 插件元数据
export interface PluginMetadata {
  id: string;
  name: string;
  version: string;
  description?: string;
  author?: string;
  icon?: string;
}

// 插件配置
export interface PluginConfig {
  [key: string]: unknown;
}

// 配置项 Schema
export interface PluginConfigSchemaItem {
  type: 'string' | 'number' | 'boolean' | 'select' | 'multiselect';
  label: string;
  default: unknown;
  options?: Array<{ label: string; value: unknown }>;
  min?: number;
  max?: number;
}

export interface PluginConfigSchema {
  [key: string]: PluginConfigSchemaItem;
}

// 插件支持的尺寸
export type PluginSize = '1x1' | '2x2' | '2x4';

// 插件 API 接口
export interface PluginAPI {
  getConfig: <T = PluginConfig>() => T;
  setConfig: (config: Partial<PluginConfig>) => void;
  getStorage: <T>(key: string) => T | null;
  setStorage: <T>(key: string, value: T) => void;
}

// 插件接口
export interface Plugin {
  metadata: PluginMetadata;
  configSchema?: PluginConfigSchema;
  defaultConfig?: PluginConfig;
  renderCard?: (api: PluginAPI, size: PluginSize) => ReactNode;
  renderModal?: (api: PluginAPI) => ReactNode;
  supportedSizes?: PluginSize[];
  defaultSize?: PluginSize;
  isSystem?: boolean; // 系统插件，不可删除
  modalSize?: { width: number; height: number }; // 自定义弹窗尺寸
}

// 插件卡片实例
export interface PluginCardItem {
  id: string;
  pluginId: string;
  name: string;
  icon: string;
  size: CardSize;
  position?: Position;
  isPlugin: true;
}

// 类型守卫：判断是否为插件卡片
export function isPluginCard(entry: unknown): entry is PluginCardItem {
  return typeof entry === 'object' && entry !== null && 'isPlugin' in entry && (entry as PluginCardItem).isPlugin === true;
}
