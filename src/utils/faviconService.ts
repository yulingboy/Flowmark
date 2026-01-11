/**
 * 增强的图标服务
 * 支持多源回退、内存缓存、占位符生成
 */

// 缓存条目接口
interface FaviconCacheEntry {
  url: string;
  fetchedAt: number;
}

// 服务配置
interface FaviconServiceConfig {
  cacheTTL: number;        // 缓存过期时间（毫秒）
  maxCacheSize: number;    // 最大缓存数量
  defaultSize: number;     // 默认图标尺寸
}

// 默认配置
const DEFAULT_CONFIG: FaviconServiceConfig = {
  cacheTTL: 24 * 60 * 60 * 1000, // 24小时
  maxCacheSize: 500,
  defaultSize: 64,
};

// 有效的图标尺寸
const VALID_SIZES = [16, 32, 64, 128, 256] as const;
type ValidSize = typeof VALID_SIZES[number];

// 内存缓存
const faviconCache = new Map<string, FaviconCacheEntry>();

// 预加载队列
const preloadQueue = new Set<string>();
const MAX_CONCURRENT_PRELOADS = 3;
let activePreloads = 0;

/**
 * 生成缓存键
 */
function getCacheKey(domain: string, size: number): string {
  return `${domain}:${size}`;
}

/**
 * 从 URL 提取域名
 */
function extractDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    // 如果不是有效 URL，尝试直接使用
    return url.replace(/^(https?:\/\/)?/, '').split('/')[0];
  }
}

/**
 * 生成占位符 SVG（使用首字母）
 */
export function generatePlaceholder(name: string, size: number = 64): string {
  const letter = (name || '?')[0].toUpperCase();
  const colors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', 
    '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
  ];
  // 基于名称生成一致的颜色
  const colorIndex = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
  const bgColor = colors[colorIndex];
  
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="${bgColor}"/>
    <text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" 
          fill="white" font-family="system-ui, sans-serif" font-weight="600" 
          font-size="${size * 0.5}">${letter}</text>
  </svg>`;
  
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

/**
 * 获取图标源列表（按优先级排序）
 */
function getFaviconSources(domain: string, size: number): string[] {
  return [
    `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`,
    `https://icons.duckduckgo.com/ip3/${domain}.ico`,
    `https://${domain}/favicon.ico`,
  ];
}

/**
 * 验证图标尺寸
 */
function validateSize(size: number): ValidSize {
  if (VALID_SIZES.includes(size as ValidSize)) {
    return size as ValidSize;
  }
  // 找到最接近的有效尺寸
  return VALID_SIZES.reduce((prev, curr) => 
    Math.abs(curr - size) < Math.abs(prev - size) ? curr : prev
  );
}

/**
 * 清理过期缓存
 */
function cleanExpiredCache(config: FaviconServiceConfig = DEFAULT_CONFIG): void {
  const now = Date.now();
  for (const [key, entry] of faviconCache.entries()) {
    if (now - entry.fetchedAt > config.cacheTTL) {
      faviconCache.delete(key);
    }
  }
  
  // 如果缓存仍然过大，删除最旧的条目
  if (faviconCache.size > config.maxCacheSize) {
    const entries = Array.from(faviconCache.entries())
      .sort((a, b) => a[1].fetchedAt - b[1].fetchedAt);
    const toDelete = entries.slice(0, faviconCache.size - config.maxCacheSize);
    toDelete.forEach(([key]) => faviconCache.delete(key));
  }
}

/**
 * 获取图标 URL（同步版本，用于兼容现有代码）
 * 返回第一个可用源的 URL，不进行实际验证
 */
export function getFaviconUrl(url: string, size: number = DEFAULT_CONFIG.defaultSize): string {
  const domain = extractDomain(url);
  const validSize = validateSize(size);
  const cacheKey = getCacheKey(domain, validSize);
  
  // 检查缓存
  const cached = faviconCache.get(cacheKey);
  if (cached && Date.now() - cached.fetchedAt < DEFAULT_CONFIG.cacheTTL) {
    return cached.url;
  }
  
  // 返回 Google 服务 URL（最可靠的源）
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=${validSize}`;
  
  // 更新缓存
  faviconCache.set(cacheKey, {
    url: faviconUrl,
    fetchedAt: Date.now(),
  });
  
  // 清理过期缓存
  if (faviconCache.size > DEFAULT_CONFIG.maxCacheSize * 0.9) {
    cleanExpiredCache();
  }
  
  return faviconUrl;
}


/**
 * 异步获取图标 URL（带回退机制）
 * 尝试多个源，返回第一个成功加载的
 */
export async function getFaviconUrlAsync(
  url: string, 
  size: number = DEFAULT_CONFIG.defaultSize
): Promise<string> {
  const domain = extractDomain(url);
  const validSize = validateSize(size);
  const cacheKey = getCacheKey(domain, validSize);
  
  // 检查缓存
  const cached = faviconCache.get(cacheKey);
  if (cached && Date.now() - cached.fetchedAt < DEFAULT_CONFIG.cacheTTL) {
    return cached.url;
  }
  
  const sources = getFaviconSources(domain, validSize);
  
  // 尝试每个源
  for (const source of sources) {
    try {
      const isValid = await validateImageUrl(source);
      if (isValid) {
        // 缓存成功的 URL
        faviconCache.set(cacheKey, {
          url: source,
          fetchedAt: Date.now(),
        });
        return source;
      }
    } catch {
      // 继续尝试下一个源
    }
  }
  
  // 所有源都失败，返回占位符
  const placeholder = generatePlaceholder(domain, validSize);
  faviconCache.set(cacheKey, {
    url: placeholder,
    fetchedAt: Date.now(),
  });
  
  return placeholder;
}

/**
 * 验证图片 URL 是否可访问
 */
async function validateImageUrl(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img.width > 0 && img.height > 0);
    img.onerror = () => resolve(false);
    img.src = url;
    
    // 超时处理
    setTimeout(() => resolve(false), 5000);
  });
}

/**
 * 预加载单个图标
 */
async function preloadSingle(url: string, size: number): Promise<void> {
  if (activePreloads >= MAX_CONCURRENT_PRELOADS) {
    preloadQueue.add(`${url}:${size}`);
    return;
  }
  
  activePreloads++;
  try {
    await getFaviconUrlAsync(url, size);
  } finally {
    activePreloads--;
    processPreloadQueue();
  }
}

/**
 * 处理预加载队列
 */
function processPreloadQueue(): void {
  if (preloadQueue.size === 0 || activePreloads >= MAX_CONCURRENT_PRELOADS) {
    return;
  }
  
  const next = preloadQueue.values().next().value;
  if (next) {
    preloadQueue.delete(next);
    const [url, sizeStr] = next.split(':');
    preloadSingle(url, parseInt(sizeStr, 10) || DEFAULT_CONFIG.defaultSize);
  }
}

/**
 * 预加载多个图标
 */
export async function preloadFavicons(
  urls: string[], 
  size: number = DEFAULT_CONFIG.defaultSize
): Promise<void> {
  const promises = urls.map(url => preloadSingle(url, size));
  await Promise.allSettled(promises);
}

/**
 * 清除缓存
 */
export function clearFaviconCache(): void {
  faviconCache.clear();
  preloadQueue.clear();
}

/**
 * 获取缓存统计
 */
export function getCacheStats(): { size: number; maxSize: number } {
  return {
    size: faviconCache.size,
    maxSize: DEFAULT_CONFIG.maxCacheSize,
  };
}
