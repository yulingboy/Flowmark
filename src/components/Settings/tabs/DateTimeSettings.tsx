import { useState, useEffect } from 'react';
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
        <div className="flex gap-2">
          {(['small', 'medium', 'large'] as const).map((size) => (
            <button
              key={size}
              onClick={() => updateClockFontSize(size)}
              className={`px-3 py-1 text-xs rounded-md cursor-pointer ${
                clockFontSize === size
                  ? 'border-2 border-blue-500 bg-blue-50'
                  : 'border border-gray-200 bg-white'
              } text-gray-700`}
            >
              {size === 'small' ? '小' : size === 'medium' ? '中' : '大'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between py-3 border-b border-gray-100">
        <div className="text-sm text-gray-700">字体颜色</div>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={clockColor}
            onChange={(e) => updateClockColor(e.target.value)}
            className="w-8 h-8 p-0 border border-gray-200 rounded-md cursor-pointer"
          />
          <button
            onClick={() => updateClockColor('#ffffff')}
            className="px-2 py-1 text-xs text-gray-500 bg-gray-100 rounded cursor-pointer"
          >
            重置
          </button>
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
