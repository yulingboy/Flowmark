import React from 'react';
import type { Plugin, PluginSize } from '../../types';
import { FlipClockCard } from './FlipClockCard';
import { FlipClockModal } from './FlipClockModal';

export const flipClockPlugin: Plugin = {
  metadata: {
    id: 'flip-clock',
    name: '翻页时钟',
    version: '1.0.0',
    description: '经典翻页时钟，带有翻页动画效果',
    author: 'Built-in',
    icon: '🕐'
  },

  supportedSizes: ['1x1', '2x2', '2x4'],
  defaultSize: '2x2',
  modalSize: { width: 480, height: 320 },

  configSchema: {
    showSeconds: {
      type: 'boolean',
      label: '显示秒数',
      default: true,
    },
    use24Hour: {
      type: 'boolean',
      label: '24小时制',
      default: true,
    },
    showDate: {
      type: 'boolean',
      label: '显示日期',
      default: true,
    },
    showLunar: {
      type: 'boolean',
      label: '显示农历',
      default: true,
    },
  },

  defaultConfig: {
    showSeconds: true,
    use24Hour: true,
    showDate: true,
    showLunar: true,
  },

  renderCard: (_api, size: PluginSize) => React.createElement(FlipClockCard, { size }),
  renderModal: () => React.createElement(FlipClockModal),
};
