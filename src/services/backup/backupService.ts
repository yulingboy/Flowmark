/**
 * 备份服务
 * 负责导出和导入应用数据
 */
import type { BackupData, ExportResult, ImportResult, BackupMetadata } from './types';

// 当前数据版本
const CURRENT_VERSION = '1.0.0';

// 自动备份相关常量
const AUTO_BACKUP_KEY = 'ai-nav-auto-backups';
const AUTO_BACKUP_CONFIG_KEY = 'ai-nav-auto-backup-config';
const DEFAULT_BACKUP_INTERVAL = 24 * 60 * 60 * 1000; // 24小时
const DEFAULT_MAX_BACKUPS = 5;

// 自动备份配置
interface AutoBackupConfig {
  enabled: boolean;
  interval: number;
  maxBackups: number;
  lastBackupTime: number;
}

// 自动备份定时器
let autoBackupTimer: number | null = null;

/**
 * 导出所有应用数据
 * 
 * @returns 导出结果，包含备份数据
 */
export function exportData(): ExportResult {
  try {
    // 从 localStorage 读取所有数据
    const shortcuts = localStorage.getItem('shortcuts-storage');
    const general = localStorage.getItem('newtab-general');
    const clock = localStorage.getItem('newtab-clock');
    const search = localStorage.getItem('newtab-search');
    const background = localStorage.getItem('newtab-background');
    const pluginData = localStorage.getItem('plugin-data');

    // 解析数据
    const shortcutsData = shortcuts ? JSON.parse(shortcuts) : { state: { shortcuts: [] } };
    const generalData = general ? JSON.parse(general) : { state: {} };
    const clockData = clock ? JSON.parse(clock) : { state: {} };
    const searchData = search ? JSON.parse(search) : { state: {} };
    const backgroundData = background ? JSON.parse(background) : { state: {} };
    const pluginDataParsed = pluginData ? JSON.parse(pluginData) : { state: { pluginConfigs: {}, pluginData: {} } };

    // 构建备份数据
    const backupData: BackupData = {
      version: CURRENT_VERSION,
      timestamp: Date.now(),
      shortcuts: shortcutsData.state.shortcuts || [],
      settings: {
        general: generalData.state || {},
        clock: clockData.state || {},
        search: searchData.state || {},
        background: backgroundData.state || {},
      },
      plugins: {
        configs: pluginDataParsed.state.pluginConfigs || {},
        data: pluginDataParsed.state.pluginData || {},
      },
    };

    return {
      success: true,
      data: backupData,
    };
  } catch (error) {
    console.error('导出数据失败:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * 数据版本迁移
 * 
 * @param data 旧版本数据
 * @param _fromVersion 源版本（保留用于未来迁移）
 * @param toVersion 目标版本
 * @returns 迁移后的数据
 */
function migrateData(data: BackupData, _fromVersion: string, toVersion: string): BackupData {
  let migratedData = { ...data };
  
  // 目前只有 1.0.0 版本，未来可以添加版本迁移逻辑
  // 例如：
  // if (_fromVersion === '0.9.0' && toVersion === '1.0.0') {
  //   migratedData = migrate_0_9_to_1_0(migratedData);
  // }
  
  // 更新版本号
  migratedData.version = toVersion;
  
  return migratedData;
}

/**
 * 导入备份数据
 * 
 * @param data 备份数据
 * @returns 导入结果
 */
export function importData(data: BackupData): ImportResult {
  try {
    // 验证数据结构
    if (!data || typeof data !== 'object') {
      return {
        success: false,
        error: '无效的备份数据格式',
      };
    }

    if (!data.version || !data.timestamp) {
      return {
        success: false,
        error: '备份数据缺少必要字段',
      };
    }

    // 版本迁移
    let processedData = data;
    let migratedFrom: string | undefined;
    
    if (data.version !== CURRENT_VERSION) {
      console.log(`正在迁移数据从版本 ${data.version} 到 ${CURRENT_VERSION}`);
      processedData = migrateData(data, data.version, CURRENT_VERSION);
      migratedFrom = data.version;
    }

    // 恢复快捷方式数据
    if (processedData.shortcuts) {
      const shortcutsStorage = {
        state: { shortcuts: processedData.shortcuts },
        version: 0,
      };
      localStorage.setItem('shortcuts-storage', JSON.stringify(shortcutsStorage));
    }

    // 恢复设置数据
    if (processedData.settings) {
      if (processedData.settings.general) {
        const generalStorage = {
          state: processedData.settings.general,
          version: 0,
        };
        localStorage.setItem('newtab-general', JSON.stringify(generalStorage));
      }

      if (processedData.settings.clock) {
        const clockStorage = {
          state: processedData.settings.clock,
          version: 0,
        };
        localStorage.setItem('newtab-clock', JSON.stringify(clockStorage));
      }

      if (processedData.settings.search) {
        const searchStorage = {
          state: processedData.settings.search,
          version: 0,
        };
        localStorage.setItem('newtab-search', JSON.stringify(searchStorage));
      }

      if (processedData.settings.background) {
        const backgroundStorage = {
          state: processedData.settings.background,
          version: 0,
        };
        localStorage.setItem('newtab-background', JSON.stringify(backgroundStorage));
      }
    }

    // 恢复插件数据
    if (processedData.plugins) {
      const pluginStorage = {
        state: {
          pluginConfigs: processedData.plugins.configs || {},
          pluginData: processedData.plugins.data || {},
        },
        version: 0,
      };
      localStorage.setItem('plugin-data', JSON.stringify(pluginStorage));
    }

    return {
      success: true,
      migratedFrom,
    };
  } catch (error) {
    console.error('导入数据失败:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * 下载备份文件
 * 
 * @param data 备份数据
 * @param filename 文件名（可选）
 */
export function downloadBackup(data: BackupData, filename?: string): void {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || `ai-nav-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * 从文件读取备份数据
 * 
 * @param file 文件对象
 * @returns Promise<备份数据>
 */
export function readBackupFile(file: File): Promise<BackupData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const data = JSON.parse(text) as BackupData;
        resolve(data);
      } catch (error) {
        reject(new Error('无法解析备份文件'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('读取文件失败'));
    };
    
    reader.readAsText(file);
  });
}

/**
 * 获取自动备份配置
 */
export function getAutoBackupConfig(): AutoBackupConfig {
  try {
    const config = localStorage.getItem(AUTO_BACKUP_CONFIG_KEY);
    if (config) {
      return JSON.parse(config);
    }
  } catch (error) {
    console.error('读取自动备份配置失败:', error);
  }
  
  return {
    enabled: false,
    interval: DEFAULT_BACKUP_INTERVAL,
    maxBackups: DEFAULT_MAX_BACKUPS,
    lastBackupTime: 0,
  };
}

/**
 * 设置自动备份配置
 */
export function setAutoBackupConfig(config: Partial<AutoBackupConfig>): void {
  const currentConfig = getAutoBackupConfig();
  const newConfig = { ...currentConfig, ...config };
  localStorage.setItem(AUTO_BACKUP_CONFIG_KEY, JSON.stringify(newConfig));
  
  // 重新启动自动备份
  if (newConfig.enabled) {
    startAutoBackup();
  } else {
    stopAutoBackup();
  }
}

/**
 * 获取所有自动备份
 */
export function getAutoBackups(): BackupMetadata[] {
  try {
    const backups = localStorage.getItem(AUTO_BACKUP_KEY);
    if (backups) {
      return JSON.parse(backups);
    }
  } catch (error) {
    console.error('读取自动备份列表失败:', error);
  }
  return [];
}

/**
 * 保存自动备份
 */
function saveAutoBackup(data: BackupData): void {
  try {
    const backups = getAutoBackups();
    const config = getAutoBackupConfig();
    
    // 创建备份元数据
    const metadata: BackupMetadata = {
      id: `auto-backup-${Date.now()}`,
      timestamp: data.timestamp,
      version: data.version,
      size: JSON.stringify(data).length,
    };
    
    // 添加新备份
    backups.unshift(metadata);
    
    // 限制备份数量
    if (backups.length > config.maxBackups) {
      const removed = backups.splice(config.maxBackups);
      // 删除超出的备份数据
      removed.forEach(backup => {
        localStorage.removeItem(`backup-${backup.id}`);
      });
    }
    
    // 保存备份列表
    localStorage.setItem(AUTO_BACKUP_KEY, JSON.stringify(backups));
    
    // 保存备份数据
    localStorage.setItem(`backup-${metadata.id}`, JSON.stringify(data));
    
    // 更新最后备份时间
    config.lastBackupTime = Date.now();
    localStorage.setItem(AUTO_BACKUP_CONFIG_KEY, JSON.stringify(config));
    
    console.log('自动备份已保存:', metadata.id);
  } catch (error) {
    console.error('保存自动备份失败:', error);
  }
}

/**
 * 执行自动备份
 */
function performAutoBackup(): void {
  const result = exportData();
  if (result.success && result.data) {
    saveAutoBackup(result.data);
  }
}

/**
 * 启动自动备份
 */
export function startAutoBackup(): void {
  stopAutoBackup(); // 先停止现有的定时器
  
  const config = getAutoBackupConfig();
  if (!config.enabled) {
    return;
  }
  
  // 检查是否需要立即备份
  const now = Date.now();
  const timeSinceLastBackup = now - config.lastBackupTime;
  
  if (timeSinceLastBackup >= config.interval) {
    // 立即执行备份
    performAutoBackup();
  }
  
  // 设置定时器
  autoBackupTimer = window.setInterval(() => {
    performAutoBackup();
  }, config.interval);
  
  console.log('自动备份已启动，间隔:', config.interval / 1000 / 60, '分钟');
}

/**
 * 停止自动备份
 */
export function stopAutoBackup(): void {
  if (autoBackupTimer !== null) {
    clearInterval(autoBackupTimer);
    autoBackupTimer = null;
    console.log('自动备份已停止');
  }
}

/**
 * 获取指定备份的数据
 */
export function getBackupData(backupId: string): BackupData | null {
  try {
    const data = localStorage.getItem(`backup-${backupId}`);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('读取备份数据失败:', error);
  }
  return null;
}

/**
 * 删除指定备份
 */
export function deleteBackup(backupId: string): boolean {
  try {
    const backups = getAutoBackups();
    const index = backups.findIndex(b => b.id === backupId);
    
    if (index !== -1) {
      backups.splice(index, 1);
      localStorage.setItem(AUTO_BACKUP_KEY, JSON.stringify(backups));
      localStorage.removeItem(`backup-${backupId}`);
      return true;
    }
  } catch (error) {
    console.error('删除备份失败:', error);
  }
  return false;
}
