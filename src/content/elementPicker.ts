/**
 * 元素选择器
 * 
 * 提供可视化的 DOM 元素选择功能，允许用户通过鼠标悬停和点击
 * 来选择页面上的特定元素进行剪藏。
 * 
 * @module content/elementPicker
 */

/**
 * 元素选择器接口
 */
export interface ElementPicker {
  /** 激活选择模式 */
  activate(): void;
  
  /** 停用选择模式 */
  deactivate(): void;
  
  /** 是否处于激活状态 */
  isActive(): boolean;
  
  /** 设置元素选中回调 */
  onSelect(callback: (element: HTMLElement) => void): void;
  
  /** 设置取消回调 */
  onCancel(callback: () => void): void;
}

/**
 * 覆盖层元素的 ID
 */
const OVERLAY_ID = 'flowmark-picker-overlay';

/**
 * 提示文字元素的 ID
 */
const TOOLTIP_ID = 'flowmark-picker-tooltip';

/**
 * 创建元素选择器实例
 * 
 * @returns ElementPicker 实例
 */
export function createElementPicker(): ElementPicker {
  /** 覆盖层元素 */
  let overlay: HTMLElement | null = null;
  
  /** 提示文字元素 */
  let tooltip: HTMLElement | null = null;
  
  /** 当前高亮的元素 */
  let currentElement: HTMLElement | null = null;
  
  /** 元素选中回调 */
  let selectCallback: ((element: HTMLElement) => void) | null = null;
  
  /** 取消回调 */
  let cancelCallback: (() => void) | null = null;
  
  /** 是否处于激活状态 */
  let active = false;

  /**
   * 创建覆盖层元素
   */
  function createOverlay(): void {
    // 如果已存在则先移除
    const existing = document.getElementById(OVERLAY_ID);
    if (existing) {
      existing.remove();
    }

    overlay = document.createElement('div');
    overlay.id = OVERLAY_ID;
    overlay.className = 'flowmark-picker-overlay';
    document.body.appendChild(overlay);
  }

  /**
   * 创建提示文字元素
   */
  function createTooltip(): void {
    // 如果已存在则先移除
    const existing = document.getElementById(TOOLTIP_ID);
    if (existing) {
      existing.remove();
    }

    tooltip = document.createElement('div');
    tooltip.id = TOOLTIP_ID;
    tooltip.className = 'flowmark-picker-tooltip';
    tooltip.textContent = '点击选择要剪藏的区域，按 Esc 取消';
    document.body.appendChild(tooltip);
  }

  /**
   * 移除覆盖层元素
   */
  function removeOverlay(): void {
    if (overlay) {
      overlay.remove();
      overlay = null;
    }
  }

  /**
   * 移除提示文字元素
   */
  function removeTooltip(): void {
    if (tooltip) {
      tooltip.remove();
      tooltip = null;
    }
  }

  /**
   * 更新覆盖层位置和尺寸
   * 
   * @param element 要高亮的元素
   */
  function updateOverlay(element: HTMLElement): void {
    if (!overlay) return;

    const rect = element.getBoundingClientRect();
    
    overlay.style.top = `${rect.top + window.scrollY}px`;
    overlay.style.left = `${rect.left + window.scrollX}px`;
    overlay.style.width = `${rect.width}px`;
    overlay.style.height = `${rect.height}px`;
  }

  /**
   * 检查元素是否应该被忽略
   * 
   * @param element 要检查的元素
   * @returns 是否应该忽略
   */
  function shouldIgnoreElement(element: Element | null): boolean {
    if (!element) return true;
    
    // 忽略我们自己创建的元素
    if (element.id === OVERLAY_ID || element.id === TOOLTIP_ID) {
      return true;
    }
    
    // 忽略 html 和 body
    if (element.tagName === 'HTML' || element.tagName === 'BODY') {
      return true;
    }
    
    return false;
  }

  /**
   * 处理鼠标移动事件
   */
  function handleMouseMove(e: MouseEvent): void {
    if (!active) return;

    const element = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement;
    
    if (shouldIgnoreElement(element)) {
      return;
    }

    if (element && element !== currentElement) {
      currentElement = element;
      updateOverlay(element);
    }
  }

  /**
   * 处理点击事件
   */
  function handleClick(e: MouseEvent): void {
    if (!active) return;

    // 阻止默认行为和事件冒泡
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    if (currentElement && selectCallback) {
      const selectedElement = currentElement;
      deactivate();
      selectCallback(selectedElement);
    }
  }

  /**
   * 处理键盘事件
   */
  function handleKeyDown(e: KeyboardEvent): void {
    if (!active) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      
      deactivate();
      
      if (cancelCallback) {
        cancelCallback();
      }
    }
  }

  /**
   * 添加事件监听器
   */
  function addEventListeners(): void {
    // 使用 capture 阶段来确保我们的处理器先执行
    document.addEventListener('mousemove', handleMouseMove, true);
    document.addEventListener('click', handleClick, true);
    document.addEventListener('keydown', handleKeyDown, true);
    
    // 阻止其他点击相关事件
    document.addEventListener('mousedown', preventEvent, true);
    document.addEventListener('mouseup', preventEvent, true);
  }

  /**
   * 移除事件监听器
   */
  function removeEventListeners(): void {
    document.removeEventListener('mousemove', handleMouseMove, true);
    document.removeEventListener('click', handleClick, true);
    document.removeEventListener('keydown', handleKeyDown, true);
    document.removeEventListener('mousedown', preventEvent, true);
    document.removeEventListener('mouseup', preventEvent, true);
  }

  /**
   * 阻止事件的默认行为和冒泡
   */
  function preventEvent(e: Event): void {
    if (!active) return;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
  }

  /**
   * 激活选择模式
   */
  function activate(): void {
    if (active) return;

    active = true;
    currentElement = null;
    
    createOverlay();
    createTooltip();
    addEventListeners();
    
    // 添加 body 样式，防止滚动时出现问题
    document.body.style.cursor = 'crosshair';
  }

  /**
   * 停用选择模式
   */
  function deactivate(): void {
    if (!active) return;

    active = false;
    currentElement = null;
    
    removeOverlay();
    removeTooltip();
    removeEventListeners();
    
    // 恢复 body 样式
    document.body.style.cursor = '';
  }

  return {
    activate,
    deactivate,
    
    isActive(): boolean {
      return active;
    },
    
    onSelect(callback: (element: HTMLElement) => void): void {
      selectCallback = callback;
    },
    
    onCancel(callback: () => void): void {
      cancelCallback = callback;
    },
  };
}

/**
 * 默认的元素选择器实例
 */
export const elementPicker = createElementPicker();
