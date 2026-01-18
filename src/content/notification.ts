/**
 * 页面内通知组件
 * 
 * 在网页中显示剪藏操作的结果通知，支持成功和错误两种状态。
 * 通知会在 3 秒后自动消失。
 * 
 * @module content/notification
 */

/**
 * 通知容器的 ID
 */
const NOTIFICATION_CONTAINER_ID = 'flowmark-notification-container';

/**
 * 通知自动消失的延迟时间（毫秒）
 */
const AUTO_DISMISS_DELAY = 3000;

/**
 * 通知动画持续时间（毫秒）
 */
const ANIMATION_DURATION = 300;

/**
 * 通知类型
 */
type NotificationType = 'success' | 'error' | 'loading';

/**
 * 当前显示的通知元素
 */
let currentNotification: HTMLElement | null = null;

/**
 * 自动消失的定时器
 */
let dismissTimer: ReturnType<typeof setTimeout> | null = null;

/**
 * 获取或创建通知容器
 * 
 * @returns 通知容器元素
 */
function getOrCreateContainer(): HTMLElement {
  let container = document.getElementById(NOTIFICATION_CONTAINER_ID);
  
  if (!container) {
    container = document.createElement('div');
    container.id = NOTIFICATION_CONTAINER_ID;
    container.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 2147483647;
      pointer-events: none;
    `;
    document.body.appendChild(container);
  }
  
  return container;
}

/**
 * 获取通知图标 SVG
 * 
 * @param type 通知类型
 * @returns SVG 字符串
 */
function getIcon(type: NotificationType): string {
  switch (type) {
    case 'success':
      return `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" fill="#52c41a"/>
        <path d="M7 10L9 12L13 8" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;
    case 'error':
      return `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" fill="#ff4d4f"/>
        <path d="M7 7L13 13M13 7L7 13" stroke="white" stroke-width="2" stroke-linecap="round"/>
      </svg>`;
    case 'loading':
      return `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" class="flowmark-notification-spinner">
        <path d="M10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18" stroke="#1890ff" stroke-width="2" stroke-linecap="round"/>
      </svg>`;
  }
}

/**
 * 创建通知元素
 * 
 * @param type 通知类型
 * @param message 通知消息
 * @returns 通知元素
 */
function createNotificationElement(type: NotificationType, message: string): HTMLElement {
  const notification = document.createElement('div');
  notification.className = `flowmark-notification flowmark-notification-${type}`;
  notification.style.cssText = `
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    font-size: 14px;
    color: #333;
    pointer-events: auto;
    transform: translateX(100%);
    opacity: 0;
    transition: transform ${ANIMATION_DURATION}ms ease, opacity ${ANIMATION_DURATION}ms ease;
  `;
  
  notification.innerHTML = `
    <span class="flowmark-notification-icon">${getIcon(type)}</span>
    <span class="flowmark-notification-message">${message}</span>
  `;
  
  // 添加旋转动画样式（用于 loading 状态）
  if (type === 'loading') {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes flowmark-spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      .flowmark-notification-spinner {
        animation: flowmark-spin 1s linear infinite;
      }
    `;
    notification.appendChild(style);
  }
  
  return notification;
}

/**
 * 显示通知
 * 
 * @param type 通知类型
 * @param message 通知消息
 * @param autoDismiss 是否自动消失
 */
function showNotification(type: NotificationType, message: string, autoDismiss = true): void {
  // 清除之前的通知
  dismiss();
  
  const container = getOrCreateContainer();
  const notification = createNotificationElement(type, message);
  
  container.appendChild(notification);
  currentNotification = notification;
  
  // 触发进入动画
  requestAnimationFrame(() => {
    notification.style.transform = 'translateX(0)';
    notification.style.opacity = '1';
  });
  
  // 设置自动消失
  if (autoDismiss && type !== 'loading') {
    dismissTimer = setTimeout(() => {
      dismiss();
    }, AUTO_DISMISS_DELAY);
  }
}

/**
 * 关闭当前通知
 */
function dismiss(): void {
  // 清除定时器
  if (dismissTimer) {
    clearTimeout(dismissTimer);
    dismissTimer = null;
  }
  
  // 执行退出动画并移除元素
  if (currentNotification) {
    const notification = currentNotification;
    notification.style.transform = 'translateX(100%)';
    notification.style.opacity = '0';
    
    setTimeout(() => {
      notification.remove();
    }, ANIMATION_DURATION);
    
    currentNotification = null;
  }
}

/**
 * 显示成功通知
 * 
 * @param message 通知消息
 */
export function showSuccess(message: string): void {
  showNotification('success', message);
}

/**
 * 显示错误通知
 * 
 * @param message 通知消息
 */
export function showError(message: string): void {
  showNotification('error', message);
}

/**
 * 显示加载中通知
 * 
 * @param message 通知消息
 */
export function showLoading(message: string): void {
  showNotification('loading', message, false);
}

/**
 * 关闭通知
 */
export function hideNotification(): void {
  dismiss();
}

/**
 * 通知服务对象
 */
export const notification = {
  success: showSuccess,
  error: showError,
  loading: showLoading,
  hide: hideNotification,
};
