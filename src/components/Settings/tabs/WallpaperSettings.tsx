import { useState } from 'react';
import { useSettingsStore } from '@/stores/settingsStore';
import { Slider } from '../components/Slider';

const ONLINE_WALLPAPERS = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&q=80',
  'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=1920&q=80',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920&q=80',
  'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=1920&q=80',
  'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=1920&q=80',
];

export function WallpaperSettings() {
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

      {showOnlineWallpapers && (
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '14px', color: '#374151', marginBottom: '12px' }}>选择壁纸</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
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

      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '14px', color: '#374151', marginBottom: '8px' }}>自定义壁纸 URL</div>
        <input
          type="text"
          value={backgroundUrl}
          onChange={(e) => updateBackgroundUrl(e.target.value)}
          placeholder="输入图片 URL"
          style={{
            width: '100%',
            padding: '10px 12px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '14px',
            boxSizing: 'border-box',
          }}
        />
      </div>

      <Slider value={backgroundBlur} onChange={updateBackgroundBlur} label="背景模糊值" min={0} max={100} />
      <Slider value={backgroundOverlay} onChange={updateBackgroundOverlay} label="遮罩透明度" min={0} max={80} />
    </div>
  );
}
