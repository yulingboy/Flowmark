import { useState, useRef } from 'react';
import type { ShortcutFolder as ShortcutFolderType, ShortcutItem } from '@/types';
import { IframeModal } from '@/components/common';

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
  const [modalItem, setModalItem] = useState<ShortcutItem | null>(null);
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
    if (item.openMode === 'popup') {
      setModalItem(item);
    } else {
      window.open(item.url, '_blank');
    }
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
                    className="rounded-2xl overflow-hidden bg-white shadow-md group-hover:shadow-xl group-hover:scale-110 transition-all duration-200 relative"
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
                    {/* 打开方式标识 - 只有新标签页模式才显示角标 */}
                    {item.openMode !== 'popup' && (
                      <div className="absolute bottom-0 right-0 w-5 h-5 bg-[#0084FF] rounded-tl-xl flex items-center justify-center">
                        <svg fill="none" version="1.1" width="12" height="12" viewBox="0 0 32 32"><g><g><rect x="7" y="6" width="19" height="19" rx="0" fill="#FFFFFF" fillOpacity="1" /></g><g><path d="M16,0C7.16344,0,0,7.16344,0,16C0,24.8366,7.16344,32,16,32C24.8366,32,32,24.8366,32,16C32,7.16344,24.8366,0,16,0ZM24.0224,14.3808C23.3989,15.3805,22.426,16.1127,21.2928,16.4352C21.0457,16.5158,20.7879,16.559,20.528,16.5632C20.0282,16.5603,19.6245,16.1542,19.6245,15.6544C19.6245,15.1545,20.0282,14.7485,20.528,14.7456C20.5972,14.7472,20.6659,14.7341,20.7296,14.7072C21.4574,14.5263,22.0849,14.0666,22.4768,13.4272C22.7048,13.0545,22.8244,12.6257,22.8224,12.1888C22.8224,10.752,21.4944,9.568,19.8752,9.568C19.3149,9.56918,18.7641,9.71347,18.2752,9.98719C17.4545,10.4193,16.9318,11.2616,16.9088,12.1888Q16.8858,13.116,16.9088,19.8208C16.8926,21.3952,16.0225,22.8365,14.6368,23.584C13.8762,24.0117,13.0166,24.2324,12.144,24.224C9.50719,24.224,7.344,22.24,7.344,19.7856C7.34867,19.0157,7.56211,18.2614,7.96159,17.6032C8.58511,16.6035,9.55798,15.8713,10.6912,15.5488C10.9386,15.4694,11.1962,15.4262,11.456,15.4208C11.96,15.4179,12.3701,15.8256,12.3701,16.3296C12.3701,16.8336,11.96,17.2414,11.456,17.2384C11.3868,17.2368,11.3181,17.2499,11.2544,17.2768C10.5329,17.4709,9.90979,17.9274,9.50722,18.5568C9.27923,18.9295,9.15955,19.3583,9.1616,19.7952C9.1616,21.232,10.4896,22.416,12.128,22.416C12.6883,22.4148,13.2391,22.2705,13.728,21.9968C14.5474,21.5638,15.0688,20.7217,15.0912,19.7952L15.0912,12.1984C15.1089,10.6228,15.98,9.18083,17.3664,8.43203C18.1133,7.98446,18.9693,7.75191,19.84,7.76003C22.4768,7.76003,24.64,9.74403,24.64,12.1984C24.6353,12.9684,24.4219,13.7226,24.0224,14.3808Z" fill="#0084FF" fillOpacity="1" /></g></g></svg>
                      </div>
                    )}
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

      {/* 弹窗 */}
      {modalItem && (
        <IframeModal
          isOpen={!!modalItem}
          onClose={() => setModalItem(null)}
          url={modalItem.url}
          title={modalItem.name}
        />
      )}
    </div>
  );
}
