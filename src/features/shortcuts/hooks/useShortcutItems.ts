import { useState, useEffect } from 'react';
import { GridManager, pixelToGrid, gridToPixel, getGridSpan } from '../utils/gridUtils';
import type { GridItem } from '@/types';

interface UseShortcutItemsOptions {
  shortcuts: GridItem[];
  columns: number;
  rows: number;
  unit: number;
  gap: number;
}

export function useShortcutItems({ shortcuts, columns, rows, unit, gap }: UseShortcutItemsOptions) {
  const [items, setItems] = useState<GridItem[]>(shortcuts);

  useEffect(() => {
    const manager = new GridManager(columns, rows, unit, gap);
    const itemsWithPositions = shortcuts.map((item) => {
      if (item.position) {
        const { col, row } = pixelToGrid(item.position.x, item.position.y, unit, gap);
        const { colSpan, rowSpan } = getGridSpan(item.size || '1x1');
        
        // 如果当前位置可以放置，使用当前位置
        if (manager.canPlace(col, row, colSpan, rowSpan)) {
          manager.occupy(col, row, colSpan, rowSpan);
          return { ...item, position: gridToPixel(col, row, unit, gap) };
        }
        
        // 如果当前位置不能放置（可能是因为与其他卡片冲突），尝试找新位置
        // 但如果是因为超出边界，保持原位置不变（不占用网格）
        const isOutOfBounds = col < 0 || row < 0 || col + colSpan > columns || row + rowSpan > rows;
        if (isOutOfBounds) {
          // 超出边界的卡片保持原位置，但不占用网格（让用户手动调整）
          return { ...item, position: gridToPixel(col, row, unit, gap) };
        }
        
        // 与其他卡片冲突，尝试找新位置
        const newPos = manager.findNearestAvailable(col, row, colSpan, rowSpan);
        if (newPos) {
          manager.occupy(newPos.col, newPos.row, colSpan, rowSpan);
          return { ...item, position: gridToPixel(newPos.col, newPos.row, unit, gap) };
        }
        
        // 找不到新位置，保持原位置
        return { ...item, position: gridToPixel(col, row, unit, gap) };
      }
      
      // 没有位置的卡片，分配新位置
      const { colSpan, rowSpan } = getGridSpan(item.size || '1x1');
      const pos = manager.findNearestAvailable(0, 0, colSpan, rowSpan) || { col: 0, row: 0 };
      manager.occupy(pos.col, pos.row, colSpan, rowSpan);
      return { ...item, position: gridToPixel(pos.col, pos.row, unit, gap) };
    });
    setItems(itemsWithPositions);
  }, [shortcuts, columns, rows, unit, gap]);

  const itemsMap = new Map<string, GridItem>();
  items.forEach(item => itemsMap.set(item.id, item));

  return { items, setItems, itemsMap };
}
