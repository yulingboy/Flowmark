import { useState } from 'react';
import type { ShortcutFolder as ShortcutFolderType, ShortcutSize } from '@/types';
import { ContextMenu } from '@/components/common';
import type { ContextMenuItem } from '@/components/common';
import { useShortcutsStore } from '@/stores/shortcutsStore';

interface ShortcutFolderProps {
  folder: ShortcutFolderType;
  onOpen?: (folder: ShortcutFolderType) => void;
  onResize?: (folder: ShortcutFolderType, size: ShortcutSize) => void;
  className?: string;
  isDropTarget?: boolean;
}

// 右键菜单图标
const LayoutIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
  </svg>
);

const UnfoldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
    <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
  </svg>
);

const DeleteIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
  </svg>
);

// 根据文件夹尺寸计算预览网格
function getPreviewConfig(size: ShortcutSize = '1x1') {
  switch (size) {
    case '1x1':
      return { cols: 2, rows: 2, maxItems: 4 };
    case '2x2':
      return { cols: 2, rows: 2, maxItems: 4 };
    case '2x4':
      return { cols: 2, rows: 4, maxItems: 8 };
    default:
      return { cols: 2, rows: 2, maxItems: 4 };
  }
}

export function ShortcutFolder({ folder, onOpen, onResize, className = '', isDropTarget = false }: ShortcutFolderProps) {
  const [contextMenu, setContextMenu] = useState<{ isOpen: boolean; x: number; y: number }>({
    isOpen: false, x: 0, y: 0,
  });
  const dissolveFolder = useShortcutsStore((state) => state.dissolveFolder);
  const deleteShortcut = useShortcutsStore((state) => state.deleteShortcut);

  const size = folder.size || '1x1';
  const { cols, rows, maxItems } = getPreviewConfig(size);
  
  const handleClick = () => {
    onOpen?.(folder);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ isOpen: true, x: e.clientX, y: e.clientY });
  };

  const contextMenuItems: ContextMenuItem[] = [
    {
      icon: <LayoutIcon />,
      label: '布局',
      type: 'layout',
      layoutOptions: ['1x1', '2x2', '2x4'],
      currentLayout: folder.size || '1x1',
      onLayoutSelect: (newSize) => onResize?.(folder, newSize),
      onClick: () => {},
    },
    {
      icon: <UnfoldIcon />,
      label: '解散文件夹',
      onClick: () => dissolveFolder(folder.id),
    },
    {
      icon: <DeleteIcon />,
      label: '删除卡片',
      onClick: () => deleteShortcut(folder.id),
    },
  ];

  // 显示文件夹内图标的预览
  const previewItems = folder.items.slice(0, maxItems);

  return (
    <>
      <button
        onClick={handleClick}
        onContextMenu={handleContextMenu}
        className={`flex flex-col items-center gap-1 cursor-pointer group w-full h-full ${className}`}
      >
      {/* 文件夹卡片 - 使用内联样式确保 padding 生效 */}
      <div 
        className="w-full flex-1 rounded-2xl overflow-hidden group-hover:scale-105 transition-all"
        style={{
          backgroundColor: isDropTarget ? 'rgba(16, 185, 129, 0.35)' : 'rgba(255, 255, 255, 0.25)',
          backdropFilter: 'blur(8px)',
          padding: '16px',
          boxShadow: isDropTarget ? '0 0 0 2px rgba(16, 185, 129, 0.8), 0 0 16px rgba(16, 185, 129, 0.4)' : 'none',
          transform: isDropTarget ? 'scale(1.08)' : undefined,
          transition: 'all 0.2s ease-out',
        }}
      >
        {previewItems.length > 0 ? (
          <div 
            className="w-full h-full"
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${cols}, 1fr)`,
              gridTemplateRows: `repeat(${rows}, 1fr)`,
              gap: '12px',
            }}
          >
            {previewItems.map((item, index) => (
              <div key={item.id || index} className="bg-white rounded-xl overflow-hidden shadow-sm aspect-square">
                <img
                  src={item.icon}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  loading="eager"
                  draggable={false}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
            ))}
            {Array.from({ length: maxItems - previewItems.length }).map((_, i) => (
              <div key={`empty-${i}`} className="bg-white/30 rounded-xl aspect-square" />
            ))}
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white/70" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
            </svg>
          </div>
        )}
      </div>
      {/* 名称在卡片外面 */}
      <span className="text-white text-xs truncate drop-shadow w-full text-center flex-shrink-0">
        {folder.name || '新文件夹'}
      </span>
    </button>

    {/* 右键菜单 */}
    <ContextMenu
      isOpen={contextMenu.isOpen}
      position={{ x: contextMenu.x, y: contextMenu.y }}
      items={contextMenuItems}
      onClose={() => setContextMenu(prev => ({ ...prev, isOpen: false }))}
    />
    </>
  );
}
