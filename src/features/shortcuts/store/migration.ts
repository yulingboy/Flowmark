/**
 * 数据迁移模块
 * 
 * 负责将旧格式（像素坐标）的位置数据迁移到新格式（网格坐标）
 * 
 * 迁移检测逻辑：
 * - 包含 `x` 和 `y` → 旧格式，需要迁移
 * - 包含 `col` 和 `row` → 新格式，无需迁移
 */

import type { GridItem, GridPosition } from '@/types';
import { pixelToGrid } from '@/utils/gridUtils';
import type { GridConfig } from '@/utils/gridUtils';

/**
 * 检测位置数据是否为旧格式（像素坐标）
 * 
 * 判断逻辑：
 * - 如果对象包含 `x` 和 `y` 属性，但不包含 `col` 和 `row` 属性，则为旧格式
 * - 其他情况（包括 null、undefined、新格式）返回 false
 * 
 * @param position 位置数据（可能是任意类型）
 * @returns 是否为旧格式（像素坐标）
 */
export function isLegacyPosition(position: unknown): boolean {
  // 检查是否为对象
  if (typeof position !== 'object' || position === null) {
    return false;
  }

  const pos = position as Record<string, unknown>;

  // 检查是否包含 x 和 y 属性（旧格式特征）
  const hasXY = 'x' in pos && 'y' in pos;
  
  // 检查是否包含 col 和 row 属性（新格式特征）
  const hasColRow = 'col' in pos && 'row' in pos;

  // 只有包含 x/y 且不包含 col/row 时才是旧格式
  return hasXY && !hasColRow;
}

/**
 * 清理数值，处理 NaN、Infinity 和负数
 * 
 * @param value 原始数值
 * @param defaultValue 默认值（当值无效时使用）
 * @returns 清理后的数值
 */
function sanitizeNumber(value: unknown, defaultValue: number = 0): number {
  if (typeof value !== 'number') {
    return defaultValue;
  }
  
  // 处理 NaN 和 Infinity
  if (!Number.isFinite(value)) {
    return defaultValue;
  }
  
  // 处理负数：clamp 到 0
  if (value < 0) {
    return 0;
  }
  
  return value;
}

/**
 * 迁移单个位置数据
 * 
 * 将像素坐标转换为网格坐标
 * 
 * @param position 旧格式位置数据 { x, y }
 * @param unit 单个网格单元的边长（像素）
 * @param gap 网格间距（像素）
 * @returns 新格式位置数据 { col, row }
 */
export function migratePosition(
  position: { x: number; y: number },
  unit: number,
  gap: number
): GridPosition {
  // 清理输入值，处理无效数据
  const x = sanitizeNumber(position.x, 0);
  const y = sanitizeNumber(position.y, 0);

  // 使用 pixelToGrid 进行坐标转换
  const gridPos = pixelToGrid(x, y, unit, gap);

  // 确保结果不为负数
  return {
    col: Math.max(0, gridPos.col),
    row: Math.max(0, gridPos.row),
  };
}

/**
 * 迁移单个项目的位置数据
 * 
 * @param item 原始项目数据
 * @param unit 单个网格单元的边长（像素）
 * @param gap 网格间距（像素）
 * @returns 迁移后的项目数据
 */
function migrateItemPosition<T extends { position?: unknown }>(
  item: T,
  unit: number,
  gap: number
): T {
  // 如果没有位置数据，返回原始项目
  if (!item.position) {
    return item;
  }

  // 如果是旧格式，进行迁移
  if (isLegacyPosition(item.position)) {
    const legacyPos = item.position as { x: number; y: number };
    const newPosition = migratePosition(legacyPos, unit, gap);
    return { ...item, position: newPosition };
  }

  // 如果已经是新格式，检查并清理数据
  if (typeof item.position === 'object' && item.position !== null) {
    const pos = item.position as Record<string, unknown>;
    if ('col' in pos && 'row' in pos) {
      // 清理可能的无效值
      const col = sanitizeNumber(pos.col, 0);
      const row = sanitizeNumber(pos.row, 0);
      return { ...item, position: { col, row } };
    }
  }

  // 无效位置数据：分配默认位置并记录警告
  console.warn('[Migration] Invalid position data detected, assigning default position (0, 0):', item.position);
  return { ...item, position: { col: 0, row: 0 } };
}

/**
 * 迁移整个快捷方式列表
 * 
 * 遍历所有项目，将旧格式位置数据迁移为新格式
 * 
 * @param shortcuts 原始快捷方式列表（可能包含旧格式数据）
 * @param gridConfig 网格配置
 * @returns 迁移后的快捷方式列表
 */
export function migrateShortcuts(
  shortcuts: unknown[],
  gridConfig: GridConfig
): GridItem[] {
  // 处理空数组
  if (!Array.isArray(shortcuts) || shortcuts.length === 0) {
    return [];
  }

  const { unit, gap } = gridConfig;

  return shortcuts.map((item, index) => {
    // 检查项目是否为有效对象
    if (typeof item !== 'object' || item === null) {
      console.warn(`[Migration] Invalid item at index ${index}, skipping:`, item);
      return null;
    }

    try {
      // 迁移项目位置
      const migratedItem = migrateItemPosition(item as { position?: unknown }, unit, gap);
      return migratedItem as GridItem;
    } catch (error) {
      console.warn(`[Migration] Failed to migrate item at index ${index}:`, error);
      // 迁移失败时，尝试保留原始数据并分配默认位置
      return { ...(item as object), position: { col: 0, row: 0 } } as unknown as GridItem;
    }
  }).filter((item): item is GridItem => item !== null);
}
