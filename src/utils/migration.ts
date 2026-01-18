/**
 * 数据迁移服务
 * 
 * 负责从 localStorage 迁移笔记数据到 chrome.storage.local。
 * 用于扩展升级时保持用户数据的向后兼容性。
 * 
 * @module migration
 */

import { chromeStorage } from './chromeStorage';

/**
 * 存储键名（localStorage 和 chrome.storage 使用相同的键名）
 */
const STORAGE_KEY = 'notes-plugin-data';

/**
 * 迁移结果接口
 */
export interface MigrationResult {
  /** 迁移是否成功 */
  success: boolean;
  /** 迁移的笔记数量 */
  migratedCount: number;
  /** 错误信息（如果有） */
  error?: string;
}

/**
 * 笔记数据接口（用于类型检查）
 */
interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

/**
 * 存储数据格式
 */
interface NotesStorageData {
  notes: Note[];
  version: number;
}

/**
 * 迁移服务接口
 */
export interface MigrationService {
  /** 检查是否需要迁移 */
  needsMigration(): Promise<boolean>;
  
  /** 执行数据迁移 */
  migrate(): Promise<MigrationResult>;
}

/**
 * 验证笔记数据是否有效
 * 
 * @param data 待验证的数据
 * @returns 如果数据有效返回 true
 */
function isValidNotesData(data: unknown): data is NotesStorageData {
  if (!data || typeof data !== 'object') {
    return false;
  }
  
  const obj = data as Record<string, unknown>;
  
  // 检查 notes 数组
  if (!Array.isArray(obj.notes)) {
    return false;
  }
  
  // 验证每个笔记的结构
  for (const note of obj.notes) {
    if (!note || typeof note !== 'object') {
      return false;
    }
    
    const n = note as Record<string, unknown>;
    
    if (
      typeof n.id !== 'string' ||
      typeof n.title !== 'string' ||
      typeof n.content !== 'string' ||
      typeof n.createdAt !== 'number' ||
      typeof n.updatedAt !== 'number'
    ) {
      return false;
    }
  }
  
  return true;
}

/**
 * 从 localStorage 读取旧数据
 * 
 * @returns 旧数据，如果不存在或无效返回 null
 */
function getLocalStorageData(): NotesStorageData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    
    if (!raw) {
      return null;
    }
    
    const parsed = JSON.parse(raw);
    
    // 处理 Zustand persist 中间件的数据格式
    // Zustand persist 会将数据包装在 { state: { ... }, version: ... } 结构中
    let data: unknown;
    
    if (parsed && typeof parsed === 'object' && 'state' in parsed) {
      // Zustand persist 格式：{ state: { notes: [...] }, version: 0 }
      data = {
        notes: parsed.state?.notes || [],
        version: 1
      };
    } else {
      // 直接格式：{ notes: [...], version: 1 }
      data = parsed;
    }
    
    if (isValidNotesData(data)) {
      return data;
    }
    
    console.warn('[Migration] localStorage 数据格式无效');
    return null;
  } catch (error) {
    console.error('[Migration] 读取 localStorage 失败:', error);
    return null;
  }
}

/**
 * 清除 localStorage 中的旧数据
 */
function clearLocalStorageData(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log('[Migration] 已清除 localStorage 旧数据');
  } catch (error) {
    console.error('[Migration] 清除 localStorage 失败:', error);
  }
}

/**
 * 检查是否需要迁移
 * 
 * 迁移条件：
 * 1. localStorage 中存在有效的旧数据
 * 2. chrome.storage 中没有数据（或数据为空）
 * 
 * @returns 如果需要迁移返回 true
 */
async function needsMigration(): Promise<boolean> {
  try {
    // 检查 localStorage 是否有旧数据
    const localData = getLocalStorageData();
    
    if (!localData || localData.notes.length === 0) {
      console.log('[Migration] localStorage 无数据，无需迁移');
      return false;
    }
    
    // 检查 chrome.storage 是否已有数据
    const chromeData = await chromeStorage.get<NotesStorageData>(STORAGE_KEY);
    
    if (chromeData && Array.isArray(chromeData.notes) && chromeData.notes.length > 0) {
      console.log('[Migration] chrome.storage 已有数据，无需迁移');
      return false;
    }
    
    console.log(`[Migration] 检测到需要迁移的数据: ${localData.notes.length} 条笔记`);
    return true;
  } catch (error) {
    console.error('[Migration] 检查迁移状态失败:', error);
    return false;
  }
}

/**
 * 执行数据迁移
 * 
 * 将 localStorage 中的笔记数据迁移到 chrome.storage.local。
 * 迁移成功后清除 localStorage 中的旧数据。
 * 如果迁移失败，保留原始数据并记录错误。
 * 
 * @returns 迁移结果
 */
async function migrate(): Promise<MigrationResult> {
  console.log('[Migration] 开始数据迁移...');
  
  try {
    // 读取 localStorage 数据
    const localData = getLocalStorageData();
    
    if (!localData) {
      console.log('[Migration] 无数据需要迁移');
      return {
        success: true,
        migratedCount: 0
      };
    }
    
    const notesCount = localData.notes.length;
    
    if (notesCount === 0) {
      console.log('[Migration] 笔记列表为空，无需迁移');
      return {
        success: true,
        migratedCount: 0
      };
    }
    
    // 再次检查 chrome.storage 是否为空（防止并发迁移）
    const existingData = await chromeStorage.get<NotesStorageData>(STORAGE_KEY);
    
    if (existingData && Array.isArray(existingData.notes) && existingData.notes.length > 0) {
      console.log('[Migration] chrome.storage 已有数据，跳过迁移');
      // 清除 localStorage 旧数据（因为 chrome.storage 已有数据）
      clearLocalStorageData();
      return {
        success: true,
        migratedCount: 0
      };
    }
    
    // 写入 chrome.storage
    await chromeStorage.set(STORAGE_KEY, localData);
    
    // 验证写入是否成功
    const verifyData = await chromeStorage.get<NotesStorageData>(STORAGE_KEY);
    
    if (!verifyData || !Array.isArray(verifyData.notes) || verifyData.notes.length !== notesCount) {
      throw new Error('数据验证失败：写入的数据与原始数据不一致');
    }
    
    // 迁移成功，清除 localStorage 旧数据
    clearLocalStorageData();
    
    console.log(`[Migration] 迁移成功: ${notesCount} 条笔记`);
    
    return {
      success: true,
      migratedCount: notesCount
    };
  } catch (error) {
    // 迁移失败，保留原始数据
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[Migration] 迁移失败:', errorMessage);
    
    return {
      success: false,
      migratedCount: 0,
      error: errorMessage
    };
  }
}

/**
 * 迁移服务实例
 * 
 * 提供数据迁移功能，用于将 localStorage 中的旧数据迁移到 chrome.storage.local。
 * 
 * @example
 * ```typescript
 * import { migrationService } from './utils/migration';
 * 
 * // 检查是否需要迁移
 * if (await migrationService.needsMigration()) {
 *   const result = await migrationService.migrate();
 *   if (result.success) {
 *     console.log(`迁移成功: ${result.migratedCount} 条笔记`);
 *   } else {
 *     console.error(`迁移失败: ${result.error}`);
 *   }
 * }
 * ```
 */
export const migrationService: MigrationService = {
  needsMigration,
  migrate
};
