import { useState } from 'react';
import { Upload, Download, RotateCcw, AlertTriangle } from 'lucide-react';
import { Modal, message } from 'antd';

export function DataSettings() {
  const [isResetting, setIsResetting] = useState(false);

  // 获取所有 localStorage 数据
  const getAllData = () => {
    const data: Record<string, unknown> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        try {
          data[key] = JSON.parse(localStorage.getItem(key) || '');
        } catch {
          data[key] = localStorage.getItem(key);
        }
      }
    }
    return data;
  };

  // 导出数据
  const handleExport = () => {
    const data = getAllData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flowmark-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    message.success('数据导出成功');
  };

  // 导入数据
  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          Object.entries(data).forEach(([key, value]) => {
            localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
          });
          message.success('数据导入成功，即将刷新页面');
          setTimeout(() => window.location.reload(), 1000);
        } catch {
          message.error('导入失败，文件格式不正确');
        }
      };
      reader.readAsText(file);
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
    <div className="space-y-3">
      <p className="text-xs text-gray-400 mb-4">管理你的快捷方式、设置等数据</p>
      
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
