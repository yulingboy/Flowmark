import { useState } from 'react';
import type { ShortcutItem } from '@/types';
import { IframeModal } from '@/components/common';

interface ShortcutCardProps {
  item: ShortcutItem;
  onClick?: (item: ShortcutItem) => void;
  className?: string;
}

export function ShortcutCard({ item, onClick, className = '' }: ShortcutCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isPopupMode = item.openMode === 'popup';

  const handleClick = () => {
    if (onClick) {
      onClick(item);
      return;
    }
    
    if (isPopupMode) {
      setIsModalOpen(true);
    } else {
      window.open(item.url, '_blank');
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={`flex flex-col items-center gap-1 cursor-pointer group w-full h-full ${className}`}
      >
        {/* 图标卡片 */}
        <div className="w-full flex-1 rounded-2xl overflow-hidden bg-white shadow-lg flex items-center justify-center group-hover:scale-105 transition-transform relative">
          <img
            src={item.icon}
            alt={item.name}
            className="w-full h-full object-cover"
            loading="eager"
            draggable={false}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.parentElement!.innerHTML = `<span class="text-gray-600 text-2xl font-bold">${item.name[0]}</span>`;
            }}
          />
          
          {/* 打开方式标识 - 右下角1/4圆角标 */}
          <div className="absolute bottom-0 right-0">
            {isPopupMode ? (
              <svg width="20" height="20" viewBox="0 0 20 20" className="block">
                <path d="M20 0 Q0 0 0 20 L20 20 Z" fill="#8B5CF6"/>
                <path d="M8 15 L8 10 Q8 8 10 8 L12 8 M12 6 L15 6 L15 9 M14.5 6.5 L11 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 20 20" className="block">
                <path d="M20 0 Q0 0 0 20 L20 20 Z" fill="#3B82F6"/>
                <path d="M8 15 L8 10 Q8 8 10 8 L12 8 M12 6 L15 6 L15 9 M14.5 6.5 L11 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
            )}
          </div>
        </div>
        
        {/* 名称 */}
        <span className="text-white text-xs truncate drop-shadow w-full text-center flex-shrink-0">
          {item.name}
        </span>
      </button>

      {/* 弹窗 */}
      <IframeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        url={item.url}
        title={item.name}
      />
    </>
  );
}
