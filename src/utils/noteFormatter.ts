/**
 * 笔记格式化工具
 * 
 * 将剪藏数据转换为 Markdown 格式的笔记内容。
 * 
 * @module utils/noteFormatter
 */

import type { ClipData } from '../types/clipper';

/**
 * 格式化后的笔记数据
 */
export interface FormattedNote {
  /** 笔记标题 */
  title: string;
  /** 笔记内容（Markdown 格式） */
  content: string;
}

/**
 * 笔记格式化器接口
 */
export interface NoteFormatter {
  /** 格式化剪藏数据为笔记 */
  format(clipData: ClipData): FormattedNote;
}

/**
 * 格式化日期时间
 * 
 * @param timestamp 时间戳（毫秒）
 * @returns 格式化的日期时间字符串 (YYYY-MM-DD HH:mm)
 */
function formatDateTime(timestamp: number): string {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

/**
 * 获取剪藏类型的中文描述
 * 
 * @param clipType 剪藏类型
 * @returns 中文描述
 */
function getClipTypeLabel(clipType: ClipData['clipType']): string {
  switch (clipType) {
    case 'selection':
      return '选中内容';
    case 'page':
      return '整页内容';
    case 'element':
      return '元素内容';
    default:
      return '剪藏内容';
  }
}

/**
 * 格式化内容为引用块
 * 用于选中文本的剪藏
 * 
 * @param content 内容文本
 * @returns Markdown 引用块格式的内容
 */
function formatAsQuote(content: string): string {
  if (!content) {
    return '';
  }
  
  // 将内容按行分割，每行添加引用前缀
  const lines = content.split('\n');
  return lines.map(line => `> ${line}`).join('\n');
}

/**
 * 创建笔记格式化器实例
 * 
 * @returns NoteFormatter 实例
 */
export function createNoteFormatter(): NoteFormatter {
  return {
    /**
     * 格式化剪藏数据为笔记
     * 
     * 生成的 Markdown 格式：
     * ```
     * > 来源: [页面标题](页面URL)
     * > 剪藏时间: YYYY-MM-DD HH:mm
     * > 类型: 选中内容/整页内容/元素内容
     * 
     * ---
     * 
     * [剪藏的内容]
     * ```
     * 
     * @param clipData 剪藏数据
     * @returns 格式化后的笔记
     */
    format(clipData: ClipData): FormattedNote {
      const { title, url, content, clipType, timestamp } = clipData;
      
      // 构建元数据部分
      const metadata = [
        `> 来源: [${title || '未知页面'}](${url})`,
        `> 剪藏时间: ${formatDateTime(timestamp)}`,
        `> 类型: ${getClipTypeLabel(clipType)}`,
      ].join('\n');
      
      // 构建内容部分
      let formattedContent: string;
      
      if (clipType === 'selection') {
        // 选中内容使用引用块格式
        formattedContent = formatAsQuote(content);
      } else {
        // 整页或元素内容直接显示
        formattedContent = content;
      }
      
      // 组合完整的笔记内容
      const noteContent = [
        metadata,
        '',
        '---',
        '',
        formattedContent,
      ].join('\n');
      
      return {
        title: title || '未命名剪藏',
        content: noteContent,
      };
    },
  };
}

/**
 * 默认的笔记格式化器实例
 */
export const noteFormatter = createNoteFormatter();
