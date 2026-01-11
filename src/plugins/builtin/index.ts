import { pluginManager } from '../core/pluginManager';
import { useShortcutsStore } from '@/features/shortcuts';
import { isPluginCard } from '../types';
import { weatherPlugin } from './weather';
import { todoPlugin } from './todo';
import { notesPlugin } from './notes';
import { pluginManagerPlugin } from './plugin-manager';

export const builtinPlugins = [pluginManagerPlugin, weatherPlugin, todoPlugin, notesPlugin];

export function registerBuiltinPlugins() {
  const shortcutsStore = useShortcutsStore.getState();
  const shortcuts = shortcutsStore.shortcuts;
  
  const hasAnyPluginCard = shortcuts.some(s => isPluginCard(s));
  
  builtinPlugins.forEach(plugin => {
    pluginManager.register(plugin);
    
    // 首次运行时，为所有内置插件添加卡片
    if (!hasAnyPluginCard) {
      shortcutsStore.addPluginCard(
        plugin.metadata.id,
        plugin.metadata.name,
        plugin.metadata.icon || '🔌',
        plugin.defaultSize || '2x2'
      );
    }
    // 系统插件始终确保存在
    else if (plugin.isSystem) {
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

export { weatherPlugin, todoPlugin, notesPlugin, pluginManagerPlugin };
