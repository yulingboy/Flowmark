import { SEARCH } from '@/constants';
import { isValidUrl } from './urlValidation';

/**
 * 添加搜索记录到历史
 * - 去重：如果已存在则移到最前面
 * - 限制最大数量
 * - 过滤 URL：不添加 URL 到历史记录
 * 
 * @param history - 当前历史记录数组
 * @param query - 要添加的查询字符串
 * @returns 更新后的历史记录数组
 */
export function addToHistory(history: string[], query: string): string[] {
  const trimmed = query.trim();
  if (!trimmed) return history;
  
  // 不添加 URL 到历史记录
  if (isValidUrl(trimmed)) {
    return history;
  }
  
  const filtered = history.filter(item => item !== trimmed);
  return [trimmed, ...filtered].slice(0, SEARCH.MAX_HISTORY_ITEMS);
}

/**
 * 从历史中移除指定记录
 */
export function removeFromHistory(history: string[], query: string): string[] {
  return history.filter(item => item !== query);
}
