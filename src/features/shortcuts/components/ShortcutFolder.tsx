import { useState, useMemo } from 'react';
import type { ShortcutFolder as ShortcutFolderType, CardSize, Position } from '@/types';
import { ContextMenu } from '@/components';
import type { ContextMenuItem } from '@/components';
import { DeleteOutlined, AppstoreOutlined, ExpandOutlined, FolderOutlined } from '@ant-design/icons';
import { useShortcutsStore } from '../store';
import { pixelToGrid, getValidSizesForPosition } from '@/utils/gridUtils';

interface GridConfig {
  columns: number;
  rows: number;
  unit: number;
  gap: number;
}

interface ShortcutFolderProps {
  folder: ShortcutFolderType;
  onOpen?: (folder: ShortcutFolderType) => void;
  onResize?: (folder: ShortcutFolderType, size: CardSize) => void;
  className?: string;
  isDropTarget?: boolean;
  gridConfig?: GridConfig;
  position?: Position;
}

function getPreviewConfig(size: CardSize = '1x1') {
  switch (size) {
    case '1x1': return { cols: 2, rows: 2, maxItems: 4 };
    case '2x2': return { cols: 2, rows: 2, maxItems: 4 };
    case '2x4': return { cols: 2, rows: 4, maxItems: 8 };
    default: return { cols: 2, rows: 2, maxItems: 4 };
  }
}

export function ShortcutFolder({ folder, onOpen, onResize, className = '', isDropTarget = false, gridConfig, position }: ShortcutFolderProps) {
  const [contextMenu, setContextMenu] = useState<{ isOpen: boolean; x: number; y: number }>({ isOpen: false, x: 0, y: 0 });
  const dissolveFolder = useShortcutsStore((state) => state.dissolveFolder);
  const deleteItem = useShortcutsStore((state) => state.deleteItem);

  const size = folder.size || '1x1';
  const { cols, rows, maxItems } = getPreviewConfig(size);

  const disabledLayouts = useMemo(() => {
    if (!gridConfig || !position) return [];
    const { col, row } = pixelToGrid(position.x, position.y, gridConfig.unit, gridConfig.gap);
    const validSizes = getValidSizesForPosition(col, row, gridConfig.columns, gridConfig.rows, folder.size);
    const folderSizes: CardSize[] = ['1x1', '2x2', '2x4'];
    return folderSizes.filter(s => !validSizes.includes(s));
  }, [gridConfig, position, folder.size]);
  
  const handleClick = () => { onOpen?.(folder); };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ isOpen: true, x: e.clientX, y: e.clientY });
  };

  const contextMenuItems: ContextMenuItem[] = [
    { icon: <AppstoreOutlined />, label: '布局', type: 'layout', layoutOptions: ['1x1', '2x2', '2x4'], disabledLayouts,
      currentLayout: folder.size || '1x1', onLayoutSelect: (newSize) => onResize?.(folder, newSize), onClick: () => {} },
    { icon: <ExpandOutlined />, label: '解散文件夹', onClick: () => dissolveFolder(folder.id) },
    { icon: <DeleteOutlined />, label: '删除卡片', onClick: () => deleteItem(folder.id) },
  ];

  const previewItems = folder.items.slice(0, maxItems);

  return (
    <>
      <button onClick={handleClick} onContextMenu={handleContextMenu}
        className={`flex flex-col items-center gap-2 cursor-pointer group w-full h-full ${className}`}>
        <div className="w-full flex-1 rounded-2xl overflow-hidden group-hover:scale-105 transition-all"
          style={{
            backgroundColor: isDropTarget ? 'rgba(16, 185, 129, 0.35)' : 'rgba(255, 255, 255, 0.25)',
            backdropFilter: 'blur(8px)', padding: '16px',
            boxShadow: isDropTarget ? '0 0 0 2px rgba(16, 185, 129, 0.8), 0 0 16px rgba(16, 185, 129, 0.4)' : 'none',
            transform: isDropTarget ? 'scale(1.08)' : undefined, transition: 'all 0.2s ease-out',
          }}>
          {previewItems.length > 0 ? (
            <div className="w-full h-full" style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)`, gap: '12px' }}>
              {previewItems.map((item, index) => (
                <div key={item.id || index} className="bg-white rounded-xl overflow-hidden shadow-sm aspect-square">
                  <img src={item.icon} alt={item.name} className="w-full h-full object-cover" loading="eager" draggable={false}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                </div>
              ))}
              {Array.from({ length: maxItems - previewItems.length }).map((_, i) => (
                <div key={`empty-${i}`} className="bg-white/30 rounded-xl aspect-square" />
              ))}
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FolderOutlined className="text-white/70" style={{ fontSize: 32 }} />
            </div>
          )}
        </div>
        <span className="text-white text-xs truncate drop-shadow w-full text-center flex-shrink-0">{folder.name || '新文件夹'}</span>
      </button>
      <ContextMenu isOpen={contextMenu.isOpen} position={{ x: contextMenu.x, y: contextMenu.y }} items={contextMenuItems}
        onClose={() => setContextMenu(prev => ({ ...prev, isOpen: false }))} />
    </>
  );
}
