/**
 * Notes Store
 * 
 * 使用 chrome.storage.local 作为持久化后端的笔记状态管理器。
 * 支持跨页面数据同步（newtab 和 Side Panel）。
 * 
 * @module notes/store
 */

import { create } from 'zustand';
import type { Note } from './types';
import { chromeStorage } from '@/extension/utils/chromeStorage';

/**
 * 存储键名
 */
const STORAGE_KEY = 'notes-plugin-data';

/**
 * 存储数据格式
 */
interface NotesStorageData {
  notes: Note[];
  version: number;  // 用于未来数据迁移
}

/**
 * 当前存储版本
 */
const CURRENT_VERSION = 1;

/**
 * Notes Store 状态接口
 */
interface NotesState {
  notes: Note[];
  isLoading: boolean;
  
  // 操作方法
  loadNotes: () => Promise<void>;
  addNote: () => Promise<string>;
  updateNote: (id: string, updates: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  clearAllNotes: () => Promise<void>;
  
  // 内部方法
  _setNotes: (notes: Note[]) => void;
}

/**
 * 防抖定时器
 */
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

/**
 * 防抖延迟时间（毫秒）
 */
const DEBOUNCE_DELAY = 300;

/**
 * 标记是否正在保存，用于避免自己触发的变更重复处理
 */
let isSaving = false;

/**
 * 将笔记数据保存到 chrome.storage
 * 
 * @param notes 笔记数组
 */
async function saveNotes(notes: Note[]): Promise<void> {
  const data: NotesStorageData = {
    notes,
    version: CURRENT_VERSION
  };
  
  try {
    isSaving = true;
    await chromeStorage.set(STORAGE_KEY, data);
  } catch (error) {
    console.error('[NotesStore] 保存笔记失败:', error);
    throw error;
  } finally {
    // 延迟重置标记，确保 onChanged 事件已处理
    setTimeout(() => {
      isSaving = false;
    }, 50);
  }
}

/**
 * 防抖保存笔记数据
 * 
 * @param notes 笔记数组
 */
function debouncedSaveNotes(notes: Note[]): void {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
  
  debounceTimer = setTimeout(async () => {
    try {
      await saveNotes(notes);
    } catch (error) {
      console.error('[NotesStore] 防抖保存失败:', error);
    }
  }, DEBOUNCE_DELAY);
}

/**
 * Notes Store
 * 
 * 使用 Zustand 管理笔记状态，使用 chrome.storage.local 持久化数据。
 */
export const useNotesStore = create<NotesState>()((set, get) => ({
  notes: [],
  isLoading: true,

  /**
   * 从 chrome.storage 加载笔记数据
   * 应在应用初始化时调用
   */
  loadNotes: async () => {
    set({ isLoading: true });
    
    try {
      const data = await chromeStorage.get<NotesStorageData>(STORAGE_KEY);
      
      if (data && Array.isArray(data.notes)) {
        set({ notes: data.notes, isLoading: false });
      } else {
        set({ notes: [], isLoading: false });
      }
    } catch (error) {
      console.error('[NotesStore] 加载笔记失败:', error);
      set({ notes: [], isLoading: false });
    }
  },

  /**
   * 添加新笔记
   * 
   * @returns 新笔记的 ID
   */
  addNote: async () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: '',
      content: '',
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    const newNotes = [newNote, ...get().notes];
    set({ notes: newNotes });
    
    // 立即保存（不使用防抖，确保新笔记立即持久化）
    await saveNotes(newNotes);
    
    return newNote.id;
  },

  /**
   * 更新笔记
   * 使用防抖避免频繁写入
   * 
   * @param id 笔记 ID
   * @param updates 要更新的字段
   */
  updateNote: async (id, updates) => {
    const newNotes = get().notes.map(n =>
      n.id === id ? { ...n, ...updates, updatedAt: Date.now() } : n
    );
    
    set({ notes: newNotes });
    
    // 使用防抖保存
    debouncedSaveNotes(newNotes);
  },

  /**
   * 删除笔记
   * 
   * @param id 笔记 ID
   */
  deleteNote: async (id) => {
    const newNotes = get().notes.filter(n => n.id !== id);
    set({ notes: newNotes });
    
    // 立即保存（不使用防抖，确保删除立即生效）
    await saveNotes(newNotes);
  },

  /**
   * 清除所有笔记
   */
  clearAllNotes: async () => {
    set({ notes: [] });
    
    // 立即保存
    await saveNotes([]);
  },

  /**
   * 内部方法：直接设置笔记数据
   * 用于跨页面同步时更新状态
   * 
   * @param notes 笔记数组
   */
  _setNotes: (notes) => {
    set({ notes });
  }
}));

/**
 * 初始化存储变更监听器
 * 用于跨页面数据同步
 * 
 * @returns 取消订阅函数
 */
export function initStorageListener(): () => void {
  return chromeStorage.subscribe(STORAGE_KEY, (newValue) => {
    // 如果是自己触发的保存，忽略
    if (isSaving) {
      return;
    }
    
    const data = newValue as NotesStorageData | undefined;
    
    if (data && Array.isArray(data.notes)) {
      useNotesStore.getState()._setNotes(data.notes);
    }
  });
}

/**
 * 初始化 Notes Store
 * 加载数据并设置跨页面同步监听器
 * 
 * @returns 取消订阅函数
 */
export async function initNotesStore(): Promise<() => void> {
  // 加载数据
  await useNotesStore.getState().loadNotes();
  
  // 设置跨页面同步监听器
  const unsubscribe = initStorageListener();
  
  return unsubscribe;
}
