import { Select, Button, Modal } from 'antd';
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
        <Select
          value={language}
          onChange={updateLanguage}
          style={{ width: 120 }}
          options={[
            { value: 'zh-CN', label: '简体中文' },
            { value: 'en-US', label: 'English' },
          ]}
        />
      </div>
      
      <div className="text-xs text-gray-400 my-5">数据管理</div>
      
      <div className="flex gap-3 py-3">
        <Button
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
        >
          导出设置
        </Button>
        <Button>
          <label className="cursor-pointer">
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
                      Modal.error({ title: '导入失败', content: '文件格式错误' });
                    }
                  };
                  reader.readAsText(file);
                }
              }}
            />
          </label>
        </Button>
        <Button
          danger
          onClick={() => {
            Modal.confirm({
              title: '重置设置',
              content: '确定要重置所有设置吗？此操作不可撤销。',
              okText: '重置',
              cancelText: '取消',
              okButtonProps: { danger: true },
              onOk: resetAllSettings,
            });
          }}
        >
          重置设置
        </Button>
      </div>
    </div>
  );
}
