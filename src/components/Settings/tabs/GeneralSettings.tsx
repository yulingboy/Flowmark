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
      <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '16px' }}>
        界面显示
      </div>
      
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
      
      <div style={{ fontSize: '12px', color: '#9ca3af', margin: '20px 0 16px' }}>
        链接行为
      </div>
      
      <ToggleSwitch
        checked={openInNewTab}
        onChange={updateOpenInNewTab}
        label="链接新页面打开"
        description="点击快捷方式时在新标签页打开"
      />
      
      <div style={{ fontSize: '12px', color: '#9ca3af', margin: '20px 0 16px' }}>
        语言设置
      </div>
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 0',
        borderBottom: '1px solid #f3f4f6',
      }}>
        <div style={{ fontSize: '14px', color: '#374151' }}>界面语言</div>
        <select
          value={language}
          onChange={(e) => updateLanguage(e.target.value as 'zh-CN' | 'en-US')}
          style={{
            padding: '6px 12px',
            borderRadius: '6px',
            border: '1px solid #e5e7eb',
            fontSize: '14px',
            color: '#374151',
            backgroundColor: 'white',
            cursor: 'pointer',
          }}
        >
          <option value="zh-CN">简体中文</option>
          <option value="en-US">English</option>
        </select>
      </div>
      
      <div style={{ fontSize: '12px', color: '#9ca3af', margin: '20px 0 16px' }}>
        数据管理
      </div>
      
      <div style={{ display: 'flex', gap: '12px', padding: '12px 0' }}>
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
          style={{
            padding: '8px 16px',
            fontSize: '14px',
            backgroundColor: '#f3f4f6',
            color: '#374151',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          导出设置
        </button>
        <label style={{
          padding: '8px 16px',
          fontSize: '14px',
          backgroundColor: '#f3f4f6',
          color: '#374151',
          borderRadius: '8px',
          cursor: 'pointer',
        }}>
          导入设置
          <input
            type="file"
            accept=".json"
            style={{ display: 'none' }}
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
          style={{
            padding: '8px 16px',
            fontSize: '14px',
            backgroundColor: '#fef2f2',
            color: '#ef4444',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          重置设置
        </button>
      </div>
    </div>
  );
}
