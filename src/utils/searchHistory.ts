import { SEARCH } from '@/constants';

/**
 * 添加搜索记录到历史
 * - 去重：如果已存在则移到最前面
 * - 限制最大数量
 */
export function addToHistory(history: string[], query: string): string[] {
  const trimmed = query.trim();
  if (!trimmed) return history;
  const filtered = history.filter(item => item !== trimmed);
  return [trimmed, ...filtered].slice(0, SEARCH.MAX_HISTORY_ITEMS);
}

/**
 * 从历史中移除指定记录
 */
export function removeFromHistory(history: string[], query: string): string[] {
  return history.filter(item => item !== query);
}
