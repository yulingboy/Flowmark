import { useState, useEffect, useRef } from 'react';
import { useSettingsStore } from '@/stores/settingsStore';
import type { SearchEngine } from '@/types';
import { SEARCH_ENGINE_ICONS } from '@/utils/search';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const SEARCH_ENGINES: { value: SearchEngine; label: string }[] = [
  { value: 'bing', label: 'Bing' },
  { value: 'google', label: 'Google' },
  { value: 'baidu', label: '百度' },
];

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const { backgroundUrl, searchEngine, updateBackgroundUrl, updateSearchEngine } = useSettingsStore();
  const [bgUrl, setBgUrl] = useState(backgroundUrl);
  const [previewUrl, setPreviewUrl] = useState(backgroundUrl);
  const [urlError, setUrlError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // 同步外部设置变化
  useEffect(() => {
    setBgUrl(backgroundUrl);
    setPreviewUrl(backgroundUrl);
  }, [backgroundUrl]);

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

  const handleBgUrlChange = (url: string) => {
    setBgUrl(url);
    setUrlError(null);
  };

  const handlePreview = () => {
    if (!bgUrl.trim()) {
      setUrlError('请输入图片 URL');
      return;
    }
    setPreviewUrl(bgUrl);
    setIsValidating(true);
  };

  const handleImageLoad = () => {
    setIsValidating(false);
    setUrlError(null);
  };

  const handleImageError = () => {
    setIsValidating(false);
    setUrlError('图片加载失败，请检查 URL');
  };

  const handleSaveBackground = () => {
    if (urlError || isValidating) return;
    updateBackgroundUrl(bgUrl);
  };

  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        ref={panelRef}
        style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          width: '100%',
          maxWidth: '420px',
          margin: '0 16px',
          overflow: 'hidden',
        }}
      >
        {/* 头部 */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 24px',
            borderBottom: '1px solid #f3f4f6',
          }}
        >
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#1f2937', margin: 0 }}>设置</h2>
          <button
            onClick={onClose}
            style={{
              padding: '4px',
              borderRadius: '50%',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
            }}
            aria-label="关闭设置"
          >
            <svg style={{ width: '20px', height: '20px', color: '#6b7280' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div style={{ padding: '24px', maxHeight: '70vh', overflowY: 'auto' }}>
          {/* 背景设置 */}
          <section style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '12px' }}>背景图片</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input
                type="text"
                value={bgUrl}
                onChange={(e) => handleBgUrlChange(e.target.value)}
                placeholder="输入图片 URL"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              {urlError && (
                <p style={{ fontSize: '14px', color: '#ef4444', margin: 0 }}>{urlError}</p>
              )}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={handlePreview}
                  disabled={isValidating}
                  style={{
                    padding: '6px 12px',
                    fontSize: '14px',
                    backgroundColor: '#f3f4f6',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: isValidating ? 'not-allowed' : 'pointer',
                    opacity: isValidating ? 0.5 : 1,
                  }}
                >
                  预览
                </button>
                <button
                  onClick={handleSaveBackground}
                  disabled={!!urlError || isValidating}
                  style={{
                    padding: '6px 12px',
                    fontSize: '14px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: (urlError || isValidating) ? 'not-allowed' : 'pointer',
                    opacity: (urlError || isValidating) ? 0.5 : 1,
                  }}
                >
                  保存
                </button>
              </div>
              {/* 预览区域 */}
              <div 
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '120px',
                  backgroundColor: '#f3f4f6',
                  borderRadius: '8px',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={previewUrl}
                  alt="背景预览"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />
                {isValidating && (
                  <div 
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    }}
                  >
                    <span style={{ color: 'white', fontSize: '14px' }}>加载中...</span>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* 搜索引擎设置 */}
          <section>
            <h3 style={{ fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '12px' }}>搜索引擎</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {SEARCH_ENGINES.map(({ value, label }) => {
                const isSelected = searchEngine === value;
                return (
                  <label
                    key={value}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      backgroundColor: isSelected ? '#eff6ff' : '#f9fafb',
                      border: isSelected ? '1px solid #bfdbfe' : '1px solid transparent',
                    }}
                  >
                    <input
                      type="radio"
                      name="searchEngine"
                      value={value}
                      checked={isSelected}
                      onChange={() => updateSearchEngine(value)}
                      style={{ display: 'none' }}
                    />
                    <img
                      src={SEARCH_ENGINE_ICONS[value]}
                      alt={label}
                      style={{ width: '20px', height: '20px' }}
                    />
                    <span style={{ fontSize: '14px', color: '#374151', flex: 1 }}>{label}</span>
                    {isSelected && (
                      <svg style={{ width: '16px', height: '16px', color: '#3b82f6' }} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </label>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
