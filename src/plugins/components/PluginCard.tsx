import { useState } from 'react';
import { DeleteOutlined } from '@ant-design/icons';
import { pluginManager } from '../core/pluginManager';
import { ContextMenu, MacModal } from '@/components';
import type { ContextMenuItem } from '@/components';
import { LayoutIcon } from '@/components/icons';
import type { PluginCardItem, PluginSize, CardSize, Position, ShortcutSize } from '@/types';
import { useCardBehavior } from '@/features/shortcuts/hooks/useCardBehavior';

interface GridConfig {
  columns: number;
  rows: number;
  unit: number;
  gap: number;
}

interface PluginCardProps {
  item: PluginCardItem;
  onResize?: (item: PluginCardItem, size: CardSize) => void;
  onRemove?: (item: PluginCardItem) => void;
  className?: string;
  batchEditMode?: boolean;
  isSelected?: boolean;
  onToggleSelect?: (id: string) => void;
  gridConfig?: GridConfig;
  position?: Position;
}

export function PluginCard({ 
  item, 
  onResize, 
  onRemove,
  className = '', 
  batchEditMode = false, 
  isSelected = false, 
  onToggleSelect,
  gridConfig,
  position
}: PluginCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const plugin = pluginManager.getPlugin(item.pluginId);
  const api = pluginManager.getPluginAPI(item.pluginId);
  const isSystem = plugin?.isSystem === true;

  // 使用 useCardBehavior hook
  const {
    contextMenu,
    handleContextMenu: baseHandleContextMenu,
    closeContextMenu,
    disabledLayouts,
    handleBatchClick,
    cardContainerClassName,
    selectionIndicatorClassName,
  } = useCardBehavior({
    size: (item.size || '2x2') as ShortcutSize,
    gridConfig,
    position,
    batchEditMode,
    isSelected,
    disableContextMenu: isSystem,
  });

  // 系统插件禁用右键菜单
  const handleContextMenu = (e: React.MouseEvent) => {
    if (isSystem) {
      e.preventDefault();
      return;
    }
    baseHandleContextMenu(e);
  };

  if (!plugin || !api) {
    return (
      <div className={`w-full h-full rounded-2xl bg-white shadow-lg flex items-center justify-center ${className}`}>
        <span className="text-gray-400 text-sm">插件未找到</span>
      </div>
    );
  }

  const handleClick = () => {
    if (handleBatchClick(onToggleSelect, item.id)) return;
    if (plugin.renderModal) {
      setIsModalOpen(true);
    }
  };

  const supportedSizes = plugin.supportedSizes || ['1x1', '2x2'];
  const layoutOptions = supportedSizes as CardSize[];

  const contextMenuItems: ContextMenuItem[] = [
    {
      icon: <LayoutIcon />,
      label: '布局',
      type: 'layout',
      layoutOptions,
      disabledLayouts,
      currentLayout: item.size || '2x2',
      onLayoutSelect: (size) => onResize?.(item, size),
      onClick: () => {},
    },
  ];

  // 系统插件不可删除
  if (!isSystem) {
    contextMenuItems.push({
      icon: <DeleteOutlined />,
      label: '移除插件',
      onClick: () => onRemove?.(item),
    });
  }

  const pluginSize: PluginSize = (item.size === '1x1' || item.size === '2x2' || item.size === '2x4') 
    ? item.size 
    : '2x2';

  return (
    <>
      <button
        onClick={handleClick}
        onContextMenu={handleContextMenu}
        className={`flex flex-col items-center gap-2 cursor-pointer group w-full h-full ${className}`}
      >
        <div className={cardContainerClassName}>
          {batchEditMode && (
            <div className={selectionIndicatorClassName}>
              {isSelected && (
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" className="w-3 h-3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
          )}
          
          {plugin.renderCard ? (
            plugin.renderCard(api, pluginSize)
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-2">
              <span className="text-2xl">{plugin.metadata.icon || '🔌'}</span>
              <span className="text-sm text-gray-600">{plugin.metadata.name}</span>
            </div>
          )}
        </div>
        
        <span className="text-white text-xs truncate drop-shadow w-full text-center flex-shrink-0">
          {item.name}
        </span>
      </button>

      <ContextMenu
        isOpen={contextMenu.isOpen}
        position={{ x: contextMenu.x, y: contextMenu.y }}
        items={contextMenuItems}
        onClose={closeContextMenu}
      />

      <MacModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={plugin.metadata.name}
        width={plugin.modalSize?.width || 450}
        height={plugin.modalSize?.height || 500}
      >
        {plugin.renderModal?.(api)}
      </MacModal>
    </>
  );
}
