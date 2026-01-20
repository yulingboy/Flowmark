import { useState, useMemo } from 'react';
import type { ShortcutItem, CardSize, Position } from '@/types';
import { isShortcutFolder } from '@/types';
import { IframeModal, ContextMenu } from '@/components';
import type { ContextMenuItem } from '@/components';
import { EditOutlined, DeleteOutlined, FolderOutlined, RightOutlined, ExportOutlined, AppstoreOutlined } from '@ant-design/icons';
import { OpenModeIndicator } from '@/components/icons';
import { useShortcutsStore } from '../store';
import { useCardBehavior } from '../hooks/useCardBehavior';

interface GridConfig {
  columns: number;
  rows: number;
  unit: number;
  gap: number;
}

interface ShortcutCardProps {
  item: ShortcutItem;
  onClick?: (item: ShortcutItem) => void;
  onEdit?: (item: ShortcutItem) => void;
  onDelete?: (item: ShortcutItem) => void;
  onResize?: (item: ShortcutItem, size: CardSize) => void;
  className?: string;
  gridConfig?: GridConfig;
  position?: Position;
}

export function ShortcutCard({ item, onClick, onEdit, onDelete, onResize, className = '', gridConfig, position }: ShortcutCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const shortcuts = useShortcutsStore((state) => state.shortcuts);
  const moveToFolder = useShortcutsStore((state) => state.moveToFolder);
  const isPopupMode = item.openMode === 'popup';
  const is1x1 = (item.size || '1x1') === '1x1';

  const {
    contextMenu,
    handleContextMenu,
    closeContextMenu,
    disabledLayouts,
    cardContainerClassName,
  } = useCardBehavior({
    size: item.size || '1x1',
    gridConfig,
    position,
  });

  const iconStyle = is1x1
    ? { className: 'max-w-full max-h-full object-cover', style: {} }
    : { className: 'object-contain', style: { width: '64px', height: '64px', maxWidth: '50%', maxHeight: '50%' } };

  const folders = useMemo(() => 
    shortcuts.filter(isShortcutFolder).map((f) => ({ id: f.id, name: f.name })),
    [shortcuts]
  );

  const handleClick = () => {
    if (onClick) { onClick(item); return; }
    if (isPopupMode) { setIsModalOpen(true); } else { window.open(item.url, '_blank'); }
  };

  const contextMenuItems: ContextMenuItem[] = [
    { icon: <ExportOutlined />, label: '新标签打开', onClick: () => window.open(item.url, '_blank') },
    { icon: <EditOutlined />, label: '编辑标签', onClick: () => onEdit?.(item) },
    { icon: <FolderOutlined />, label: '移动至分类', type: 'submenu', rightIcon: <RightOutlined style={{ fontSize: 12 }} />,
      submenuItems: folders.map((folder) => ({ id: folder.id, label: folder.name, onClick: () => moveToFolder(item.id, folder.id) })), onClick: () => {} },
    { icon: <AppstoreOutlined />, label: '布局', type: 'layout', layoutOptions: ['1x1', '1x2', '2x1', '2x2', '2x4'], disabledLayouts,
      currentLayout: item.size || '1x1', onLayoutSelect: (size) => onResize?.(item, size), onClick: () => {} },
    { icon: <DeleteOutlined />, label: '删除标签', onClick: () => onDelete?.(item) },
  ];

  return (
    <>
      <button onClick={handleClick} onContextMenu={handleContextMenu}
        className={`flex flex-col items-center gap-2 cursor-pointer group w-full h-full ${className}`}>
        <div className={`${cardContainerClassName} flex items-center justify-center`}>
          <img src={item.icon} alt={item.name} className={iconStyle.className} style={iconStyle.style} loading="eager" draggable={false}
            onError={(e) => { const target = e.target as HTMLImageElement; target.style.display = 'none'; target.parentElement!.innerHTML = `<span class="text-gray-600 text-2xl font-bold">${item.name[0]}</span>`; }} />
          {!isPopupMode && <OpenModeIndicator />}
        </div>
        <span className="text-white text-xs truncate drop-shadow w-full text-center flex-shrink-0">{item.name}</span>
      </button>
      <ContextMenu isOpen={contextMenu.isOpen} position={{ x: contextMenu.x, y: contextMenu.y }} items={contextMenuItems}
        onClose={closeContextMenu} />
      <IframeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} url={item.url} title={item.name} />
    </>
  );
}
