import React from 'react';
import type { Plugin, PluginSize } from '../../types';
import { NotesCard, NotesModal } from './NotesWidget';

export const notesPlugin: Plugin = {
  metadata: {
    id: 'notes',
    name: '便签',
    version: '1.0.0',
    description: '快速记录想法和笔记',
    author: 'Built-in',
    icon: '📝'
  },
  
  supportedSizes: ['1x1', '2x2', '2x4'],
  defaultSize: '2x2',
  
  configSchema: {
    layout: {
      type: 'select',
      label: '布局方式',
      default: 'grid',
      options: [
        { label: '网格', value: 'grid' },
        { label: '列表', value: 'list' }
      ]
    },
    defaultColor: {
      type: 'select',
      label: '默认颜色',
      default: '#fef08a',
      options: [
        { label: '黄色', value: '#fef08a' },
        { label: '绿色', value: '#bbf7d0' },
        { label: '蓝色', value: '#bfdbfe' },
        { label: '红色', value: '#fecaca' },
        { label: '紫色', value: '#e9d5ff' },
        { label: '橙色', value: '#fed7aa' }
      ]
    }
  },
  
  defaultConfig: {
    layout: 'grid',
    defaultColor: '#fef08a'
  },
  
  renderCard: (api, size: PluginSize) => React.createElement(NotesCard, { api, size }),
  renderModal: (api) => React.createElement(NotesModal, { api })
};
