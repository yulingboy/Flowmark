import { useState, useRef } from 'react';
import type { ShortcutFolder as ShortcutFolderType, ShortcutItem } from '@/types';

interface FolderPopupProps {
  folder: ShortcutFolderType;
  onClose: () => void;
  onItemsChange: (items: ShortcutItem[]) => void;
  onItemDragOut: (item: ShortcutItem) => void;
}

// 弹窗网格配置
const POPUP_COLS = 8;
const POPUP_ROWS = 4;
const POPUP_ICON_SIZE = 72;
const POPUP_GAP = 20;
const TEXT_HEIGHT = 24;

export function FolderPopup({
  folder,
  onClose,
  onItemsChange,
  onItemDragOut,
}: FolderPopupProps) {
  const [folderItems, setFolderItems] = useState<ShortcutItem[]>(folder.items);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 计算弹窗尺寸
  const popupWidth = POPUP_COLS * POPUP_ICON_SIZE + (POPUP_COLS + 1) * POPUP_GAP;
  const popupHeight = POPUP_ROWS * (POPUP_ICON_SIZE + TEXT_HEIGHT) + (POPUP_ROWS + 1) * POPUP_GAP;

  // 点击背景关闭
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // 拖拽开始
  const handleDragStart = (e: React.DragEvent, item: ShortcutItem) => {
    setDraggedId(item.id);
    e.dataTransfer.effectAllowed = 'move';
    // 设置拖拽图片为当前元素
    const target = e.currentTarget as HTMLElement;
    e.dataTransfer.setDragImage(target, POPUP_ICON_SIZE / 2, POPUP_ICON_SIZE / 2);
  };

  // 拖拽经过
  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (draggedId && draggedId !== targetId) {
      setDragOverId(targetId);
    }
  };

  // 拖拽离开
  const handleDragLeave = () => {
    setDragOverId(null);
  };

  // 放置 - 交换位置
  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    setDragOverId(null);

    if (!draggedId || draggedId === targetId) return;

    const draggedIndex = folderItems.findIndex(i => i.id === draggedId);
    const targetIndex = folderItems.findIndex(i => i.id === targetId);

    if (draggedIndex !== -1 && targetIndex !== -1) {
      const newItems = [...folderItems];
      [newItems[draggedIndex], newItems[targetIndex]] = [newItems[targetIndex], newItems[draggedIndex]];
      setFolderItems(newItems);
      onItemsChange(newItems);
    }
  };

  // 拖拽结束
  const handleDragEnd = (e: React.DragEvent) => {
    // 检查是否拖出了容器
    if (containerRef.current && draggedId) {
      const rect = containerRef.current.getBoundingClientRect();
      const { clientX, clientY } = e;
      
      if (
        clientX < rect.left || 
        clientX > rect.right || 
        clientY < rect.top || 
        clientY > rect.bottom
      ) {
        // 拖出容器
        const item = folderItems.find(i => i.id === draggedId);
        if (item) {
          onItemDragOut(item);
        }
      }
    }

    setDraggedId(null);
    setDragOverId(null);
  };

  // 点击打开链接
  const handleClick = (item: ShortcutItem) => {
    window.open(item.url, '_blank');
  };

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center z-50 p-8"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(12px)' }}
      onClick={handleBackdropClick}
    >
      {/* 文件夹名称 */}
      <div className="mb-4">
        <h2 className="text-white text-2xl font-semibold tracking-wide">
          {folder.name || '新文件夹'}
        </h2>
      </div>
      
      {/* 弹窗内容 */}
      <div
        ref={containerRef}
        className="rounded-3xl shadow-2xl"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.75)',
          backdropFilter: 'blur(40px)',
          padding: `${POPUP_GAP}px`,
          width: `${popupWidth}px`,
          height: `${popupHeight}px`,
          border: '1px solid rgba(255, 255, 255, 0.5)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {folderItems.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${POPUP_COLS}, ${POPUP_ICON_SIZE}px)`,
              gridTemplateRows: `repeat(${POPUP_ROWS}, ${POPUP_ICON_SIZE + TEXT_HEIGHT}px)`,
              gap: `${POPUP_GAP}px`,
            }}
          >
            {folderItems.slice(0, POPUP_COLS * POPUP_ROWS).map((item) => {
              const isDragging = draggedId === item.id;
              const isDragOver = dragOverId === item.id;

              return (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item)}
                  onDragOver={(e) => handleDragOver(e, item.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, item.id)}
                  onDragEnd={handleDragEnd}
                  onClick={() => !isDragging && handleClick(item)}
                  className="flex flex-col items-center gap-1.5 cursor-pointer group select-none"
                  style={{
                    opacity: isDragging ? 0.4 : 1,
                    transform: isDragOver ? 'scale(1.15)' : 'scale(1)',
                    transition: 'all 0.2s ease-out',
                  }}
                >
                  <div 
                    className="rounded-2xl overflow-hidden bg-white shadow-md group-hover:shadow-xl group-hover:scale-110 transition-all duration-200"
                    style={{ 
                      width: `${POPUP_ICON_SIZE}px`, 
                      height: `${POPUP_ICON_SIZE}px`,
                      outline: isDragOver ? '3px solid rgba(16, 185, 129, 0.8)' : 'none',
                      outlineOffset: '3px',
                    }}
                  >
                    <img
                      src={item.icon}
                      alt={item.name}
                      className="w-full h-full object-cover pointer-events-none"
                      draggable={false}
                    />
                  </div>
                  <span 
                    className="text-gray-800 text-sm font-medium truncate text-center pointer-events-none"
                    style={{ width: POPUP_ICON_SIZE }}
                  >
                    {item.name}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center p-12">
            <div className="text-center">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/>
              </svg>
              <p className="text-gray-500 text-base font-medium">空文件夹</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
