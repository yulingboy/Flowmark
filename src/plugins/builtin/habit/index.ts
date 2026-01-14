import React from 'react';
import type { Plugin, PluginSize } from '@/types';
import { HabitCard } from './HabitCard';
import { HabitModal } from './HabitModal';

export const habitPlugin: Plugin = {
  metadata: {
    id: 'habit',
    name: '习惯养成',
    version: '1.0.0',
    description: '追踪每日习惯，养成好习惯',
    author: 'Built-in',
    icon: '✅'
  },

  supportedSizes: ['1x1', '2x2', '2x4'],
  defaultSize: '2x2',
  modalSize: { width: 400, height: 520 },

  configSchema: {
    showStreak: {
      type: 'boolean',
      label: '显示连续天数',
      default: true,
    },
  },

  defaultConfig: {
    showStreak: true,
  },

  renderCard: (size: PluginSize) => React.createElement(HabitCard, { size }),
  renderModal: () => React.createElement(HabitModal),
};
