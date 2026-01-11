import type { ShortcutEntry, ShortcutSize, Position } from '@/types';

export const TEXT_HEIGHT = 20;

export function getGridSpan(size: ShortcutSize = '1x1') {
  const [cols, rows] = size.split('x').map(Number);
  return { colSpan: cols, rowSpan: rows };
}

// 计算单个元素的尺寸
export function getItemSize(
  item: ShortcutEntry,
  unit: number,
  gap: number
): { width: number; height: number } {
  const size = item.size || '1x1';
  const { colSpan, rowSpan } = getGridSpan(size);
  return {
    width: colSpan * unit + (colSpan - 1) * gap,
    height: rowSpan * unit + (rowSpan - 1) * gap + TEXT_HEIGHT,
  };
}

// 获取单元格尺寸
export function getCellSize(unit: number, gap: number) {
  return {
    cellWidth: unit + gap,
    cellHeight: unit + gap + TEXT_HEIGHT,
  };
}

// 像素位置转网格坐标
export function pixelToGrid(
  x: number,
  y: number,
  unit: number,
  gap: number
): { col: number; row: number } {
  const { cellWidth, cellHeight } = getCellSize(unit, gap);
  return {
    col: Math.round(x / cellWidth),
    row: Math.round(y / cellHeight),
  };
}

// 网格坐标转像素位置
export function gridToPixel(
  col: number,
  row: number,
  unit: number,
  gap: number
): Position {
  const { cellWidth, cellHeight } = getCellSize(unit, gap);
  return {
    x: col * cellWidth,
    y: row * cellHeight,
  };
}

// 网格占用管理器
export class GridManager {
  private grid: Set<string> = new Set(); // 存储占用的格子 "col,row"
  private columns: number;
  private unit: number;
  private gap: number;

  constructor(columns: number, unit: number, gap: number) {
    this.columns = columns;
    this.unit = unit;
    this.gap = gap;
  }

  // 生成格子 key
  private cellKey(col: number, row: number): string {
    return `${col},${row}`;
  }

  // 检查位置是否可用
  canPlace(col: number, row: number, colSpan: number, rowSpan: number): boolean {
    if (col < 0 || row < 0 || col + colSpan > this.columns) return false;
    
    for (let r = 0; r < rowSpan; r++) {
      for (let c = 0; c < colSpan; c++) {
        const key = this.cellKey(col + c, row + r);
        if (this.grid.has(key)) return false;
      }
    }
    return true;
  }

  // 标记占用
  occupy(col: number, row: number, colSpan: number, rowSpan: number): void {
    for (let r = 0; r < rowSpan; r++) {
      for (let c = 0; c < colSpan; c++) {
        this.grid.add(this.cellKey(col + c, row + r));
      }
    }
  }

  // 释放占用
  release(col: number, row: number, colSpan: number, rowSpan: number): void {
    for (let r = 0; r < rowSpan; r++) {
      for (let c = 0; c < colSpan; c++) {
        this.grid.delete(this.cellKey(col + c, row + r));
      }
    }
  }

  // 找到最近的可用位置
  findNearestAvailable(
    targetCol: number,
    targetRow: number,
    colSpan: number,
    rowSpan: number
  ): { col: number; row: number } | null {
    // 先检查目标位置
    if (this.canPlace(targetCol, targetRow, colSpan, rowSpan)) {
      return { col: targetCol, row: targetRow };
    }

    // 螺旋搜索最近的可用位置
    const maxRadius = Math.max(this.columns, 20);
    for (let radius = 1; radius <= maxRadius; radius++) {
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          if (Math.abs(dx) !== radius && Math.abs(dy) !== radius) continue;
          
          const col = targetCol + dx;
          const row = targetRow + dy;
          
          if (this.canPlace(col, row, colSpan, rowSpan)) {
            return { col, row };
          }
        }
      }
    }
    
    // 找不到则返回第一个可用位置
    for (let row = 0; row < 100; row++) {
      for (let col = 0; col <= this.columns - colSpan; col++) {
        if (this.canPlace(col, row, colSpan, rowSpan)) {
          return { col, row };
        }
      }
    }
    
    return null;
  }

  // 从 items 初始化网格占用状态
  initFromItems(items: ShortcutEntry[], excludeId?: string): void {
    this.grid.clear();
    
    for (const item of items) {
      if (item.id === excludeId) continue;
      if (!item.position) continue;
      
      const { col, row } = pixelToGrid(item.position.x, item.position.y, this.unit, this.gap);
      const { colSpan, rowSpan } = getGridSpan(item.size || '1x1');
      
      this.occupy(col, row, colSpan, rowSpan);
    }
  }
}


