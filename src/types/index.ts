// 卡片尺寸类型：1x1, 1x2, 2x1, 2x2, 2x4
export type ShortcutSize = '1x1' | '1x2' | '2x1' | '2x2' | '2x4';
export type CardSize = ShortcutSize;

// 打开方式：新标签页 或 弹窗
export type OpenMode = 'tab' | 'popup';

// 位置信息
export interface Position {
  x: number;
  y: number;
}

// 快捷入口项目
export interface ShortcutItem {
  id: string;
  name: string;
  url: string;
  icon: string;
  size?: ShortcutSize;
  position?: Position;
  openMode?: OpenMode;
}

// 快捷入口文件夹
export interface ShortcutFolder {
  id: string;
  name: string;
  items: ShortcutItem[];
  isFolder: true;
  size?: ShortcutSize;
  position?: Position;
}

// 快捷入口条目
export type ShortcutEntry = ShortcutItem | ShortcutFolder;

// 从插件系统导入类型
import type { PluginCardItem } from '@/plugins';
export type { PluginCardItem };

// 网格项目
export type GridItem = ShortcutEntry | PluginCardItem;

// 类型守卫
export function isShortcutFolder(entry: GridItem): entry is ShortcutFolder {
  return 'isFolder' in entry && entry.isFolder === true;
}

export { isPluginCard } from '@/plugins';

export function isShortcutItem(entry: GridItem): entry is ShortcutItem {
  return !isShortcutFolder(entry) && !('isPlugin' in entry);
}

// 时钟数据
export interface ClockData {
  time: string;
  date: string;
  weekday: string;
  lunar: string;
}

// 搜索引擎类型
export type SearchEngine = 'bing' | 'google' | 'baidu';
