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

  const fontSizeMap = {
    small: '48px',
    medium: '56px',
    large: '64px',
  };

  return (
    <div>
      <div style={{
        backgroundColor: '#1f2937',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '20px',
        textAlign: 'center',
      }}>
        <div style={{
          fontSize: fontSizeMap[clockFontSize],
          fontWeight: 600,
          color: clockColor,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontVariantNumeric: 'tabular-nums',
        }}>
          {previewTime}
        </div>
        <div style={{
          fontSize: '14px',
          color: clockColor,
          opacity: 0.9,
          marginTop: '8px',
        }}>
          {previewDate}
        </div>
      </div>

      <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '12px' }}>
        基本设置
      </div>

      <ToggleSwitch checked={show24Hour} onChange={updateShow24Hour} label="24小时制" />
      <ToggleSwitch checked={showSeconds} onChange={updateShowSeconds} label="显示秒" />

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 0',
        borderBottom: '1px solid #f3f4f6',
      }}>
        <div style={{ fontSize: '14px', color: '#374151' }}>字体大小</div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {(['small', 'medium', 'large'] as const).map((size) => (
            <button
              key={size}
              onClick={() => updateClockFontSize(size)}
              style={{
                padding: '4px 12px',
                fontSize: '12px',
                borderRadius: '6px',
                border: clockFontSize === size ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                backgroundColor: clockFontSize === size ? '#eff6ff' : 'white',
                color: '#374151',
                cursor: 'pointer',
              }}
            >
              {size === 'small' ? '小' : size === 'medium' ? '中' : '大'}
            </button>
          ))}
        </div>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 0',
        borderBottom: '1px solid #f3f4f6',
      }}>
        <div style={{ fontSize: '14px', color: '#374151' }}>字体颜色</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="color"
            value={clockColor}
            onChange={(e) => updateClockColor(e.target.value)}
            style={{
              width: '32px',
              height: '32px',
              padding: 0,
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          />
          <button
            onClick={() => updateClockColor('#ffffff')}
            style={{
              padding: '4px 8px',
              fontSize: '12px',
              color: '#6b7280',
              backgroundColor: '#f3f4f6',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            重置
          </button>
        </div>
      </div>

      <div style={{ fontSize: '12px', color: '#9ca3af', margin: '20px 0 12px' }}>
        内容展示
      </div>

      <ToggleSwitch checked={showYear} onChange={updateShowYear} label="年份" />
      <ToggleSwitch checked={showDate} onChange={updateShowDate} label="日期" />
      <ToggleSwitch checked={showWeekday} onChange={updateShowWeekday} label="星期" />
      <ToggleSwitch checked={showLunar} onChange={updateShowLunar} label="农历" />
    </div>
  );
}
