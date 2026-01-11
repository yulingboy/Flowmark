import type { ShortcutSize, Position, GridItem } from '@/types';

export const TEXT_HEIGHT = 20;

export function getGridSpan(size: ShortcutSize = '1x1') {
  const [cols, rows] = size.split('x').map(Number);
  return { colSpan: cols, rowSpan: rows };
}

export function getItemSize(item: GridItem, unit: number, gap: number): { width: number; height: number } {
  const { colSpan, rowSpan } = getGridSpan(item.size || '1x1');
  return {
    width: colSpan * unit + (colSpan - 1) * gap,
    height: rowSpan * unit + (rowSpan - 1) * gap + TEXT_HEIGHT,
  };
}

export function pixelToGrid(x: number, y: number, unit: number, gap: number): { col: number; row: number } {
  const cellWidth = unit + gap;
  const cellHeight = unit + gap + TEXT_HEIGHT;
  return { col: Math.round(x / cellWidth), row: Math.round(y / cellHeight) };
}

export function gridToPixel(col: number, row: number, unit: number, gap: number): Position {
  const cellWidth = unit + gap;
  const cellHeight = unit + gap + TEXT_HEIGHT;
  return { x: col * cellWidth, y: row * cellHeight };
}

export class GridManager {
  private grid = new Set<string>();
  private columns: number;
  private unit: number;
  private gap: number;

  constructor(columns: number, unit: number, gap: number) {
    this.columns = columns;
    this.unit = unit;
    this.gap = gap;
  }

  private cellKey(col: number, row: number): string {
    return `${col},${row}`;
  }

  canPlace(col: number, row: number, colSpan: number, rowSpan: number): boolean {
    if (col < 0 || row < 0 || col + colSpan > this.columns) return false;
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
    const maxRadius = Math.max(this.columns, 20);
    for (let radius = 1; radius <= maxRadius; radius++) {
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          if (Math.abs(dx) !== radius && Math.abs(dy) !== radius) continue;
          const col = targetCol + dx, row = targetRow + dy;
          if (this.canPlace(col, row, colSpan, rowSpan)) return { col, row };
        }
      }
    }
    for (let row = 0; row < 100; row++) {
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
}
