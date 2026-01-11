// 快捷方式尺寸类型：1x1, 1x2, 2x1, 2x2, 2x4
export type ShortcutSize = '1x1' | '1x2' | '2x1' | '2x2' | '2x4';

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
  size?: ShortcutSize; // 默认 1x1
  position?: Position; // 自由定位
  openMode?: OpenMode; // 打开方式，默认 tab
}

// 快捷入口文件夹
export interface ShortcutFolder {
  id: string;
  name: string;
  items: ShortcutItem[];
  isFolder: true;
  size?: ShortcutSize; // 默认 1x1
  position?: Position; // 自由定位
}

// 快捷入口条目（卡片或文件夹）
export type ShortcutEntry = ShortcutItem | ShortcutFolder;

// 类型守卫：判断是否为文件夹
export function isShortcutFolder(entry: ShortcutEntry): entry is ShortcutFolder {
  return 'isFolder' in entry && entry.isFolder === true;
}

// 时钟数据
export interface ClockData {
  time: string;      // HH:MM:SS
  date: string;      // MM月DD日
  weekday: string;   // 星期X
  lunar: string;     // 农历日期
}

// 搜索引擎类型
export type SearchEngine = 'bing' | 'google' | 'baidu';
