/**
 * 存储服务
 * 负责检测和管理 localStorage 使用情况
 */

/**
 * 存储使用情况
 */
export interface StorageUsage {
  /** 已使用字节数 */
  used: number;
  /** 总配额字节数（估算） */
  quota: number;
  /** 使用百分比 */
  percentage: number;
  /** 是否接近配额限制 */
  isNearLimit: boolean;
}

/**
 * 估算的 localStorage 配额（5MB）
 */
const ESTIMATED_QUOTA = 5 * 1024 * 1024;

/**
 * 接近限制的阈值（80%）
 */
const NEAR_LIMIT_THRESHOLD = 0.8;

/**
 * 计算字符串的字节大小
 */
function getByteSize(str: string): number {
  return new Blob([str]).size;
}

/**
 * 获取 localStorage 使用情况
 */
export function getStorageUsage(): StorageUsage {
  let totalSize = 0;
  
  try {
    // 遍历所有 localStorage 项
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        if (value) {
          // 计算键和值的大小
          totalSize += getByteSize(key) + getByteSize(value);
        }
      }
    }
  } catch (error) {
    console.error('计算存储使用量失败:', error);
  }
  
  const percentage = totalSize / ESTIMATED_QUOTA;
  
  return {
    used: totalSize,
    quota: ESTIMATED_QUOTA,
    percentage,
    isNearLimit: percentage >= NEAR_LIMIT_THRESHOLD,
  };
}

/**
 * 格式化字节大小为可读字符串
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

/**
 * 检查是否有足够的存储空间
 * 
 * @param requiredBytes 需要的字节数
 * @returns 是否有足够空间
 */
export function hasEnoughSpace(requiredBytes: number): boolean {
  const usage = getStorageUsage();
  return (usage.used + requiredBytes) < usage.quota;
}

/**
 * 获取各个存储项的大小
 */
export function getStorageItemSizes(): Array<{ key: string; size: number }> {
  const items: Array<{ key: string; size: number }> = [];
  
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        if (value) {
          const size = getByteSize(key) + getByteSize(value);
          items.push({ key, size });
        }
      }
    }
    
    // 按大小降序排序
    items.sort((a, b) => b.size - a.size);
  } catch (error) {
    console.error('获取存储项大小失败:', error);
  }
  
  return items;
}

/**
 * 清理旧的自动备份以释放空间
 * 
 * @param keepCount 保留的备份数量
 * @returns 释放的字节数
 */
export function cleanupOldBackups(keepCount: number = 3): number {
  let freedBytes = 0;
  
  try {
    const backupsKey = 'ai-nav-auto-backups';
    const backupsData = localStorage.getItem(backupsKey);
    
    if (backupsData) {
      const backups = JSON.parse(backupsData);
      
      if (Array.isArray(backups) && backups.length > keepCount) {
        // 删除超出保留数量的备份
        const toRemove = backups.slice(keepCount);
        
        toRemove.forEach((backup: { id: string }) => {
          const backupKey = `backup-${backup.id}`;
          const backupData = localStorage.getItem(backupKey);
          
          if (backupData) {
            freedBytes += getByteSize(backupKey) + getByteSize(backupData);
            localStorage.removeItem(backupKey);
          }
        });
        
        // 更新备份列表
        const newBackups = backups.slice(0, keepCount);
        localStorage.setItem(backupsKey, JSON.stringify(newBackups));
      }
    }
  } catch (error) {
    console.error('清理旧备份失败:', error);
  }
  
  return freedBytes;
}
