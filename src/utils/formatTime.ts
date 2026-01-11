/**
 * 格式化缓存时间为相对时间
 * @param timestamp 时间戳
 */
export function formatCacheAge(timestamp: number): string {
  const now = Date.now();
  const diff = Math.floor((now - timestamp) / 1000);
  
  if (diff < 60) return '刚刚更新';
  if (diff < 3600) return `${Math.floor(diff / 60)} 分钟前更新`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} 小时前更新`;
  return `${Math.floor(diff / 86400)} 天前更新`;
}
