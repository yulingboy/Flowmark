/**
 * 剪藏处理器
 * 
 * 在 Background Service Worker 中处理剪藏相关的逻辑，
 * 包括右键菜单创建、消息处理和笔记保存。
 * 
 * @module background/clipperHandler
 */

import type { 
  ClipType, 
  ClipData, 
  ClipRequest, 
  ClipDataResponse,
  ShowNotification,
} from '../types/clipper';
import { CONTEXT_MENU_IDS, COMMAND_IDS } from '../types/clipper';
import { noteFormatter } from '../utils/noteFormatter';

/**
 * 笔记存储键名
 */
const NOTES_STORAGE_KEY = 'notes-plugin-data';

/**
 * 笔记数据接口
 */
interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

/**
 * 笔记存储数据格式
 */
interface NotesStorageData {
  notes: Note[];
  version: number;
}

/**
 * 剪藏处理器接口
 */
export interface ClipperHandler {
  /** 初始化右键菜单 */
  initContextMenus(): void;
  
  /** 处理剪藏请求 */
  handleClipRequest(tabId: number, clipType: ClipType): Promise<void>;
  
  /** 保存剪藏为笔记 */
  saveClip(clipData: ClipData): Promise<string>;
  
  /** 初始化快捷键监听 */
  initCommandListener(): void;
}

/**
 * 检查 URL 是否可以注入 Content Script
 * 
 * @param url 要检查的 URL
 * @returns 是否可以注入
 */
function canInjectContentScript(url: string | undefined): boolean {
  if (!url) return false;
  
  // 不能注入的 URL 模式
  const blockedPatterns = [
    /^chrome:\/\//,
    /^chrome-extension:\/\//,
    /^edge:\/\//,
    /^about:/,
    /^file:\/\//,
    /^view-source:/,
    /^devtools:/,
  ];
  
  return !blockedPatterns.some(pattern => pattern.test(url));
}

/**
 * 向标签页发送通知消息
 * 
 * @param tabId 标签页 ID
 * @param success 是否成功
 * @param message 通知消息
 */
async function sendNotification(tabId: number, success: boolean, message: string): Promise<void> {
  try {
    const notification: ShowNotification = {
      type: 'SHOW_NOTIFICATION',
      success,
      message,
    };
    await chrome.tabs.sendMessage(tabId, notification);
  } catch (error) {
    console.error('[ClipperHandler] 发送通知失败:', error);
  }
}

/**
 * 创建剪藏处理器实例
 * 
 * @returns ClipperHandler 实例
 */
export function createClipperHandler(): ClipperHandler {
  return {
    /**
     * 初始化右键菜单
     * 
     * 创建三个菜单项：
     * - 剪藏选中内容（有选中文本时显示）
     * - 剪藏整个页面
     * - 选择区域剪藏
     */
    initContextMenus(): void {
      // 先移除已有的菜单项，避免重复创建
      chrome.contextMenus.removeAll(() => {
        // 剪藏选中内容
        chrome.contextMenus.create({
          id: CONTEXT_MENU_IDS.CLIP_SELECTION,
          title: '剪藏选中内容',
          contexts: ['selection'],
        });

        // 剪藏整个页面
        chrome.contextMenus.create({
          id: CONTEXT_MENU_IDS.CLIP_PAGE,
          title: '剪藏整个页面',
          contexts: ['page'],
        });

        // 选择区域剪藏
        chrome.contextMenus.create({
          id: CONTEXT_MENU_IDS.CLIP_ELEMENT,
          title: '选择区域剪藏',
          contexts: ['page'],
        });

        console.log('[ClipperHandler] 右键菜单已创建');
      });

      // 监听菜单点击事件
      chrome.contextMenus.onClicked.addListener(async (info, tab) => {
        if (!tab?.id) return;

        let clipType: ClipType;
        
        switch (info.menuItemId) {
          case CONTEXT_MENU_IDS.CLIP_SELECTION:
            clipType = 'selection';
            break;
          case CONTEXT_MENU_IDS.CLIP_PAGE:
            clipType = 'page';
            break;
          case CONTEXT_MENU_IDS.CLIP_ELEMENT:
            clipType = 'element';
            break;
          default:
            return;
        }

        await this.handleClipRequest(tab.id, clipType);
      });
    },

    /**
     * 处理剪藏请求
     * 
     * @param tabId 标签页 ID
     * @param clipType 剪藏类型
     */
    async handleClipRequest(tabId: number, clipType: ClipType): Promise<void> {
      try {
        // 获取标签页信息
        const tab = await chrome.tabs.get(tabId);
        
        // 检查是否可以注入 Content Script
        if (!canInjectContentScript(tab.url)) {
          await sendNotification(tabId, false, '此页面无法剪藏');
          return;
        }

        // 发送剪藏请求到 Content Script
        const request: ClipRequest = {
          type: 'CLIP_REQUEST',
          clipType,
        };

        let response: ClipDataResponse | { type: 'CLIP_ERROR'; error: string };
        
        try {
          response = await chrome.tabs.sendMessage(tabId, request);
        } catch {
          // Content Script 可能未加载，尝试注入
          console.log('[ClipperHandler] Content Script 未响应，尝试注入...');
          
          try {
            await chrome.scripting.executeScript({
              target: { tabId },
              files: ['assets/content.js'],
            });
            
            // 注入 CSS
            await chrome.scripting.insertCSS({
              target: { tabId },
              files: ['assets/content.css'],
            });
            
            // 重新发送请求
            response = await chrome.tabs.sendMessage(tabId, request);
          } catch (injectError) {
            console.error('[ClipperHandler] 注入 Content Script 失败:', injectError);
            // 无法发送通知，因为 Content Script 未加载
            return;
          }
        }

        // 处理响应
        if (response.type === 'CLIP_ERROR') {
          await sendNotification(tabId, false, response.error);
          return;
        }

        if (response.type === 'CLIP_DATA') {
          // 保存剪藏
          const noteId = await this.saveClip(response.data);
          
          if (noteId) {
            await sendNotification(tabId, true, '剪藏成功');
          } else {
            await sendNotification(tabId, false, '保存失败');
          }
        }
      } catch (error) {
        console.error('[ClipperHandler] 处理剪藏请求失败:', error);
        try {
          await sendNotification(tabId, false, '剪藏失败');
        } catch {
          // 忽略通知发送失败
        }
      }
    },

    /**
     * 保存剪藏为笔记
     * 
     * @param clipData 剪藏数据
     * @returns 新笔记的 ID
     */
    async saveClip(clipData: ClipData): Promise<string> {
      try {
        // 格式化剪藏数据为笔记
        const formattedNote = noteFormatter.format(clipData);
        
        // 创建新笔记
        const newNote: Note = {
          id: Date.now().toString(),
          title: formattedNote.title,
          content: formattedNote.content,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        // 从存储中获取现有笔记
        const result = await chrome.storage.local.get(NOTES_STORAGE_KEY);
        const existingData = result[NOTES_STORAGE_KEY] as NotesStorageData | undefined;
        const storageData: NotesStorageData = existingData || {
          notes: [],
          version: 1,
        };

        // 添加新笔记到列表开头
        storageData.notes.unshift(newNote);

        // 保存回存储
        await chrome.storage.local.set({
          [NOTES_STORAGE_KEY]: storageData,
        });

        console.log('[ClipperHandler] 笔记已保存:', newNote.id);
        return newNote.id;
      } catch (error) {
        console.error('[ClipperHandler] 保存笔记失败:', error);
        throw error;
      }
    },

    /**
     * 初始化快捷键监听
     * 
     * 监听 Alt+Shift+C 快捷键，执行剪藏操作
     */
    initCommandListener(): void {
      chrome.commands.onCommand.addListener(async (command) => {
        if (command !== COMMAND_IDS.CLIP_CONTENT) return;

        // 获取当前活动标签页
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        if (!tab?.id) return;

        // 检查是否有选中文本
        try {
          // 先尝试剪藏选中内容
          const request: ClipRequest = {
            type: 'CLIP_REQUEST',
            clipType: 'selection',
          };

          const response = await chrome.tabs.sendMessage(tab.id, request) as ClipDataResponse;
          
          // 如果没有选中内容，则剪藏整个页面
          if (response.type === 'CLIP_DATA' && !response.data.content) {
            await this.handleClipRequest(tab.id, 'page');
          } else {
            // 有选中内容，保存
            const noteId = await this.saveClip(response.data);
            if (noteId) {
              await sendNotification(tab.id, true, '剪藏成功');
            }
          }
        } catch {
          // Content Script 未加载，尝试剪藏整个页面
          await this.handleClipRequest(tab.id, 'page');
        }
      });

      console.log('[ClipperHandler] 快捷键监听已初始化');
    },
  };
}

/**
 * 默认的剪藏处理器实例
 */
export const clipperHandler = createClipperHandler();
