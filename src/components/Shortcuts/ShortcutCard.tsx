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
          
          {/* 打开方式标识 - 右下角 */}
          <div className="absolute bottom-1 right-1">
            {isPopupMode ? (
              <div className="w-5 h-5 rounded-md bg-purple-500/90 flex items-center justify-center shadow-sm" title="弹窗打开">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </div>
            ) : (
              <div className="w-5 h-5 rounded-md bg-blue-500/90 flex items-center justify-center shadow-sm" title="新标签页打开">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
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
