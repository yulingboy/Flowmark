/**
 * Chrome Extension Background Service Worker
 * 
 * 负责处理扩展图标点击事件、右键菜单和剪藏功能
 * 
 * @see https://developer.chrome.com/docs/extensions/reference/api/sidePanel
 */

import { clipperHandler } from './clipperHandler';

// 当用户点击扩展图标时，打开 Side Panel
chrome.action.onClicked.addListener((tab) => {
  if (tab.id) {
    chrome.sidePanel.open({ tabId: tab.id });
  }
});

// 设置 Side Panel 行为：点击图标时打开
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error('设置 Side Panel 行为失败:', error));

// 初始化剪藏功能
// 创建右键菜单
clipperHandler.initContextMenus();

// 初始化快捷键监听
clipperHandler.initCommandListener();

console.log('[Background] Service Worker 已启动');
