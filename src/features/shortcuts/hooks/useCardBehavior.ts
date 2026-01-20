import { useMemo, useCallback } from 'react';
import { useContextMenu } from '@/hooks/useContextMenu';
import { pixelToGrid, getValidSizesForPosition, ALL_SIZES } from '@/utils/gridUtils';
import type { Position, CardSize } from '@/types';

interface GridConfig {
  columns: number;
  rows: number;
  unit: number;
  gap: number;
}

export interface UseCardBehaviorOptions {
  /** 当前卡片尺寸 */
  size: CardSize;
  /** 网格配置 */
  gridConfig?: GridConfig;
  /** 卡片位置 */
  position?: Position;
  /** 是否禁用右键菜单 */
  disableContextMenu?: boolean;
}

export interface UseCardBehaviorResult {
  /** 右键菜单状态 */
  contextMenu: { isOpen: boolean; x: number; y: number };
  /** 右键菜单处理函数 */
  handleContextMenu: (e: React.MouseEvent) => void;
  /** 关闭右键菜单 */
  closeContextMenu: () => void;
  /** 禁用的布局选项 */
  disabledLayouts: CardSize[];
  /** 卡片容器样式类名 */
  cardContainerClassName: string;
}

/**
 * Card 行为 Hook
 * 封装卡片的通用行为：右键菜单、布局计算、样式生成
 */
export function useCardBehavior(options: UseCardBehaviorOptions): UseCardBehaviorResult {
  const { size, gridConfig, position, disableContextMenu = false } = options;

  const { contextMenu, handleContextMenu: baseHandleContextMenu, closeContextMenu } = useContextMenu(disableContextMenu);

  // 计算禁用的布局选项
  const disabledLayouts = useMemo(() => {
    if (!gridConfig || !position) return [];
    const { col, row } = pixelToGrid(position.x, position.y, gridConfig.unit, gridConfig.gap);
    const validSizes = getValidSizesForPosition(col, row, gridConfig.columns, gridConfig.rows, size);
    return ALL_SIZES.filter(s => !validSizes.includes(s));
  }, [gridConfig, position, size]);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    baseHandleContextMenu(e);
    e.stopPropagation();
  }, [baseHandleContextMenu]);

  const cardContainerClassName = 'w-full flex-1 rounded-2xl overflow-hidden bg-white shadow-lg group-hover:scale-105 transition-transform relative';

  return {
    contextMenu,
    handleContextMenu,
    closeContextMenu,
    disabledLayouts,
    cardContainerClassName,
  };
}
