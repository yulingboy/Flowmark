import { useState } from 'react';
import { Button, Slider, Input } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import { useBackgroundStore } from '@/stores/settings/backgroundStore';
import { PRESET_WALLPAPERS } from '@/constants';

export function WallpaperSettings() {
  const { 
    backgroundUrl, backgroundBlur, backgroundOverlay,
    updateBackgroundUrl, updateBackgroundBlur, updateBackgroundOverlay, resetBackground 
  } = useBackgroundStore();
  const [showOnlineWallpapers, setShowOnlineWallpapers] = useState(false);

  return (
    <div>
      <div className="w-full h-45 rounded-xl overflow-hidden bg-gray-100 mb-4 relative">
        <img src={backgroundUrl} alt="当前壁纸" className="w-full h-full object-cover" style={{ filter: `blur(${backgroundBlur / 10}px)` }} />
        <div className="absolute inset-0" style={{ backgroundColor: `rgba(0, 0, 0, ${backgroundOverlay / 100})` }} />
      </div>

      <div className="flex gap-3 mb-5">
        <Button type="primary" onClick={() => setShowOnlineWallpapers(!showOnlineWallpapers)} block>在线壁纸</Button>
        <Button onClick={resetBackground} block>恢复默认</Button>
      </div>

      {showOnlineWallpapers && (
        <div className="mb-5">
          <div className="text-sm text-gray-700 mb-3">选择壁纸</div>
          <div className="grid grid-cols-3 gap-2">
            {PRESET_WALLPAPERS.map((wp) => (
              <button key={wp.id} onClick={() => updateBackgroundUrl(wp.url)}
                className={`p-0 rounded-lg overflow-hidden cursor-pointer aspect-video border-2 relative ${backgroundUrl === wp.url ? 'border-blue-500' : 'border-transparent'}`}>
                <img src={wp.url} alt={wp.name} className="w-full h-full object-cover" />
                {backgroundUrl === wp.url && (
                  <div className="absolute top-1 right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <CheckOutlined style={{ color: 'white', fontSize: 12 }} />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mb-4">
        <div className="text-sm text-gray-700 mb-2">自定义壁纸 URL</div>
        <Input value={backgroundUrl} onChange={(e) => updateBackgroundUrl(e.target.value)} placeholder="输入图片 URL" />
      </div>

      <div className="py-3 border-b border-gray-100">
        <div className="flex justify-between text-sm text-gray-700 mb-2">
          <span>背景模糊值</span><span>{backgroundBlur}%</span>
        </div>
        <Slider min={0} max={100} value={backgroundBlur} onChange={updateBackgroundBlur} />
      </div>

      <div className="py-3 border-b border-gray-100">
        <div className="flex justify-between text-sm text-gray-700 mb-2">
          <span>遮罩透明度</span><span>{backgroundOverlay}%</span>
        </div>
        <Slider min={0} max={80} value={backgroundOverlay} onChange={updateBackgroundOverlay} />
      </div>
    </div>
  );
}
