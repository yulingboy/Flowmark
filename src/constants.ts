/**
 * 全局常量模块
 * 集中管理应用中的魔法数字和配置值
 */

// 网格布局常量
export const GRID = {
  COLUMNS: 12,
  ROWS: 4,
  UNIT: 72,
  GAP: 20,
} as const;

// Z-Index 层级常量
export const Z_INDEX = {
  BACKGROUND: 0,
  CONTENT: 10,
  SHORTCUTS: 20,
  CONTEXT_MENU: 50,
  MODAL: 100,
  IFRAME_MODAL: 100,
  TOAST: 200,
} as const;

// 动画时长常量 (毫秒)
export const ANIMATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;

// 搜索配置常量
export const SEARCH = {
  MAX_HISTORY_ITEMS: 10,
} as const;

// Toast 配置常量
export const TOAST = {
  DURATION: 3000,
  MAX_VISIBLE: 5,
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

// 错误消息模板
export const ERROR_MESSAGES = {
  SHORTCUT_ADD_FAILED: '添加快捷方式失败',
  SHORTCUT_DELETE_FAILED: '删除快捷方式失败',
  WALLPAPER_LOAD_FAILED: '壁纸加载失败',
  SETTINGS_SAVE_FAILED: '设置保存失败',
} as const;

// 成功消息模板
export const SUCCESS_MESSAGES = {
  SHORTCUT_ADDED: '快捷方式已添加',
  SHORTCUT_DELETED: '快捷方式已删除',
  SHORTCUT_UPDATED: '快捷方式已更新',
  SETTINGS_SAVED: '设置已保存',
  WALLPAPER_CHANGED: '壁纸已更换',
} as const;
