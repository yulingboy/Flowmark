import type { ShortcutEntry, ShortcutItem, ShortcutSize, ShortcutFolder } from '@/types';
import { getFaviconUrl } from '../utils/faviconService';

export const createFolder = (
  id: string,
  items: ShortcutItem[],
  name: string,
  size: ShortcutSize = '2x2'
): ShortcutFolder => ({
  id,
  name,
  items,
  isFolder: true,
  size,
});

export const defaultShortcuts: ShortcutEntry[] = [
  { id: '1', name: '爱奇艺', url: 'https://www.iqiyi.com', icon: getFaviconUrl('https://www.iqiyi.com'), size: '1x1', openMode: 'popup' },
  { id: '2', name: '芒果TV', url: 'https://www.mgtv.com', icon: getFaviconUrl('https://www.mgtv.com'), size: '1x1' },
  { id: '3', name: '抖音', url: 'https://www.douyin.com', icon: getFaviconUrl('https://www.douyin.com'), size: '1x1' },
  { id: '4', name: '微博', url: 'https://weibo.com', icon: getFaviconUrl('https://weibo.com'), size: '1x1' },
  { id: '5', name: '优酷', url: 'https://www.youku.com', icon: getFaviconUrl('https://www.youku.com'), size: '1x1' },
  { id: '6', name: '哔哩哔哩', url: 'https://www.bilibili.com', icon: getFaviconUrl('https://www.bilibili.com'), size: '1x1' },
  { id: '7', name: '维基百科', url: 'https://zh.wikipedia.org', icon: getFaviconUrl('https://zh.wikipedia.org'), size: '1x1', openMode: 'popup' },
  { id: '8', name: '百度', url: 'https://www.baidu.com', icon: getFaviconUrl('https://www.baidu.com'), size: '1x1', openMode: 'popup' },
  createFolder('folder-1', [
    { id: 'f1-1', name: 'GitHub', url: 'https://github.com', icon: getFaviconUrl('https://github.com'), openMode: 'popup' },
    { id: 'f1-2', name: 'GitLab', url: 'https://gitlab.com', icon: getFaviconUrl('https://gitlab.com') },
    { id: 'f1-3', name: 'VS Code', url: 'https://code.visualstudio.com', icon: getFaviconUrl('https://code.visualstudio.com'), openMode: 'popup' },
    { id: 'f1-4', name: 'NPM', url: 'https://www.npmjs.com', icon: getFaviconUrl('https://www.npmjs.com') },
  ], '开发工具'),
];
