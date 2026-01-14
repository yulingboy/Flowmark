/**
 * 备份服务类型定义
 */
import type { GridItem } from '@/types';

/** 备份数据结构 */
export interface BackupData {
  /** 数据版本号 */
  version: string;
  /** 备份时间戳 */
  timestamp: number;
  /** 快捷方式数据 */
  shortcuts: GridItem[];
  /** 设置数据 */
  settings: {
    general: Record<string, unknown>;
    clock: Record<string, unknown>;
    search: Record<string, unknown>;
    background: Record<string, unknown>;
  };
  /** 插件数据 */
  plugins: {
    configs: Record<string, Record<string, unknown>>;
    data: Record<string, Record<string, unknown>>;
  };
}

/** 导入结果 */
export interface ImportResult {
  success: boolean;
  error?: string;
  migratedFrom?: string;
}

/** 导出结果 */
export interface ExportResult {
  success: boolean;
  data?: BackupData;
  error?: string;
}

/** 备份配置 */
export interface BackupConfig {
  /** 是否启用自动备份 */
  autoBackupEnabled: boolean;
  /** 自动备份间隔（毫秒） */
  autoBackupInterval: number;
  /** 最大备份数量 */
  maxBackupCount: number;
}

/** 备份元数据 */
export interface BackupMetadata {
  id: string;
  timestamp: number;
  version: string;
  size: number;
}
