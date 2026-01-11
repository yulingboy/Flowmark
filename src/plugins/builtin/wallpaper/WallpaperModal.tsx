import { useState } from 'react';
import { Input, Button, Badge } from 'antd';
import { CheckOutlined, LinkOutlined, ReloadOutlined, ExpandOutlined } from '@ant-design/icons';
import { useBackgroundStore } from '@/features/settings/store/backgroundStore';
import { PRESET_WALLPAPERS, WALLPAPER_CATEGORIES } from '@/constants';

export function WallpaperModal() {
  const { backgroundUrl, updateBackgroundUrl, resetBackground } = useBackgroundStore();
  const [customUrl, setCustomUrl] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleCustomUrlSubmit = () => {
    if (customUrl.trim()) {
      updateBackgroundUrl(customUrl.trim());
      setCustomUrl('');
    }
  };

  const isCurrentWallpaper = (url: string) => backgroundUrl === url;

  // 根据分类筛选壁纸
  const filteredWallpapers = activeCategory === 'all' 
    ? PRESET_WALLPAPERS 
    : PRESET_WALLPAPERS.filter(wp => wp.category === activeCategory);

  // 获取分类壁纸数量
  const getCategoryCount = (categoryId: string) => {
    if (categoryId === 'all') return PRESET_WALLPAPERS.length;
    return PRESET_WALLPAPERS.filter(wp => wp.category === categoryId).length;
  };

  return (
    <div className="flex h-full">
      {/* 左侧分类导航 */}
      <div className="w-[140px] flex-shrink-0 border-r border-gray-100 bg-gray-50/50 flex flex-col">
        <div className="p-3 border-b border-gray-100">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">分类</span>
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          {WALLPAPER_CATEGORIES.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`w-full px-3 py-2.5 flex items-center justify-between text-left transition-all ${
                activeCategory === category.id 
                  ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-500' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <span>{category.icon}</span>
                <span className="text-sm">{category.name}</span>
              </div>
              <Badge 
                count={getCategoryCount(category.id)} 
                size="small"
                style={{ 
                  backgroundColor: activeCategory === category.id ? '#3b82f6' : '#e5e7eb',
                  color: activeCategory === category.id ? '#fff' : '#6b7280'
                }}
              />
            </button>
          ))}
        </div>
        
        {/* 自定义壁纸入口 */}
        <div className="p-3 border-t border-gray-100">
          <div className="text-xs text-gray-500 mb-2 flex items-center gap-1">
            <LinkOutlined />
            <span>自定义链接</span>
          </div>
          <Input 
            value={customUrl} 
            onChange={(e) => setCustomUrl(e.target.value)} 
            placeholder="输入图片 URL" 
            onPressEnter={handleCustomUrlSubmit}
            size="small"
            allowClear
            suffix={
              <Button 
                type="link" 
                size="small" 
                onClick={handleCustomUrlSubmit}
                disabled={!customUrl.trim()}
                className="!p-0"
              >
                应用
              </Button>
            }
          />
        </div>
      </div>

      {/* 右侧壁纸网格 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 顶部当前壁纸预览 */}
        <div className="p-4 border-b border-gray-100 bg-white">
          <div className="flex gap-4">
            <div className="w-48 h-28 rounded-lg overflow-hidden bg-gray-100 relative group flex-shrink-0">
              <img 
                src={backgroundUrl} 
                alt="当前壁纸" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                <span className="text-white text-xs bg-black/60 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  当前壁纸
                </span>
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-between py-1">
              <div>
                <div className="text-sm font-medium text-gray-700 mb-1">当前使用</div>
                <div className="text-xs text-gray-400 truncate max-w-[280px]" title={backgroundUrl}>
                  {backgroundUrl}
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  size="small"
                  icon={<ReloadOutlined />}
                  onClick={resetBackground}
                >
                  恢复默认
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* 壁纸网格 */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50/30">
          <div className="grid grid-cols-3 gap-3">
            {filteredWallpapers.map((wp) => (
              <div 
                key={wp.id} 
                role="button"
                tabIndex={0}
                onClick={() => updateBackgroundUrl(wp.url)}
                onDoubleClick={() => setPreviewUrl(wp.url)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    updateBackgroundUrl(wp.url);
                  }
                }}
                className={`group p-0 rounded-xl overflow-hidden cursor-pointer aspect-video border-2 relative transition-all hover:shadow-lg hover:-translate-y-0.5 ${
                  isCurrentWallpaper(wp.url) 
                    ? 'border-blue-500 ring-2 ring-blue-200 shadow-md' 
                    : 'border-transparent hover:border-gray-200'
                }`}
              >
                <img 
                  src={wp.url} 
                  alt={wp.name} 
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  loading="lazy"
                />
                
                {/* 选中标记 */}
                {isCurrentWallpaper(wp.url) && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                    <CheckOutlined style={{ color: 'white', fontSize: 12 }} />
                  </div>
                )}
                
                {/* 预览按钮 */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewUrl(wp.url);
                  }}
                  className="absolute top-2 left-2 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                >
                  <ExpandOutlined style={{ color: 'white', fontSize: 10 }} />
                </button>
                
                {/* 名称标签 */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-2 pt-6">
                  <span className="text-white text-xs font-medium">{wp.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 底部提示 */}
        <div className="px-4 py-2 border-t border-gray-100 bg-white">
          <span className="text-xs text-gray-400">
            💡 双击壁纸可预览大图 · 模糊和遮罩设置请前往「系统设置 → 壁纸」
          </span>
        </div>
      </div>

      {/* 大图预览遮罩 */}
      {previewUrl && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center cursor-pointer"
          onClick={() => setPreviewUrl(null)}
        >
          <img 
            src={previewUrl} 
            alt="预览" 
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
          />
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
            <Button 
              type="primary"
              onClick={(e) => {
                e.stopPropagation();
                updateBackgroundUrl(previewUrl);
                setPreviewUrl(null);
              }}
            >
              使用此壁纸
            </Button>
            <Button 
              onClick={(e) => {
                e.stopPropagation();
                setPreviewUrl(null);
              }}
            >
              关闭预览
            </Button>
          </div>
          <div className="absolute top-4 right-4 text-white/60 text-sm">
            按 ESC 或点击任意处关闭
          </div>
        </div>
      )}
    </div>
  );
}
