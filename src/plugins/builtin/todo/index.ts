import React from 'react';
import type { Plugin, PluginSize } from '@/types';
import { TodoCard } from './TodoCard';
import { TodoModal } from './TodoModal';

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
  
  modalSize: { width: 800, height: 560 },
  
  renderCard: (_api, size: PluginSize) => React.createElement(TodoCard, { size }),
  renderModal: () => React.createElement(TodoModal)
};
