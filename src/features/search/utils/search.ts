import type { SearchEngine } from '@/types';

/**
 * 搜索引擎配置接口
 */
export interface SearchEngineConfig {
  name: string;
  urlTemplate: string;
  faviconUrl: string;
}

/**
 * 搜索引擎配置
 */
export const SEARCH_ENGINE_CONFIGS: Record<SearchEngine, SearchEngineConfig> = {
  bing: {
    name: 'Bing',
    urlTemplate: 'https://www.bing.com/search?q=',
    faviconUrl: 'https://www.bing.com/favicon.ico',
  },
  google: {
    name: 'Google',
    urlTemplate: 'https://www.google.com/search?q=',
    faviconUrl: 'https://www.google.com/favicon.ico',
  },
  baidu: {
    name: 'Baidu',
    urlTemplate: 'https://www.baidu.com/s?wd=',
    faviconUrl: 'https://www.baidu.com/favicon.ico',
  },
};

/**
 * 生成搜索 URL
 * @param query 搜索查询
 * @param engine 搜索引擎
 * @returns 完整的搜索 URL
 */
export function generateSearchUrl(query: string, engine: SearchEngine = 'bing'): string {
  const config = SEARCH_ENGINE_CONFIGS[engine];
  const encodedQuery = encodeURIComponent(query);
  return `${config.urlTemplate}${encodedQuery}`;
}

/**
 * 执行搜索
 * @param query 搜索查询
 * @param engine 搜索引擎
 * @param newTab 是否在新标签页打开
 */
export function performSearch(query: string, engine: SearchEngine = 'bing', newTab = true): void {
  if (!query.trim()) return;
  const url = generateSearchUrl(query, engine);
  if (newTab) {
    window.open(url, '_blank');
  } else {
    window.location.href = url;
  }
}

