import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragMoveEvent,
  useDraggable,
} from '@dnd-kit/core';
import { useState, useMemo, useEffect, useRef } from 'react';
import { ShortcutCard } from './ShortcutCard';
import { ShortcutFolder } from './ShortcutFolder';
import { FolderPopup } from './FolderPopup';
import { 
  getItemSize, 
  GridManager, 
  pixelToGrid, 
  gridToPixel,
  getGridSpan,
} from './utils/gridUtils';
import type { ShortcutEntry, ShortcutFolder as ShortcutFolderType, ShortcutItem, Position } from '@/types';
import { isShortcutFolder } from '@/types';

interface ShortcutsContainerProps {
  shortcuts: ShortcutEntry[];
  onShortcutsChange?: (shortcuts: ShortcutEntry[]) => void;
  className?: string;
  columns?: number;
  unit?: number;
  gap?: number;
}

// 可拖拽的项目组件
function DraggableItem({ 
  entry, 
  position,
  size,
  onOpen,
  isDropTarget,
  isDragging,
  shouldAnimate,
}: { 
  entry: ShortcutEntry;
  position: Position;
  size: { width: number; height: number };
  onOpen?: (folder: ShortcutFolderType) => void;
  isDropTarget: boolean;
  isDragging: boolean;
  shouldAnimate: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: entry.id,
  });

  const style = {
    position: 'absolute' as const,
    left: position.x,
    top: position.y,
    width: size.width,
    height: size.height,
    transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
    // 只在需要吸附动画时才添加 transition
    transition: shouldAnimate ? 'left 0.2s ease-out, top 0.2s ease-out' : 'none',
    opacity: isDragging ? 0.3 : 1,
    cursor: 'grab',
    touchAction: 'none',
    zIndex: isDragging ? 1000 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {isShortcutFolder(entry) ? (
        <ShortcutFolder
          folder={entry}
          onOpen={onOpen}
          isDropTarget={isDropTarget}
        />
      ) : (
        <ShortcutCard item={entry} />
      )}
    </div>
  );
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
  const [openFolder, setOpenFolder] = useState<ShortcutFolderType | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [dragOverFolderId, setDragOverFolderId] = useState<string | null>(null);
  // 记录需要吸附动画的项目ID
  const [animatingItemId, setAnimatingItemId] = useState<string | null>(null);
  
  // 网格管理器
  const gridManager = useRef(new GridManager(columns, unit, gap));

  // 同步外部 shortcuts 变化
  useEffect(() => {
    // 为没有位置的项目分配初始网格位置
    const manager = new GridManager(columns, unit, gap);
    
    const itemsWithPositions = shortcuts.map((item) => {
      if (item.position) {
        // 已有位置，吸附到网格
        const { col, row } = pixelToGrid(item.position.x, item.position.y, unit, gap);
        const { colSpan, rowSpan } = getGridSpan(item.size || '1x1');
        
        // 检查是否可用，不可用则找最近的
        const finalPos = manager.canPlace(col, row, colSpan, rowSpan)
          ? { col, row }
          : manager.findNearestAvailable(col, row, colSpan, rowSpan) || { col: 0, row: 0 };
        
        manager.occupy(finalPos.col, finalPos.row, colSpan, rowSpan);
        
        return {
          ...item,
          position: gridToPixel(finalPos.col, finalPos.row, unit, gap),
        };
      }
      
      // 没有位置，找第一个可用位置
      const { colSpan, rowSpan } = getGridSpan(item.size || '1x1');
      const pos = manager.findNearestAvailable(0, 0, colSpan, rowSpan) || { col: 0, row: 0 };
      manager.occupy(pos.col, pos.row, colSpan, rowSpan);
      
      return {
        ...item,
        position: gridToPixel(pos.col, pos.row, unit, gap),
      };
    });
    
    setItems(itemsWithPositions);
    gridManager.current = manager;
  }, [shortcuts, columns, unit, gap]);

  // 配置拖拽传感器
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  // 创建 id -> item 的映射
  const itemsMap = useMemo(() => {
    const map = new Map<string, ShortcutEntry>();
    items.forEach(item => map.set(item.id, item));
    return map;
  }, [items]);

  // 获取当前拖拽的元素
  const activeItem = activeId ? itemsMap.get(activeId) : null;
  const activeItemSize = activeItem ? getItemSize(activeItem, unit, gap) : null;

  // 拖拽开始
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    setAnimatingItemId(null);
  };

  // 拖拽移动 - 检测是否悬停在文件夹上
  const handleDragMove = (event: DragMoveEvent) => {
    const { active, delta } = event;
    const draggedItemId = active.id as string;
    const draggedItem = itemsMap.get(draggedItemId);
    
    if (!draggedItem || isShortcutFolder(draggedItem)) {
      setDragOverFolderId(null);
      return;
    }

    const currentPos = draggedItem.position || { x: 0, y: 0 };
    const dragPos = {
      x: currentPos.x + delta.x,
      y: currentPos.y + delta.y,
    };

    // 计算拖拽位置对应的网格
    const dragGrid = pixelToGrid(dragPos.x, dragPos.y, unit, gap);

    // 检查是否悬停在某个文件夹上
    let hoveredFolderId: string | null = null;
    for (const item of items) {
      if (item.id === draggedItemId || !isShortcutFolder(item)) continue;
      
      const folderPos = item.position || { x: 0, y: 0 };
      const folderGrid = pixelToGrid(folderPos.x, folderPos.y, unit, gap);
      const folderSpan = getGridSpan(item.size || '1x1');
      
      // 检查拖拽位置是否在文件夹范围内
      if (
        dragGrid.col >= folderGrid.col &&
        dragGrid.col < folderGrid.col + folderSpan.colSpan &&
        dragGrid.row >= folderGrid.row &&
        dragGrid.row < folderGrid.row + folderSpan.rowSpan
      ) {
        hoveredFolderId = item.id;
        break;
      }
    }

    setDragOverFolderId(hoveredFolderId);
  };

  // 拖拽结束
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;
    const draggedItemId = active.id as string;
    
    setActiveId(null);
    setDragOverFolderId(null);

    const draggedItem = itemsMap.get(draggedItemId);
    if (!draggedItem) return;

    const currentPos = draggedItem.position || { x: 0, y: 0 };
    const newPixelPos = {
      x: currentPos.x + delta.x,
      y: currentPos.y + delta.y,
    };

    // 计算目标网格位置
    const targetGrid = pixelToGrid(newPixelPos.x, newPixelPos.y, unit, gap);
    const { colSpan, rowSpan } = getGridSpan(draggedItem.size || '1x1');

    // 检查是否拖到文件夹上
    if (!isShortcutFolder(draggedItem)) {
      // 检查目标位置是否有文件夹
      for (const item of items) {
        if (item.id === draggedItemId || !isShortcutFolder(item)) continue;
        
        const folderPos = item.position || { x: 0, y: 0 };
        const folderGrid = pixelToGrid(folderPos.x, folderPos.y, unit, gap);
        const folderSpan = getGridSpan(item.size || '1x1');
        
        // 检查是否在文件夹范围内
        if (
          targetGrid.col >= folderGrid.col &&
          targetGrid.col < folderGrid.col + folderSpan.colSpan &&
          targetGrid.row >= folderGrid.row &&
          targetGrid.row < folderGrid.row + folderSpan.rowSpan
        ) {
          // 拖入文件夹
          const newItems = items
            .filter(i => i.id !== draggedItemId)
            .map(i => {
              if (i.id === item.id && isShortcutFolder(i)) {
                return {
                  ...i,
                  items: [...i.items, draggedItem as ShortcutItem],
                };
              }
              return i;
            });

          setItems(newItems);
          onShortcutsChange?.(newItems);
          return;
        }
      }
    }

    // 检查目标网格位置是否可用
    const manager = new GridManager(columns, unit, gap);
    manager.initFromItems(items, draggedItemId);
    
    // 限制目标位置不能为负数
    const targetCol = Math.max(0, targetGrid.col);
    const targetRow = Math.max(0, targetGrid.row);
    
    // 检查目标位置是否可放置
    const canPlaceAtTarget = manager.canPlace(targetCol, targetRow, colSpan, rowSpan);
    
    // 如果目标位置被占用，返回原位置
    if (!canPlaceAtTarget) {
      // 计算原始网格位置
      const originalGrid = pixelToGrid(currentPos.x, currentPos.y, unit, gap);
      const originalPos = gridToPixel(originalGrid.col, originalGrid.row, unit, gap);
      
      // 计算拖拽释放时的实际像素位置
      const dropPos = {
        x: currentPos.x + delta.x,
        y: currentPos.y + delta.y,
      };
      
      // 先移动到释放位置，然后动画返回原位
      const intermediateItems = items.map(item => {
        if (item.id === draggedItemId) {
          return { ...item, position: dropPos };
        }
        return item;
      });
      setItems(intermediateItems);
      
      requestAnimationFrame(() => {
        setAnimatingItemId(draggedItemId);
        const finalItems = intermediateItems.map(item => {
          if (item.id === draggedItemId) {
            return { ...item, position: originalPos };
          }
          return item;
        });
        setItems(finalItems);
        setTimeout(() => setAnimatingItemId(null), 250);
      });
      return;
    }
    
    // 目标位置可用，移动到目标位置
    const finalPos = gridToPixel(targetCol, targetRow, unit, gap);
    
    // 计算拖拽释放时的实际像素位置
    const dropPos = {
      x: currentPos.x + delta.x,
      y: currentPos.y + delta.y,
    };
    
    // 判断是否需要吸附动画（释放位置与最终位置差距较大时）
    const needsSnapAnimation = 
      Math.abs(dropPos.x - finalPos.x) > 5 || 
      Math.abs(dropPos.y - finalPos.y) > 5;

    if (needsSnapAnimation) {
      // 先将元素移动到拖拽释放位置（无动画）
      const intermediateItems = items.map(item => {
        if (item.id === draggedItemId) {
          return { ...item, position: dropPos };
        }
        return item;
      });
      setItems(intermediateItems);
      
      // 下一帧添加动画并移动到最终位置
      requestAnimationFrame(() => {
        setAnimatingItemId(draggedItemId);
        const finalItems = intermediateItems.map(item => {
          if (item.id === draggedItemId) {
            return { ...item, position: finalPos };
          }
          return item;
        });
        setItems(finalItems);
        onShortcutsChange?.(finalItems);
        
        // 动画结束后清除动画标记
        setTimeout(() => setAnimatingItemId(null), 250);
      });
    } else {
      // 不需要动画，直接设置最终位置
      const newItems = items.map(item => {
        if (item.id === draggedItemId) {
          return { ...item, position: finalPos };
        }
        return item;
      });
      setItems(newItems);
      onShortcutsChange?.(newItems);
    }
  };

  // 打开文件夹
  const handleFolderOpen = (folder: ShortcutFolderType) => {
    setOpenFolder(folder);
  };

  // 关闭文件夹
  const handleCloseFolder = () => {
    setOpenFolder(null);
  };

  // 文件夹内容变化
  const handleFolderItemsChange = (folderId: string, newFolderItems: ShortcutItem[]) => {
    const newItems = items.map(item => {
      if (item.id === folderId && isShortcutFolder(item)) {
        return { ...item, items: newFolderItems };
      }
      return item;
    });
    setItems(newItems);
    onShortcutsChange?.(newItems);
    
    const updatedFolder = newItems.find(i => i.id === folderId);
    if (updatedFolder && isShortcutFolder(updatedFolder)) {
      setOpenFolder(updatedFolder);
    }
  };

  // 从文件夹拖出项目
  const handleItemDragOut = (folderId: string, item: ShortcutItem) => {
    const folder = itemsMap.get(folderId);
    const folderPos = folder?.position || { x: 0, y: 0 };
    
    const newItems = items.map(i => {
      if (i.id === folderId && isShortcutFolder(i)) {
        return { ...i, items: i.items.filter(fi => fi.id !== item.id) };
      }
      return i;
    });
    
    // 在文件夹附近放置拖出的项目
    const itemWithPos: ShortcutItem = {
      ...item,
      position: {
        x: folderPos.x + unit + gap,
        y: folderPos.y,
      },
    };
    
    newItems.push(itemWithPos);
    setItems(newItems);
    onShortcutsChange?.(newItems);
    setOpenFolder(null);
  };

  // 计算容器尺寸
  const containerSize = useMemo(() => {
    let maxX = 800;
    let maxY = 400;
    items.forEach((item) => {
      const pos = item.position || { x: 0, y: 0 };
      const size = getItemSize(item, unit, gap);
      maxX = Math.max(maxX, pos.x + size.width + gap);
      maxY = Math.max(maxY, pos.y + size.height + gap);
    });
    return { width: maxX, height: maxY };
  }, [items, unit, gap]);

  return (
    <div className={`relative ${className}`}>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
      >
        <div
          style={{
            position: 'relative',
            width: containerSize.width,
            height: containerSize.height,
            minHeight: 300,
          }}
        >
          {/* 可拖拽的项目 */}
          {items.map((entry) => {
            const pos = entry.position || { x: 0, y: 0 };
            const size = getItemSize(entry, unit, gap);
            const isDropTarget = dragOverFolderId === entry.id;
            const isDragging = activeId === entry.id;

            return (
              <DraggableItem
                key={entry.id}
                entry={entry}
                position={pos}
                size={size}
                onOpen={handleFolderOpen}
                isDropTarget={isDropTarget}
                isDragging={isDragging}
                shouldAnimate={animatingItemId === entry.id}
              />
            );
          })}
        </div>

        {/* 拖拽预览 */}
        <DragOverlay dropAnimation={null}>
          {activeItem && activeItemSize ? (
            <div
              style={{
                width: activeItemSize.width,
                height: activeItemSize.height,
                opacity: 0.9,
                transform: 'scale(1.05)',
                cursor: 'grabbing',
              }}
            >
              {isShortcutFolder(activeItem) ? (
                <ShortcutFolder folder={activeItem} />
              ) : (
                <ShortcutCard item={activeItem} />
              )}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* 文件夹展开弹窗 */}
      {openFolder && (
        <FolderPopup
          folder={openFolder}
          onClose={handleCloseFolder}
          onItemsChange={(newItems) => handleFolderItemsChange(openFolder.id, newItems)}
          onItemDragOut={(item) => handleItemDragOut(openFolder.id, item)}
        />
      )}
    </div>
  );
}
