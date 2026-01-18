/**
 * 核心共享类型定义
 * 这些类型被多个功能模块共享使用
 */

// 卡片尺寸类型：1x1, 1x2, 2x1, 2x2, 2x4
export type CardSize = '1x1' | '1x2' | '2x1' | '2x2' | '2x4';

// 打开方式：新标签页 或 弹窗
export type OpenMode = 'tab' | 'popup';

// 网格坐标（用于存储）
export interface GridPosition {
  col: number;
  row: number;
}

// 像素坐标（用于渲染，保留用于组件内部）
export interface PixelPosition {
  x: number;
  y: number;
}

// 保持 Position 别名以兼容现有代码
export type Position = PixelPosition;

// 搜索引擎类型
export type SearchEngine = 'bing' | 'google' | 'baidu';

// 时钟数据
export interface ClockData {
  time: string;
  date: string;
  weekday: string;
  lunar: string;
}
