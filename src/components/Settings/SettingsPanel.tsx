import { useState, useEffect, useRef } from 'react';
import { useSettingsStore } from '@/stores/settingsStore';
import type { SearchEngine } from '@/types';
import { SEARCH_ENGINE_ICONS } from '@/utils/search';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

type SettingsTab = 'general' | 'search' | 'wallpaper' | 'datetime' | 'about';

const TABS: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
  {
    id: 'general',
    label: '常规设置',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    id: 'search',
    label: '搜索设置',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    id: 'wallpaper',
    label: '壁纸设置',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: 'datetime',
    label: '时间日期',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: 'about',
    label: '关于我们',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

const SEARCH_ENGINES: { value: SearchEngine; label: string }[] = [
  { value: 'bing', label: 'Bing' },
  { value: 'google', label: 'Google' },
  { value: 'baidu', label: '百度' },
];

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const panelRef = useRef<HTMLDivElement>(null);

  // ESC 键关闭
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(4px)',
    }}>
      <div
        ref={panelRef}
        style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          width: '720px',
          height: '520px',
          display: 'flex',
          overflow: 'hidden',
        }}
      >
        {/* 左侧导航 */}
        <div style={{
          width: '200px',
          backgroundColor: '#f9fafb',
          borderRight: '1px solid #e5e7eb',
          padding: '20px 0',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {/* 导航菜单 */}
          <nav style={{ flex: 1 }}>
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  border: 'none',
                  background: activeTab === tab.id ? 'white' : 'transparent',
                  cursor: 'pointer',
                  color: activeTab === tab.id ? '#3b82f6' : '#6b7280',
                  fontSize: '14px',
                  textAlign: 'left',
                  borderLeft: activeTab === tab.id ? '3px solid #3b82f6' : '3px solid transparent',
                }}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* 右侧内容 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* 头部 */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 24px',
            borderBottom: '1px solid #e5e7eb',
          }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#1f2937', margin: 0 }}>
              {TABS.find(t => t.id === activeTab)?.label}
            </h2>
            <button
              onClick={onClose}
              style={{
                padding: '4px',
                borderRadius: '50%',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
              }}
            >
              <svg style={{ width: '20px', height: '20px', color: '#6b7280' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 内容区域 */}
          <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
            {activeTab === 'general' && <GeneralSettings />}
            {activeTab === 'search' && <SearchSettings />}
            {activeTab === 'wallpaper' && <WallpaperSettings />}
            {activeTab === 'datetime' && <DateTimeSettings />}
            {activeTab === 'about' && <AboutSettings />}
          </div>
        </div>
      </div>
    </div>
  );
}

// 通用开关组件
function ToggleSwitch({ checked, onChange, label, description }: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 0',
      borderBottom: '1px solid #f3f4f6',
    }}>
      <div>
        <div style={{ fontSize: '14px', color: '#374151' }}>{label}</div>
        {description && (
          <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>{description}</div>
        )}
      </div>
      <button
        onClick={() => onChange(!checked)}
        style={{
          width: '44px',
          height: '24px',
          borderRadius: '12px',
          border: 'none',
          backgroundColor: checked ? '#3b82f6' : '#d1d5db',
          cursor: 'pointer',
          position: 'relative',
          transition: 'background-color 0.2s',
        }}
      >
        <div style={{
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          backgroundColor: 'white',
          position: 'absolute',
          top: '2px',
          left: checked ? '22px' : '2px',
          transition: 'left 0.2s',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }} />
      </button>
    </div>
  );
}

// 常规设置
function GeneralSettings() {
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
      
      <div style={{
        display: 'flex',
        gap: '12px',
        padding: '12px 0',
      }}>
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

// 搜索设置
function SearchSettings() {
  const {
    searchEngine,
    searchInNewTab,
    autoFocusSearch,
    showSearchSuggestions,
    searchHistoryEnabled,
    updateSearchEngine,
    updateSearchInNewTab,
    updateAutoFocusSearch,
    updateShowSearchSuggestions,
    updateSearchHistoryEnabled,
    clearSearchHistory,
  } = useSettingsStore();

  return (
    <div>
      {/* 搜索引擎选择 */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '14px', color: '#374151', marginBottom: '12px' }}>默认搜索引擎</div>
        <div style={{ display: 'flex', gap: '12px' }}>
          {SEARCH_ENGINES.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => updateSearchEngine(value)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '8px',
                border: searchEngine === value ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                backgroundColor: searchEngine === value ? '#eff6ff' : 'white',
                cursor: 'pointer',
              }}
            >
              <img src={SEARCH_ENGINE_ICONS[value]} alt={label} style={{ width: '16px', height: '16px' }} />
              <span style={{ fontSize: '14px', color: '#374151' }}>{label}</span>
            </button>
          ))}
        </div>
      </div>

      <ToggleSwitch
        checked={searchInNewTab}
        onChange={updateSearchInNewTab}
        label="搜索新页面打开"
      />
      <ToggleSwitch
        checked={autoFocusSearch}
        onChange={updateAutoFocusSearch}
        label="进入程序自动聚焦搜索"
      />
      <ToggleSwitch
        checked={showSearchSuggestions}
        onChange={updateShowSearchSuggestions}
        label="搜索词联想功能"
      />
      <ToggleSwitch
        checked={searchHistoryEnabled}
        onChange={updateSearchHistoryEnabled}
        label="搜索历史"
        description="仅本地生效"
      />

      {searchHistoryEnabled && (
        <div style={{ marginTop: '16px' }}>
          <button
            onClick={clearSearchHistory}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              color: '#ef4444',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            清除搜索历史
          </button>
        </div>
      )}
    </div>
  );
}

// 滑块组件
function Slider({ value, onChange, label, min = 0, max = 100 }: {
  value: number;
  onChange: (value: number) => void;
  label: string;
  min?: number;
  max?: number;
}) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 0',
      borderBottom: '1px solid #f3f4f6',
    }}>
      <div style={{ fontSize: '14px', color: '#374151' }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{
            width: '120px',
            height: '4px',
            appearance: 'none',
            backgroundColor: '#e5e7eb',
            borderRadius: '2px',
            cursor: 'pointer',
          }}
        />
        <span style={{ fontSize: '12px', color: '#6b7280', width: '32px', textAlign: 'right' }}>{value}%</span>
      </div>
    </div>
  );
}

// 在线壁纸列表
const ONLINE_WALLPAPERS = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&q=80',
  'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=1920&q=80',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920&q=80',
  'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=1920&q=80',
  'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=1920&q=80',
];

// 壁纸设置
function WallpaperSettings() {
  const { 
    backgroundUrl, 
    backgroundBlur, 
    backgroundOverlay,
    updateBackgroundUrl, 
    updateBackgroundBlur,
    updateBackgroundOverlay,
    resetBackground 
  } = useSettingsStore();
  const [showOnlineWallpapers, setShowOnlineWallpapers] = useState(false);

  return (
    <div>
      {/* 当前壁纸预览 */}
      <div style={{
        width: '100%',
        height: '180px',
        borderRadius: '12px',
        overflow: 'hidden',
        backgroundColor: '#f3f4f6',
        marginBottom: '16px',
        position: 'relative',
      }}>
        <img
          src={backgroundUrl}
          alt="当前壁纸"
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            filter: `blur(${backgroundBlur / 10}px)`,
          }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: `rgba(0, 0, 0, ${backgroundOverlay / 100})`,
        }} />
      </div>

      {/* 操作按钮 */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <button
          onClick={() => setShowOnlineWallpapers(!showOnlineWallpapers)}
          style={{
            flex: 1,
            padding: '10px 16px',
            fontSize: '14px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          在线壁纸
        </button>
        <button
          onClick={resetBackground}
          style={{
            flex: 1,
            padding: '10px 16px',
            fontSize: '14px',
            backgroundColor: '#f3f4f6',
            color: '#374151',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          恢复默认
        </button>
      </div>

      {/* 在线壁纸选择 */}
      {showOnlineWallpapers && (
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '14px', color: '#374151', marginBottom: '12px' }}>选择壁纸</div>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: '8px',
          }}>
            {ONLINE_WALLPAPERS.map((url, index) => (
              <button
                key={index}
                onClick={() => updateBackgroundUrl(url)}
                style={{
                  padding: 0,
                  border: backgroundUrl === url ? '2px solid #3b82f6' : '2px solid transparent',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  aspectRatio: '16/9',
                }}
              >
                <img
                  src={url}
                  alt={`壁纸 ${index + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 自定义 URL */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '14px', color: '#374151', marginBottom: '8px' }}>自定义壁纸 URL</div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={backgroundUrl}
            onChange={(e) => updateBackgroundUrl(e.target.value)}
            placeholder="输入图片 URL"
            style={{
              flex: 1,
              padding: '10px 12px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px',
              boxSizing: 'border-box',
            }}
          />
        </div>
      </div>

      {/* 背景模糊值 */}
      <Slider
        value={backgroundBlur}
        onChange={updateBackgroundBlur}
        label="背景模糊值"
        min={0}
        max={100}
      />

      {/* 遮罩透明度 */}
      <Slider
        value={backgroundOverlay}
        onChange={updateBackgroundOverlay}
        label="遮罩透明度"
        min={0}
        max={80}
      />
    </div>
  );
}

// 时间日期设置
function DateTimeSettings() {
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

  // 实时预览时间
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
      {/* 预览区域 */}
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

      {/* 基本设置 */}
      <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '12px' }}>
        基本设置
      </div>

      <ToggleSwitch
        checked={show24Hour}
        onChange={updateShow24Hour}
        label="24小时制"
      />
      <ToggleSwitch
        checked={showSeconds}
        onChange={updateShowSeconds}
        label="显示秒"
      />

      {/* 字体大小 */}
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

      {/* 字体颜色 */}
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

      {/* 内容展示 */}
      <div style={{ fontSize: '12px', color: '#9ca3af', margin: '20px 0 12px' }}>
        内容展示
      </div>

      <ToggleSwitch
        checked={showYear}
        onChange={updateShowYear}
        label="年份"
      />
      <ToggleSwitch
        checked={showDate}
        onChange={updateShowDate}
        label="日期"
      />
      <ToggleSwitch
        checked={showWeekday}
        onChange={updateShowWeekday}
        label="星期"
      />
      <ToggleSwitch
        checked={showLunar}
        onChange={updateShowLunar}
        label="农历"
      />
    </div>
  );
}

// 关于我们
function AboutSettings() {
  return (
    <div>
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          margin: '0 auto 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '24px',
          fontWeight: 'bold',
        }}>
          N
        </div>
        <h3 style={{ fontSize: '18px', color: '#1f2937', margin: '0 0 8px' }}>AI Nav</h3>
        <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 4px' }}>版本 1.0.0</p>
        <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>一个简洁美观的新标签页</p>
      </div>
    </div>
  );
}
