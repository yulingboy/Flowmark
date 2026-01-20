/**
 * 内容提取器
 * 
 * 负责从网页中提取标题、URL、选中文本和页面主要内容。
 * 支持将 HTML 内容转换为 Markdown 格式。
 * 
 * @module extension/content/extractor
 */

/**
 * 内容提取器接口
 */
export interface ContentExtractor {
  /** 获取页面标题 */
  getTitle(): string;
  
  /** 获取页面 URL */
  getUrl(): string;
  
  /** 获取选中的文本（Markdown 格式） */
  getSelection(): string;
  
  /** 获取页面主要内容（Markdown 格式） */
  getPageContent(): string;
  
  /** 获取指定元素的内容（Markdown 格式） */
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
 * 清理 Markdown 文本
 * 移除多余的空白字符和空行
 * 
 * @param text 原始文本
 * @returns 清理后的文本
 */
function cleanMarkdown(text: string): string {
  return text
    .replace(/\n{3,}/g, '\n\n')  // 多个空行替换为两个换行
    .replace(/[ \t]+$/gm, '')     // 移除行尾空白
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
  try {
    const style = window.getComputedStyle(element);
    if (style.display === 'none' || style.visibility === 'hidden') {
      return true;
    }
  } catch {
    // 忽略样式获取失败
  }
  
  // 检查常见的非内容类名
  const className = element.className?.toString?.()?.toLowerCase() || '';
  const excludePatterns = ['nav', 'menu', 'sidebar', 'footer', 'header', 'ad', 'comment'];
  if (excludePatterns.some(pattern => className.includes(pattern))) {
    return true;
  }
  
  return false;
}

/**
 * 将 HTML 元素转换为 Markdown
 * 
 * @param element 要转换的元素
 * @param depth 当前递归深度
 * @returns Markdown 格式的文本
 */
function htmlToMarkdown(element: Element, depth = 0): string {
  // 防止过深递归
  if (depth > 50) {
    return '';
  }
  
  // 检查是否应该排除
  if (shouldExcludeElement(element)) {
    return '';
  }
  
  const tagName = element.tagName.toUpperCase();
  const parts: string[] = [];
  
  // 处理子节点
  for (const node of element.childNodes) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.replace(/\s+/g, ' ') || '';
      if (text.trim()) {
        parts.push(text);
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const childMarkdown = htmlToMarkdown(node as Element, depth + 1);
      if (childMarkdown) {
        parts.push(childMarkdown);
      }
    }
  }
  
  const content = parts.join('');
  
  // 根据标签类型转换为 Markdown
  switch (tagName) {
    // 标题
    case 'H1':
      return `\n# ${content.trim()}\n`;
    case 'H2':
      return `\n## ${content.trim()}\n`;
    case 'H3':
      return `\n### ${content.trim()}\n`;
    case 'H4':
      return `\n#### ${content.trim()}\n`;
    case 'H5':
      return `\n##### ${content.trim()}\n`;
    case 'H6':
      return `\n###### ${content.trim()}\n`;
    
    // 段落和换行
    case 'P':
      return `\n${content.trim()}\n`;
    case 'BR':
      return '\n';
    case 'HR':
      return '\n---\n';
    
    // 文本格式
    case 'STRONG':
    case 'B':
      return `**${content.trim()}**`;
    case 'EM':
    case 'I':
      return `*${content.trim()}*`;
    case 'CODE':
      return `\`${content.trim()}\``;
    case 'DEL':
    case 'S':
      return `~~${content.trim()}~~`;
    case 'U':
      return `<u>${content.trim()}</u>`;
    case 'MARK':
      return `==${content.trim()}==`;
    
    // 链接和图片
    case 'A': {
      const href = (element as HTMLAnchorElement).href;
      const text = content.trim() || href;
      return href ? `[${text}](${href})` : text;
    }
    case 'IMG': {
      const img = element as HTMLImageElement;
      const alt = img.alt || '图片';
      const src = img.src;
      return src ? `![${alt}](${src})` : '';
    }
    
    // 列表
    case 'UL':
    case 'OL':
      return `\n${content}\n`;
    case 'LI': {
      const parent = element.parentElement;
      const isOrdered = parent?.tagName === 'OL';
      if (isOrdered) {
        const index = Array.from(parent!.children).indexOf(element) + 1;
        return `${index}. ${content.trim()}\n`;
      }
      return `- ${content.trim()}\n`;
    }
    
    // 引用
    case 'BLOCKQUOTE': {
      const lines = content.trim().split('\n');
      return '\n' + lines.map(line => `> ${line}`).join('\n') + '\n';
    }
    
    // 代码块
    case 'PRE': {
      const codeElement = element.querySelector('code');
      const codeContent = codeElement?.textContent || content;
      const lang = codeElement?.className?.match(/language-(\w+)/)?.[1] || '';
      return `\n\`\`\`${lang}\n${codeContent.trim()}\n\`\`\`\n`;
    }
    
    // 表格
    case 'TABLE':
      return `\n${content}\n`;
    case 'THEAD':
    case 'TBODY':
      return content;
    case 'TR': {
      const cells = Array.from(element.children)
        .map(cell => htmlToMarkdown(cell, depth + 1).trim())
        .join(' | ');
      const isHeader = element.parentElement?.tagName === 'THEAD';
      if (isHeader) {
        const separator = Array.from(element.children)
          .map(() => '---')
          .join(' | ');
        return `| ${cells} |\n| ${separator} |\n`;
      }
      return `| ${cells} |\n`;
    }
    case 'TH':
    case 'TD':
      return content.trim();
    
    // 块级元素
    case 'DIV':
    case 'SECTION':
    case 'ARTICLE':
    case 'MAIN':
      return `\n${content}\n`;
    
    // 行内元素
    case 'SPAN':
    case 'LABEL':
      return content;
    
    // 默认处理
    default:
      return content;
  }
}

/**
 * 获取选中内容的 HTML 并转换为 Markdown
 * 
 * @returns Markdown 格式的选中内容
 */
function getSelectionAsMarkdown(): string {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) {
    return '';
  }
  
  const range = selection.getRangeAt(0);
  const fragment = range.cloneContents();
  
  // 创建临时容器
  const container = document.createElement('div');
  container.appendChild(fragment);
  
  // 如果只是纯文本，直接返回
  if (container.children.length === 0) {
    return selection.toString().trim();
  }
  
  // 转换为 Markdown
  const markdown = htmlToMarkdown(container);
  return cleanMarkdown(markdown);
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
     * 获取用户选中的文本（Markdown 格式）
     * 
     * @returns 选中的文本，如果没有选中则返回空字符串
     */
    getSelection(): string {
      return getSelectionAsMarkdown();
    },

    /**
     * 获取页面主要内容（Markdown 格式）
     * 尝试智能识别主要内容区域，排除导航、侧边栏等
     * 
     * @returns 页面主要内容的 Markdown 文本
     */
    getPageContent(): string {
      const mainElement = findMainContent();
      const markdown = htmlToMarkdown(mainElement);
      return cleanMarkdown(markdown);
    },

    /**
     * 获取指定元素的内容（Markdown 格式）
     * 
     * @param element 要提取内容的 DOM 元素
     * @returns 元素的 Markdown 内容
     */
    getElementContent(element: HTMLElement): string {
      const markdown = htmlToMarkdown(element);
      return cleanMarkdown(markdown);
    },
  };
}

/**
 * 默认的内容提取器实例
 */
export const contentExtractor = createContentExtractor();
