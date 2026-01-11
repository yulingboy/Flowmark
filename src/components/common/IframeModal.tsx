import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useDraggableModal } from '@/hooks/useDraggableModal';

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

  // 使用可拖拽 Hook
  const { position, isDragging, handleMouseDown, resetPosition } = useDraggableModal({
    disabled: isFullscreen,
  });

  // 打开时重置位置
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      resetPosition();
    }
  }, [isOpen, resetPosition]);

  // 键盘事件处理
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
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, isFullscreen]);

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!isDragging && modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen && !isFullscreen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose, isFullscreen, isDragging]);

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
    if (!isFullscreen) {
      resetPosition();
    }
  };

  if (!isOpen) return null;

  const modalClass = isFullscreen
    ? 'fixed inset-4 bg-white shadow-2xl rounded-lg flex flex-col'
    : 'bg-white shadow-2xl rounded-lg w-[900px] h-[600px] flex flex-col';

  const modalStyle = isFullscreen ? {} : {
    transform: `translate(${position.x}px, ${position.y}px)`,
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div ref={modalRef} className={modalClass} style={modalStyle}>
        {/* 标题栏 - 可拖拽 */}
        <div 
          className={`flex items-center justify-between px-4 py-3 border-b border-gray-200 ${!isFullscreen ? 'cursor-move' : ''}`}
          onMouseDown={!isFullscreen ? handleMouseDown : undefined}
        >
          <div className="flex-1 select-none">
            <span className="text-sm font-medium text-gray-700">{title || url}</span>
          </div>
          
          {/* macOS 风格按钮 */}
          <div className="flex gap-2" onMouseDown={(e) => e.stopPropagation()}>
            <div className="relative group">
              <button
                onClick={handleRefresh}
                className="w-3 h-3 rounded-full bg-yellow-400 hover:bg-yellow-500 cursor-pointer border-none"
                aria-label="刷新"
              />
              <span className="absolute top-5 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                刷新
              </span>
            </div>
            
            <div className="relative group">
              <button
                onClick={handleToggleFullscreen}
                className="w-3 h-3 rounded-full bg-green-400 hover:bg-green-500 cursor-pointer border-none"
                aria-label={isFullscreen ? '退出全屏' : '全屏'}
              />
              <span className="absolute top-5 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {isFullscreen ? '退出全屏' : '全屏'}
              </span>
            </div>
            
            <div className="relative group">
              <button
                onClick={handleOpenInNewTab}
                className="w-3 h-3 rounded-full bg-blue-400 hover:bg-blue-500 cursor-pointer border-none"
                aria-label="在新标签页打开"
              />
              <span className="absolute top-5 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                新标签页打开
              </span>
            </div>
           
            <div className="relative group">
              <button
                onClick={onClose}
                className="w-3 h-3 rounded-full bg-red-400 hover:bg-red-500 cursor-pointer border-none"
                aria-label="关闭"
              />
              <span className="absolute top-5 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                关闭
              </span>
            </div>
          </div>
        </div>

        {/* iframe 内容区域 */}
        <div className="flex-1 relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white">
              <div className="flex flex-col items-center gap-2">
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
            title={title || 'iframe'}
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />
        </div>
      </div>
    </div>,
    document.body
  );
}
