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
  /** 是否处于批量编辑模式 */
  batchEditMode?: boolean;
  /** 是否被选中 */
  isSelected?: boolean;
  /** 是否禁用右键菜单 */
  disableContextMenu?: boolean;
}

export interface UseCardBehaviorResult {
  /** 右键菜单状态 */
  contextMenu: {
    isOpen: boolean;
    x: number;
    y: number;
  };
  /** 右键菜单处理函数 */
  handleContextMenu: (e: React.MouseEvent) => void;
  /** 关闭右键菜单 */
  closeContextMenu: () => void;
  /** 禁用的布局选项 */
  disabledLayouts: CardSize[];
  /** 批量编辑点击处理 */
  handleBatchClick: (onToggleSelect?: (id: string) => void, itemId?: string) => boolean;
  /** 卡片容器样式类名 */
  cardContainerClassName: string;
  /** 选择指示器样式类名 */
  selectionIndicatorClassName: string;
}

/**
 * Card 行为 Hook
 * 封装卡片的通用行为：右键菜单、布局计算、批量编辑、样式生成
 */
export function useCardBehavior(options: UseCardBehaviorOptions): UseCardBehaviorResult {
  const {
    size,
    gridConfig,
    position,
    batchEditMode = false,
    isSelected = false,
    disableContextMenu = false,
  } = options;

  // 使用 useContextMenu hook
  const { contextMenu, handleContextMenu: baseHandleContextMenu, closeContextMenu } = useContextMenu(disableContextMenu);

  // 计算禁用的布局选项
  const disabledLayouts = useMemo(() => {
    if (!gridConfig || !position) return [];
    const { col, row } = pixelToGrid(position.x, position.y, gridConfig.unit, gridConfig.gap);
    const validSizes = getValidSizesForPosition(col, row, gridConfig.columns, gridConfig.rows, size);
    return ALL_SIZES.filter(s => !validSizes.includes(s));
  }, [gridConfig, position, size]);

  // 右键菜单处理（批量编辑模式下禁用）
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    if (batchEditMode) {
      e.preventDefault();
      return;
    }
    baseHandleContextMenu(e);
    e.stopPropagation();
  }, [batchEditMode, baseHandleContextMenu]);

  // 批量编辑点击处理，返回是否已处理
  const handleBatchClick = useCallback((onToggleSelect?: (id: string) => void, itemId?: string): boolean => {
    if (batchEditMode && onToggleSelect && itemId) {
      onToggleSelect(itemId);
      return true;
    }
    return false;
  }, [batchEditMode]);

  // 卡片容器样式类名
  const cardContainerClassName = useMemo(() => {
    const baseClass = 'w-full flex-1 rounded-2xl overflow-hidden bg-white shadow-lg group-hover:scale-105 transition-transform relative';
    const selectedClass = batchEditMode && isSelected ? 'ring-2 ring-blue-500' : '';
    return `${baseClass} ${selectedClass}`.trim();
  }, [batchEditMode, isSelected]);

  // 选择指示器样式类名
  const selectionIndicatorClassName = useMemo(() => {
    const baseClass = 'absolute top-1 left-1 w-5 h-5 rounded-full border-2 flex items-center justify-center z-10';
    const selectedClass = isSelected ? 'bg-blue-500 border-blue-500' : 'bg-white/80 border-gray-300';
    return `${baseClass} ${selectedClass}`;
  }, [isSelected]);

  return {
    contextMenu,
    handleContextMenu,
    closeContextMenu,
    disabledLayouts,
    handleBatchClick,
    cardContainerClassName,
    selectionIndicatorClassName,
  };
}
