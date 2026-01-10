import { useState } from 'react';
import { ShortcutCard } from './ShortcutCard';
import { ShortcutFolder } from './ShortcutFolder';
import type { ShortcutEntry, ShortcutFolder as ShortcutFolderType, ShortcutSize } from '../../types';
import { isShortcutFolder } from '../../types';

interface ShortcutsContainerProps {
  shortcuts: ShortcutEntry[];
  className?: string;
  columns?: number; // 网格列数，默认10
  unit?: number;    // 基础单位，默认64px
  gap?: number;     // 间距，默认16px
}

// 根据尺寸获取 grid span
function getGridSpan(size: ShortcutSize = '1x1') {
  const [cols, rows] = size.split('x').map(Number);
  return { colSpan: cols, rowSpan: rows };
}

// 文字高度
const TEXT_HEIGHT = 20;

export function ShortcutsContainer({ 
  shortcuts, 
  className = '', 
  columns = 10,
  unit = 64,
  gap = 16,
}: ShortcutsContainerProps) {
  const [openFolder, setOpenFolder] = useState<ShortcutFolderType | null>(null);

  const handleFolderOpen = (folder: ShortcutFolderType) => {
    setOpenFolder(folder);
  };

  const handleCloseFolder = () => {
    setOpenFolder(null);
  };

  // 计算网格宽度
  const gridWidth = columns * unit + (columns - 1) * gap;

  return (
    <div className={`relative ${className}`}>
      {/* 快捷入口网格 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, ${unit}px)`,
          gridAutoRows: `${unit}px`,
          gap: `${gap}px`,
          width: gridWidth,
        }}
      >
        {shortcuts.map((entry) => {
          const size = entry.size || '1x1';
          const { colSpan, rowSpan } = getGridSpan(size);
          // 计算实际高度：图标高度 + 文字高度
          const itemHeight = rowSpan * unit + (rowSpan - 1) * gap + TEXT_HEIGHT;
          
          return (
            <div
              key={entry.id}
              style={{
                gridColumn: `span ${colSpan}`,
                gridRow: `span ${rowSpan}`,
                height: itemHeight,
              }}
            >
              {isShortcutFolder(entry) ? (
                <ShortcutFolder folder={entry} onOpen={handleFolderOpen} />
              ) : (
                <ShortcutCard item={entry} />
              )}
            </div>
          );
        })}
      </div>

      {/* 文件夹展开弹窗 */}
      {openFolder && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={handleCloseFolder}
        >
          <div
            className="bg-white/15 backdrop-blur-xl rounded-2xl p-5 border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 文件夹标题 */}
            <div className="text-white text-base font-medium mb-4 text-center">
              {openFolder.name || '新文件夹'}
            </div>
            {/* 文件夹内容 - 使用网格布局 */}
            {openFolder.items.length > 0 ? (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(4, ${unit}px)`,
                  gridAutoRows: `${unit}px`,
                  gap: `${gap}px`,
                }}
              >
                {openFolder.items.map((item) => {
                  const size = item.size || '1x1';
                  const { colSpan, rowSpan } = getGridSpan(size);
                  const itemHeight = rowSpan * unit + (rowSpan - 1) * gap + TEXT_HEIGHT;
                  
                  return (
                    <div
                      key={item.id}
                      style={{
                        gridColumn: `span ${colSpan}`,
                        gridRow: `span ${rowSpan}`,
                        height: itemHeight,
                      }}
                    >
                      <ShortcutCard item={item} />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-white/50 text-center py-4 text-sm">
                空文件夹
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
