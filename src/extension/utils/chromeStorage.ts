/**
 * Chrome Storage 服务
 * 
 * 提供统一的存储接口，支持 Chrome 扩展环境和普通网页环境。
 * 在扩展环境中使用 chrome.storage.local，在普通网页环境中回退到 localStorage。
 * 
 * @module extension/utils/chromeStorage
 */

/**
 * Chrome Storage 服务接口
 */
export interface ChromeStorageService {
  /** 获取存储数据 */
  get<T>(key: string): Promise<T | null>;
  
  /** 设置存储数据 */
  set<T>(key: string, value: T): Promise<void>;
  
  /** 删除存储数据 */
  remove(key: string): Promise<void>;
  
  /** 监听数据变更 */
  subscribe(key: string, callback: (newValue: unknown, oldValue: unknown) => void): () => void;
}

/**
 * 存储变更监听器类型
 */
type StorageChangeListener = (newValue: unknown, oldValue: unknown) => void;

/**
 * 检测当前是否在 Chrome 扩展环境中
 * 
 * @returns 如果在扩展环境中返回 true，否则返回 false
 */
export function isExtensionEnvironment(): boolean {
  return (
    typeof chrome !== 'undefined' &&
    chrome.storage !== undefined &&
    chrome.storage.local !== undefined
  );
}

/**
 * 存储变更监听器管理
 * 用于管理所有 key 的监听器
 */
const listeners = new Map<string, Set<StorageChangeListener>>();

/**
 * 全局 chrome.storage.onChanged 监听器是否已注册
 */
let globalListenerRegistered = false;

/**
 * 注册全局 chrome.storage.onChanged 监听器
 * 只在扩展环境中注册一次
 */
function registerGlobalListener(): void {
  if (globalListenerRegistered || !isExtensionEnvironment()) {
    return;
  }

  chrome.storage.onChanged.addListener(
    (changes: { [key: string]: chrome.storage.StorageChange }, areaName: string) => {
      // 只处理 local 存储区域的变更
      if (areaName !== 'local') {
        return;
      }

      // 遍历所有变更的 key
      for (const [key, change] of Object.entries(changes)) {
        const keyListeners = listeners.get(key);
        if (keyListeners) {
          // 通知所有监听该 key 的回调
          for (const callback of keyListeners) {
            try {
              callback(change.newValue, change.oldValue);
            } catch (error) {
              console.error(`[ChromeStorage] 监听器回调执行失败 (key: ${key}):`, error);
            }
          }
        }
      }
    }
  );

  globalListenerRegistered = true;
}

/**
 * Chrome Storage 服务实现
 * 
 * 在扩展环境中使用 chrome.storage.local，
 * 在普通网页环境中回退到 localStorage（用于开发调试）。
 */
export const chromeStorage: ChromeStorageService = {
  /**
   * 获取存储数据
   * 
   * @param key 存储键名
   * @returns 存储的数据，如果不存在返回 null
   */
  async get<T>(key: string): Promise<T | null> {
    if (isExtensionEnvironment()) {
      try {
        const result = await chrome.storage.local.get(key);
        return (result[key] as T) ?? null;
      } catch (error) {
        console.error(`[ChromeStorage] 读取数据失败 (key: ${key}):`, error);
        return null;
      }
    }

    // 回退到 localStorage
    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return null;
      }
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`[ChromeStorage] localStorage 读取失败 (key: ${key}):`, error);
      return null;
    }
  },

  /**
   * 设置存储数据
   * 
   * @param key 存储键名
   * @param value 要存储的数据
   */
  async set<T>(key: string, value: T): Promise<void> {
    if (isExtensionEnvironment()) {
      try {
        await chrome.storage.local.set({ [key]: value });
      } catch (error) {
        console.error(`[ChromeStorage] 写入数据失败 (key: ${key}):`, error);
        throw error;
      }
      return;
    }

    // 回退到 localStorage
    try {
      const oldValue = localStorage.getItem(key);
      const oldParsed = oldValue ? JSON.parse(oldValue) : undefined;
      
      localStorage.setItem(key, JSON.stringify(value));
      
      // 在非扩展环境中手动触发监听器
      const keyListeners = listeners.get(key);
      if (keyListeners) {
        for (const callback of keyListeners) {
          try {
            callback(value, oldParsed);
          } catch (error) {
            console.error(`[ChromeStorage] 监听器回调执行失败 (key: ${key}):`, error);
          }
        }
      }
    } catch (error) {
      console.error(`[ChromeStorage] localStorage 写入失败 (key: ${key}):`, error);
      throw error;
    }
  },

  /**
   * 删除存储数据
   * 
   * @param key 存储键名
   */
  async remove(key: string): Promise<void> {
    if (isExtensionEnvironment()) {
      try {
        await chrome.storage.local.remove(key);
      } catch (error) {
        console.error(`[ChromeStorage] 删除数据失败 (key: ${key}):`, error);
        throw error;
      }
      return;
    }

    // 回退到 localStorage
    try {
      const oldValue = localStorage.getItem(key);
      const oldParsed = oldValue ? JSON.parse(oldValue) : undefined;
      
      localStorage.removeItem(key);
      
      // 在非扩展环境中手动触发监听器
      const keyListeners = listeners.get(key);
      if (keyListeners) {
        for (const callback of keyListeners) {
          try {
            callback(undefined, oldParsed);
          } catch (error) {
            console.error(`[ChromeStorage] 监听器回调执行失败 (key: ${key}):`, error);
          }
        }
      }
    } catch (error) {
      console.error(`[ChromeStorage] localStorage 删除失败 (key: ${key}):`, error);
      throw error;
    }
  },

  /**
   * 监听数据变更
   * 
   * 在扩展环境中使用 chrome.storage.onChanged 事件，
   * 在普通网页环境中通过 set/remove 方法手动触发。
   * 
   * @param key 要监听的存储键名
   * @param callback 变更回调函数，接收新值和旧值
   * @returns 取消订阅函数
   */
  subscribe(key: string, callback: StorageChangeListener): () => void {
    // 确保全局监听器已注册（仅在扩展环境中）
    registerGlobalListener();

    // 获取或创建该 key 的监听器集合
    let keyListeners = listeners.get(key);
    if (!keyListeners) {
      keyListeners = new Set();
      listeners.set(key, keyListeners);
    }

    // 添加监听器
    keyListeners.add(callback);

    // 返回取消订阅函数
    return () => {
      const currentListeners = listeners.get(key);
      if (currentListeners) {
        currentListeners.delete(callback);
        // 如果没有监听器了，清理 Map 条目
        if (currentListeners.size === 0) {
          listeners.delete(key);
        }
      }
    };
  }
};

/**
 * 清除所有监听器（用于测试）
 */
export function clearAllListeners(): void {
  listeners.clear();
}

/**
 * 获取当前监听器数量（用于测试）
 * 
 * @param key 可选的键名，如果提供则返回该键的监听器数量
 * @returns 监听器数量
 */
export function getListenerCount(key?: string): number {
  if (key) {
    return listeners.get(key)?.size ?? 0;
  }
  let total = 0;
  for (const keyListeners of listeners.values()) {
    total += keyListeners.size;
  }
  return total;
}
