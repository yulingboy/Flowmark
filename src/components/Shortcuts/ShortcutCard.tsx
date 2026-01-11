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
          
          {/* 打开方式标识 - 左下角圆弧形角标 */}
          <div className="absolute bottom-0 left-0">
            {isPopupMode ? (
              <svg width="28" height="28" viewBox="0 0 28 28" className="block">
                <path 
                  d="M0 28 L0 8 Q0 0 8 0 L20 0 Q28 8 28 20 L28 28 Z" 
                  fill="#8B5CF6"
                />
                <path 
                  d="M7 18 L7 10 M7 10 L11 10 M7 10 L13 16" 
                  stroke="white" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            ) : (
              <svg width="28" height="28" viewBox="0 0 28 28" className="block">
                <path 
                  d="M0 28 L0 8 Q0 0 8 0 L20 0 Q28 8 28 20 L28 28 Z" 
                  fill="#3B82F6"
                />
                <path 
                  d="M8 18 L8 12 Q8 10 10 10 L14 10 M14 8 L18 8 L18 12 M17 9 L12 14" 
                  stroke="white" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  fill="none"
                />
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
