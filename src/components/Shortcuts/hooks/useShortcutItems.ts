import { useState, useEffect, useRef } from 'react';
import { GridManager, pixelToGrid, gridToPixel, getGridSpan } from '../utils/gridUtils';
import type { ShortcutEntry } from '@/types';

interface UseShortcutItemsOptions {
  shortcuts: ShortcutEntry[];
  columns: number;
  unit: number;
  gap: number;
}

export function useShortcutItems({ shortcuts, columns, unit, gap }: UseShortcutItemsOptions) {
  const [items, setItems] = useState<ShortcutEntry[]>(shortcuts);
  const gridManager = useRef(new GridManager(columns, unit, gap));

  // 同步外部 shortcuts 变化，为没有位置的项目分配初始网格位置
  useEffect(() => {
    const manager = new GridManager(columns, unit, gap);
    
    const itemsWithPositions = shortcuts.map((item) => {
      if (item.position) {
        // 已有位置，吸附到网格
        const { col, row } = pixelToGrid(item.position.x, item.position.y, unit, gap);
        const { colSpan, rowSpan } = getGridSpan(item.size || '1x1');
        
        // 检查是否可用，不可用则找最近的
        const finalPos = manager.canPlace(col, row, colSpan, rowSpan)
          ? { col, row }
          : manager.findNearestAvailable(col, row, colSpan, rowSpan) || { col: 0, row: 0 };
        
        manager.occupy(finalPos.col, finalPos.row, colSpan, rowSpan);
        
        return {
          ...item,
          position: gridToPixel(finalPos.col, finalPos.row, unit, gap),
        };
      }
      
      // 没有位置，找第一个可用位置
      const { colSpan, rowSpan } = getGridSpan(item.size || '1x1');
      const pos = manager.findNearestAvailable(0, 0, colSpan, rowSpan) || { col: 0, row: 0 };
      manager.occupy(pos.col, pos.row, colSpan, rowSpan);
      
      return {
        ...item,
        position: gridToPixel(pos.col, pos.row, unit, gap),
      };
    });
    
    setItems(itemsWithPositions);
    gridManager.current = manager;
  }, [shortcuts, columns, unit, gap]);

  // 创建 id -> item 的映射
  const itemsMap = new Map<string, ShortcutEntry>();
  items.forEach(item => itemsMap.set(item.id, item));

  return {
    items,
    setItems,
    itemsMap,
    gridManager,
  };
}


