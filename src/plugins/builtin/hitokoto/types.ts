export const PLUGIN_ID = 'hitokoto';

/** 一言数据 */
export interface HitokotoData {
  id: number;
  uuid: string;
  hitokoto: string;
  type: string;
  from: string;
  from_who: string | null;
  creator: string;
  creator_uid: number;
  reviewer: number;
  commit_from: string;
  created_at: string;
  length: number;
}

/** 一言类型 */
export const HITOKOTO_TYPES: Record<string, string> = {
  'a': '动画',
  'b': '漫画',
  'c': '游戏',
  'd': '文学',
  'e': '原创',
  'f': '来自网络',
  'g': '其他',
  'h': '影视',
  'i': '诗词',
  'j': '网易云',
  'k': '哲学',
  'l': '抖机灵',
};

/** 一言配置 */
export interface HitokotoConfig {
  types: string[];
  autoRefresh: boolean;
  refreshInterval: number;
}

/** 一言缓存 */
export interface HitokotoCache {
  data: HitokotoData;
  timestamp: number;
}

/** 获取类型名称 */
export function getTypeName(type: string): string {
  return HITOKOTO_TYPES[type] || '其他';
}
