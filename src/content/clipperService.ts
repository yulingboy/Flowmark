/**
 * 剪藏服务
 * 
 * 协调内容提取器和元素选择器，提供统一的剪藏接口。
 * 
 * @module content/clipperService
 */

import type { ClipData, ClipType } from '../types/clipper';
import { contentExtractor } from './extractor';
import { createElementPicker, type ElementPicker } from './elementPicker';

/**
 * 剪藏服务接口
 */
export interface ClipperService {
  /** 剪藏选中内容 */
  clipSelection(): Promise<ClipData>;
  
  /** 剪藏整个页面 */
  clipPage(): Promise<ClipData>;
  
  /** 剪藏指定元素 */
  clipElement(element: HTMLElement): Promise<ClipData>;
  
  /** 启动元素选择模式 */
  startElementPicker(): Promise<ClipData>;
}

/**
 * 创建基础剪藏数据
 * 
 * @param clipType 剪藏类型
 * @param content 剪藏内容
 * @returns ClipData 对象
 */
function createClipData(clipType: ClipType, content: string): ClipData {
  return {
    title: contentExtractor.getTitle(),
    url: contentExtractor.getUrl(),
    content,
    clipType,
    timestamp: Date.now(),
  };
}

/**
 * 创建剪藏服务实例
 * 
 * @returns ClipperService 实例
 */
export function createClipperService(): ClipperService {
  /** 元素选择器实例 */
  let elementPicker: ElementPicker | null = null;

  return {
    /**
     * 剪藏选中内容
     * 
     * 获取用户当前选中的文本并创建剪藏数据。
     * 如果没有选中内容，则返回空内容的剪藏数据。
     * 
     * @returns 剪藏数据
     */
    async clipSelection(): Promise<ClipData> {
      const selection = contentExtractor.getSelection();
      return createClipData('selection', selection);
    },

    /**
     * 剪藏整个页面
     * 
     * 提取页面主要内容并创建剪藏数据。
     * 
     * @returns 剪藏数据
     */
    async clipPage(): Promise<ClipData> {
      const content = contentExtractor.getPageContent();
      return createClipData('page', content);
    },

    /**
     * 剪藏指定元素
     * 
     * 提取指定 DOM 元素的内容并创建剪藏数据。
     * 
     * @param element 要剪藏的 DOM 元素
     * @returns 剪藏数据
     */
    async clipElement(element: HTMLElement): Promise<ClipData> {
      const content = contentExtractor.getElementContent(element);
      return createClipData('element', content);
    },

    /**
     * 启动元素选择模式
     * 
     * 激活可视化元素选择器，等待用户选择元素后返回剪藏数据。
     * 如果用户取消选择，则返回 rejected Promise。
     * 
     * @returns 剪藏数据的 Promise
     */
    startElementPicker(): Promise<ClipData> {
      return new Promise((resolve, reject) => {
        // 创建新的元素选择器实例
        elementPicker = createElementPicker();
        
        // 设置选中回调
        elementPicker.onSelect(async (element) => {
          try {
            const clipData = await this.clipElement(element);
            resolve(clipData);
          } catch (error) {
            reject(error);
          } finally {
            elementPicker = null;
          }
        });
        
        // 设置取消回调
        elementPicker.onCancel(() => {
          elementPicker = null;
          reject(new Error('用户取消了元素选择'));
        });
        
        // 激活选择器
        elementPicker.activate();
      });
    },
  };
}

/**
 * 默认的剪藏服务实例
 */
export const clipperService = createClipperService();
