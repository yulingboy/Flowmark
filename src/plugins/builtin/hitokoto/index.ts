import React from 'react';
import type { Plugin, PluginSize } from '@/types';
import { HitokotoCard } from './HitokotoCard';
import { HitokotoModal } from './HitokotoModal';
import { HITOKOTO_TYPES } from './types';

export const hitokotoPlugin: Plugin = {
  metadata: {
    id: 'hitokoto',
    name: '一言',
    version: '1.0.0',
    description: '随机展示一句话，来自动画、漫画、游戏、文学等',
    author: 'Built-in',
    icon: '💬'
  },

  supportedSizes: ['1x1', '2x2', '2x4'],
  defaultSize: '2x2',
  modalSize: { width: 480, height: 360 },

  configSchema: {
    types: {
      type: 'multiselect',
      label: '句子类型',
      default: ['a', 'b', 'c', 'd', 'i'],
      options: Object.entries(HITOKOTO_TYPES).map(([value, label]) => ({
        label,
        value,
      })),
    },
    autoRefresh: {
      type: 'boolean',
      label: '自动刷新',
      default: false,
    },
    refreshInterval: {
      type: 'number',
      label: '刷新间隔 (秒)',
      default: 30,
      min: 10,
      max: 300,
    },
  },

  defaultConfig: {
    types: ['a', 'b', 'c', 'd', 'i'],
    autoRefresh: false,
    refreshInterval: 30,
  },

  renderCard: (_api, size: PluginSize) => React.createElement(HitokotoCard, { size }),
  renderModal: () => React.createElement(HitokotoModal),
};
