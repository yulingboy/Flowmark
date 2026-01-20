import { useState, useRef } from 'react';
import type { ShortcutFolder as ShortcutFolderType, ShortcutItem } from '@/types';
import { IframeModal } from '@/components';
import { FolderOutlined } from '@ant-design/icons';
import { OpenModeIndicator } from '@/components/icons';

interface FolderPopupProps {
  folder: ShortcutFolderType;
  onClose: () => void;
  onItemsChange: (items: ShortcutItem[]) => void;
  onItemDragOut: (item: ShortcutItem) => void;
}

const POPUP_COLS = 8;
const POPUP_ROWS = 4;
const POPUP_ICON_SIZE = 72;
const POPUP_GAP = 20;
const TEXT_HEIGHT = 24;

export function FolderPopup({ folder, onClose, onItemsChange, onItemDragOut }: FolderPopupProps) {
  const [folderItems, setFolderItems] = useState<ShortcutItem[]>(folder.items);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [modalItem, setModalItem] = useState<ShortcutItem | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const popupWidth = POPUP_COLS * POPUP_ICON_SIZE + (POPUP_COLS + 1) * POPUP_GAP;
  const popupHeight = POPUP_ROWS * (POPUP_ICON_SIZE + TEXT_HEIGHT) + (POPUP_ROWS + 1) * POPUP_GAP;

  const handleBackdropClick = (e: React.MouseEvent) => { if (e.target === e.currentTarget) onClose(); };

  const handleDragStart = (e: React.DragEvent, item: ShortcutItem) => {
    setDraggedId(item.id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setDragImage(e.currentTarget as HTMLElement, POPUP_ICON_SIZE / 2, POPUP_ICON_SIZE / 2);
  };

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (draggedId && draggedId !== targetId) setDragOverId(targetId);
  };

  const handleDragLeave = () => { setDragOverId(null); };

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

  const handleDragEnd = (e: React.DragEvent) => {
    if (containerRef.current && draggedId) {
      const rect = containerRef.current.getBoundingClientRect();
      const { clientX, clientY } = e;
      if (clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom) {
        const item = folderItems.find(i => i.id === draggedId);
        if (item) onItemDragOut(item);
      }
    }
    setDraggedId(null);
    setDragOverId(null);
  };

  const handleClick = (item: ShortcutItem) => {
    if (item.openMode === 'popup') setModalItem(item);
    else window.open(item.url, '_blank');
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center z-50 p-8"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(12px)' }} onClick={handleBackdropClick}>
      <div className="mb-4"><h2 className="text-white text-2xl font-semibold tracking-wide">{folder.name || '新文件夹'}</h2></div>
      <div ref={containerRef} className="rounded-3xl shadow-2xl" onClick={(e) => e.stopPropagation()}
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.75)', backdropFilter: 'blur(40px)', padding: `${POPUP_GAP}px`,
          width: `${popupWidth}px`, height: `${popupHeight}px`, border: '1px solid rgba(255, 255, 255, 0.5)' }}>
        {folderItems.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${POPUP_COLS}, ${POPUP_ICON_SIZE}px)`,
            gridTemplateRows: `repeat(${POPUP_ROWS}, ${POPUP_ICON_SIZE + TEXT_HEIGHT}px)`, gap: `${POPUP_GAP}px` }}>
            {folderItems.slice(0, POPUP_COLS * POPUP_ROWS).map((item) => {
              const isDragging = draggedId === item.id;
              const isDragOver = dragOverId === item.id;
              return (
                <div key={item.id} draggable onDragStart={(e) => handleDragStart(e, item)} onDragOver={(e) => handleDragOver(e, item.id)}
                  onDragLeave={handleDragLeave} onDrop={(e) => handleDrop(e, item.id)} onDragEnd={handleDragEnd}
                  onClick={() => !isDragging && handleClick(item)} className="flex flex-col items-center gap-1.5 cursor-pointer group select-none"
                  style={{ opacity: isDragging ? 0.4 : 1, transform: isDragOver ? 'scale(1.15)' : 'scale(1)', transition: 'all 0.2s ease-out' }}>
                  <div className="rounded-2xl overflow-hidden bg-white shadow-md group-hover:shadow-xl group-hover:scale-110 transition-all duration-200 relative"
                    style={{ width: `${POPUP_ICON_SIZE}px`, height: `${POPUP_ICON_SIZE}px`,
                      outline: isDragOver ? '3px solid rgba(16, 185, 129, 0.8)' : 'none', outlineOffset: '3px' }}>
                    <img src={item.icon} alt={item.name} className="w-full h-full object-cover pointer-events-none" draggable={false} />
                    {item.openMode !== 'popup' && <OpenModeIndicator size="small" />}
                  </div>
                  <span className="text-gray-800 text-sm font-medium truncate text-center pointer-events-none" style={{ width: POPUP_ICON_SIZE }}>{item.name}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center p-12">
            <div className="text-center">
              <FolderOutlined className="text-gray-300 mx-auto mb-3" style={{ fontSize: 64 }} />
              <p className="text-gray-500 text-base font-medium">空文件夹</p>
            </div>
          </div>
        )}
      </div>
      {modalItem && <IframeModal isOpen={!!modalItem} onClose={() => setModalItem(null)} url={modalItem.url} title={modalItem.name} />}
    </div>
  );
}
