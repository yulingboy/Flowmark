import { useState, useEffect } from 'react';
import { Radio, ColorPicker, Button } from 'antd';
import { useSettingsStore } from '@/stores/settingsStore';
import { ToggleSwitch } from '../components/ToggleSwitch';

export function DateTimeSettings() {
  const { 
    showSeconds, 
    show24Hour, 
    showLunar, 
    showDate,
    showWeekday,
    showYear,
    clockColor,
    clockFontSize,
    updateShowSeconds, 
    updateShow24Hour, 
    updateShowLunar,
    updateShowDate,
    updateShowWeekday,
    updateShowYear,
    updateClockColor,
    updateClockFontSize,
  } = useSettingsStore();

  const [previewTime, setPreviewTime] = useState('');
  const [previewDate, setPreviewDate] = useState('');

  useEffect(() => {
    const updatePreview = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      
      if (!show24Hour) {
        hours = hours % 12 || 12;
      }
      const hoursStr = String(hours).padStart(2, '0');
      
      setPreviewTime(showSeconds ? `${hoursStr}:${minutes}:${seconds}` : `${hoursStr}:${minutes}`);
      
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
      
      const parts = [];
      if (showYear) parts.push(`${year}年`);
      if (showDate) parts.push(`${month}月${day}日`);
      if (showWeekday) parts.push(weekdays[now.getDay()]);
      if (showLunar) parts.push('农历');
      
      setPreviewDate(parts.join('  '));
    };
    
    updatePreview();
    const interval = setInterval(updatePreview, 1000);
    return () => clearInterval(interval);
  }, [showSeconds, show24Hour, showDate, showWeekday, showYear, showLunar]);

  const fontSizeClass = {
    small: 'text-5xl',
    medium: 'text-6xl',
    large: 'text-7xl',
  };

  return (
    <div>
      <div className="bg-gray-800 rounded-xl p-6 mb-5 text-center">
        <div
          className={`${fontSizeClass[clockFontSize]} font-semibold tabular-nums`}
          style={{ color: clockColor }}
        >
          {previewTime}
        </div>
        <div className="text-sm mt-2 opacity-90" style={{ color: clockColor }}>
          {previewDate}
        </div>
      </div>

      <div className="text-xs text-gray-400 mb-3">基本设置</div>

      <ToggleSwitch checked={show24Hour} onChange={updateShow24Hour} label="24小时制" />
      <ToggleSwitch checked={showSeconds} onChange={updateShowSeconds} label="显示秒" />

      <div className="flex items-center justify-between py-3 border-b border-gray-100">
        <div className="text-sm text-gray-700">字体大小</div>
        <Radio.Group value={clockFontSize} onChange={(e) => updateClockFontSize(e.target.value)}>
          <Radio.Button value="small">小</Radio.Button>
          <Radio.Button value="medium">中</Radio.Button>
          <Radio.Button value="large">大</Radio.Button>
        </Radio.Group>
      </div>

      <div className="flex items-center justify-between py-3 border-b border-gray-100">
        <div className="text-sm text-gray-700">字体颜色</div>
        <div className="flex items-center gap-2">
          <ColorPicker value={clockColor} onChange={(_, hex) => updateClockColor(hex)} />
          <Button size="small" onClick={() => updateClockColor('#ffffff')}>重置</Button>
        </div>
      </div>

      <div className="text-xs text-gray-400 my-5">内容展示</div>

      <ToggleSwitch checked={showYear} onChange={updateShowYear} label="年份" />
      <ToggleSwitch checked={showDate} onChange={updateShowDate} label="日期" />
      <ToggleSwitch checked={showWeekday} onChange={updateShowWeekday} label="星期" />
      <ToggleSwitch checked={showLunar} onChange={updateShowLunar} label="农历" />
    </div>
  );
}
