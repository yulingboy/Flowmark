import type { ShortcutFolder as ShortcutFolderType, ShortcutSize } from '@/types';

interface ShortcutFolderProps {
  folder: ShortcutFolderType;
  onOpen?: (folder: ShortcutFolderType) => void;
  className?: string;
  isDropTarget?: boolean;
}

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

export function ShortcutFolder({ folder, onOpen, className = '', isDropTarget = false }: ShortcutFolderProps) {
  const size = folder.size || '1x1';
  const { cols, rows, maxItems } = getPreviewConfig(size);
  
  const handleClick = () => {
    onOpen?.(folder);
  };

  // 显示文件夹内图标的预览
  const previewItems = folder.items.slice(0, maxItems);

  return (
    <button
      onClick={handleClick}
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
  );
}
