import { useState, useEffect } from 'react';
import { GridManager, pixelToGrid, gridToPixel, getGridSpan } from '../utils/gridUtils';
import type { GridItem } from '@/types';

interface UseShortcutItemsOptions {
  shortcuts: GridItem[];
  columns: number;
  unit: number;
  gap: number;
}

export function useShortcutItems({ shortcuts, columns, unit, gap }: UseShortcutItemsOptions) {
  const [items, setItems] = useState<GridItem[]>(shortcuts);

  useEffect(() => {
    const manager = new GridManager(columns, unit, gap);
    const itemsWithPositions = shortcuts.map((item) => {
      if (item.position) {
        const { col, row } = pixelToGrid(item.position.x, item.position.y, unit, gap);
        const { colSpan, rowSpan } = getGridSpan(item.size || '1x1');
        const finalPos = manager.canPlace(col, row, colSpan, rowSpan)
          ? { col, row }
          : manager.findNearestAvailable(col, row, colSpan, rowSpan) || { col: 0, row: 0 };
        manager.occupy(finalPos.col, finalPos.row, colSpan, rowSpan);
        return { ...item, position: gridToPixel(finalPos.col, finalPos.row, unit, gap) };
      }
      const { colSpan, rowSpan } = getGridSpan(item.size || '1x1');
      const pos = manager.findNearestAvailable(0, 0, colSpan, rowSpan) || { col: 0, row: 0 };
      manager.occupy(pos.col, pos.row, colSpan, rowSpan);
      return { ...item, position: gridToPixel(pos.col, pos.row, unit, gap) };
    });
    setItems(itemsWithPositions);
  }, [shortcuts, columns, unit, gap]);

  const itemsMap = new Map<string, GridItem>();
  items.forEach(item => itemsMap.set(item.id, item));

  return { items, setItems, itemsMap };
}
