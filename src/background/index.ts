/**
 * Chrome Extension Background Service Worker
 * 
 * 负责处理扩展图标点击事件，打开 Side Panel
 * 
 * @see https://developer.chrome.com/docs/extensions/reference/api/sidePanel
 */

// 当用户点击扩展图标时，打开 Side Panel
chrome.action.onClicked.addListener((tab) => {
  if (tab.id) {
    chrome.sidePanel.open({ tabId: tab.id });
  }
});

// 设置 Side Panel 行为：点击图标时打开
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error('设置 Side Panel 行为失败:', error));
