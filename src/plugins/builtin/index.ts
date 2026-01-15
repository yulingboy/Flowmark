import { useShortcutsStore } from '@/features/shortcuts';
import { isPluginCard } from '@/types';
import { weatherPlugin } from './weather';
import { todoPlugin } from './todo';
import { notesPlugin } from './notes';
import { pluginManagerPlugin } from './plugin-manager';
import { wallpaperPlugin } from './wallpaper';
import { calendarPlugin } from './calendar';
import { hitokotoPlugin } from './hitokoto';
import { pomodoroPlugin } from './pomodoro';
import { flipClockPlugin } from './flip-clock';
import { habitPlugin } from './habit';
import { foodPickerPlugin } from './food-picker';

export const builtinPlugins = [
  pluginManagerPlugin,
  weatherPlugin,
  todoPlugin,
  notesPlugin,
  wallpaperPlugin,
  calendarPlugin,
  hitokotoPlugin,
  pomodoroPlugin,
  flipClockPlugin,
  habitPlugin,
  foodPickerPlugin
];

/**
 * 注册所有内置插件
 */
export function registerBuiltinPlugins() {
  const shortcutsStore = useShortcutsStore.getState();
  const shortcuts = shortcutsStore.shortcuts;
  
  // 不再自动添加插件卡片，用户需要手动从插件管理器添加
  // 只确保系统插件存在
  builtinPlugins.forEach(plugin => {
    if (plugin.isSystem) {
      const exists = shortcuts.some(s => isPluginCard(s) && s.pluginId === plugin.metadata.id);
      if (!exists) {
        shortcutsStore.addPluginCard(
          plugin.metadata.id,
          plugin.metadata.name,
          plugin.metadata.icon || '🔌',
          plugin.defaultSize || '2x2'
        );
      }
    }
  });
}

export {
  weatherPlugin,
  todoPlugin,
  notesPlugin,
  pluginManagerPlugin,
  wallpaperPlugin,
  calendarPlugin,
  hitokotoPlugin,
  pomodoroPlugin,
  flipClockPlugin,
  habitPlugin,
  foodPickerPlugin
};
