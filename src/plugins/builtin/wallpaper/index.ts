import React from 'react';
import type { Plugin, PluginSize } from '../../types';
import { WallpaperCard } from './WallpaperCard';
import { WallpaperModal } from './WallpaperModal';

export const wallpaperPlugin: Plugin = {
  metadata: {
    id: 'wallpaper',
    name: '壁纸中心',
    version: '1.0.0',
    description: '浏览和切换桌面壁纸',
    author: 'Built-in',
    icon: 'image'
  },
  
  supportedSizes: ['1x1', '2x2'],
  defaultSize: '1x1',
  
  modalSize: { width: 760, height: 560 },
  
  renderCard: (_api, size: PluginSize) => React.createElement(WallpaperCard, { size }),
  renderModal: () => React.createElement(WallpaperModal)
};
