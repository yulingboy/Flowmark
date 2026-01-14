/**
 * 壁纸相关常量
 */

/**
 * 壁纸分类
 */
export const WALLPAPER_CATEGORIES = [
  { id: 'all', name: '全部', icon: '🎨' },
  { id: 'nature', name: '自然', icon: '🏔️' },
  { id: 'city', name: '城市', icon: '🌃' },
  { id: 'abstract', name: '抽象', icon: '🎭' },
  { id: 'minimal', name: '简约', icon: '◻️' },
] as const;

/**
 * 预设壁纸列表
 */
export const PRESET_WALLPAPERS = [
  // 自然风景
  { id: '1', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80', name: '山峰', category: 'nature' },
  { id: '2', url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920&q=80', name: '森林', category: 'nature' },
  { id: '3', url: 'https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=1920&q=80', name: '海洋', category: 'nature' },
  { id: '4', url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920&q=80', name: '雪山', category: 'nature' },
  { id: '5', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80', name: '峡谷', category: 'nature' },
  { id: '6', url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1920&q=80', name: '湖泊', category: 'nature' },
  { id: '7', url: 'https://images.unsplash.com/photo-1518173946687-a4c036bc3c95?w=1920&q=80', name: '极光', category: 'nature' },
  { id: '8', url: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=1920&q=80', name: '日落', category: 'nature' },
  // 城市
  { id: '9', url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1920&q=80', name: '东京', category: 'city' },
  { id: '10', url: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1920&q=80', name: '纽约', category: 'city' },
  { id: '11', url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1920&q=80', name: '京都', category: 'city' },
  { id: '12', url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1920&q=80', name: '巴黎', category: 'city' },
  // 抽象
  { id: '13', url: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=1920&q=80', name: '流彩', category: 'abstract' },
  { id: '14', url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1920&q=80', name: '渐变', category: 'abstract' },
  { id: '15', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1920&q=80', name: '几何', category: 'abstract' },
  { id: '16', url: 'https://images.unsplash.com/photo-1550859492-d5da9d8e45f3?w=1920&q=80', name: '光影', category: 'abstract' },
  // 简约
  { id: '17', url: 'https://images.unsplash.com/photo-1553356084-58ef4a67b2a7?w=1920&q=80', name: '纯色', category: 'minimal' },
  { id: '18', url: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=1920&q=80', name: '线条', category: 'minimal' },
  { id: '19', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&q=80', name: '留白', category: 'minimal' },
  { id: '20', url: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=1920&q=80', name: '水墨', category: 'minimal' },
] as const;
