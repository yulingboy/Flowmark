import type { ShortcutEntry, ShortcutSize } from '@/types';

export const TEXT_HEIGHT = 20;

export function getGridSpan(size: ShortcutSize = '1x1') {
  const [cols, rows] = size.split('x').map(Number);
  return { colSpan: cols, rowSpan: rows };
}

// 计算元素在网格中的位置
export function calculatePositions(
  order: string[],
  itemsMap: Map<string, ShortcutEntry>,
  columns: number,
  unit: number,
  gap: number
): Map<string, { x: number; y: number; width: number; height: number }> {
  const posMap = new Map<string, { x: number; y: number; width: number; height: number }>();
  
  // 使用二维数组跟踪网格占用情况
  const grid: boolean[][] = [];
  const getCell = (row: number, col: number) => grid[row]?.[col] ?? false;
  const setCell = (row: number, col: number, value: boolean) => {
    if (!grid[row]) grid[row] = [];
    grid[row][col] = value;
  };
  
  // 找到可以放置元素的位置
  const findPosition = (colSpan: number, rowSpan: number): { col: number; row: number } => {
    for (let row = 0; ; row++) {
      for (let col = 0; col <= columns - colSpan; col++) {
        let canPlace = true;
        for (let r = 0; r < rowSpan && canPlace; r++) {
          for (let c = 0; c < colSpan && canPlace; c++) {
            if (getCell(row + r, col + c)) {
              canPlace = false;
            }
          }
        }
        if (canPlace) {
          return { col, row };
        }
      }
    }
  };
  
  for (const id of order) {
    const item = itemsMap.get(id);
    if (!item) continue;
    
    const size = item.size || '1x1';
    const { colSpan, rowSpan } = getGridSpan(size);
    
    const { col, row } = findPosition(colSpan, rowSpan);
    
    // 标记占用的格子
    for (let r = 0; r < rowSpan; r++) {
      for (let c = 0; c < colSpan; c++) {
        setCell(row + r, col + c, true);
      }
    }
    
    posMap.set(id, {
      x: col * (unit + gap),
      y: row * (unit + gap + TEXT_HEIGHT),
      width: colSpan * unit + (colSpan - 1) * gap,
      height: rowSpan * unit + (rowSpan - 1) * gap + TEXT_HEIGHT,
    });
  }
  
  return posMap;
}
