import React from 'react';
import type { Plugin } from '@/types';
import { PluginManagerCard } from './PluginManagerCard';
import { PluginManagerModal } from './PluginManagerModal';

export const pluginManagerPlugin: Plugin = {
  metadata: {
    id: 'plugin-manager',
    name: '插件市场',
    version: '1.0.0',
    description: '发现更多插件',
    author: 'Built-in',
    icon: 'package'
  },
  
  supportedSizes: ['1x1', '2x2'],
  defaultSize: '1x1',
  
  // 系统插件，不可删除
  isSystem: true,
  
  modalSize: { width: 640, height: 480 },
  
  renderCard: (_api, size) => React.createElement(PluginManagerCard, { size }),
  renderModal: () => React.createElement(PluginManagerModal)
};
