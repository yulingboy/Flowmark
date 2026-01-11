import type { ShortcutSize, Position, GridItem } from '@/types';

export const TEXT_HEIGHT = 20;

// 所有可用的尺寸选项
export const ALL_SIZES: ShortcutSize[] = ['1x1', '1x2', '2x1', '2x2', '2x4'];

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

export function getItemSize(item: GridItem, unit: number, gap: number): { width: number; height: number } {
  const { colSpan, rowSpan } = getGridSpan(item.size || '1x1');
  const hGap = gap + TEXT_HEIGHT;
  const vGap = gap;
  return {
    width: colSpan * unit + (colSpan - 1) * hGap,
    height: rowSpan * (unit + TEXT_HEIGHT) + (rowSpan - 1) * vGap,
  };
}

export function pixelToGrid(x: number, y: number, unit: number, gap: number): { col: number; row: number } {
  const hGap = gap + TEXT_HEIGHT;
  const cellWidth = unit + hGap;
  const cellHeight = unit + TEXT_HEIGHT + gap;
  return { col: Math.round(x / cellWidth), row: Math.round(y / cellHeight) };
}

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
  // 边界检查
  if (col < 0 || row < 0 || col + colSpan > columns || row + rowSpan > rows) {
    return false;
  }
  
  // 碰撞检查
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
 * @param targetCol 目标列
 * @param targetRow 目标行
 * @param size 卡片尺寸
 * @param gridConfig 网格配置
 * @param occupiedCells 已占用的网格单元（可选）
 * @returns 有效位置或 null
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
  
  // 搜索最近的有效位置
  const maxRadius = Math.max(columns, rows);
  for (let radius = 1; radius <= maxRadius; radius++) {
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        if (Math.abs(dx) !== radius && Math.abs(dy) !== radius) continue;
        const col = targetCol + dx;
        const row = targetRow + dy;
        if (isPositionValid(col, row, colSpan, rowSpan, columns, rows, occupiedCells)) {
          return { col, row };
        }
      }
    }
  }
  
  // 最后尝试遍历整个网格
  for (let row = 0; row <= rows - rowSpan; row++) {
    for (let col = 0; col <= columns - colSpan; col++) {
      if (isPositionValid(col, row, colSpan, rowSpan, columns, rows, occupiedCells)) {
        return { col, row };
      }
    }
  }
  
  return null;
}

export class GridManager {
  private grid = new Set<string>();
  private columns: number;
  private rows: number;
  private unit: number;
  private gap: number;

  constructor(columns: number, rows: number, unit: number, gap: number) {
    this.columns = columns;
    this.rows = rows;
    this.unit = unit;
    this.gap = gap;
  }

  private cellKey(col: number, row: number): string {
    return `${col},${row}`;
  }

  canPlace(col: number, row: number, colSpan: number, rowSpan: number): boolean {
    // 检查列边界和行边界
    if (col < 0 || row < 0 || col + colSpan > this.columns || row + rowSpan > this.rows) return false;
    for (let r = 0; r < rowSpan; r++) {
      for (let c = 0; c < colSpan; c++) {
        if (this.grid.has(this.cellKey(col + c, row + r))) return false;
      }
    }
    return true;
  }

  occupy(col: number, row: number, colSpan: number, rowSpan: number): void {
    for (let r = 0; r < rowSpan; r++) {
      for (let c = 0; c < colSpan; c++) {
        this.grid.add(this.cellKey(col + c, row + r));
      }
    }
  }

  findNearestAvailable(targetCol: number, targetRow: number, colSpan: number, rowSpan: number): { col: number; row: number } | null {
    if (this.canPlace(targetCol, targetRow, colSpan, rowSpan)) {
      return { col: targetCol, row: targetRow };
    }
    const maxRadius = Math.max(this.columns, this.rows);
    for (let radius = 1; radius <= maxRadius; radius++) {
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          if (Math.abs(dx) !== radius && Math.abs(dy) !== radius) continue;
          const col = targetCol + dx, row = targetRow + dy;
          if (this.canPlace(col, row, colSpan, rowSpan)) return { col, row };
        }
      }
    }
    // 遍历整个网格查找有效位置
    for (let row = 0; row <= this.rows - rowSpan; row++) {
      for (let col = 0; col <= this.columns - colSpan; col++) {
        if (this.canPlace(col, row, colSpan, rowSpan)) return { col, row };
      }
    }
    return null;
  }

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
   * 获取当前已占用的网格单元格集合
   * @returns 已占用单元格的集合
   */
  getOccupiedCells(): Set<string> {
    return new Set(this.grid);
  }
}
