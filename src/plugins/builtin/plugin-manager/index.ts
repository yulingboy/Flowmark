import React from 'react';
import type { Plugin } from '../../types';
import { PluginManagerCard, PluginManagerModal } from './PluginManagerWidget';

export const pluginManagerPlugin: Plugin = {
  metadata: {
    id: 'plugin-manager',
    name: '插件市场',
    version: '1.0.0',
    description: '发现更多插件',
    author: 'Built-in'
  },
  
  supportedSizes: ['1x1', '2x2'],
  defaultSize: '1x1',
  
  // 系统插件，不可删除
  isSystem: true,
  
  // 更大的弹窗
  modalSize: { width: 720, height: 560 },
  
  renderCard: (api, size) => React.createElement(PluginManagerCard, { api, size }),
  renderModal: (api) => React.createElement(PluginManagerModal, { api })
};
