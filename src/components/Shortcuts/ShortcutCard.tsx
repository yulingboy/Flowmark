import { useState } from 'react';
import type { ShortcutItem, ShortcutSize } from '@/types';
import { IframeModal, ContextMenu } from '@/components/common';
import type { ContextMenuItem } from '@/components/common';

interface ShortcutCardProps {
  item: ShortcutItem;
  onClick?: (item: ShortcutItem) => void;
  onEdit?: (item: ShortcutItem) => void;
  onDelete?: (item: ShortcutItem) => void;
  onResize?: (item: ShortcutItem, size: ShortcutSize) => void;
  className?: string;
}

// 右键菜单图标
const OpenTabIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const EditIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const MoveIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
    <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
  </svg>
);

const DockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
    <rect x="2" y="6" width="20" height="12" rx="2" />
    <line x1="6" y1="18" x2="6" y2="21" />
    <line x1="18" y1="18" x2="18" y2="21" />
  </svg>
);

const LayoutIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);

const DeleteIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

export function ShortcutCard({ item, onClick, onEdit, onDelete, onResize, className = '' }: ShortcutCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ isOpen: boolean; x: number; y: number }>({
    isOpen: false, x: 0, y: 0,
  });
  const isPopupMode = item.openMode === 'popup';
  const size = item.size || '1x1';

  const handleClick = () => {
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
      onClick: () => console.log('移动至分类'),
      rightIcon: <ArrowRightIcon />,
    },
    {
      icon: <DockIcon />,
      label: '加入Dock栏',
      onClick: () => console.log('加入Dock栏'),
    },
    {
      icon: <LayoutIcon />,
      label: '布局',
      type: 'layout',
      layoutOptions: ['1x1', '1x2', '2x1', '2x2', '2x4'],
      currentLayout: item.size || '1x1',
      onLayoutSelect: (s) => onResize?.(item, s),
      onClick: () => {},
    },
    {
      icon: <DeleteIcon />,
      label: '删除标签',
      onClick: () => onDelete?.(item),
    },
  ];

  // 根据尺寸渲染不同布局
  const renderContent = () => {
    // 1x1: 标准小图标 + 底部名称
    if (size === '1x1') {
      return (
        <div className="flex flex-col items-center gap-1 w-full h-full">
          <div className="w-full flex-1 rounded-2xl overflow-hidden bg-white shadow-lg flex items-center justify-center group-hover:scale-105 transition-transform relative">
            <img
              src={item.icon}
              alt={item.name}
              className="w-full h-full object-cover"
              loading="eager"
              draggable={false}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.parentElement!.innerHTML = `<span class="text-gray-600 text-2xl font-bold">${item.name[0]}</span>`;
              }}
            />
            {renderBadge()}
          </div>
          <span className="text-white text-xs truncate drop-shadow w-full text-center flex-shrink-0">
            {item.name}
          </span>
        </div>
      );
    }

    // 2x1: 横向布局，左侧图标 + 右侧名称和描述
    if (size === '2x1') {
      return (
        <div className="flex items-center gap-3 w-full h-full rounded-2xl bg-white/90 shadow-lg p-3 group-hover:scale-[1.02] transition-transform relative overflow-hidden">
          <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 flex items-center justify-center">
            <img
              src={item.icon}
              alt={item.name}
              className="w-full h-full object-cover"
              loading="eager"
              draggable={false}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.parentElement!.innerHTML = `<span class="text-gray-600 text-lg font-bold">${item.name[0]}</span>`;
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-gray-800 text-sm font-medium truncate">{item.name}</div>
            <div className="text-gray-500 text-xs truncate">{new URL(item.url).hostname}</div>
          </div>
          {renderBadge()}
        </div>
      );
    }

    // 1x2: 纵向布局，上方大图标 + 下方名称和描述
    if (size === '1x2') {
      return (
        <div className="flex flex-col w-full h-full rounded-2xl bg-white/90 shadow-lg overflow-hidden group-hover:scale-[1.02] transition-transform relative">
          <div className="flex-1 flex items-center justify-center bg-gray-50 p-4">
            <img
              src={item.icon}
              alt={item.name}
              className="w-12 h-12 object-contain"
              loading="eager"
              draggable={false}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.parentElement!.innerHTML = `<span class="text-gray-600 text-2xl font-bold">${item.name[0]}</span>`;
              }}
            />
          </div>
          <div className="p-3 text-center">
            <div className="text-gray-800 text-sm font-medium truncate">{item.name}</div>
            <div className="text-gray-500 text-xs truncate mt-1">{new URL(item.url).hostname}</div>
          </div>
          {renderBadge()}
        </div>
      );
    }

    // 2x2: 大卡片布局
    if (size === '2x2') {
      return (
        <div className="flex flex-col w-full h-full rounded-2xl bg-white/90 shadow-lg overflow-hidden group-hover:scale-[1.02] transition-transform relative">
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-6">
            <img
              src={item.icon}
              alt={item.name}
              className="w-16 h-16 object-contain"
              loading="eager"
              draggable={false}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.parentElement!.innerHTML = `<span class="text-gray-600 text-4xl font-bold">${item.name[0]}</span>`;
              }}
            />
          </div>
          <div className="p-4">
            <div className="text-gray-800 text-base font-medium truncate">{item.name}</div>
            <div className="text-gray-500 text-sm truncate mt-1">{new URL(item.url).hostname}</div>
          </div>
          {renderBadge()}
        </div>
      );
    }

    // 2x4: 超大卡片布局
    if (size === '2x4') {
      return (
        <div className="flex flex-col w-full h-full rounded-2xl bg-white/90 shadow-lg overflow-hidden group-hover:scale-[1.01] transition-transform relative">
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-8">
            <img
              src={item.icon}
              alt={item.name}
              className="w-20 h-20 object-contain"
              loading="eager"
              draggable={false}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.parentElement!.innerHTML = `<span class="text-gray-600 text-5xl font-bold">${item.name[0]}</span>`;
              }}
            />
          </div>
          <div className="p-5">
            <div className="text-gray-800 text-lg font-semibold truncate">{item.name}</div>
            <div className="text-gray-500 text-sm mt-2 line-clamp-2">{new URL(item.url).hostname}</div>
          </div>
          {renderBadge()}
        </div>
      );
    }

    // 默认 1x1
    return null;
  };

  // 渲染角标
  const renderBadge = () => {
    if (isPopupMode) return null;
    return (
      <div className="absolute bottom-0 right-0 w-6 h-6 bg-[#0084FF] rounded-tl-2xl flex items-center justify-center">
        <svg fill="none" version="1.1" width="14" height="14" viewBox="0 0 32 32"><g><g><rect x="7" y="6" width="19" height="19" rx="0" fill="#FFFFFF" fillOpacity="1" /></g><g><path d="M16,0C7.16344,0,0,7.16344,0,16C0,24.8366,7.16344,32,16,32C24.8366,32,32,24.8366,32,16C32,7.16344,24.8366,0,16,0ZM24.0224,14.3808C23.3989,15.3805,22.426,16.1127,21.2928,16.4352C21.0457,16.5158,20.7879,16.559,20.528,16.5632C20.0282,16.5603,19.6245,16.1542,19.6245,15.6544C19.6245,15.1545,20.0282,14.7485,20.528,14.7456C20.5972,14.7472,20.6659,14.7341,20.7296,14.7072C21.4574,14.5263,22.0849,14.0666,22.4768,13.4272C22.7048,13.0545,22.8244,12.6257,22.8224,12.1888C22.8224,10.752,21.4944,9.568,19.8752,9.568C19.3149,9.56918,18.7641,9.71347,18.2752,9.98719C17.4545,10.4193,16.9318,11.2616,16.9088,12.1888Q16.8858,13.116,16.9088,19.8208C16.8926,21.3952,16.0225,22.8365,14.6368,23.584C13.8762,24.0117,13.0166,24.2324,12.144,24.224C9.50719,24.224,7.344,22.24,7.344,19.7856C7.34867,19.0157,7.56211,18.2614,7.96159,17.6032C8.58511,16.6035,9.55798,15.8713,10.6912,15.5488C10.9386,15.4694,11.1962,15.4262,11.456,15.4208C11.96,15.4179,12.3701,15.8256,12.3701,16.3296C12.3701,16.8336,11.96,17.2414,11.456,17.2384C11.3868,17.2368,11.3181,17.2499,11.2544,17.2768C10.5329,17.4709,9.90979,17.9274,9.50722,18.5568C9.27923,18.9295,9.15955,19.3583,9.1616,19.7952C9.1616,21.232,10.4896,22.416,12.128,22.416C12.6883,22.4148,13.2391,22.2705,13.728,21.9968C14.5474,21.5638,15.0688,20.7217,15.0912,19.7952L15.0912,12.1984C15.1089,10.6228,15.98,9.18083,17.3664,8.43203C18.1133,7.98446,18.9693,7.75191,19.84,7.76003C22.4768,7.76003,24.64,9.74403,24.64,12.1984C24.6353,12.9684,24.4219,13.7226,24.0224,14.3808Z" fill="#0084FF" fillOpacity="1" /></g></g></svg>
      </div>
    );
  };

  return (
    <>
      <button
        onClick={handleClick}
        onContextMenu={handleContextMenu}
        className={`cursor-pointer group w-full h-full ${className}`}
      >
        {renderContent()}
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
