import { useState } from 'react';
import { Button, Slider } from 'antd';
import { useSettingsStore } from '@/stores/settingsStore';

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
    backgroundUrl, backgroundBlur, backgroundOverlay,
    updateBackgroundUrl, updateBackgroundBlur, updateBackgroundOverlay, resetBackground 
  } = useSettingsStore();
  const [showOnlineWallpapers, setShowOnlineWallpapers] = useState(false);

  return (
    <div>
      <div className="w-full h-45 rounded-xl overflow-hidden bg-gray-100 mb-4 relative">
        <img src={backgroundUrl} alt="当前壁纸" className="w-full h-full object-cover" style={{ filter: `blur(${backgroundBlur / 10}px)` }} />
        <div className="absolute inset-0" style={{ backgroundColor: `rgba(0, 0, 0, ${backgroundOverlay / 100})` }} />
      </div>

      <div className="flex gap-3 mb-5">
        <Button type="primary" onClick={() => setShowOnlineWallpapers(!showOnlineWallpapers)} block>
          在线壁纸
        </Button>
        <Button onClick={resetBackground} block>恢复默认</Button>
      </div>

      {showOnlineWallpapers && (
        <div className="mb-5">
          <div className="text-sm text-gray-700 mb-3">选择壁纸</div>
          <div className="grid grid-cols-3 gap-2">
            {ONLINE_WALLPAPERS.map((url, index) => (
              <button key={index} onClick={() => updateBackgroundUrl(url)}
                className={`p-0 rounded-lg overflow-hidden cursor-pointer aspect-video border-2 ${backgroundUrl === url ? 'border-blue-500' : 'border-transparent'}`}>
                <img src={url} alt={`壁纸 ${index + 1}`} className="w-full h-full object-cover" />
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

      <div className="py-3 border-b border-gray-100">
        <div className="flex justify-between text-sm text-gray-700 mb-2">
          <span>背景模糊值</span>
          <span>{backgroundBlur}%</span>
        </div>
        <Slider min={0} max={100} value={backgroundBlur} onChange={updateBackgroundBlur} />
      </div>

      <div className="py-3 border-b border-gray-100">
        <div className="flex justify-between text-sm text-gray-700 mb-2">
          <span>遮罩透明度</span>
          <span>{backgroundOverlay}%</span>
        </div>
        <Slider min={0} max={80} value={backgroundOverlay} onChange={updateBackgroundOverlay} />
      </div>
    </div>
  );
}
