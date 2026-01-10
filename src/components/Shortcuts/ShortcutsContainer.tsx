import { useState, useRef, useCallback, useMemo } from 'react';
import { ShortcutCard } from './ShortcutCard';
import { ShortcutFolder } from './ShortcutFolder';
import type { ShortcutEntry, ShortcutFolder as ShortcutFolderType, ShortcutItem, ShortcutSize } from '../../types';
import { isShortcutFolder } from '../../types';

interface ShortcutsContainerProps {
  shortcuts: ShortcutEntry[];
  onShortcutsChange?: (shortcuts: ShortcutEntry[]) => void;
  className?: string;
  columns?: number;
  unit?: number;
  gap?: number;
}

function getGridSpan(size: ShortcutSize = '1x1') {
  const [cols, rows] = size.split('x').map(Number);
  return { colSpan: cols, rowSpan: rows };
}

const TEXT_HEIGHT = 20;

// 计算元素在网格中的位置（简化版：假设都是 1x1）
function calculatePositions(
  order: string[],
  itemsMap: Map<string, ShortcutEntry>,
  columns: number,
  unit: number,
  gap: number
): Map<string, { x: number; y: number; width: number; height: number }> {
  const posMap = new Map<string, { x: number; y: number; width: number; height: number }>();
  
  let col = 0;
  let row = 0;
  
  for (const id of order) {
    const item = itemsMap.get(id);
    if (!item) continue;
    
    const size = item.size || '1x1';
    const { colSpan, rowSpan } = getGridSpan(size);
    
    // 如果当前行放不下，换行
    if (col + colSpan > columns) {
      col = 0;
      row++;
    }
    
    posMap.set(id, {
      x: col * (unit + gap),
      y: row * (unit + gap),
      width: colSpan * unit + (colSpan - 1) * gap,
      height: rowSpan * unit + (rowSpan - 1) * gap + TEXT_HEIGHT,
    });
    
    col += colSpan;
    if (col >= columns) {
      col = 0;
      row++;
    }
  }
  
  return posMap;
}

export function ShortcutsContainer({
  shortcuts,
  onShortcutsChange,
  className = '',
  columns = 10,
  unit = 64,
  gap = 16,
}: ShortcutsContainerProps) {
  const [items, setItems] = useState<ShortcutEntry[]>(shortcuts);
  const [sortOrder, setSortOrder] = useState<string[]>(shortcuts.map(s => s.id));
  const [openFolder, setOpenFolder] = useState<ShortcutFolderType | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [dragPosition, setDragPosition] = useState<{ x: number; y: number } | null>(null);
  const [dragFromFolder, setDragFromFolder] = useState<string | null>(null); // 从哪个文件夹拖出
  const [draggedFolderItem, setDraggedFolderItem] = useState<ShortcutItem | null>(null); // 从文件夹拖出的项
  
  const containerRef = useRef<HTMLDivElement>(null);
  const lastSwapTime = useRef<number>(0);
  const dragOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // 创建 id -> item 的映射
  const itemsMap = useMemo(() => {
    const map = new Map<string, ShortcutEntry>();
    items.forEach(item => map.set(item.id, item));
    return map;
  }, [items]);

  // 计算每个元素的目标位置
  const positions = useMemo(() => {
    return calculatePositions(sortOrder, itemsMap, columns, unit, gap);
  }, [sortOrder, itemsMap, columns, unit, gap]);

  // 获取拖拽的元素尺寸
  const getDraggedItemSize = useCallback(() => {
    const item = itemsMap.get(draggedId || '');
    if (!item) return { width: unit, height: unit + TEXT_HEIGHT };
    const size = item.size || '1x1';
    const { colSpan, rowSpan } = getGridSpan(size);
    return {
      width: colSpan * unit + (colSpan - 1) * gap,
      height: rowSpan * unit + (rowSpan - 1) * gap + TEXT_HEIGHT,
    };
  }, [draggedId, itemsMap, unit, gap]);

  const handleDragStart = (e: React.DragEvent, entry: ShortcutEntry) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    
    setDraggedId(entry.id);
    
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', entry.id);
    
    const img = new Image();
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    e.dataTransfer.setDragImage(img, 0, 0);
  };

  const handleDrag = (e: React.DragEvent) => {
    if (e.clientX === 0 && e.clientY === 0) return;
    setDragPosition({ x: e.clientX, y: e.clientY });
  };

  const handleDragEnd = () => {
    // 根据最终排序生成新的 items 数组
    const newItems = sortOrder
      .map(id => itemsMap.get(id))
      .filter((item): item is ShortcutEntry => item !== undefined);
    
    setItems(newItems);
    onShortcutsChange?.(newItems);
    
    setDraggedId(null);
    setDragOverId(null);
    setDragPosition(null);
  };

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    if (!draggedId || targetId === draggedId) return;
    
    setDragOverId(targetId);
    
    const now = Date.now();
    if (now - lastSwapTime.current < 200) return;
    
    const draggedItem = itemsMap.get(draggedId);
    const targetItem = itemsMap.get(targetId);
    if (!draggedItem || !targetItem) return;
    
    // 如果目标是文件夹且拖拽的不是文件夹，不自动交换（等待 drop）
    if (isShortcutFolder(targetItem) && !isShortcutFolder(draggedItem)) {
      return;
    }
    
    // 交换位置
    const oldIndex = sortOrder.indexOf(draggedId);
    const newIndex = sortOrder.indexOf(targetId);
    
    if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
      lastSwapTime.current = now;
      const newOrder = [...sortOrder];
      newOrder.splice(oldIndex, 1);
      newOrder.splice(newIndex, 0, draggedId);
      setSortOrder(newOrder);
    }
  };

  const handleDragLeave = () => {
    setDragOverId(null);
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    
    if (!draggedId || draggedId === targetId) return;

    const draggedItem = itemsMap.get(draggedId);
    const targetItem = itemsMap.get(targetId);
    if (!draggedItem || !targetItem) return;

    // 如果拖拽到文件夹上，且拖拽的不是文件夹
    if (isShortcutFolder(targetItem) && !isShortcutFolder(draggedItem)) {
      // 从排序中移除被拖拽的项
      const newOrder = sortOrder.filter(id => id !== draggedId);
      setSortOrder(newOrder);
      
      // 更新 items：移除被拖拽项，并添加到目标文件夹
      const newItems = items
        .filter(item => item.id !== draggedId)
        .map(item => {
          if (item.id === targetId && isShortcutFolder(item)) {
            return {
              ...item,
              items: [...item.items, draggedItem as ShortcutItem],
            };
          }
          return item;
        });
      
      setItems(newItems);
      onShortcutsChange?.(newItems);
      
      // 清理拖拽状态
      setDraggedId(null);
      setDragOverId(null);
      setDragPosition(null);
    }
  };

  // 判断是否正在拖拽到文件夹
  const isDraggingToFolder = (entryId: string) => {
    if (!draggedId || !dragOverId) return false;
    const draggedItem = itemsMap.get(draggedId);
    const overItem = itemsMap.get(dragOverId);
    return (
      dragOverId === entryId &&
      draggedItem &&
      !isShortcutFolder(draggedItem) &&
      overItem &&
      isShortcutFolder(overItem)
    );
  };

  const handleFolderOpen = (folder: ShortcutFolderType) => {
    setOpenFolder(folder);
  };

  const handleCloseFolder = () => {
    setOpenFolder(null);
  };

  // 从文件夹内拖拽开始
  const handleFolderItemDragStart = (e: React.DragEvent, item: ShortcutItem, folderId: string) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    
    setDraggedFolderItem(item);
    setDragFromFolder(folderId);
    
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', item.id);
    
    const img = new Image();
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    e.dataTransfer.setDragImage(img, 0, 0);
  };

  const handleFolderItemDrag = (e: React.DragEvent) => {
    if (e.clientX === 0 && e.clientY === 0) return;
    setDragPosition({ x: e.clientX, y: e.clientY });
  };

  const handleFolderItemDragEnd = () => {
    // 如果拖到了弹窗外面，将图标移出文件夹
    if (draggedFolderItem && dragFromFolder) {
      // 从文件夹中移除
      const newItems = items.map(item => {
        if (item.id === dragFromFolder && isShortcutFolder(item)) {
          return {
            ...item,
            items: item.items.filter(i => i.id !== draggedFolderItem.id),
          };
        }
        return item;
      });
      
      // 添加到主列表末尾
      newItems.push(draggedFolderItem);
      
      // 更新排序
      const newOrder = [...sortOrder, draggedFolderItem.id];
      
      setItems(newItems);
      setSortOrder(newOrder);
      onShortcutsChange?.(newItems);
      
      // 更新打开的文件夹状态
      const updatedFolder = newItems.find(i => i.id === dragFromFolder);
      if (updatedFolder && isShortcutFolder(updatedFolder)) {
        setOpenFolder(updatedFolder);
      }
    }
    
    setDraggedFolderItem(null);
    setDragFromFolder(null);
    setDragPosition(null);
  };

  // 计算容器尺寸
  const containerSize = useMemo(() => {
    let maxX = 0;
    let maxY = 0;
    positions.forEach((pos) => {
      maxX = Math.max(maxX, pos.x + pos.width);
      maxY = Math.max(maxY, pos.y + pos.height);
    });
    return { width: maxX, height: maxY };
  }, [positions]);

  const draggedItem = draggedId ? itemsMap.get(draggedId) : null;
  const draggedSize = getDraggedItemSize();

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* 容器 */}
      <div
        style={{
          position: 'relative',
          width: containerSize.width,
          height: containerSize.height,
        }}
      >
        {/* 按原始顺序渲染，用 transform 移动 */}
        {items.map((entry) => {
          const pos = positions.get(entry.id);
          if (!pos) return null;
          
          const isDropTarget = isDraggingToFolder(entry.id);
          const isDragging = draggedId === entry.id;

          return (
            <div
              key={entry.id}
              draggable
              onDragStart={(e) => handleDragStart(e, entry)}
              onDrag={handleDrag}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => handleDragOver(e, entry.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, entry.id)}
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: pos.width,
                height: pos.height,
                transform: `translate(${pos.x}px, ${pos.y}px)`,
                transition: draggedId ? 'transform 0.2s ease-out' : 'none',
                opacity: isDragging ? 0.3 : 1,
                cursor: 'grab',
                zIndex: isDragging ? 0 : 1,
              }}
            >
              {isShortcutFolder(entry) ? (
                <ShortcutFolder
                  folder={entry}
                  onOpen={handleFolderOpen}
                  isDropTarget={isDropTarget}
                />
              ) : (
                <ShortcutCard item={entry} />
              )}
            </div>
          );
        })}
      </div>

      {/* 拖拽预览 */}
      {draggedItem && dragPosition && (
        <div
          style={{
            position: 'fixed',
            left: dragPosition.x - dragOffset.current.x,
            top: dragPosition.y - dragOffset.current.y,
            width: draggedSize.width,
            height: draggedSize.height,
            pointerEvents: 'none',
            zIndex: 1000,
            opacity: 0.9,
            transform: 'scale(1.02)',
            transformOrigin: `${dragOffset.current.x}px ${dragOffset.current.y}px`,
          }}
        >
          {isShortcutFolder(draggedItem) ? (
            <ShortcutFolder folder={draggedItem} />
          ) : (
            <ShortcutCard item={draggedItem} />
          )}
        </div>
      )}

      {/* 从文件夹拖出的预览 */}
      {draggedFolderItem && dragPosition && (
        <div
          style={{
            position: 'fixed',
            left: dragPosition.x - dragOffset.current.x,
            top: dragPosition.y - dragOffset.current.y,
            width: 64,
            height: 84,
            pointerEvents: 'none',
            zIndex: 1001,
            opacity: 0.9,
            transform: 'scale(1.02)',
          }}
        >
          <ShortcutCard item={draggedFolderItem} />
        </div>
      )}

      {/* 文件夹展开弹窗 */}
      {openFolder && (() => {
        // 弹窗网格配置
        const popupCols = 8;
        const popupRows = 4;
        const popupIconSize = 64;
        const popupGap = 24; // 间距和边距统一
        const textHeight = 20;
        
        // 计算弹窗尺寸：边距 = 间距
        const popupWidth = popupCols * popupIconSize + (popupCols + 1) * popupGap;
        const popupHeight = popupRows * (popupIconSize + textHeight) + (popupRows + 1) * popupGap;
        
        return (
          <div
            className="fixed inset-0 flex flex-col items-center justify-center z-50"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(30px)' }}
            onClick={handleCloseFolder}
          >
            {/* 文件夹名称 */}
            <div className="mb-6">
              <span className="text-white text-sm font-normal">
                {openFolder.name || '新文件夹'}
              </span>
            </div>
            
            {/* 弹窗内容 */}
            <div
              className="rounded-3xl"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.65)',
                backdropFilter: 'blur(20px)',
                padding: `${popupGap}px`,
                width: `${popupWidth}px`,
                height: `${popupHeight}px`,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {openFolder.items.length > 0 ? (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${popupCols}, ${popupIconSize}px)`,
                    gridAutoRows: `${popupIconSize + textHeight}px`,
                    gap: `${popupGap}px`,
                  }}
                >
                  {openFolder.items.slice(0, popupCols * popupRows).map((item) => (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={(e) => handleFolderItemDragStart(e, item, openFolder.id)}
                      onDrag={handleFolderItemDrag}
                      onDragEnd={handleFolderItemDragEnd}
                      onClick={() => window.open(item.url, '_blank')}
                      className="flex flex-col items-center gap-1 cursor-pointer group"
                      style={{ opacity: draggedFolderItem?.id === item.id ? 0.3 : 1 }}
                    >
                      <div 
                        className="rounded-2xl overflow-hidden bg-white shadow group-hover:scale-105 transition-transform"
                        style={{ width: `${popupIconSize}px`, height: `${popupIconSize}px` }}
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
                  ))}
                </div>
              ) : (
                <div className="text-gray-400 text-center py-8 text-sm">
                  空文件夹
                </div>
              )}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
