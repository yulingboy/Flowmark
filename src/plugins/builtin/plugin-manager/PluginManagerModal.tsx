import { Card, Button, Empty, message } from 'antd';
import { pluginManager } from '../../core/pluginManager';
import { useShortcutsStore } from '@/features/shortcuts';
import { isPluginCard } from '../../types';
import type { Plugin, PluginSize } from '../../types';

function PluginItem({ plugin }: { plugin: Plugin }) {
  const shortcuts = useShortcutsStore(state => state.shortcuts);
  const addPluginCard = useShortcutsStore(state => state.addPluginCard);
  const deleteItem = useShortcutsStore(state => state.deleteItem);
  
  const isOnDesktop = shortcuts.some(s => isPluginCard(s) && s.pluginId === plugin.metadata.id);

  const handleToggle = () => {
    if (isOnDesktop) {
      deleteItem(`plugin-${plugin.metadata.id}`);
      message.success('已移除插件');
    } else {
      const success = addPluginCard(
        plugin.metadata.id,
        plugin.metadata.name,
        plugin.metadata.icon || '🔌',
        plugin.defaultSize || '2x2',
        plugin.supportedSizes as PluginSize[]
      );
      if (success) {
        message.success('已添加插件');
      } else {
        message.warning('桌面空间不足，无法添加插件');
      }
    }
  };

  return (
    <Card
      hoverable
      cover={
        <div className="h-32 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
          <span className="text-6xl">{plugin.metadata.icon || '🔌'}</span>
        </div>
      }
      styles={{ body: { padding: 16 } }}
    >
      <Card.Meta
        title={<span className="text-center block">{plugin.metadata.name}</span>}
        description={
          plugin.metadata.description && (
            <p className="text-xs text-gray-400 text-center line-clamp-2">
              {plugin.metadata.description}
            </p>
          )
        }
      />
      <Button
        block
        type={isOnDesktop ? 'default' : 'primary'}
        onClick={handleToggle}
        className="mt-3"
      >
        {isOnDesktop ? '移除' : '添加'}
      </Button>
    </Card>
  );
}

export function PluginManagerModal() {
  const plugins = pluginManager.getPlugins().filter(p => p.metadata.id !== 'plugin-manager');

  if (plugins.length === 0) {
    return (
      <div className="p-6 min-h-full flex items-center justify-center">
        <Empty description="暂无可用插件" />
      </div>
    );
  }

  return (
    <div className="p-6 min-h-full">
      <div className="grid grid-cols-3 gap-4">
        {plugins.map(plugin => (
          <PluginItem key={plugin.metadata.id} plugin={plugin} />
        ))}
      </div>
    </div>
  );
}
