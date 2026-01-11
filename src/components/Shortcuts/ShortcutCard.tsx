import { useState, useMemo } from 'react';
import type { ShortcutItem, ShortcutSize } from '@/types';
import { isShortcutFolder } from '@/types';
import { IframeModal, ContextMenu } from '@/components/common';
import type { ContextMenuItem } from '@/components/common';
import { EditOutlined, DeleteOutlined, FolderOutlined, RightOutlined } from '@ant-design/icons';
import { OpenTabIcon, LayoutIcon, OpenModeIndicator } from '@/components/common/icons';
import { useShortcutsStore } from '@/stores/shortcuts';

interface ShortcutCardProps {
  item: ShortcutItem;
  onClick?: (item: ShortcutItem) => void;
  onEdit?: (item: ShortcutItem) => void;
  onDelete?: (item: ShortcutItem) => void;
  onResize?: (item: ShortcutItem, size: ShortcutSize) => void;
  className?: string;
  batchEditMode?: boolean;
  isSelected?: boolean;
  onToggleSelect?: (id: string) => void;
}

export function ShortcutCard({ item, onClick, onEdit, onDelete, onResize, className = '', batchEditMode = false, isSelected = false, onToggleSelect }: ShortcutCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ isOpen: boolean; x: number; y: number }>({
    isOpen: false, x: 0, y: 0,
  });
  const shortcuts = useShortcutsStore((state) => state.shortcuts);
  const moveToFolder = useShortcutsStore((state) => state.moveToFolder);
  const isPopupMode = item.openMode === 'popup';
  const is1x1 = (item.size || '1x1') === '1x1';

  // 根据尺寸计算图标样式
  const iconStyle = is1x1
    ? { className: 'w-full h-full object-cover', style: {} }
    : { className: 'object-contain', style: { width: '64px', height: '64px', maxWidth: '50%', maxHeight: '50%' } };

  const folders = useMemo(() => 
    shortcuts.filter(isShortcutFolder).map((f) => ({ id: f.id, name: f.name })),
    [shortcuts]
  );

  const handleClick = () => {
    // 批量编辑模式下，点击切换选中状态
    if (batchEditMode) {
      onToggleSelect?.(item.id);
      return;
    }
    if (onClick) {
      onClick(item);
      return;
    }
    if (isPopupMode) {
      setIsModalOpen(true);
    } else {
      window.open(item.url, '_blank');
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    // 批量编辑模式下禁用右键菜单
    if (batchEditMode) {
      e.preventDefault();
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ isOpen: true, x: e.clientX, y: e.clientY });
  };

  const contextMenuItems: ContextMenuItem[] = [
    {
      icon: <OpenTabIcon />,
      label: '新标签打开',
      onClick: () => window.open(item.url, '_blank'),
    },
    {
      icon: <EditOutlined />,
      label: '编辑标签',
      onClick: () => onEdit?.(item),
    },
    {
      icon: <FolderOutlined />,
      label: '移动至分类',
      type: 'submenu',
      rightIcon: <RightOutlined />,
      submenuItems: folders.map((folder) => ({
        id: folder.id,
        label: folder.name,
        onClick: () => moveToFolder(item.id, folder.id),
      })),
      onClick: () => {},
    },
    {
      icon: <LayoutIcon />,
      label: '布局',
      type: 'layout',
      layoutOptions: ['1x1', '1x2', '2x1', '2x2', '2x4'],
      currentLayout: item.size || '1x1',
      onLayoutSelect: (size) => onResize?.(item, size),
      onClick: () => {},
    },
    {
      icon: <DeleteOutlined />,
      label: '删除标签',
      onClick: () => onDelete?.(item),
    },
  ];

  return (
    <>
      <button
        onClick={handleClick}
        onContextMenu={handleContextMenu}
        className={`flex flex-col items-center gap-1 cursor-pointer group w-full h-full ${className}`}
      >
        {/* 图标卡片 */}
        <div className={`w-full flex-1 rounded-2xl overflow-hidden bg-white shadow-lg flex items-center justify-center group-hover:scale-105 transition-transform relative ${batchEditMode && isSelected ? 'ring-2 ring-blue-500' : ''}`}>
          {/* 批量编辑模式下的选中标记 */}
          {batchEditMode && (
            <div className={`absolute top-1 left-1 w-5 h-5 rounded-full border-2 flex items-center justify-center z-10 ${isSelected ? 'bg-blue-500 border-blue-500' : 'bg-white/80 border-gray-300'}`}>
              {isSelected && (
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" className="w-3 h-3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
          )}
          <img
            src={item.icon}
            alt={item.name}
            className={iconStyle.className}
            style={iconStyle.style}
            loading="eager"
            draggable={false}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.parentElement!.innerHTML = `<span class="text-gray-600 text-2xl font-bold">${item.name[0]}</span>`;
            }}
          />
          {/* 打开方式标识 - 只有新标签页模式才显示角标 */}
          {!isPopupMode && <OpenModeIndicator />}
        </div>
        {/* 名称 */}
        <span className="text-white text-xs truncate drop-shadow w-full text-center flex-shrink-0">
          {item.name}
        </span>
      </button>

      {/* 右键菜单 */}
      <ContextMenu
        isOpen={contextMenu.isOpen}
        position={{ x: contextMenu.x, y: contextMenu.y }}
        items={contextMenuItems}
        onClose={() => setContextMenu(prev => ({ ...prev, isOpen: false }))}
      />

      {/* 弹窗 */}
      <IframeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        url={item.url}
        title={item.name}
      />
    </>
  );
}
