import type { ShortcutEntry, ShortcutItem, CardSize, ShortcutFolder } from '@/types';
import { getFaviconUrl } from '../utils/faviconService';

export const createFolder = (
  id: string,
  items: ShortcutItem[],
  name: string,
  size: CardSize = '2x2'
): ShortcutFolder => ({
  id,
  name,
  items,
  isFolder: true,
  size,
});

// 默认快捷方式使用 GridPosition (col, row) 格式
export const defaultShortcuts: ShortcutEntry[] = [
  { id: '1', name: 'GitHub', url: 'https://github.com', icon: getFaviconUrl('https://github.com'), size: '1x1', openMode: 'tab', position: { col: 0, row: 0 } },
  { id: '2', name: 'MDN', url: 'https://developer.mozilla.org', icon: getFaviconUrl('https://developer.mozilla.org'), size: '1x1', openMode: 'tab', position: { col: 1, row: 0 } },
  { id: '3', name: 'CodePen', url: 'https://codepen.io', icon: getFaviconUrl('https://codepen.io'), size: '1x1', openMode: 'tab', position: { col: 2, row: 0 } },
  { id: '4', name: 'React', url: 'https://react.dev', icon: getFaviconUrl('https://react.dev'), size: '1x1', openMode: 'tab', position: { col: 3, row: 0 } },
  { id: '5', name: 'Vue', url: 'https://vuejs.org', icon: getFaviconUrl('https://vuejs.org'), size: '1x1', openMode: 'tab', position: { col: 4, row: 0 } },
  { id: '6', name: 'TypeScript', url: 'https://www.typescriptlang.org', icon: getFaviconUrl('https://www.typescriptlang.org'), size: '1x1', openMode: 'tab', position: { col: 5, row: 0 } },
  { id: '7', name: 'Vite', url: 'https://vitejs.dev', icon: getFaviconUrl('https://vitejs.dev'), size: '1x1', openMode: 'tab', position: { col: 6, row: 0 } },
  { id: '8', name: 'Tailwind CSS', url: 'https://tailwindcss.com', icon: getFaviconUrl('https://tailwindcss.com'), size: '1x1', openMode: 'tab', position: { col: 7, row: 0 } },
  { id: '9', name: 'Next.js', url: 'https://nextjs.org', icon: getFaviconUrl('https://nextjs.org'), size: '1x1', openMode: 'tab', position: { col: 8, row: 0 } },
  { id: '10', name: 'Nuxt', url: 'https://nuxt.com', icon: getFaviconUrl('https://nuxt.com'), size: '1x1', openMode: 'tab', position: { col: 9, row: 0 } },
  { id: '11', name: 'Svelte', url: 'https://svelte.dev', icon: getFaviconUrl('https://svelte.dev'), size: '1x1', openMode: 'tab', position: { col: 10, row: 0 } },
  { id: '12', name: 'Angular', url: 'https://angular.dev', icon: getFaviconUrl('https://angular.dev'), size: '1x1', openMode: 'tab', position: { col: 11, row: 0 } },
];
