/**
 * 内容提取器
 * 
 * 负责从网页中提取标题、URL、选中文本和页面主要内容。
 * 
 * @module content/extractor
 */

/**
 * 内容提取器接口
 */
export interface ContentExtractor {
  /** 获取页面标题 */
  getTitle(): string;
  
  /** 获取页面 URL */
  getUrl(): string;
  
  /** 获取选中的文本 */
  getSelection(): string;
  
  /** 获取页面主要内容 */
  getPageContent(): string;
  
  /** 获取指定元素的内容 */
  getElementContent(element: HTMLElement): string;
}

/**
 * 需要排除的标签名列表
 * 这些标签通常不包含用户关心的主要内容
 */
const EXCLUDED_TAGS = new Set([
  'SCRIPT',
  'STYLE',
  'NOSCRIPT',
  'IFRAME',
  'OBJECT',
  'EMBED',
  'SVG',
  'CANVAS',
  'NAV',
  'HEADER',
  'FOOTER',
  'ASIDE',
  'FORM',
  'INPUT',
  'BUTTON',
  'SELECT',
  'TEXTAREA',
]);

/**
 * 主要内容容器的选择器
 * 按优先级排序，优先选择语义化标签
 */
const MAIN_CONTENT_SELECTORS = [
  'article',
  'main',
  '[role="main"]',
  '.article',
  '.post',
  '.content',
  '.entry-content',
  '.post-content',
  '#content',
  '#main',
];

/**
 * 清理文本内容
 * 移除多余的空白字符
 * 
 * @param text 原始文本
 * @returns 清理后的文本
 */
function cleanText(text: string): string {
  return text
    .replace(/\s+/g, ' ')  // 多个空白字符替换为单个空格
    .replace(/\n\s*\n/g, '\n\n')  // 多个空行替换为两个换行
    .trim();
}

/**
 * 检查元素是否应该被排除
 * 
 * @param element 要检查的元素
 * @returns 是否应该排除
 */
function shouldExcludeElement(element: Element): boolean {
  // 检查标签名
  if (EXCLUDED_TAGS.has(element.tagName)) {
    return true;
  }
  
  // 检查是否隐藏
  const style = window.getComputedStyle(element);
  if (style.display === 'none' || style.visibility === 'hidden') {
    return true;
  }
  
  // 检查常见的非内容类名
  const className = element.className.toString().toLowerCase();
  const excludePatterns = ['nav', 'menu', 'sidebar', 'footer', 'header', 'ad', 'comment'];
  if (excludePatterns.some(pattern => className.includes(pattern))) {
    return true;
  }
  
  return false;
}

/**
 * 递归提取元素的文本内容
 * 
 * @param element 要提取的元素
 * @param depth 当前递归深度
 * @returns 提取的文本
 */
function extractTextFromElement(element: Element, depth = 0): string {
  // 防止过深递归
  if (depth > 50) {
    return '';
  }
  
  // 检查是否应该排除
  if (shouldExcludeElement(element)) {
    return '';
  }
  
  const texts: string[] = [];
  
  for (const node of element.childNodes) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim();
      if (text) {
        texts.push(text);
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const childText = extractTextFromElement(node as Element, depth + 1);
      if (childText) {
        texts.push(childText);
      }
    }
  }
  
  return texts.join(' ');
}

/**
 * 查找页面主要内容区域
 * 
 * @returns 主要内容元素，如果找不到则返回 body
 */
function findMainContent(): Element {
  // 尝试使用语义化选择器
  for (const selector of MAIN_CONTENT_SELECTORS) {
    const element = document.querySelector(selector);
    if (element) {
      return element;
    }
  }
  
  // 回退到 body
  return document.body;
}

/**
 * 创建内容提取器实例
 * 
 * @returns ContentExtractor 实例
 */
export function createContentExtractor(): ContentExtractor {
  return {
    /**
     * 获取页面标题
     * 
     * @returns 页面标题，如果没有则返回空字符串
     */
    getTitle(): string {
      return document.title || '';
    },

    /**
     * 获取页面 URL
     * 
     * @returns 当前页面的完整 URL
     */
    getUrl(): string {
      return window.location.href;
    },

    /**
     * 获取用户选中的文本
     * 
     * @returns 选中的文本，如果没有选中则返回空字符串
     */
    getSelection(): string {
      const selection = window.getSelection();
      if (!selection) {
        return '';
      }
      return selection.toString().trim();
    },

    /**
     * 获取页面主要内容
     * 尝试智能识别主要内容区域，排除导航、侧边栏等
     * 
     * @returns 页面主要内容文本
     */
    getPageContent(): string {
      const mainElement = findMainContent();
      const text = extractTextFromElement(mainElement);
      return cleanText(text);
    },

    /**
     * 获取指定元素的内容
     * 
     * @param element 要提取内容的 DOM 元素
     * @returns 元素的文本内容
     */
    getElementContent(element: HTMLElement): string {
      // 优先使用 innerText，它会考虑 CSS 样式
      const text = element.innerText || element.textContent || '';
      return cleanText(text);
    },
  };
}

/**
 * 默认的内容提取器实例
 */
export const contentExtractor = createContentExtractor();
