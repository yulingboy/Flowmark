import React from 'react';
import type { Plugin, PluginSize } from '@/types';
import { NotesCard } from './NotesCard';
import { NotesModal } from './NotesModal';

export const notesPlugin: Plugin = {
  metadata: {
    id: 'notes',
    name: '记事本',
    version: '1.1.0',
    description: '您可以使用记事本来记录您的想法或者记录一些您的生活点滴',
    author: 'Built-in',
    icon: '📝'
  },
  
  supportedSizes: ['1x1', '2x2', '2x4'],
  defaultSize: '2x2',
  
  modalSize: { width: 960, height: 640 },
  
  renderCard: (size: PluginSize) => React.createElement(NotesCard, { size }),
  renderModal: () => React.createElement(NotesModal)
};
