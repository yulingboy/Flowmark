/**
 * 全局常量模块
 */

// 网格布局常量
export const GRID = {
  COLUMNS: 12,
  ROWS: 4,
  UNIT: 72,
  GAP: 20,
} as const;

// 搜索配置常量
export const SEARCH = {
  MAX_HISTORY_ITEMS: 10,
} as const;

// 默认设置常量
export const DEFAULTS = {
  BACKGROUND_URL: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
  BACKGROUND_BLUR: 0,
  BACKGROUND_OVERLAY: 20,
  SEARCH_ENGINE: 'bing' as const,
  CLOCK_FONT_SIZE: 'large' as const,
  CLOCK_COLOR: '#ffffff',
  LANGUAGE: 'zh-CN' as const,
} as const;

// 预设壁纸列表
export const PRESET_WALLPAPERS = [
  { id: '1', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80', name: '山峰' },
  { id: '2', url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920&q=80', name: '森林' },
  { id: '3', url: 'https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=1920&q=80', name: '海洋' },
  { id: '4', url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920&q=80', name: '雪山' },
  { id: '5', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80', name: '峡谷' },
  { id: '6', url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1920&q=80', name: '湖泊' },
  { id: '7', url: 'https://images.unsplash.com/photo-1518173946687-a4c036bc3c95?w=1920&q=80', name: '极光' },
  { id: '8', url: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=1920&q=80', name: '日落' },
] as const;
