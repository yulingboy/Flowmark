import React from 'react';
import type { Plugin, PluginSize } from '../../types';
import { TodoCard, TodoModal } from './TodoWidget';

export const todoPlugin: Plugin = {
  metadata: {
    id: 'todo',
    name: '待办事项',
    version: '1.0.0',
    description: '管理您的待办任务',
    author: 'Built-in',
    icon: '✅'
  },
  
  supportedSizes: ['1x1', '2x2', '2x4'],
  defaultSize: '2x2',
  
  configSchema: {
    showCompleted: {
      type: 'boolean',
      label: '显示已完成任务',
      default: true
    }
  },
  
  defaultConfig: {
    showCompleted: true
  },
  
  renderCard: (api, size: PluginSize) => React.createElement(TodoCard, { api, size }),
  renderModal: (api) => React.createElement(TodoModal, { api })
};
