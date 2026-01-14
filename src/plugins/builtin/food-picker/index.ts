import React from 'react';
import type { Plugin, PluginSize } from '@/types';
import { FoodPickerCard } from './FoodPickerCard';
import { FoodPickerModal } from './FoodPickerModal';

export const foodPickerPlugin: Plugin = {
  metadata: {
    id: 'food-picker',
    name: '今天吃什么',
    version: '1.0.0',
    description: '随机选择今天吃什么，解决选择困难症',
    author: 'Built-in',
    icon: 'utensils'
  },

  supportedSizes: ['1x1', '2x2', '2x4'],
  defaultSize: '2x2',
  modalSize: { width: 560, height: 420 },

  configSchema: {},
  defaultConfig: {},

  renderCard: (size: PluginSize) => React.createElement(FoodPickerCard, { size }),
  renderModal: () => React.createElement(FoodPickerModal),
};
