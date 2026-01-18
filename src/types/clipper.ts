/**
 * 网页剪藏相关类型定义
 * 
 * 定义 Content Script 与 Background Service Worker 之间的消息类型，
 * 以及剪藏数据的结构。
 * 
 * @module types/clipper
 */

/**
 * 剪藏类型
 * - selection: 剪藏选中的文本
 * - page: 剪藏整个页面
 * - element: 剪藏指定 DOM 元素
 */
export type ClipType = 'selection' | 'page' | 'element';

/**
 * 剪藏数据
 * 包含从网页提取的内容信息
 */
export interface ClipData {
  /** 页面标题 */
  title: string;
  /** 页面 URL */
  url: string;
  /** 剪藏的内容 */
  content: string;
  /** 剪藏类型 */
  clipType: ClipType;
  /** 剪藏时间戳 */
  timestamp: number;
}

/**
 * 剪藏请求消息
 * 从 Background 发送到 Content Script
 */
export interface ClipRequest {
  type: 'CLIP_REQUEST';
  clipType: ClipType;
}

/**
 * 启动元素选择器消息
 * 从 Background 发送到 Content Script
 */
export interface StartPickerRequest {
  type: 'START_PICKER';
}

/**
 * 剪藏结果消息
 * 从 Background 发送到 Content Script
 */
export interface ClipResult {
  type: 'CLIP_RESULT';
  success: boolean;
  noteId?: string;
  error?: string;
}

/**
 * 显示通知消息
 * 从 Background 发送到 Content Script
 */
export interface ShowNotification {
  type: 'SHOW_NOTIFICATION';
  success: boolean;
  message: string;
}

/**
 * 剪藏数据响应消息
 * 从 Content Script 发送到 Background
 */
export interface ClipDataResponse {
  type: 'CLIP_DATA';
  data: ClipData;
}

/**
 * 所有消息类型联合
 */
export type ClipperMessage =
  | ClipRequest
  | StartPickerRequest
  | ClipResult
  | ShowNotification
  | ClipDataResponse;

/**
 * 右键菜单项 ID
 */
export const CONTEXT_MENU_IDS = {
  /** 剪藏选中内容 */
  CLIP_SELECTION: 'flowmark-clip-selection',
  /** 剪藏整个页面 */
  CLIP_PAGE: 'flowmark-clip-page',
  /** 选择区域剪藏 */
  CLIP_ELEMENT: 'flowmark-clip-element',
} as const;

/**
 * 快捷键命令 ID
 */
export const COMMAND_IDS = {
  /** 剪藏内容 */
  CLIP_CONTENT: 'clip-content',
} as const;
