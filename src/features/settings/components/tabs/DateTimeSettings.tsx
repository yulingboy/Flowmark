import { useState, useEffect } from 'react';
import { Radio, ColorPicker, Button, Switch } from 'antd';
import { useClockStore } from '../../store/clockStore';

// 将 SettingRow 移到组件外部
function SettingRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100">
      <div className="text-sm text-gray-700">{label}</div>
      {children}
    </div>
  );
}

export function DateTimeSettings() {
  const { 
    showSeconds, show24Hour, showLunar, showDate, showWeekday, showYear, clockColor, clockFontSize,
    updateShowSeconds, updateShow24Hour, updateShowLunar, updateShowDate, updateShowWeekday, updateShowYear, updateClockColor, updateClockFontSize,
  } = useClockStore();

  const [previewTime, setPreviewTime] = useState('');
  const [previewDate, setPreviewDate] = useState('');

  useEffect(() => {
    const updatePreview = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      if (!show24Hour) hours = hours % 12 || 12;
      const hoursStr = String(hours).padStart(2, '0');
      setPreviewTime(showSeconds ? hoursStr + ':' + minutes + ':' + seconds : hoursStr + ':' + minutes);
      
      const parts = [];
      if (showYear) parts.push(now.getFullYear() + '年');
      if (showDate) parts.push(String(now.getMonth() + 1).padStart(2, '0') + '月' + String(now.getDate()).padStart(2, '0') + '日');
      if (showWeekday) parts.push(['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][now.getDay()]);
      if (showLunar) parts.push('农历');
      setPreviewDate(parts.join('  '));
    };
    updatePreview();
    const interval = setInterval(updatePreview, 1000);
    return () => clearInterval(interval);
  }, [showSeconds, show24Hour, showDate, showWeekday, showYear, showLunar]);

  const fontSizeClass = { small: 'text-5xl', medium: 'text-6xl', large: 'text-7xl' } as Record<string, string>;


  return (
    <div>
      <div className="bg-gray-800 rounded-xl p-6 mb-5 text-center">
        <div className={fontSizeClass[clockFontSize] + ' font-semibold tabular-nums'} style={{ color: clockColor }}>{previewTime}</div>
        <div className="text-sm mt-2 opacity-90" style={{ color: clockColor }}>{previewDate}</div>
      </div>

      <div className="text-xs text-gray-400 mb-3">基本设置</div>
      <SettingRow label="24小时制"><Switch checked={show24Hour} onChange={updateShow24Hour} /></SettingRow>
      <SettingRow label="显示秒"><Switch checked={showSeconds} onChange={updateShowSeconds} /></SettingRow>
      <SettingRow label="字体大小">
        <Radio.Group value={clockFontSize} onChange={(e) => updateClockFontSize(e.target.value)}>
          <Radio.Button value="small">小</Radio.Button>
          <Radio.Button value="medium">中</Radio.Button>
          <Radio.Button value="large">大</Radio.Button>
        </Radio.Group>
      </SettingRow>
      <SettingRow label="字体颜色">
        <div className="flex items-center gap-2">
          <ColorPicker value={clockColor} onChange={(_, hex) => updateClockColor(hex)} />
          <Button size="small" onClick={() => updateClockColor('#ffffff')}>重置</Button>
        </div>
      </SettingRow>

      <div className="text-xs text-gray-400 my-5">内容展示</div>
      <SettingRow label="年份"><Switch checked={showYear} onChange={updateShowYear} /></SettingRow>
      <SettingRow label="日期"><Switch checked={showDate} onChange={updateShowDate} /></SettingRow>
      <SettingRow label="星期"><Switch checked={showWeekday} onChange={updateShowWeekday} /></SettingRow>
      <SettingRow label="农历"><Switch checked={showLunar} onChange={updateShowLunar} /></SettingRow>
    </div>
  );
}
