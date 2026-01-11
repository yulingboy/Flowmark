import { pluginManager } from '../../core/pluginManager';
import { useShortcutsStore } from '@/stores/shortcutsStore';
import { isPluginCard } from '../../types';
import type { Plugin, PluginAPI, PluginSize } from '../../types';

// 商店图标
const StoreIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

// 插件图标
const PluginIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
  </svg>
);

function PluginItem({ plugin }: { plugin: Plugin }) {
  const shortcuts = useShortcutsStore(state => state.shortcuts);
  const addPluginCard = useShortcutsStore(state => state.addPluginCard);
  const removePluginCard = useShortcutsStore(state => state.removePluginCard);
  
  const isOnDesktop = shortcuts.some(s => isPluginCard(s) && s.pluginId === plugin.metadata.id);

  const handleToggle = () => {
    if (isOnDesktop) {
      removePluginCard(`plugin-${plugin.metadata.id}`);
    } else {
      addPluginCard(
        plugin.metadata.id,
        plugin.metadata.name,
        plugin.metadata.icon || '🔌',
        plugin.defaultSize || '2x2'
      );
    }
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* 预览区域 */}
      <div className="h-32 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <span className="text-6xl">{plugin.metadata.icon || '🔌'}</span>
      </div>
      
      {/* 信息区域 */}
      <div className="p-4">
        <h3 className="font-medium text-gray-800 text-center">{plugin.metadata.name}</h3>
        {plugin.metadata.description && (
          <p className="text-xs text-gray-400 text-center mt-1 line-clamp-2">{plugin.metadata.description}</p>
        )}
        
        {/* 操作按钮 */}
        <button
          onClick={handleToggle}
          className={`w-full mt-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            isOnDesktop 
              ? 'bg-gray-100 text-gray-500 hover:bg-gray-200' 
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {isOnDesktop ? '移除' : '添加'}
        </button>
      </div>
    </div>
  );
}

// 卡片视图
export function PluginManagerCard({ size }: { api: PluginAPI; size: PluginSize }) {
  if (size === '1x1') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-violet-500 to-purple-600">
        <StoreIcon className="w-8 h-8 text-white" />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-violet-500 to-purple-600 p-4">
      <StoreIcon className="w-12 h-12 text-white mb-2" />
      <span className="font-medium text-white">插件市场</span>
      <span className="text-xs text-white/70 mt-1">发现更多插件</span>
    </div>
  );
}

// 弹窗视图
export function PluginManagerModal() {
  const plugins = pluginManager.getPlugins().filter(p => p.metadata.id !== 'plugin-manager');

  return (
    <div className="p-6 min-h-full">
      {plugins.length === 0 ? (
        <div className="text-center text-gray-400 py-16">
          <PluginIcon className="w-16 h-16 mx-auto mb-3 text-gray-300" />
          <p>暂无可用插件</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {plugins.map(plugin => (
            <PluginItem key={plugin.metadata.id} plugin={plugin} />
          ))}
        </div>
      )}
    </div>
  );
}
