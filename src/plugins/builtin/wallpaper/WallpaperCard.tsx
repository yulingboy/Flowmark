import { useBackgroundStore } from '@/features/settings/store/backgroundStore';
import type { PluginSize } from '../../types';

interface WallpaperCardProps {
  size: PluginSize;
}

export function WallpaperCard({ size }: WallpaperCardProps) {
  const { backgroundUrl } = useBackgroundStore();
  
  if (size === '1x1') {
    return (
      <div className="w-full h-full flex items-center justify-center relative overflow-hidden rounded-xl">
        <img 
          src={backgroundUrl} 
          alt="当前壁纸" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20" />
        <span className="text-2xl relative z-10">🖼️</span>
      </div>
    );
  }
  
  // 2x2 size
  return (
    <div className="w-full h-full flex flex-col relative overflow-hidden rounded-xl">
      <img 
        src={backgroundUrl} 
        alt="当前壁纸" 
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/30" />
      <div className="relative z-10 p-3 flex flex-col h-full">
        <div className="text-white text-sm font-medium mb-1">壁纸中心</div>
        <div className="text-white/70 text-xs">点击更换壁纸</div>
      </div>
    </div>
  );
}
