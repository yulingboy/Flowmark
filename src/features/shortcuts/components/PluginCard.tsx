import { useState, useRef, useEffect } from 'react';
import { DeleteOutlined, CheckOutlined, AppstoreOutlined } from '@ant-design/icons';
import { builtinPlugins } from '@/plugins/builtin';
import { ContextMenu, MacModal } from '@/components';
import type { ContextMenuItem } from '@/components';
import type { PluginCardItem, PluginSize, CardSize, Position } from '@/types';
import { useCardBehavior } from '../hooks/useCardBehavior';

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

/**
 * 使用 Intersection Observer 实现懒加载
 */
function useIntersectionObserver(options?: IntersectionObserverInit) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // 一旦可见就停止观察
        }
      },
      { threshold: 0.1, rootMargin: '50px', ...options }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [options]);

  return { ref, isVisible };
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
  const { ref: visibilityRef, isVisible } = useIntersectionObserver();

  const plugin = builtinPlugins.find(p => p.metadata.id === item.pluginId);
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
    size: (item.size || '2x2') as CardSize,
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

  if (!plugin) {
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
      icon: <AppstoreOutlined />,
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
        ref={visibilityRef as React.RefObject<HTMLButtonElement>}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
        className={`flex flex-col items-center gap-2 cursor-pointer group w-full h-full ${className}`}
      >
        <div className={cardContainerClassName}>
          {batchEditMode && (
            <div className={selectionIndicatorClassName}>
              {isSelected && <CheckOutlined style={{ fontSize: 12, color: 'white', strokeWidth: 50 }} />}
            </div>
          )}
          
          {/* 懒加载：只有可见时才渲染插件内容 */}
          {isVisible ? (
            plugin.renderCard ? (
              plugin.renderCard(pluginSize)
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-2">
                <span className="text-2xl">{plugin.metadata.icon || '🔌'}</span>
                <span className="text-sm text-gray-600">{plugin.metadata.name}</span>
              </div>
            )
          ) : (
            // 占位符：未可见时显示
            <div className="w-full h-full flex flex-col items-center justify-center p-2 animate-pulse">
              <div className="w-8 h-8 bg-gray-200 rounded-full" />
              <div className="w-16 h-3 bg-gray-200 rounded mt-2" />
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
        {plugin.renderModal?.()}
      </MacModal>
    </>
  );
}
