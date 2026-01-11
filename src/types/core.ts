/**
 * 核心共享类型定义
 * 这些类型被多个功能模块共享使用
 */

// 卡片尺寸类型：1x1, 1x2, 2x1, 2x2, 2x4
export type CardSize = '1x1' | '1x2' | '2x1' | '2x2' | '2x4';

// 打开方式：新标签页 或 弹窗
export type OpenMode = 'tab' | 'popup';

// 位置信息
export interface Position {
  x: number;
  y: number;
}

// 搜索引擎类型
export type SearchEngine = 'bing' | 'google' | 'baidu';

// 时钟数据
export interface ClockData {
  time: string;
  date: string;
  weekday: string;
  lunar: string;
}
