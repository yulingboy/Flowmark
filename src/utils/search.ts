import type { SearchEngine } from '@/types';

// 搜索引擎 URL 模板
const SEARCH_ENGINES: Record<SearchEngine, string> = {
  bing: 'https://www.bing.com/search?q=',
  google: 'https://www.google.com/search?q=',
  baidu: 'https://www.baidu.com/s?wd=',
};

// 搜索引擎图标（使用 favicon）
export const SEARCH_ENGINE_ICONS: Record<SearchEngine, string> = {
  bing: 'https://www.bing.com/favicon.ico',
  google: 'https://www.google.com/favicon.ico',
  baidu: 'https://www.baidu.com/favicon.ico',
};

/**
 * 生成搜索 URL
 * @param query 搜索查询
 * @param engine 搜索引擎
 * @returns 完整的搜索 URL
 */
export function generateSearchUrl(query: string, engine: SearchEngine = 'bing'): string {
  const encodedQuery = encodeURIComponent(query);
  return `${SEARCH_ENGINES[engine]}${encodedQuery}`;
}

/**
 * 执行搜索（在新标签页打开）
 */
export function performSearch(query: string, engine: SearchEngine = 'bing'): void {
  if (!query.trim()) return;
  const url = generateSearchUrl(query, engine);
  window.open(url, '_blank');
}
