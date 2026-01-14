import { useState, useEffect } from 'react';
import { Upload, Download, RotateCcw, AlertTriangle, Clock, HardDrive, Trash2 } from 'lucide-react';
import { Modal, message, Switch, InputNumber, Progress } from 'antd';
import {
  exportData,
  importData,
  downloadBackup,
  readBackupFile,
  getAutoBackupConfig,
  setAutoBackupConfig,
  getAutoBackups,
  startAutoBackup,
  getBackupData,
  deleteBackup,
} from '@/services/backup';
import {
  getStorageUsage,
  formatBytes,
  cleanupOldBackups,
} from '@/services/storage';
import type { BackupMetadata } from '@/services/backup';
import type { StorageUsage } from '@/services/storage';

export function DataSettings() {
  const [isResetting, setIsResetting] = useState(false);
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(false);
  const [backupInterval, setBackupInterval] = useState(24);
  const [maxBackups, setMaxBackups] = useState(5);
  const [backups, setBackups] = useState<BackupMetadata[]>([]);
  const [storageUsage, setStorageUsage] = useState<StorageUsage | null>(null);

  // 加载配置和数据
  useEffect(() => {
    const config = getAutoBackupConfig();
    setAutoBackupEnabled(config.enabled);
    setBackupInterval(config.interval / (60 * 60 * 1000)); // 转换为小时
    setMaxBackups(config.maxBackups);
    
    loadBackups();
    updateStorageUsage();
    
    // 启动自动备份（如果已启用）
    if (config.enabled) {
      startAutoBackup();
    }
  }, []);

  const loadBackups = () => {
    setBackups(getAutoBackups());
  };

  const updateStorageUsage = () => {
    setStorageUsage(getStorageUsage());
  };

  // 导出数据
  const handleExport = () => {
    const result = exportData();
    if (result.success && result.data) {
      downloadBackup(result.data);
      message.success('数据导出成功');
    } else {
      message.error(`导出失败: ${result.error}`);
    }
  };

  // 导入数据
  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      try {
        const data = await readBackupFile(file);
        const result = importData(data);
        
        if (result.success) {
          if (result.migratedFrom) {
            message.success(`数据导入成功（已从版本 ${result.migratedFrom} 迁移），即将刷新页面`);
          } else {
            message.success('数据导入成功，即将刷新页面');
          }
          setTimeout(() => window.location.reload(), 1000);
        } else {
          message.error(`导入失败: ${result.error}`);
        }
      } catch (error) {
        message.error('导入失败，文件格式不正确');
      }
    };
    input.click();
  };

  // 还原数据
  const handleReset = () => {
    setIsResetting(true);
  };

  const confirmReset = () => {
    localStorage.clear();
    message.success('数据已还原，即将刷新页面');
    setTimeout(() => window.location.reload(), 1000);
  };

  // 切换自动备份
  const handleAutoBackupToggle = (enabled: boolean) => {
    setAutoBackupEnabled(enabled);
    setAutoBackupConfig({ enabled });
  };

  // 更新备份间隔
  const handleIntervalChange = (value: number | null) => {
    if (value) {
      setBackupInterval(value);
      setAutoBackupConfig({ interval: value * 60 * 60 * 1000 }); // 转换为毫秒
    }
  };

  // 更新最大备份数
  const handleMaxBackupsChange = (value: number | null) => {
    if (value) {
      setMaxBackups(value);
      setAutoBackupConfig({ maxBackups: value });
    }
  };

  // 恢复备份
  const handleRestoreBackup = (backupId: string) => {
    const data = getBackupData(backupId);
    if (data) {
      const result = importData(data);
      if (result.success) {
        message.success('备份恢复成功，即将刷新页面');
        setTimeout(() => window.location.reload(), 1000);
      } else {
        message.error(`恢复失败: ${result.error}`);
      }
    } else {
      message.error('无法读取备份数据');
    }
  };

  // 删除备份
  const handleDeleteBackup = (backupId: string) => {
    if (deleteBackup(backupId)) {
      message.success('备份已删除');
      loadBackups();
      updateStorageUsage();
    } else {
      message.error('删除失败');
    }
  };

  // 清理旧备份
  const handleCleanupBackups = () => {
    const freed = cleanupOldBackups(3);
    if (freed > 0) {
      message.success(`已清理 ${formatBytes(freed)} 空间`);
      loadBackups();
      updateStorageUsage();
    } else {
      message.info('没有需要清理的备份');
    }
  };

  const actions = [
    {
      icon: Download,
      title: '导出数据',
      desc: '将所有设置和数据导出为 JSON 文件',
      onClick: handleExport,
      color: 'text-blue-500',
      bg: 'bg-blue-50 hover:bg-blue-100',
    },
    {
      icon: Upload,
      title: '导入数据',
      desc: '从 JSON 文件恢复设置和数据',
      onClick: handleImport,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50 hover:bg-emerald-100',
    },
    {
      icon: RotateCcw,
      title: '还原默认',
      desc: '清除所有数据，恢复初始状态',
      onClick: handleReset,
      color: 'text-red-500',
      bg: 'bg-red-50 hover:bg-red-100',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs text-gray-400 mb-4">管理你的快捷方式、设置等数据</p>
        
        <div className="space-y-3">
          {actions.map((action) => (
            <button
              key={action.title}
              onClick={action.onClick}
              className={`w-full flex items-center gap-4 p-4 rounded-xl ${action.bg} transition-colors text-left`}
            >
              <div className={`w-10 h-10 rounded-lg bg-white flex items-center justify-center ${action.color}`}>
                <action.icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-700">{action.title}</div>
                <div className="text-xs text-gray-400">{action.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 自动备份设置 */}
      <div className="border-t pt-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-gray-500" />
          <h3 className="text-sm font-medium text-gray-700">自动备份</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-700">启用自动备份</div>
              <div className="text-xs text-gray-400">定期自动备份数据到本地存储</div>
            </div>
            <Switch checked={autoBackupEnabled} onChange={handleAutoBackupToggle} />
          </div>

          {autoBackupEnabled && (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-700">备份间隔（小时）</div>
                  <div className="text-xs text-gray-400">自动备份的时间间隔</div>
                </div>
                <InputNumber
                  min={1}
                  max={168}
                  value={backupInterval}
                  onChange={handleIntervalChange}
                  className="w-24"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-700">最大备份数</div>
                  <div className="text-xs text-gray-400">保留的备份文件数量</div>
                </div>
                <InputNumber
                  min={1}
                  max={20}
                  value={maxBackups}
                  onChange={handleMaxBackupsChange}
                  className="w-24"
                />
              </div>
            </>
          )}
        </div>

        {/* 备份列表 */}
        {backups.length > 0 && (
          <div className="mt-4">
            <div className="text-xs text-gray-500 mb-2">自动备份列表</div>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {backups.map((backup) => (
                <div
                  key={backup.id}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs"
                >
                  <div>
                    <div className="text-gray-700">
                      {new Date(backup.timestamp).toLocaleString('zh-CN')}
                    </div>
                    <div className="text-gray-400">
                      {formatBytes(backup.size)} · v{backup.version}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRestoreBackup(backup.id)}
                      className="text-blue-500 hover:text-blue-600"
                    >
                      恢复
                    </button>
                    <button
                      onClick={() => handleDeleteBackup(backup.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 存储使用情况 */}
      {storageUsage && (
        <div className="border-t pt-6">
          <div className="flex items-center gap-2 mb-4">
            <HardDrive className="w-4 h-4 text-gray-500" />
            <h3 className="text-sm font-medium text-gray-700">存储使用情况</h3>
          </div>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-gray-600">
                  已使用 {formatBytes(storageUsage.used)} / {formatBytes(storageUsage.quota)}
                </span>
                <span className="text-gray-600">
                  {(storageUsage.percentage * 100).toFixed(1)}%
                </span>
              </div>
              <Progress
                percent={storageUsage.percentage * 100}
                showInfo={false}
                status={storageUsage.isNearLimit ? 'exception' : 'normal'}
              />
            </div>

            {storageUsage.isNearLimit && (
              <div className="flex items-start gap-2 p-3 bg-orange-50 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5" />
                <div className="flex-1">
                  <div className="text-xs text-orange-700 font-medium">存储空间不足</div>
                  <div className="text-xs text-orange-600 mt-1">
                    建议清理旧备份或导出数据后清除本地存储
                  </div>
                  <button
                    onClick={handleCleanupBackups}
                    className="text-xs text-orange-600 hover:text-orange-700 underline mt-2"
                  >
                    清理旧备份
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <Modal
        title={
          <div className="flex items-center gap-2 text-red-500">
            <AlertTriangle className="w-5 h-5" />
            <span>确认还原</span>
          </div>
        }
        open={isResetting}
        onCancel={() => setIsResetting(false)}
        onOk={confirmReset}
        okText="确认还原"
        cancelText="取消"
        okButtonProps={{ danger: true }}
      >
        <p className="text-gray-600 py-4">
          此操作将清除所有数据，包括快捷方式、设置等，且无法恢复。建议先导出备份。
        </p>
      </Modal>
    </div>
  );
}
