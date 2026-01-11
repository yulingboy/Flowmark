import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface IframeModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title?: string;
}

export function IframeModal({ isOpen, onClose, url, title }: IframeModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      setIsLoading(true);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  // 刷新页面
  const handleRefresh = () => {
    if (iframeRef.current) {
      setIsLoading(true);
      iframeRef.current.src = url;
    }
  };

  // 在新标签页打开
  const handleOpenInNewTab = () => {
    window.open(url, '_blank');
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl overflow-hidden relative w-[90vw] h-[85vh] max-w-6xl flex flex-col"
      >
        {/* 标题栏 */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-100 border-b border-gray-200">
          {/* 占位 */}
          <div className="w-24" />
          
          {/* 标题 */}
          <div className="flex-1 text-center">
            <span className="text-sm text-gray-600 truncate">{title || url}</span>
          </div>
          
          {/* 操作按钮 */}
          <div className="flex items-center gap-2">
            {/* 刷新按钮 */}
            <button
              onClick={handleRefresh}
              className="w-8 h-8 rounded-lg hover:bg-gray-200 flex items-center justify-center cursor-pointer border-none bg-transparent transition-colors group relative"
              aria-label="刷新"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                刷新
              </span>
            </button>
            
            {/* 新标签页打开按钮 */}
            <button
              onClick={handleOpenInNewTab}
              className="w-8 h-8 rounded-lg hover:bg-gray-200 flex items-center justify-center cursor-pointer border-none bg-transparent transition-colors group relative"
              aria-label="在新标签页打开"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                新标签页打开
              </span>
            </button>
            
            {/* 关闭按钮 */}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg hover:bg-red-100 flex items-center justify-center cursor-pointer border-none bg-transparent transition-colors group relative"
              aria-label="关闭"
            >
              <svg className="w-4 h-4 text-gray-600 group-hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                关闭
              </span>
            </button>
          </div>
        </div>

        {/* iframe 内容 */}
        <div className="flex-1 relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-gray-500">加载中...</span>
              </div>
            </div>
          )}
          <iframe
            ref={iframeRef}
            src={url}
            className="w-full h-full border-none"
            onLoad={() => setIsLoading(false)}
            title={title || 'iframe content'}
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />
        </div>
      </div>
    </div>,
    document.body
  );
}
