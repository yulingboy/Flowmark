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
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          onClose();
        }
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      setIsLoading(true);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, isFullscreen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen && !isFullscreen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose, isFullscreen]);

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

  // 切换全屏
  const handleToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (!isOpen) return null;

  const modalClass = isFullscreen
    ? 'bg-white shadow-2xl overflow-hidden relative w-full h-full flex flex-col'
    : 'bg-white rounded-2xl shadow-2xl overflow-hidden relative w-[90vw] h-[85vh] max-w-6xl flex flex-col';

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div ref={modalRef} className={modalClass}>
        {/* 标题栏 */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-100 border-b border-gray-200">
          {/* 占位 */}
          <div className="w-24" />
          
          {/* 标题 */}
          <div className="flex-1 text-center">
            <span className="text-sm text-gray-600 truncate">{title || url}</span>
          </div>
          
          {/* macOS 风格操作按钮 */}
          <div className="flex items-center gap-2">
            {/* 刷新按钮 - 黄色 */}
            <div className="relative group">
              <button
                onClick={handleRefresh}
                className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 cursor-pointer border-none"
                aria-label="刷新"
              />
              <span className="absolute top-5 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                刷新
              </span>
            </div>
            
            {/* 全屏按钮 - 蓝色 */}
            <div className="relative group">
              <button
                onClick={handleToggleFullscreen}
                className="w-3 h-3 rounded-full bg-blue-500 hover:bg-blue-600 cursor-pointer border-none"
                aria-label={isFullscreen ? '退出全屏' : '全屏'}
              />
              <span className="absolute top-5 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                {isFullscreen ? '退出全屏' : '全屏'}
              </span>
            </div>
            
            {/* 新标签页打开按钮 - 绿色 */}
            <div className="relative group">
              <button
                onClick={handleOpenInNewTab}
                className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 cursor-pointer border-none"
                aria-label="在新标签页打开"
              />
              <span className="absolute top-5 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                新标签页打开
              </span>
            </div>
            
            {/* 关闭按钮 - 红色 */}
            <div className="relative group">
              <button
                onClick={onClose}
                className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 cursor-pointer border-none"
                aria-label="关闭"
              />
              <span className="absolute top-5 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                关闭
              </span>
            </div>
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
