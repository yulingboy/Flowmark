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

export const defaultShortcuts: ShortcutEntry[] = [
  { id: '1', name: 'GitHub', url: 'https://github.com', icon: getFaviconUrl('https://github.com'), size: '1x1', openMode: 'popup' },
  { id: '2', name: 'MDN', url: 'https://developer.mozilla.org', icon: getFaviconUrl('https://developer.mozilla.org'), size: '1x1', openMode: 'popup' },
  { id: '3', name: 'CodePen', url: 'https://codepen.io', icon: getFaviconUrl('https://codepen.io'), size: '1x1' },
  { id: '4', name: 'React', url: 'https://react.dev', icon: getFaviconUrl('https://react.dev'), size: '1x1', openMode: 'popup' },
  { id: '5', name: 'Vue', url: 'https://vuejs.org', icon: getFaviconUrl('https://vuejs.org'), size: '1x1' },
  { id: '6', name: 'TypeScript', url: 'https://www.typescriptlang.org', icon: getFaviconUrl('https://www.typescriptlang.org'), size: '1x1', openMode: 'popup' },
  { id: '7', name: 'Vite', url: 'https://vitejs.dev', icon: getFaviconUrl('https://vitejs.dev'), size: '1x1' },
  { id: '8', name: 'Tailwind CSS', url: 'https://tailwindcss.com', icon: getFaviconUrl('https://tailwindcss.com'), size: '1x1' },
  createFolder('folder-1', [
    { id: 'f1-1', name: 'Next.js', url: 'https://nextjs.org', icon: getFaviconUrl('https://nextjs.org'), openMode: 'popup' },
    { id: 'f1-2', name: 'Nuxt', url: 'https://nuxt.com', icon: getFaviconUrl('https://nuxt.com') },
    { id: 'f1-3', name: 'Svelte', url: 'https://svelte.dev', icon: getFaviconUrl('https://svelte.dev'), openMode: 'popup' },
    { id: 'f1-4', name: 'Angular', url: 'https://angular.dev', icon: getFaviconUrl('https://angular.dev') },
    { id: 'f1-5', name: 'Astro', url: 'https://astro.build', icon: getFaviconUrl('https://astro.build') },
    { id: 'f1-6', name: 'Remix', url: 'https://remix.run', icon: getFaviconUrl('https://remix.run') },
    { id: 'f1-7', name: 'Solid', url: 'https://www.solidjs.com', icon: getFaviconUrl('https://www.solidjs.com') },
    { id: 'f1-8', name: 'Qwik', url: 'https://qwik.builder.io', icon: getFaviconUrl('https://qwik.builder.io') },
  ], '更多框架'),
];
