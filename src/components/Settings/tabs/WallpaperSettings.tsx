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
      <div className="w-full h-45 rounded-xl overflow-hidden bg-gray-100 mb-4 relative">
        <img
          src={backgroundUrl}
          alt="当前壁纸"
          className="w-full h-full object-cover"
          style={{ filter: `blur(${backgroundBlur / 10}px)` }}
        />
        <div
          className="absolute inset-0"
          style={{ backgroundColor: `rgba(0, 0, 0, ${backgroundOverlay / 100})` }}
        />
      </div>

      <div className="flex gap-3 mb-5">
        <button
          onClick={() => setShowOnlineWallpapers(!showOnlineWallpapers)}
          className="flex-1 py-2.5 px-4 text-sm bg-blue-500 text-white rounded-lg cursor-pointer"
        >
          在线壁纸
        </button>
        <button
          onClick={resetBackground}
          className="flex-1 py-2.5 px-4 text-sm bg-gray-100 text-gray-700 rounded-lg cursor-pointer"
        >
          恢复默认
        </button>
      </div>

      {showOnlineWallpapers && (
        <div className="mb-5">
          <div className="text-sm text-gray-700 mb-3">选择壁纸</div>
          <div className="grid grid-cols-3 gap-2">
            {ONLINE_WALLPAPERS.map((url, index) => (
              <button
                key={index}
                onClick={() => updateBackgroundUrl(url)}
                className={`p-0 rounded-lg overflow-hidden cursor-pointer aspect-video ${
                  backgroundUrl === url ? 'border-2 border-blue-500' : 'border-2 border-transparent'
                }`}
              >
                <img
                  src={url}
                  alt={`壁纸 ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mb-4">
        <div className="text-sm text-gray-700 mb-2">自定义壁纸 URL</div>
        <input
          type="text"
          value={backgroundUrl}
          onChange={(e) => updateBackgroundUrl(e.target.value)}
          placeholder="输入图片 URL"
          className="w-full py-2.5 px-3 border border-gray-200 rounded-lg text-sm box-border"
        />
      </div>

      <Slider value={backgroundBlur} onChange={updateBackgroundBlur} label="背景模糊值" min={0} max={100} />
      <Slider value={backgroundOverlay} onChange={updateBackgroundOverlay} label="遮罩透明度" min={0} max={80} />
    </div>
  );
}
