import type { ShortcutFolder as ShortcutFolderType, ShortcutItem } from '@/types';

interface FolderPopupProps {
  folder: ShortcutFolderType;
  onClose: () => void;
  onBackdropDrop: (e: React.DragEvent) => void;
  onPopupDrop: (e: React.DragEvent) => void;
  onPopupDragOver: (e: React.DragEvent) => void;
  onItemDragStart: (e: React.DragEvent, item: ShortcutItem, folderId: string) => void;
  onItemDrag: (e: React.DragEvent) => void;
  onItemDragEnd: () => void;
  onItemDragOver: (e: React.DragEvent, targetId: string) => void;
  draggedFolderItem: ShortcutItem | null;
}

// 弹窗网格配置
const POPUP_COLS = 8;
const POPUP_ROWS = 4;
const POPUP_ICON_SIZE = 64;
const POPUP_GAP = 24;
const TEXT_HEIGHT = 20;

export function FolderPopup({
  folder,
  onClose,
  onBackdropDrop,
  onPopupDrop,
  onPopupDragOver,
  onItemDragStart,
  onItemDrag,
  onItemDragEnd,
  onItemDragOver,
  draggedFolderItem,
}: FolderPopupProps) {
  // 计算弹窗尺寸
  const popupWidth = POPUP_COLS * POPUP_ICON_SIZE + (POPUP_COLS + 1) * POPUP_GAP;
  const popupHeight = POPUP_ROWS * (POPUP_ICON_SIZE + TEXT_HEIGHT) + (POPUP_ROWS + 1) * POPUP_GAP;
  
  // 内容区域尺寸
  const contentWidth = POPUP_COLS * POPUP_ICON_SIZE + (POPUP_COLS - 1) * POPUP_GAP;
  const contentHeight = POPUP_ROWS * (POPUP_ICON_SIZE + TEXT_HEIGHT) + (POPUP_ROWS - 1) * POPUP_GAP;
  
  // 计算每个项目的位置
  const getItemPosition = (index: number) => {
    const col = index % POPUP_COLS;
    const row = Math.floor(index / POPUP_COLS);
    return {
      x: col * (POPUP_ICON_SIZE + POPUP_GAP),
      y: row * (POPUP_ICON_SIZE + TEXT_HEIGHT + POPUP_GAP),
    };
  };

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(30px)' }}
      onClick={onClose}
      onDrop={onBackdropDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      {/* 文件夹名称 */}
      <div className="mb-6">
        <span className="text-white text-sm font-normal">
          {folder.name || '新文件夹'}
        </span>
      </div>
      
      {/* 弹窗内容 */}
      <div
        className="rounded-3xl"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.65)',
          backdropFilter: 'blur(20px)',
          padding: `${POPUP_GAP}px`,
          width: `${popupWidth}px`,
          height: `${popupHeight}px`,
        }}
        onClick={(e) => e.stopPropagation()}
        onDrop={onPopupDrop}
        onDragOver={onPopupDragOver}
      >
        {folder.items.length > 0 ? (
          <div
            style={{
              position: 'relative',
              width: contentWidth,
              height: contentHeight,
            }}
          >
            {folder.items.slice(0, POPUP_COLS * POPUP_ROWS).map((item, index) => {
              const pos = getItemPosition(index);
              const isDragging = draggedFolderItem?.id === item.id;
              
              return (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => onItemDragStart(e, item, folder.id)}
                  onDrag={onItemDrag}
                  onDragEnd={onItemDragEnd}
                  onDragOver={(e) => onItemDragOver(e, item.id)}
                  onClick={() => window.open(item.url, '_blank')}
                  className="flex flex-col items-center gap-1 cursor-pointer group"
                  style={{ 
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: POPUP_ICON_SIZE,
                    height: POPUP_ICON_SIZE + TEXT_HEIGHT,
                    transform: `translate(${pos.x}px, ${pos.y}px)`,
                    transition: draggedFolderItem ? 'transform 0.2s ease-out' : 'none',
                    opacity: isDragging ? 0.3 : 1,
                    zIndex: isDragging ? 0 : 1,
                  }}
                >
                  <div 
                    className="rounded-2xl overflow-hidden bg-white shadow group-hover:scale-105 transition-transform"
                    style={{ width: `${POPUP_ICON_SIZE}px`, height: `${POPUP_ICON_SIZE}px` }}
                  >
                    <img
                      src={item.icon}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-gray-700 text-xs truncate w-full text-center">
                    {item.name}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-gray-400 text-center py-8 text-sm">
            空文件夹
          </div>
        )}
      </div>
    </div>
  );
}
