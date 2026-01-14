import type { SearchEngine } from '@/types';

/**
 * Search engine configuration interface
 */
export interface SearchEngineConfig {
  name: string;
  urlTemplate: string;
  faviconUrl: string;
}

/**
 * Search engine configurations
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

// 搜索引擎 URL 模板（向后兼容）
const SEARCH_ENGINES: Record<SearchEngine, string> = {
  bing: SEARCH_ENGINE_CONFIGS.bing.urlTemplate,
  google: SEARCH_ENGINE_CONFIGS.google.urlTemplate,
  baidu: SEARCH_ENGINE_CONFIGS.baidu.urlTemplate,
};

// 搜索引擎图标（向后兼容）
export const SEARCH_ENGINE_ICONS: Record<SearchEngine, string> = {
  bing: SEARCH_ENGINE_CONFIGS.bing.faviconUrl,
  google: SEARCH_ENGINE_CONFIGS.google.faviconUrl,
  baidu: SEARCH_ENGINE_CONFIGS.baidu.faviconUrl,
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
 * 执行搜索
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
