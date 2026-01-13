import { Button, Empty } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { pluginManager } from '../../core/pluginManager';
import { useShortcutsStore } from '@/features/shortcuts';
import { isPluginCard } from '@/types';
import type { Plugin, PluginSize } from '@/types';

function PluginItem({ plugin }: { plugin: Plugin }) {
  const shortcuts = useShortcutsStore(state => state.shortcuts);
  const addPluginCard = useShortcutsStore(state => state.addPluginCard);
  const deleteItem = useShortcutsStore(state => state.deleteItem);
  
  const isOnDesktop = shortcuts.some(s => isPluginCard(s) && s.pluginId === plugin.metadata.id);

  const handleToggle = () => {
    if (isOnDesktop) {
      deleteItem(`plugin-${plugin.metadata.id}`);
    } else {
      addPluginCard(
        plugin.metadata.id,
        plugin.metadata.name,
        plugin.metadata.icon || 'puzzle',
        plugin.defaultSize || '2x2',
        plugin.supportedSizes as PluginSize[]
      );
    }
  };

  return (
    <div className="flex items-center justify-between gap-3 p-3 bg-white rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium truncate">{plugin.metadata.name}</h3>
        {plugin.metadata.description && (
          <p className="text-xs text-gray-400 truncate mt-0.5">
            {plugin.metadata.description}
          </p>
        )}
      </div>
      <Button
        size="small"
        type={isOnDesktop ? 'default' : 'primary'}
        icon={isOnDesktop ? <MinusOutlined /> : <PlusOutlined />}
        onClick={handleToggle}
      >
        {isOnDesktop ? '移除' : '添加'}
      </Button>
    </div>
  );
}

export function PluginManagerModal() {
  const plugins = pluginManager.getPlugins().filter(p => p.metadata.id !== 'plugin-manager');

  if (plugins.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <Empty description="暂无可用插件" />
      </div>
    );
  }

  return (
    <div className="h-full p-3 overflow-y-auto bg-gray-50">
      <div className="flex flex-col gap-2">
        {plugins.map(plugin => (
          <PluginItem key={plugin.metadata.id} plugin={plugin} />
        ))}
      </div>
    </div>
  );
}
