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
          
          {/* 打开方式标识 - 右下角圆弧形角标 */}
          <div className="absolute -bottom-1 -right-1">
            {isPopupMode ? (
              <svg width="24" height="24" viewBox="0 0 24 24" className="block">
                <path 
                  d="M0 12 Q0 0 12 0 L24 0 L24 24 L12 24 Q0 24 0 12 Z" 
                  fill="#8B5CF6"
                />
                <g transform="translate(10, 6)">
                  <rect x="0" y="4" width="8" height="8" rx="1" stroke="white" strokeWidth="1.5" fill="none"/>
                  <path d="M4 4 L4 0 L8 0" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  <path d="M8 0 L4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                </g>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" className="block">
                <path 
                  d="M0 12 Q0 0 12 0 L24 0 L24 24 L12 24 Q0 24 0 12 Z" 
                  fill="#3B82F6"
                />
                <g transform="translate(10, 6)">
                  <rect x="0" y="4" width="8" height="8" rx="1" stroke="white" strokeWidth="1.5" fill="none"/>
                  <path d="M4 4 L4 0 L8 0" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  <path d="M8 0 L4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                </g>
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
