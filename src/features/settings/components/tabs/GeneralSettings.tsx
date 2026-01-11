import { Switch } from 'antd';
import { useGeneralStore } from '../../store/generalStore';
import { SettingRow } from '../SettingRow';

export function GeneralSettings() {
  const { 
    openInNewTab, showClock, showSearch, showShortcuts,
    updateOpenInNewTab, updateShowClock, updateShowSearch, updateShowShortcuts,
  } = useGeneralStore();
  
  return (
    <div>
      <div className="text-xs text-gray-400 mb-4">界面显示</div>
      <SettingRow label="显示时钟" description="在页面顶部显示时间和日期">
        <Switch checked={showClock} onChange={updateShowClock} />
      </SettingRow>
      <SettingRow label="显示搜索框" description="显示搜索输入框">
        <Switch checked={showSearch} onChange={updateShowSearch} />
      </SettingRow>
      <SettingRow label="显示快捷入口" description="显示网站快捷方式">
        <Switch checked={showShortcuts} onChange={updateShowShortcuts} />
      </SettingRow>
      
      <div className="text-xs text-gray-400 my-5">链接行为</div>
      <SettingRow label="链接新页面打开" description="点击快捷方式时在新标签页打开">
        <Switch checked={openInNewTab} onChange={updateOpenInNewTab} />
      </SettingRow>
    </div>
  );
}
