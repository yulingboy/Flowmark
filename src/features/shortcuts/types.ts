/**
 * 快捷方式模块类型定义
 */

/** 网格配置 */
export interface GridConfig {
  columns: number;
  rows: number;
  unit: number;
  gap: number;
}

/** 验证结果 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/** 快捷方式数量限制 */
export const SHORTCUTS_LIMIT = 100;
