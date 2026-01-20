import { useState } from 'react';
import { Input, Button, Badge, message, Tabs, Upload, ColorPicker } from 'antd';
import { CheckOutlined, LinkOutlined, ReloadOutlined, ExpandOutlined, UploadOutlined, DeleteOutlined, BgColorsOutlined } from '@ant-design/icons';
import { useBackgroundStore } from '@/features/background';
import { PRESET_WALLPAPERS, WALLPAPER_CATEGORIES } from '@/constants';

/** 自定义壁纸存储 key */
const CUSTOM_WALLPAPERS_KEY = 'custom-wallpapers';

/** 预设纯色/渐变背景 */
const PRESET_COLORS = [
  { id: 'slate', name: '石板灰', color: '#1e293b' },
  { id: 'gray', name: '中性灰', color: '#374151' },
  { id: 'zinc', name: '锌灰', color: '#27272a' },
  { id: 'neutral', name: '暖灰', color: '#404040' },
  { id: 'stone', name: '石灰', color: '#44403c' },
  { id: 'red', name: '深红', color: '#7f1d1d' },
  { id: 'orange', name: '深橙', color: '#7c2d12' },
  { id: 'amber', name: '琥珀', color: '#78350f' },
  { id: 'yellow', name: '深黄', color: '#713f12' },
  { id: 'lime', name: '青柠', color: '#365314' },
  { id: 'green', name: '深绿', color: '#14532d' },
  { id: 'emerald', name: '翡翠', color: '#064e3b' },
  { id: 'teal', name: '青色', color: '#134e4a' },
  { id: 'cyan', name: '青蓝', color: '#164e63' },
  { id: 'sky', name: '天蓝', color: '#0c4a6e' },
  { id: 'blue', name: '深蓝', color: '#1e3a8a' },
  { id: 'indigo', name: '靛蓝', color: '#312e81' },
  { id: 'violet', name: '紫罗兰', color: '#4c1d95' },
  { id: 'purple', name: '深紫', color: '#581c87' },
  { id: 'fuchsia', name: '品红', color: '#701a75' },
  { id: 'pink', name: '深粉', color: '#831843' },
  { id: 'rose', name: '玫瑰', color: '#881337' },
];

/** 预设渐变背景 */
const PRESET_GRADIENTS = [
  { id: 'sunset', name: '日落', color: 'linear-gradient(135deg, #f97316 0%, #ec4899 100%)' },
  { id: 'ocean', name: '海洋', color: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)' },
  { id: 'forest', name: '森林', color: 'linear-gradient(135deg, #22c55e 0%, #0d9488 100%)' },
  { id: 'aurora', name: '极光', color: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)' },
  { id: 'fire', name: '火焰', color: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)' },
  { id: 'night', name: '夜空', color: 'linear-gradient(135deg, #1e293b 0%, #4c1d95 100%)' },
  { id: 'dawn', name: '黎明', color: 'linear-gradient(135deg, #fbbf24 0%, #f472b6 100%)' },
  { id: 'deep-sea', name: '深海', color: 'linear-gradient(135deg, #0f172a 0%, #0369a1 100%)' },
  { id: 'lavender', name: '薰衣草', color: 'linear-gradient(135deg, #a78bfa 0%, #f0abfc 100%)' },
  { id: 'mint', name: '薄荷', color: 'linear-gradient(135deg, #34d399 0%, #a7f3d0 100%)' },
  { id: 'peach', name: '蜜桃', color: 'linear-gradient(135deg, #fb923c 0%, #fda4af 100%)' },
  { id: 'cosmic', name: '宇宙', color: 'linear-gradient(135deg, #1e1b4b 0%, #7e22ce 50%, #0ea5e9 100%)' },
];

/** 获取自定义壁纸列表 */
function getCustomWallpapers(): string[] {
  try {
    const data = localStorage.getItem(CUSTOM_WALLPAPERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/** 保存自定义壁纸列表 */
function saveCustomWallpapers(urls: string[]) {
  localStorage.setItem(CUSTOM_WALLPAPERS_KEY, JSON.stringify(urls));
}

export function WallpaperModal() {
  const { backgroundType, backgroundUrl, backgroundColor, updateBackgroundUrl, updateBackgroundColor, resetBackground } = useBackgroundStore();
  const [customUrl, setCustomUrl] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [customWallpapers, setCustomWallpapers] = useState<string[]>(getCustomWallpapers);
  const [isValidating, setIsValidating] = useState(false);

  /** 验证图片 URL 是否有效 */
  const validateImageUrl = (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  };

  /** 添加远程图片 */
  const handleAddRemoteUrl = async () => {
    const url = customUrl.trim();
    if (!url) return;

    // 验证 URL 格式
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      message.error('请输入有效的图片链接（以 http:// 或 https:// 开头）');
      return;
    }

    setIsValidating(true);
    const isValid = await validateImageUrl(url);
    setIsValidating(false);

    if (!isValid) {
      message.error('无法加载该图片，请检查链接是否正确');
      return;
    }

    // 添加到自定义壁纸列表
    if (!customWallpapers.includes(url)) {
      const newList = [url, ...customWallpapers];
      setCustomWallpapers(newList);
      saveCustomWallpapers(newList);
    }

    // 应用壁纸
    updateBackgroundUrl(url);
    setCustomUrl('');
    message.success('壁纸已添加并应用');
  };

  /** 处理本地图片上传 */
  const handleFileUpload = (file: File) => {
    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      message.error('请选择图片文件');
      return false;
    }

    // 验证文件大小（最大 10MB）
    if (file.size > 10 * 1024 * 1024) {
      message.error('图片大小不能超过 10MB');
      return false;
    }

    // 转换为 base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      
      // 添加到自定义壁纸列表
      if (!customWallpapers.includes(base64)) {
        const newList = [base64, ...customWallpapers];
        setCustomWallpapers(newList);
        saveCustomWallpapers(newList);
      }

      // 应用壁纸
      updateBackgroundUrl(base64);
      message.success('壁纸已上传并应用');
    };
    reader.onerror = () => {
      message.error('图片读取失败');
    };
    reader.readAsDataURL(file);

    return false; // 阻止默认上传行为
  };

  /** 删除自定义壁纸 */
  const handleDeleteCustomWallpaper = (url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newList = customWallpapers.filter(u => u !== url);
    setCustomWallpapers(newList);
    saveCustomWallpapers(newList);
    
    // 如果删除的是当前壁纸，恢复默认
    if (backgroundUrl === url) {
      resetBackground();
    }
    message.success('已删除');
  };

  const isCurrentWallpaper = (url: string) => backgroundType === 'image' && backgroundUrl === url;
  const isCurrentColor = (color: string) => backgroundType === 'color' && backgroundColor === color;

  // 根据分类筛选壁纸
  const filteredWallpapers = activeCategory === 'all' 
    ? PRESET_WALLPAPERS 
    : activeCategory === 'custom' || activeCategory === 'colors'
    ? []
    : PRESET_WALLPAPERS.filter(wp => wp.category === activeCategory);

  // 获取分类壁纸数量
  const getCategoryCount = (categoryId: string) => {
    if (categoryId === 'all') return PRESET_WALLPAPERS.length;
    if (categoryId === 'custom') return customWallpapers.length;
    if (categoryId === 'colors') return PRESET_COLORS.length + PRESET_GRADIENTS.length;
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
          
          {/* 我的壁纸分类 */}
          <button
            onClick={() => setActiveCategory('custom')}
            className={`w-full px-3 py-2.5 flex items-center justify-between text-left transition-all ${
              activeCategory === 'custom' 
                ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-500' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-2">
              <span>📁</span>
              <span className="text-sm">我的壁纸</span>
            </div>
            <Badge 
              count={customWallpapers.length} 
              size="small"
              style={{ 
                backgroundColor: activeCategory === 'custom' ? '#3b82f6' : '#e5e7eb',
                color: activeCategory === 'custom' ? '#fff' : '#6b7280'
              }}
            />
          </button>
          
          {/* 纯色背景分类 */}
          <button
            onClick={() => setActiveCategory('colors')}
            className={`w-full px-3 py-2.5 flex items-center justify-between text-left transition-all ${
              activeCategory === 'colors' 
                ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-500' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-2">
              <BgColorsOutlined />
              <span className="text-sm">纯色背景</span>
            </div>
            <Badge 
              count={PRESET_COLORS.length + PRESET_GRADIENTS.length} 
              size="small"
              style={{ 
                backgroundColor: activeCategory === 'colors' ? '#3b82f6' : '#e5e7eb',
                color: activeCategory === 'colors' ? '#fff' : '#6b7280'
              }}
            />
          </button>
        </div>
      </div>

      {/* 右侧壁纸网格 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 顶部当前壁纸预览 */}
        <div className="p-4 border-b border-gray-100 bg-white">
          <div className="flex gap-4">
            <div className="w-48 h-28 rounded-lg overflow-hidden bg-gray-100 relative group flex-shrink-0">
              {backgroundType === 'color' ? (
                <div 
                  className="w-full h-full"
                  style={{ background: backgroundColor }}
                />
              ) : (
                <img 
                  src={backgroundUrl} 
                  alt="当前壁纸" 
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                <span className="text-white text-xs bg-black/60 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  当前背景
                </span>
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-between py-1">
              <div>
                <div className="text-sm font-medium text-gray-700 mb-1">当前使用</div>
                <div className="text-xs text-gray-400 truncate max-w-[280px]" title={backgroundType === 'color' ? backgroundColor : backgroundUrl}>
                  {backgroundType === 'color' 
                    ? (backgroundColor.includes('gradient') ? '渐变背景' : `纯色背景 ${backgroundColor}`)
                    : backgroundUrl.startsWith('data:') ? '本地上传图片' : backgroundUrl}
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
          {activeCategory === 'colors' ? (
            /* 纯色背景区域 */
            <div className="space-y-6">
              {/* 自定义颜色选择器 */}
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">自定义颜色</span>
                  <ColorPicker
                    value={backgroundColor}
                    onChange={(color) => updateBackgroundColor(color.toHexString())}
                    showText
                    presets={[
                      {
                        label: '推荐颜色',
                        colors: PRESET_COLORS.slice(0, 12).map(c => c.color),
                      },
                    ]}
                  />
                </div>
                <p className="text-xs text-gray-400">点击颜色选择器自定义任意颜色</p>
              </div>

              {/* 预设纯色 */}
              <div>
                <div className="text-sm font-medium text-gray-700 mb-3">纯色</div>
                <div className="grid grid-cols-6 gap-2">
                  {PRESET_COLORS.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => updateBackgroundColor(item.color)}
                      className={`aspect-square rounded-lg transition-all hover:scale-105 hover:shadow-md relative group ${
                        isCurrentColor(item.color) 
                          ? 'ring-2 ring-blue-500 ring-offset-2' 
                          : ''
                      }`}
                      style={{ backgroundColor: item.color }}
                      title={item.name}
                    >
                      {isCurrentColor(item.color) && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <CheckOutlined style={{ color: 'white', fontSize: 14 }} />
                        </div>
                      )}
                      <div className="absolute inset-x-0 bottom-0 bg-black/50 text-white text-[10px] py-0.5 text-center opacity-0 group-hover:opacity-100 transition-opacity rounded-b-lg">
                        {item.name}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 预设渐变 */}
              <div>
                <div className="text-sm font-medium text-gray-700 mb-3">渐变</div>
                <div className="grid grid-cols-4 gap-3">
                  {PRESET_GRADIENTS.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => updateBackgroundColor(item.color)}
                      className={`aspect-video rounded-lg transition-all hover:scale-105 hover:shadow-md relative group ${
                        isCurrentColor(item.color) 
                          ? 'ring-2 ring-blue-500 ring-offset-2' 
                          : ''
                      }`}
                      style={{ background: item.color }}
                      title={item.name}
                    >
                      {isCurrentColor(item.color) && (
                        <div className="absolute top-1 right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <CheckOutlined style={{ color: 'white', fontSize: 10 }} />
                        </div>
                      )}
                      <div className="absolute inset-x-0 bottom-0 bg-black/50 text-white text-xs py-1 text-center opacity-0 group-hover:opacity-100 transition-opacity rounded-b-lg">
                        {item.name}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : activeCategory === 'custom' ? (
            /* 自定义壁纸区域 */
            <div className="space-y-4">
              {/* 添加壁纸操作区 */}
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <Tabs
                  size="small"
                  items={[
                    {
                      key: 'upload',
                      label: (
                        <span className="flex items-center gap-1">
                          <UploadOutlined />
                          本地上传
                        </span>
                      ),
                      children: (
                        <div className="pt-2">
                          <Upload.Dragger
                            accept="image/*"
                            showUploadList={false}
                            beforeUpload={handleFileUpload}
                            className="!border-dashed"
                          >
                            <p className="text-gray-400 mb-2">
                              <UploadOutlined style={{ fontSize: 32 }} />
                            </p>
                            <p className="text-sm text-gray-600">点击或拖拽图片到此处上传</p>
                            <p className="text-xs text-gray-400 mt-1">支持 JPG、PNG、GIF，最大 10MB</p>
                          </Upload.Dragger>
                        </div>
                      ),
                    },
                    {
                      key: 'url',
                      label: (
                        <span className="flex items-center gap-1">
                          <LinkOutlined />
                          远程链接
                        </span>
                      ),
                      children: (
                        <div className="pt-2">
                          <Input.Search
                            value={customUrl}
                            onChange={(e) => setCustomUrl(e.target.value)}
                            placeholder="输入图片 URL（https://...）"
                            enterButton={isValidating ? '验证中...' : '添加'}
                            loading={isValidating}
                            onSearch={handleAddRemoteUrl}
                            allowClear
                          />
                          <p className="text-xs text-gray-400 mt-2">
                            💡 支持任意公开可访问的图片链接
                          </p>
                        </div>
                      ),
                    },
                  ]}
                />
              </div>

              {/* 自定义壁纸列表 */}
              {customWallpapers.length > 0 ? (
                <div className="grid grid-cols-3 gap-3">
                  {customWallpapers.map((url, index) => (
                    <div 
                      key={index}
                      role="button"
                      tabIndex={0}
                      onClick={() => updateBackgroundUrl(url)}
                      onDoubleClick={() => setPreviewUrl(url)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          updateBackgroundUrl(url);
                        }
                      }}
                      className={`group p-0 rounded-xl overflow-hidden cursor-pointer aspect-video border-2 relative transition-all hover:shadow-lg hover:-translate-y-0.5 ${
                        isCurrentWallpaper(url) 
                          ? 'border-blue-500 ring-2 ring-blue-200 shadow-md' 
                          : 'border-transparent hover:border-gray-200'
                      }`}
                    >
                      <img 
                        src={url} 
                        alt={`自定义壁纸 ${index + 1}`}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        loading="lazy"
                      />
                      
                      {/* 选中标记 */}
                      {isCurrentWallpaper(url) && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                          <CheckOutlined style={{ color: 'white', fontSize: 12 }} />
                        </div>
                      )}
                      
                      {/* 操作按钮 */}
                      <div className="absolute top-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewUrl(url);
                          }}
                          className="w-6 h-6 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70"
                        >
                          <ExpandOutlined style={{ color: 'white', fontSize: 10 }} />
                        </button>
                        <button
                          onClick={(e) => handleDeleteCustomWallpaper(url, e)}
                          className="w-6 h-6 bg-red-500/80 rounded-full flex items-center justify-center hover:bg-red-600"
                        >
                          <DeleteOutlined style={{ color: 'white', fontSize: 10 }} />
                        </button>
                      </div>
                      
                      {/* 标签 */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-2 pt-6">
                        <span className="text-white text-xs font-medium">
                          {url.startsWith('data:') ? '本地图片' : '远程图片'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <div className="text-4xl mb-3">📷</div>
                  <div className="text-sm">还没有自定义壁纸</div>
                  <div className="text-xs mt-1">上传本地图片或添加远程链接</div>
                </div>
              )}
            </div>
          ) : (
            /* 预设壁纸网格 */
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
          )}
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
