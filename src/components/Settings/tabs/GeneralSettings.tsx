import { useSettingsStore } from '@/stores/settingsStore';
import { ToggleSwitch } from '../components/ToggleSwitch';

export function GeneralSettings() {
  const { 
    openInNewTab, 
    showClock,
    showSearch,
    showShortcuts,
    language,
    updateOpenInNewTab,
    updateShowClock,
    updateShowSearch,
    updateShowShortcuts,
    updateLanguage,
    resetAllSettings,
  } = useSettingsStore();
  
  return (
    <div>
      <div className="text-xs text-gray-400 mb-4">界面显示</div>
      
      <ToggleSwitch
        checked={showClock}
        onChange={updateShowClock}
        label="显示时钟"
        description="在页面顶部显示时间和日期"
      />
      <ToggleSwitch
        checked={showSearch}
        onChange={updateShowSearch}
        label="显示搜索框"
        description="显示搜索输入框"
      />
      <ToggleSwitch
        checked={showShortcuts}
        onChange={updateShowShortcuts}
        label="显示快捷入口"
        description="显示网站快捷方式"
      />
      
      <div className="text-xs text-gray-400 my-5">链接行为</div>
      
      <ToggleSwitch
        checked={openInNewTab}
        onChange={updateOpenInNewTab}
        label="链接新页面打开"
        description="点击快捷方式时在新标签页打开"
      />
      
      <div className="text-xs text-gray-400 my-5">语言设置</div>
      
      <div className="flex items-center justify-between py-3 border-b border-gray-100">
        <div className="text-sm text-gray-700">界面语言</div>
        <select
          value={language}
          onChange={(e) => updateLanguage(e.target.value as 'zh-CN' | 'en-US')}
          className="px-3 py-1.5 rounded-md border border-gray-200 text-sm text-gray-700 bg-white cursor-pointer"
        >
          <option value="zh-CN">简体中文</option>
          <option value="en-US">English</option>
        </select>
      </div>
      
      <div className="text-xs text-gray-400 my-5">数据管理</div>
      
      <div className="flex gap-3 py-3">
        <button
          onClick={() => {
            const data = JSON.stringify(useSettingsStore.getState(), null, 2);
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'newtab-settings.json';
            a.click();
            URL.revokeObjectURL(url);
          }}
          className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg cursor-pointer"
        >
          导出设置
        </button>
        <label className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg cursor-pointer">
          导入设置
          <input
            type="file"
            accept=".json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                  try {
                    const data = JSON.parse(event.target?.result as string);
                    useSettingsStore.setState(data);
                  } catch {
                    alert('导入失败：文件格式错误');
                  }
                };
                reader.readAsText(file);
              }
            }}
          />
        </label>
        <button
          onClick={() => {
            if (confirm('确定要重置所有设置吗？此操作不可撤销。')) {
              resetAllSettings();
            }
          }}
          className="px-4 py-2 text-sm bg-red-50 text-red-500 border border-red-200 rounded-lg cursor-pointer"
        >
          重置设置
        </button>
      </div>
    </div>
  );
}
