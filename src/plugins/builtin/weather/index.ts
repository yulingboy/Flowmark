import React from 'react';
import type { Plugin, PluginSize } from '../../types';
import { WeatherCard } from './WeatherCard';
import { WeatherModal } from './WeatherModal';

export const weatherPlugin: Plugin = {
  metadata: {
    id: 'weather',
    name: '天气',
    version: '1.0.0',
    description: '显示当前天气信息',
    author: 'Built-in',
    icon: '🌤️'
  },
  
  supportedSizes: ['1x1', '2x2', '2x4'],
  defaultSize: '2x2',
  
  configSchema: {
    location: {
      type: 'string',
      label: '城市',
      default: 'Beijing'
    },
    unit: {
      type: 'select',
      label: '温度单位',
      default: 'celsius',
      options: [
        { label: '摄氏度 (°C)', value: 'celsius' },
        { label: '华氏度 (°F)', value: 'fahrenheit' }
      ]
    },
    updateInterval: {
      type: 'number',
      label: '更新间隔 (分钟)',
      default: 30,
      min: 5,
      max: 120
    }
  },
  
  defaultConfig: {
    location: 'Beijing',
    unit: 'celsius',
    updateInterval: 30
  },
  
  renderCard: (_api, size: PluginSize) => React.createElement(WeatherCard, { size }),
  renderModal: () => React.createElement(WeatherModal)
};
