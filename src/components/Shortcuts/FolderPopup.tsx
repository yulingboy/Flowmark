import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  rectSortingStrategy,
  arrayMove,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';
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
const POPUP_ICON_SIZE = 64;
const POPUP_GAP = 24;
const TEXT_HEIGHT = 20;

// 文件夹内的可排序项目
function SortableFolderItem({ 
  item, 
  index,
  isDragging,
}: { 
  item: ShortcutItem; 
  index: number;
  isDragging: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: item.id });

  // 计算位置
  const col = index % POPUP_COLS;
  const row = Math.floor(index / POPUP_COLS);
  const x = col * (POPUP_ICON_SIZE + POPUP_GAP);
  const y = row * (POPUP_ICON_SIZE + TEXT_HEIGHT + POPUP_GAP);

  const style = {
    position: 'absolute' as const,
    left: x,
    top: y,
    width: POPUP_ICON_SIZE,
    height: POPUP_ICON_SIZE + TEXT_HEIGHT,
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    touchAction: 'none',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => window.open(item.url, '_blank')}
      className="flex flex-col items-center gap-1 cursor-pointer group"
    >
      <div 
        className="rounded-2xl overflow-hidden bg-white shadow group-hover:scale-105 transition-transform"
        style={{ width: `${POPUP_ICON_SIZE}px`, height: `${POPUP_ICON_SIZE}px` }}
      >
        <img
          src={item.icon}
          alt={item.name}
          className="w-full h-full object-cover"
          draggable={false}
        />
      </div>
      <span className="text-gray-700 text-xs truncate w-full text-center">
        {item.name}
      </span>
    </div>
  );
}

export function FolderPopup({
  folder,
  onClose,
  onItemsChange,
  onItemDragOut,
}: FolderPopupProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [folderItems, setFolderItems] = useState<ShortcutItem[]>(folder.items);

  // 配置拖拽传感器
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // 计算弹窗尺寸
  const popupWidth = POPUP_COLS * POPUP_ICON_SIZE + (POPUP_COLS + 1) * POPUP_GAP;
  const popupHeight = POPUP_ROWS * (POPUP_ICON_SIZE + TEXT_HEIGHT) + (POPUP_ROWS + 1) * POPUP_GAP;
  
  // 内容区域尺寸
  const contentWidth = POPUP_COLS * POPUP_ICON_SIZE + (POPUP_COLS - 1) * POPUP_GAP;
  const contentHeight = POPUP_ROWS * (POPUP_ICON_SIZE + TEXT_HEIGHT) + (POPUP_ROWS - 1) * POPUP_GAP;

  // 获取当前拖拽的元素
  const activeItem = activeId ? folderItems.find(i => i.id === activeId) : null;

  // 拖拽开始
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  // 拖拽结束
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) {
      // 拖出弹窗
      const item = folderItems.find(i => i.id === active.id);
      if (item) {
        onItemDragOut(item);
      }
      return;
    }

    // 文件夹内排序
    if (active.id !== over.id) {
      const oldIndex = folderItems.findIndex(i => i.id === active.id);
      const newIndex = folderItems.findIndex(i => i.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newItems = arrayMove(folderItems, oldIndex, newIndex);
        setFolderItems(newItems);
        onItemsChange(newItems);
      }
    }
  };

  // 点击背景关闭
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const itemIds = folderItems.map(i => i.id);

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(30px)' }}
      onClick={handleBackdropClick}
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
      >
        {folderItems.length > 0 ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={itemIds} strategy={rectSortingStrategy}>
              <div
                style={{
                  position: 'relative',
                  width: contentWidth,
                  height: contentHeight,
                }}
              >
                {folderItems.slice(0, POPUP_COLS * POPUP_ROWS).map((item, index) => (
                  <SortableFolderItem
                    key={item.id}
                    item={item}
                    index={index}
                    isDragging={activeId === item.id}
                  />
                ))}
              </div>
            </SortableContext>

            {/* 拖拽预览 */}
            <DragOverlay>
              {activeItem ? (
                <div
                  className="flex flex-col items-center gap-1"
                  style={{ 
                    width: POPUP_ICON_SIZE, 
                    height: POPUP_ICON_SIZE + TEXT_HEIGHT,
                    opacity: 0.9,
                    transform: 'scale(1.02)',
                  }}
                >
                  <div 
                    className="rounded-2xl overflow-hidden bg-white shadow"
                    style={{ width: `${POPUP_ICON_SIZE}px`, height: `${POPUP_ICON_SIZE}px` }}
                  >
                    <img
                      src={activeItem.icon}
                      alt={activeItem.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-gray-700 text-xs truncate w-full text-center">
                    {activeItem.name}
                  </span>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        ) : (
          <div className="text-gray-400 text-center py-8 text-sm">
            空文件夹
          </div>
        )}
      </div>
    </div>
  );
}
