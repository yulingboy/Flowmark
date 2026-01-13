import type { ShortcutSize, Position, GridItem } from '@/types';

/** 卡片下方文字标签的高度（像素） */
export const TEXT_HEIGHT = 20;

/** 所有可用的尺寸选项：宽x高（以网格单元为单位） */
export const ALL_SIZES: ShortcutSize[] = ['1x1', '1x2', '2x1', '2x2', '2x4'];

/**
 * 解析尺寸字符串，获取列跨度和行跨度
 * @param size 尺寸字符串，格式为 "列x行"，如 "2x2"
 * @returns { colSpan: 列跨度, rowSpan: 行跨度 }
 * @example getGridSpan('2x4') => { colSpan: 2, rowSpan: 4 }
 */
export function getGridSpan(size: ShortcutSize = '1x1') {
  const [cols, rows] = size.split('x').map(Number);
  return { colSpan: cols, rowSpan: rows };
}

/**
 * 计算给定位置可用的尺寸选项
 */
export function getValidSizesForPosition(
  col: number,
  row: number,
  columns: number,
  rows: number,
  currentSize?: ShortcutSize
): ShortcutSize[] {
  if (columns <= 0 || rows <= 0 || col < 0 || row < 0) {
    return currentSize ? [currentSize] : [];
  }

  const validSizes: ShortcutSize[] = [];

  for (const size of ALL_SIZES) {
    const { colSpan, rowSpan } = getGridSpan(size);
    if (col + colSpan <= columns && row + rowSpan <= rows) {
      validSizes.push(size);
    }
  }

  if (currentSize && !validSizes.includes(currentSize)) {
    validSizes.push(currentSize);
  }

  return validSizes;
}

/**
 * 计算卡片的实际像素尺寸
 * @param item 网格项目
 * @param unit 单个网格单元的边长（像素）
 * @param gap 网格间距（像素）
 * @returns { width: 宽度像素, height: 高度像素 }
 * 
 * 计算逻辑：
 * - 水平方向：每个单元宽度 = unit，单元间距 = gap + TEXT_HEIGHT
 * - 垂直方向：每个单元高度 = unit + TEXT_HEIGHT，单元间距 = gap
 */
export function getItemSize(item: GridItem, unit: number, gap: number): { width: number; height: number } {
  const { colSpan, rowSpan } = getGridSpan(item.size || '1x1');
  const hGap = gap + TEXT_HEIGHT;  // 水平间距包含文字高度
  const vGap = gap;                 // 垂直间距
  return {
    width: colSpan * unit + (colSpan - 1) * hGap,
    height: rowSpan * (unit + TEXT_HEIGHT) + (rowSpan - 1) * vGap,
  };
}


/**
 * 将像素坐标转换为网格坐标
 * @param x 像素 X 坐标
 * @param y 像素 Y 坐标
 * @param unit 单个网格单元的边长（像素）
 * @param gap 网格间距（像素）
 * @returns { col: 列索引, row: 行索引 }
 */
export function pixelToGrid(x: number, y: number, unit: number, gap: number): { col: number; row: number } {
  const hGap = gap + TEXT_HEIGHT;
  const cellWidth = unit + hGap;           // 单元格宽度（含间距）
  const cellHeight = unit + TEXT_HEIGHT + gap;  // 单元格高度（含间距）
  return { col: Math.round(x / cellWidth), row: Math.round(y / cellHeight) };
}

/**
 * 将网格坐标转换为像素坐标
 * @param col 列索引
 * @param row 行索引
 * @param unit 单个网格单元的边长（像素）
 * @param gap 网格间距（像素）
 * @returns { x: 像素X坐标, y: 像素Y坐标 }
 */
export function gridToPixel(col: number, row: number, unit: number, gap: number): Position {
  const hGap = gap + TEXT_HEIGHT;
  const cellWidth = unit + hGap;
  const cellHeight = unit + TEXT_HEIGHT + gap;
  return { x: col * cellWidth, y: row * cellHeight };
}

/** 网格配置接口 */
export interface GridConfig {
  columns: number;
  rows: number;
  unit: number;
  gap: number;
}

/**
 * 检查是否可以将指定位置的卡片调整为新尺寸
 * @param position 卡片当前位置（像素坐标）
 * @param newSize 目标尺寸
 * @param gridConfig 网格配置
 * @returns 是否可以调整
 */
export function canResizeItem(
  position: Position,
  newSize: ShortcutSize,
  gridConfig: GridConfig
): boolean {
  const { col, row } = pixelToGrid(position.x, position.y, gridConfig.unit, gridConfig.gap);
  const { colSpan, rowSpan } = getGridSpan(newSize);
  
  // 检查是否超出边界
  return col >= 0 && row >= 0 && col + colSpan <= gridConfig.columns && row + rowSpan <= gridConfig.rows;
}

/**
 * 检查位置是否有效（在边界内且未被占用）
 * @param col 起始列
 * @param row 起始行
 * @param colSpan 列跨度
 * @param rowSpan 行跨度
 * @param columns 网格总列数
 * @param rows 网格总行数
 * @param occupiedCells 已占用的单元格集合（可选）
 * @returns 位置是否有效
 */
function isPositionValid(
  col: number,
  row: number,
  colSpan: number,
  rowSpan: number,
  columns: number,
  rows: number,
  occupiedCells?: Set<string>
): boolean {
  // 边界检查：确保不超出网格边界
  if (col < 0 || row < 0 || col + colSpan > columns || row + rowSpan > rows) {
    return false;
  }
  
  // 碰撞检查：确保所有需要占用的单元格都未被占用
  if (occupiedCells) {
    for (let r = 0; r < rowSpan; r++) {
      for (let c = 0; c < colSpan; c++) {
        if (occupiedCells.has(`${col + c},${row + r}`)) {
          return false;
        }
      }
    }
  }
  
  return true;
}

/**
 * 在网格边界内查找指定尺寸的有效位置
 * 
 * 搜索策略：
 * 1. 首先检查目标位置是否有效
 * 2. 以目标为中心，逐层向外扩展搜索
 * 3. 最后遍历整个网格查找任意可用位置
 * 
 * @param targetCol 目标列
 * @param targetRow 目标行
 * @param size 卡片尺寸
 * @param gridConfig 网格配置
 * @param occupiedCells 已占用的网格单元（可选）
 * @returns 有效位置 { col, row }，如果找不到则返回 null
 */
export function findValidPositionInBounds(
  targetCol: number,
  targetRow: number,
  size: ShortcutSize,
  gridConfig: GridConfig,
  occupiedCells?: Set<string>
): { col: number; row: number } | null {
  const { colSpan, rowSpan } = getGridSpan(size);
  const { columns, rows } = gridConfig;
  
  // 首先检查目标位置是否有效
  if (isPositionValid(targetCol, targetRow, colSpan, rowSpan, columns, rows, occupiedCells)) {
    return { col: targetCol, row: targetRow };
  }
  
  // 以目标为中心，逐层向外扩展搜索最近的有效位置
  const maxRadius = Math.max(columns, rows);
  for (let radius = 1; radius <= maxRadius; radius++) {
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        // 只检查当前半径的边界上的点
        if (Math.abs(dx) !== radius && Math.abs(dy) !== radius) continue;
        const col = targetCol + dx;
        const row = targetRow + dy;
        if (isPositionValid(col, row, colSpan, rowSpan, columns, rows, occupiedCells)) {
          return { col, row };
        }
      }
    }
  }
  
  // 最后遍历整个网格查找任意可用位置
  for (let row = 0; row <= rows - rowSpan; row++) {
    for (let col = 0; col <= columns - colSpan; col++) {
      if (isPositionValid(col, row, colSpan, rowSpan, columns, rows, occupiedCells)) {
        return { col, row };
      }
    }
  }
  
  return null;
}


/**
 * 网格管理器 - 用于管理网格布局中的卡片位置和碰撞检测
 * 
 * 主要功能：
 * - 跟踪已占用的网格单元格
 * - 检查指定位置是否可以放置卡片（边界检查 + 碰撞检测）
 * - 查找最近的可用位置
 */
export class GridManager {
  /** 已占用的网格单元格集合，格式为 "col,row" */
  private grid = new Set<string>();
  /** 网格列数 */
  private columns: number;
  /** 网格行数（用于边界检查） */
  private rows: number;
  /** 单个网格单元的边长（像素） */
  private unit: number;
  /** 网格间距（像素） */
  private gap: number;

  constructor(columns: number, rows: number, unit: number, gap: number) {
    this.columns = columns;
    this.rows = rows;
    this.unit = unit;
    this.gap = gap;
  }

  /** 生成单元格的唯一标识键 */
  private cellKey(col: number, row: number): string {
    return `${col},${row}`;
  }

  /**
   * 检查指定位置是否可以放置指定尺寸的卡片
   * @param col 起始列
   * @param row 起始行
   * @param colSpan 列跨度
   * @param rowSpan 行跨度
   * @returns 是否可以放置
   * 
   * 检查内容：
   * 1. 边界检查：确保不超出网格的列边界和行边界
   * 2. 碰撞检测：确保所有需要占用的单元格都未被占用
   */
  canPlace(col: number, row: number, colSpan: number, rowSpan: number): boolean {
    // 边界检查：列边界和行边界
    if (col < 0 || row < 0 || col + colSpan > this.columns || row + rowSpan > this.rows) return false;
    // 碰撞检测：检查所有需要占用的单元格
    for (let r = 0; r < rowSpan; r++) {
      for (let c = 0; c < colSpan; c++) {
        if (this.grid.has(this.cellKey(col + c, row + r))) return false;
      }
    }
    return true;
  }

  /**
   * 标记指定区域的单元格为已占用
   * @param col 起始列
   * @param row 起始行
   * @param colSpan 列跨度
   * @param rowSpan 行跨度
   */
  occupy(col: number, row: number, colSpan: number, rowSpan: number): void {
    for (let r = 0; r < rowSpan; r++) {
      for (let c = 0; c < colSpan; c++) {
        this.grid.add(this.cellKey(col + c, row + r));
      }
    }
  }

  /**
   * 查找距离目标位置最近的可用位置
   * @param targetCol 目标列
   * @param targetRow 目标行
   * @param colSpan 列跨度
   * @param rowSpan 行跨度
   * @returns 可用位置，如果找不到则返回 null
   * 
   * 搜索策略：
   * 1. 首先检查目标位置
   * 2. 然后以目标为中心，逐层向外扩展搜索（曼哈顿距离）
   * 3. 最后遍历整个网格查找任意可用位置
   */
  findNearestAvailable(targetCol: number, targetRow: number, colSpan: number, rowSpan: number): { col: number; row: number } | null {
    // 首先检查目标位置
    if (this.canPlace(targetCol, targetRow, colSpan, rowSpan)) {
      return { col: targetCol, row: targetRow };
    }
    // 以目标为中心，逐层向外扩展搜索
    const maxRadius = Math.max(this.columns, this.rows);
    for (let radius = 1; radius <= maxRadius; radius++) {
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          // 只检查当前半径的边界上的点
          if (Math.abs(dx) !== radius && Math.abs(dy) !== radius) continue;
          const col = targetCol + dx, row = targetRow + dy;
          if (this.canPlace(col, row, colSpan, rowSpan)) return { col, row };
        }
      }
    }
    // 遍历整个网格查找任意可用位置
    for (let row = 0; row <= this.rows - rowSpan; row++) {
      for (let col = 0; col <= this.columns - colSpan; col++) {
        if (this.canPlace(col, row, colSpan, rowSpan)) return { col, row };
      }
    }
    return null;
  }

  /**
   * 从现有卡片列表初始化网格占用状态
   * @param items 卡片列表
   * @param excludeId 要排除的卡片 ID（用于拖拽时排除自身）
   */
  initFromItems(items: GridItem[], excludeId?: string): void {
    this.grid.clear();
    for (const item of items) {
      if (item.id === excludeId || !item.position) continue;
      const { col, row } = pixelToGrid(item.position.x, item.position.y, this.unit, this.gap);
      const { colSpan, rowSpan } = getGridSpan(item.size || '1x1');
      this.occupy(col, row, colSpan, rowSpan);
    }
  }

  /**
   * 获取当前已占用的网格单元格集合（副本）
   * @returns 已占用单元格的集合，格式为 "col,row"
   */
  getOccupiedCells(): Set<string> {
    return new Set(this.grid);
  }
}
