import React from 'react';
import type { Plugin, PluginSize } from '@/types';
import { CalendarCard } from './CalendarCard';
import { CalendarModal } from './CalendarModal';

export const calendarPlugin: Plugin = {
  metadata: {
    id: 'calendar',
    name: '万年历',
    version: '1.0.0',
    description: '显示公历农历、节气、节日、宜忌等信息',
    author: 'Built-in',
    icon: '📅'
  },
  
  supportedSizes: ['1x1', '2x2', '2x4'],
  defaultSize: '2x2',
  
  modalSize: { width: 680, height: 520 },
  
  configSchema: {
    showLunar: {
      type: 'boolean',
      label: '显示农历',
      default: true
    },
    showSolarTerm: {
      type: 'boolean',
      label: '显示节气',
      default: true
    },
    showFestival: {
      type: 'boolean',
      label: '显示节日',
      default: true
    }
  },
  
  defaultConfig: {
    showLunar: true,
    showSolarTerm: true,
    showFestival: true
  },
  
  renderCard: (size: PluginSize) => React.createElement(CalendarCard, { size }),
  renderModal: () => React.createElement(CalendarModal)
};
