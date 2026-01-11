import { useState, useEffect, useMemo } from 'react';
import { GridManager, pixelToGrid, gridToPixel, getGridSpan } from '../utils/gridUtils';
import type { GridItem } from '@/types';

interface UseShortcutItemsOptions {
  shortcuts: GridItem[];
  columns: number;
  rows: number;
  unit: number;
  gap: number;
}

/**
 * 管理快捷方式卡片的位置分配
 * 
 * 主要功能：
 * - 为没有位置的卡片分配初始位置
 * - 处理位置冲突（多个卡片占用同一位置）
 * - 区分边界溢出和卡片冲突两种情况
 * 
 * 位置分配策略：
 * 1. 有位置的卡片：优先使用原位置
 * 2. 位置冲突时：查找最近的可用位置
 * 3. 边界溢出时：保持原位置不变（让用户手动调整）
 * 4. 无位置的卡片：从 (0,0) 开始查找可用位置
 */
export function useShortcutItems({ shortcuts, columns, rows, unit, gap }: UseShortcutItemsOptions) {
  // 使用 useMemo 计算 items，避免 useEffect 中的 setState
  const items = useMemo(() => {
    const manager = new GridManager(columns, rows, unit, gap);
    return shortcuts.map((item) => {
      if (item.position) {
        const { col, row } = pixelToGrid(item.position.x, item.position.y, unit, gap);
        const { colSpan, rowSpan } = getGridSpan(item.size || '1x1');
        
        // 如果当前位置可以放置，使用当前位置
        if (manager.canPlace(col, row, colSpan, rowSpan)) {
          manager.occupy(col, row, colSpan, rowSpan);
          return { ...item, position: gridToPixel(col, row, unit, gap) };
        }
        
        // 检查是否是因为超出边界导致无法放置
        const isOutOfBounds = col < 0 || row < 0 || col + colSpan > columns || row + rowSpan > rows;
        if (isOutOfBounds) {
          // 超出边界的卡片保持原位置，但不占用网格
          // 这样用户可以看到问题并手动调整
          return { ...item, position: gridToPixel(col, row, unit, gap) };
        }
        
        // 与其他卡片冲突，尝试查找最近的可用位置
        const newPos = manager.findNearestAvailable(col, row, colSpan, rowSpan);
        if (newPos) {
          manager.occupy(newPos.col, newPos.row, colSpan, rowSpan);
          return { ...item, position: gridToPixel(newPos.col, newPos.row, unit, gap) };
        }
        
        // 找不到新位置，保持原位置（可能会重叠）
        return { ...item, position: gridToPixel(col, row, unit, gap) };
      }
      
      // 没有位置的卡片，从 (0,0) 开始查找可用位置
      const { colSpan, rowSpan } = getGridSpan(item.size || '1x1');
      const pos = manager.findNearestAvailable(0, 0, colSpan, rowSpan) || { col: 0, row: 0 };
      manager.occupy(pos.col, pos.row, colSpan, rowSpan);
      return { ...item, position: gridToPixel(pos.col, pos.row, unit, gap) };
    });
  }, [shortcuts, columns, rows, unit, gap]);

  const [itemsState, setItems] = useState<GridItem[]>(items);

  // 当 items 变化时更新 state
  useEffect(() => {
    setItems(items);
  }, [items]);

  // 构建 ID -> 卡片 的映射，方便快速查找
  const itemsMap = new Map<string, GridItem>();
  itemsState.forEach(item => itemsMap.set(item.id, item));

  return { items: itemsState, setItems, itemsMap };
}
