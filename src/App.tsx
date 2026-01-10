import { Clock } from '@/components/Clock/Clock';
import { Search } from '@/components/Search/Search';
import { ShortcutsContainer } from '@/components/Shortcuts';
import { Background } from '@/components/Background/Background';
import type { ShortcutEntry } from '@/types';
import { createShortcutFolder } from '@/types';

// 默认快捷入口数据
const defaultShortcuts: ShortcutEntry[] = [
  { id: '1', name: '爱奇艺', url: 'https://www.iqiyi.com', icon: 'https://www.iqiyi.com/favicon.ico', size: '1x1' },
  { id: '2', name: '芒果TV', url: 'https://www.mgtv.com', icon: 'https://www.mgtv.com/favicon.ico', size: '1x1' },
  { id: '3', name: '抖音', url: 'https://www.douyin.com', icon: 'https://www.douyin.com/favicon.ico', size: '1x1' },
  { id: '4', name: '微博', url: 'https://weibo.com', icon: 'https://weibo.com/favicon.ico', size: '1x1' },
  { id: '5', name: '优酷', url: 'https://www.youku.com', icon: 'https://www.youku.com/favicon.ico', size: '1x1' },
  { id: '6', name: '哔哩哔哩', url: 'https://www.bilibili.com', icon: 'https://www.bilibili.com/favicon.ico', size: '1x1' },
  { id: '7', name: '乐视', url: 'https://www.le.com', icon: 'https://www.le.com/favicon.ico', size: '1x1' },
  { id: '8', name: '百度', url: 'https://www.baidu.com', icon: 'https://www.baidu.com/favicon.ico', size: '1x1' },
  createShortcutFolder('folder-1', [
    { id: 'f1-1', name: 'GitHub', url: 'https://github.com', icon: 'https://github.com/favicon.ico' },
    { id: 'f1-2', name: 'GitLab', url: 'https://gitlab.com', icon: 'https://gitlab.com/favicon.ico' },
    { id: 'f1-3', name: 'VS Code', url: 'https://code.visualstudio.com', icon: 'https://code.visualstudio.com/favicon.ico' },
    { id: 'f1-4', name: 'NPM', url: 'https://www.npmjs.com', icon: 'https://www.npmjs.com/favicon.ico' },
  ], '开发工具', '2x2'),
];

// 默认背景图（使用 Unsplash 的山景图）
const defaultBackground = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80';

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-8 gap-4">
      {/* 背景 */}
      <Background imageUrl={defaultBackground} />

      {/* 时钟 */}
      <Clock />

      {/* 搜索框 */}
      <Search placeholder="搜索内容" searchEngine="bing" />

      {/* 快捷入口 */}
      <ShortcutsContainer shortcuts={defaultShortcuts} className="mt-1" />
    </div>
  );
}

export default App;
