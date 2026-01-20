/**
 * 快捷方式相关类型定义
 */
import type { CardSize, GridPosition, OpenMode } from './core';

// 快捷入口项目
export interface ShortcutItem {
  id: string;
  name: string;
  url: string;
  icon: string;
  size?: CardSize;
  position?: GridPosition;  // 使用网格坐标存储位置
  openMode?: OpenMode;
  /** 图标背景颜色 */
  bgColor?: string;
}

// 快捷入口文件夹
export interface ShortcutFolder {
  id: string;
  name: string;
  items: ShortcutItem[];
  isFolder: true;
  size?: CardSize;
  position?: GridPosition;  // 使用网格坐标存储位置
}

// 快捷入口条目
export type ShortcutEntry = ShortcutItem | ShortcutFolder;

// 类型守卫：判断是否为文件夹
export function isShortcutFolder(entry: unknown): entry is ShortcutFolder {
  return typeof entry === 'object' && entry !== null && 'isFolder' in entry && (entry as ShortcutFolder).isFolder === true;
}

// 类型守卫：判断是否为快捷方式项目
export function isShortcutItem(entry: unknown): entry is ShortcutItem {
  if (typeof entry !== 'object' || entry === null) return false;
  return !isShortcutFolder(entry) && !('isPlugin' in entry);
}
