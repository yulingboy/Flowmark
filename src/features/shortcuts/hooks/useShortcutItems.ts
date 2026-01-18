import { useState, useEffect, useMemo } from 'react';
import { GridManager, gridToPixel, getGridSpan } from '@/utils/gridUtils';
import type { GridItem, GridPosition, PixelPosition } from '@/types';

interface UseShortcutItemsOptions {
  shortcuts: GridItem[];
  columns: number;
  rows: number;
  unit: number;
  gap: number;
}

/**
 * 带有渲染位置的网格项目
 * 
 * 扩展 GridItem，添加 _renderPosition 用于渲染
 * - position: GridPosition（用于存储，col/row 格式）
 * - _renderPosition: PixelPosition（用于渲染，x/y 格式）
 */
export type GridItemWithRenderPosition = GridItem & {
  _renderPosition: PixelPosition;
};

/**
 * 检查位置对象是否为 GridPosition 格式
 * GridPosition 包含 col 和 row 属性
 */
function isGridPosition(position: unknown): position is GridPosition {
  return (
    typeof position === 'object' &&
    position !== null &&
    'col' in position &&
    'row' in position &&
    typeof (position as GridPosition).col === 'number' &&
    typeof (position as GridPosition).row === 'number'
  );
}

/**
 * 管理快捷方式卡片的位置分配
 * 
 * 主要功能：
 * - 为没有位置的卡片分配初始位置
 * - 处理位置冲突（多个卡片占用同一位置）
 * - 区分边界溢出和卡片冲突两种情况
 * - 将 GridPosition 转换为 PixelPosition 用于渲染
 * 
 * 位置分配策略：
 * 1. 有位置的卡片：优先使用原位置（position 现在是 GridPosition）
 * 2. 位置冲突时：查找最近的可用位置
 * 3. 边界溢出时：保持原位置不变（让用户手动调整）
 * 4. 无位置的卡片：从 (0,0) 开始查找可用位置
 * 
 * 返回的 items 包含：
 * - position: GridPosition（用于存储）
 * - _renderPosition: PixelPosition（用于渲染）
 */
export function useShortcutItems({ shortcuts, columns, rows, unit, gap }: UseShortcutItemsOptions) {
  // 使用 useMemo 计算 items，避免 useEffect 中的 setState
  const items = useMemo(() => {
    const manager = new GridManager(columns, rows, unit, gap);
    return shortcuts.map((item): GridItemWithRenderPosition => {
      if (item.position && isGridPosition(item.position)) {
        // position 现在是 GridPosition，直接使用 col 和 row
        const { col, row } = item.position;
        const { colSpan, rowSpan } = getGridSpan(item.size || '1x1');
        
        // 如果当前位置可以放置，使用当前位置
        if (manager.canPlace(col, row, colSpan, rowSpan)) {
          manager.occupy(col, row, colSpan, rowSpan);
          const pixelPos = gridToPixel(col, row, unit, gap);
          return { ...item, position: { col, row }, _renderPosition: pixelPos };
        }
        
        // 检查是否是因为超出边界导致无法放置
        const isOutOfBounds = col < 0 || row < 0 || col + colSpan > columns || row + rowSpan > rows;
        if (isOutOfBounds) {
          // 超出边界的卡片保持原位置，但不占用网格
          // 这样用户可以看到问题并手动调整
          const pixelPos = gridToPixel(col, row, unit, gap);
          return { ...item, position: { col, row }, _renderPosition: pixelPos };
        }
        
        // 与其他卡片冲突，尝试查找最近的可用位置
        const newPos = manager.findNearestAvailable(col, row, colSpan, rowSpan);
        if (newPos) {
          manager.occupy(newPos.col, newPos.row, colSpan, rowSpan);
          const pixelPos = gridToPixel(newPos.col, newPos.row, unit, gap);
          return { ...item, position: newPos, _renderPosition: pixelPos };
        }
        
        // 找不到新位置，保持原位置（可能会重叠）
        const pixelPos = gridToPixel(col, row, unit, gap);
        return { ...item, position: { col, row }, _renderPosition: pixelPos };
      }
      
      // 没有位置的卡片，从 (0,0) 开始查找可用位置
      const { colSpan, rowSpan } = getGridSpan(item.size || '1x1');
      const pos = manager.findNearestAvailable(0, 0, colSpan, rowSpan) || { col: 0, row: 0 };
      manager.occupy(pos.col, pos.row, colSpan, rowSpan);
      const pixelPos = gridToPixel(pos.col, pos.row, unit, gap);
      return { ...item, position: pos, _renderPosition: pixelPos };
    });
  }, [shortcuts, columns, rows, unit, gap]);

  const [itemsState, setItems] = useState<GridItemWithRenderPosition[]>(items);

  // 当 items 变化时更新 state
  useEffect(() => {
    setItems(items);
  }, [items]);

  // 构建 ID -> 卡片 的映射，方便快速查找
  const itemsMap = new Map<string, GridItemWithRenderPosition>();
  itemsState.forEach(item => itemsMap.set(item.id, item));

  return { items: itemsState, setItems, itemsMap };
}
