/**
 * 备份服务模块导出
 */
export { 
  exportData, 
  importData, 
  downloadBackup, 
  readBackupFile,
  getAutoBackupConfig,
  setAutoBackupConfig,
  getAutoBackups,
  startAutoBackup,
  stopAutoBackup,
  getBackupData,
  deleteBackup,
} from './backupService';
export type { BackupData, ExportResult, ImportResult, BackupConfig, BackupMetadata } from './types';
