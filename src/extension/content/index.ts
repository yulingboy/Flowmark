/**
 * Content Script 入口
 * 
 * 注入到网页中的脚本，负责处理来自 Background Service Worker 的消息，
 * 执行剪藏操作并返回结果。
 * 
 * @module extension/content/index
 */

import type { 
  ClipperMessage, 
  ClipRequest, 
  ClipData,
  ClipDataResponse,
} from '../types/clipper';
import { clipperService } from './clipperService';
import { notification } from './notification';

// 导入样式
import './elementPicker.css';

/**
 * 处理剪藏请求
 * 
 * @param request 剪藏请求
 * @returns 剪藏数据
 */
async function handleClipRequest(request: ClipRequest): Promise<ClipData> {
  const { clipType } = request;
  
  switch (clipType) {
    case 'selection':
      return clipperService.clipSelection();
    case 'page':
      return clipperService.clipPage();
    case 'element':
      return clipperService.startElementPicker();
    default:
      throw new Error(`未知的剪藏类型: ${clipType}`);
  }
}

/**
 * 消息监听器
 * 
 * 处理来自 Background Service Worker 的消息
 */
function messageListener(
  message: ClipperMessage,
  _sender: chrome.runtime.MessageSender,
  sendResponse: (response: unknown) => void
): boolean {
  // 根据消息类型处理
  switch (message.type) {
    case 'CLIP_REQUEST':
      // 处理剪藏请求
      handleClipRequest(message)
        .then((clipData) => {
          const response: ClipDataResponse = {
            type: 'CLIP_DATA',
            data: clipData,
          };
          sendResponse(response);
        })
        .catch((error) => {
          sendResponse({
            type: 'CLIP_ERROR',
            error: error.message || '剪藏失败',
          });
        });
      // 返回 true 表示异步发送响应
      return true;

    case 'START_PICKER':
      // 启动元素选择器
      clipperService.startElementPicker()
        .then((clipData) => {
          const response: ClipDataResponse = {
            type: 'CLIP_DATA',
            data: clipData,
          };
          sendResponse(response);
        })
        .catch((error) => {
          sendResponse({
            type: 'CLIP_ERROR',
            error: error.message || '元素选择失败',
          });
        });
      return true;

    case 'SHOW_NOTIFICATION':
      // 显示通知
      if (message.success) {
        notification.success(message.message);
      } else {
        notification.error(message.message);
      }
      sendResponse({ success: true });
      return false;

    default:
      // 未知消息类型，不处理
      return false;
  }
}

/**
 * 初始化 Content Script
 */
function init(): void {
  // 注册消息监听器
  chrome.runtime.onMessage.addListener(messageListener);
  
  // 标记 Content Script 已加载
  console.log('[Flowmark] Content Script 已加载');
}

// 执行初始化
init();
