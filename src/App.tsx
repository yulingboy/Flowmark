import { useState, useEffect, useRef } from 'react';
import { Clock } from '@/components/Clock/Clock';
import { Search } from '@/components/Search/Search';
import { ShortcutsContainer } from '@/components/Shortcuts';
import { Background } from '@/components/Background/Background';
import { SettingsButton, SettingsPanel } from '@/components/Settings';
import { useSettingsStore } from '@/stores/settingsStore';
import { getFaviconUrl } from '@/utils/favicon';
import type { ShortcutEntry } from '@/types';
import { createShortcutFolder } from '@/types';

// 默认快捷入口数据
const defaultShortcuts: ShortcutEntry[] = [
  { id: '1', name: '爱奇艺', url: 'https://www.iqiyi.com', icon: getFaviconUrl('https://www.iqiyi.com'), size: '1x1', openMode: 'popup' },
  { id: '2', name: '芒果TV', url: 'https://www.mgtv.com', icon: getFaviconUrl('https://www.mgtv.com'), size: '1x1' },
  { id: '3', name: '抖音', url: 'https://www.douyin.com', icon: getFaviconUrl('https://www.douyin.com'), size: '1x1' },
  { id: '4', name: '微博', url: 'https://weibo.com', icon: getFaviconUrl('https://weibo.com'), size: '1x1' },
  { id: '5', name: '优酷', url: 'https://www.youku.com', icon: getFaviconUrl('https://www.youku.com'), size: '1x1' },
  { id: '6', name: '哔哩哔哩', url: 'https://www.bilibili.com', icon: getFaviconUrl('https://www.bilibili.com'), size: '1x1' },
  { id: '7', name: '乐视', url: 'https://www.le.com', icon: getFaviconUrl('https://www.le.com'), size: '1x1' },
  { id: '8', name: '百度', url: 'https://www.baidu.com', icon: getFaviconUrl('https://www.baidu.com'), size: '1x1' },
  createShortcutFolder('folder-1', [
    { id: 'f1-1', name: 'GitHub', url: 'https://github.com', icon: getFaviconUrl('https://github.com') },
    { id: 'f1-2', name: 'GitLab', url: 'https://gitlab.com', icon: getFaviconUrl('https://gitlab.com') },
    { id: 'f1-3', name: 'VS Code', url: 'https://code.visualstudio.com', icon: getFaviconUrl('https://code.visualstudio.com') },
    { id: 'f1-4', name: 'NPM', url: 'https://www.npmjs.com', icon: getFaviconUrl('https://www.npmjs.com') },
  ], '开发工具', '2x2'),
];

function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { backgroundUrl, showClock, showSearch, showShortcuts, autoFocusSearch } = useSettingsStore();
  const searchRef = useRef<HTMLInputElement>(null);

  // 自动聚焦搜索框
  useEffect(() => {
    if (autoFocusSearch && showSearch) {
      // 延迟聚焦，确保组件已渲染
      const timer = setTimeout(() => {
        searchRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [autoFocusSearch, showSearch]);

  return (
    <div 
      style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        paddingTop: '100px',
        gap: '24px'
      }}
    >
      {/* 背景 */}
      <Background imageUrl={backgroundUrl} />

      {/* 设置按钮 */}
      <SettingsButton
        onClick={() => setIsSettingsOpen(true)}
        className="fixed top-4 right-4"
      />

      {/* 设置面板 */}
      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* 时钟 */}
      {showClock && <Clock />}

      {/* 搜索框 */}
      {showSearch && <Search placeholder="搜索内容" inputRef={searchRef} />}

      {/* 快捷入口 */}
      {showShortcuts && (
        <div style={{ marginTop: '32px' }}>
          <ShortcutsContainer 
            shortcuts={defaultShortcuts} 
            columns={12}
            rows={4}
            unit={72}
            gap={20}
          />
        </div>
      )}
    </div>
  );
}

export default App;
