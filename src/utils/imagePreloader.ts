/**
 * 图片预加载工具
 * 支持单图/批量预加载，带并发限制
 */

export interface PreloadOptions {
  priority?: 'high' | 'low';
  maxConcurrent?: number;
}

// 默认最大并发数
const DEFAULT_MAX_CONCURRENT = 3;

// 预加载缓存
const preloadCache = new Set<string>();

// 当前活跃的预加载请求数
let activeRequests = 0;

// 等待队列
const pendingQueue: Array<{ src: string; resolve: () => void; reject: (err: Error) => void }> = [];

/**
 * 处理队列中的下一个请求
 */
function processQueue(maxConcurrent: number): void {
  while (activeRequests < maxConcurrent && pendingQueue.length > 0) {
    const next = pendingQueue.shift();
    if (next) {
      executePreload(next.src, maxConcurrent)
        .then(next.resolve)
        .catch(next.reject);
    }
  }
}

/**
 * 执行单个预加载
 */
function executePreload(src: string, maxConcurrent: number): Promise<void> {
  return new Promise((resolve, reject) => {
    activeRequests++;
    
    const img = new Image();
    
    img.onload = () => {
      preloadCache.add(src);
      activeRequests--;
      processQueue(maxConcurrent);
      resolve();
    };
    
    img.onerror = () => {
      activeRequests--;
      processQueue(maxConcurrent);
      reject(new Error(`Failed to preload image: ${src}`));
    };
    
    img.src = src;
  });
}

/**
 * 预加载单张图片
 * @param src 图片 URL
 * @param options 预加载选项
 */
export function preloadImage(src: string, options: PreloadOptions = {}): Promise<void> {
  const { maxConcurrent = DEFAULT_MAX_CONCURRENT } = options;
  
  // 已缓存，直接返回
  if (preloadCache.has(src)) {
    return Promise.resolve();
  }
  
  // 检查并发限制
  if (activeRequests >= maxConcurrent) {
    return new Promise((resolve, reject) => {
      pendingQueue.push({ src, resolve, reject });
    });
  }
  
  return executePreload(src, maxConcurrent);
}

/**
 * 批量预加载图片
 * @param srcs 图片 URL 数组
 * @param options 预加载选项
 */
export function preloadImages(srcs: string[], options: PreloadOptions = {}): Promise<void[]> {
  return Promise.all(srcs.map(src => preloadImage(src, options).catch(() => {}))) as Promise<void[]>;
}

/**
 * 检查图片是否已预加载
 */
export function isPreloaded(src: string): boolean {
  return preloadCache.has(src);
}

/**
 * 获取当前活跃请求数（用于测试）
 */
export function getActiveRequestCount(): number {
  return activeRequests;
}

/**
 * 获取等待队列长度（用于测试）
 */
export function getPendingQueueLength(): number {
  return pendingQueue.length;
}

/**
 * 清除预加载缓存（用于测试）
 */
export function clearPreloadCache(): void {
  preloadCache.clear();
  activeRequests = 0;
  pendingQueue.length = 0;
}
