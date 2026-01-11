import { useState, useMemo, useCallback } from 'react';
import type { ShortcutItem, ShortcutSize } from '@/types';
import { isShortcutFolder } from '@/types';
import { IframeModal, ContextMenu } from '@/components/common';
import type { ContextMenuItem } from '@/components/common';
import { OpenTabIcon, EditIcon, MoveIcon, LayoutIcon, DeleteIcon, ChevronRightIcon } from '@/components/common/icons';
import { useShortcutsStore } from '@/stores/shortcutsStore';

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
  const size = item.size || '1x1';
  const is1x1 = size === '1x1';

  // 根据尺寸计算图标样式
  const getIconStyle = useCallback(() => {
    if (is1x1) {
      return { className: 'w-full h-full object-cover', style: {} };
    }
    // 非1x1尺寸：图标居中显示，保持原比例
    return { 
      className: 'object-contain', 
      style: { 
        width: '64px', 
        height: '64px',
        maxWidth: '50%',
        maxHeight: '50%',
      } 
    };
  }, [is1x1]);

  const iconStyle = getIconStyle();

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
      icon: <EditIcon />,
      label: '编辑标签',
      onClick: () => onEdit?.(item),
    },
    {
      icon: <MoveIcon />,
      label: '移动至分类',
      type: 'submenu',
      rightIcon: <ChevronRightIcon />,
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
      icon: <DeleteIcon />,
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
          {!isPopupMode && (
            <div className="absolute bottom-0 right-0 w-6 h-6 bg-[#0084FF] rounded-tl-2xl flex items-center justify-center">
              <svg fill="none" version="1.1" width="14" height="14" viewBox="0 0 32 32"><g><g><rect x="7" y="6" width="19" height="19" rx="0" fill="#FFFFFF" fillOpacity="1" /></g><g><path d="M16,0C7.16344,0,0,7.16344,0,16C0,24.8366,7.16344,32,16,32C24.8366,32,32,24.8366,32,16C32,7.16344,24.8366,0,16,0ZM24.0224,14.3808C23.3989,15.3805,22.426,16.1127,21.2928,16.4352C21.0457,16.5158,20.7879,16.559,20.528,16.5632C20.0282,16.5603,19.6245,16.1542,19.6245,15.6544C19.6245,15.1545,20.0282,14.7485,20.528,14.7456C20.5972,14.7472,20.6659,14.7341,20.7296,14.7072C21.4574,14.5263,22.0849,14.0666,22.4768,13.4272C22.7048,13.0545,22.8244,12.6257,22.8224,12.1888C22.8224,10.752,21.4944,9.568,19.8752,9.568C19.3149,9.56918,18.7641,9.71347,18.2752,9.98719C17.4545,10.4193,16.9318,11.2616,16.9088,12.1888Q16.8858,13.116,16.9088,19.8208C16.8926,21.3952,16.0225,22.8365,14.6368,23.584C13.8762,24.0117,13.0166,24.2324,12.144,24.224C9.50719,24.224,7.344,22.24,7.344,19.7856C7.34867,19.0157,7.56211,18.2614,7.96159,17.6032C8.58511,16.6035,9.55798,15.8713,10.6912,15.5488C10.9386,15.4694,11.1962,15.4262,11.456,15.4208C11.96,15.4179,12.3701,15.8256,12.3701,16.3296C12.3701,16.8336,11.96,17.2414,11.456,17.2384C11.3868,17.2368,11.3181,17.2499,11.2544,17.2768C10.5329,17.4709,9.90979,17.9274,9.50722,18.5568C9.27923,18.9295,9.15955,19.3583,9.1616,19.7952C9.1616,21.232,10.4896,22.416,12.128,22.416C12.6883,22.4148,13.2391,22.2705,13.728,21.9968C14.5474,21.5638,15.0688,20.7217,15.0912,19.7952L15.0912,12.1984C15.1089,10.6228,15.98,9.18083,17.3664,8.43203C18.1133,7.98446,18.9693,7.75191,19.84,7.76003C22.4768,7.76003,24.64,9.74403,24.64,12.1984C24.6353,12.9684,24.4219,13.7226,24.0224,14.3808Z" fill="#0084FF" fillOpacity="1" /></g></g></svg>
            </div>
          )}
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
