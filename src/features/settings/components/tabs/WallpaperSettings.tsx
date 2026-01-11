import { Slider } from 'antd';
import { useBackgroundStore } from '../../store';

export function WallpaperSettings() {
  const { 
    backgroundUrl, backgroundBlur, backgroundOverlay,
    updateBackgroundBlur, updateBackgroundOverlay
  } = useBackgroundStore();

  return (
    <div>
      {/* 壁纸预览 */}
      <div className="w-full h-45 rounded-xl overflow-hidden bg-gray-100 mb-5 relative">
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

      {/* 模糊值调节 */}
      <div className="py-3 border-b border-gray-100">
        <div className="flex justify-between text-sm text-gray-700 mb-2">
          <span>背景模糊值</span>
          <span>{backgroundBlur}%</span>
        </div>
        <Slider min={0} max={100} value={backgroundBlur} onChange={updateBackgroundBlur} />
      </div>

      {/* 遮罩透明度调节 */}
      <div className="py-3">
        <div className="flex justify-between text-sm text-gray-700 mb-2">
          <span>遮罩透明度</span>
          <span>{backgroundOverlay}%</span>
        </div>
        <Slider min={0} max={80} value={backgroundOverlay} onChange={updateBackgroundOverlay} />
      </div>

      <div className="mt-4 text-xs text-gray-400 text-center">
        更多壁纸设置请使用「壁纸中心」插件
      </div>
    </div>
  );
}
