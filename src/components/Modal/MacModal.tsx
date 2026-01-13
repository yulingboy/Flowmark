import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useModalBehavior } from './useModalBehavior';

interface MacModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  width?: number;
  height?: number;
}

export function MacModal({ 
  isOpen, 
  onClose, 
  title, 
  children,
  width = 400,
  height = 500
}: MacModalProps) {
  const {
    position,
    isFullscreen,
    toggleFullscreen,
    handlePointerDown,
    modalRef,
  } = useModalBehavior({
    isOpen,
    onClose,
    enableDrag: true,
    enableFullscreen: true,
    enableClickOutside: true,
    enableEscapeKey: true,
  });

  // 阻止全局右键菜单（MacModal 特有逻辑）
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };
    if (isOpen) {
      document.addEventListener('contextmenu', handleContextMenu, true);
    }
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu, true);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onPointerDown={(e) => e.stopPropagation()}
      onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); }}
    >
      <div
        ref={modalRef}
        className={isFullscreen 
          ? 'fixed inset-4 bg-white shadow-2xl rounded-lg flex flex-col overflow-hidden' 
          : 'bg-white shadow-2xl rounded-lg flex flex-col overflow-hidden'
        }
        style={isFullscreen ? {} : { 
          width, 
          height,
          transform: `translate(${position.x}px, ${position.y}px)` 
        }}
      >
        {/* 标题栏 - macOS 风格 */}
        <div 
          className={`flex items-center px-4 py-3 border-b border-gray-200 bg-gray-50 ${!isFullscreen ? 'cursor-move' : ''}`}
          onPointerDown={!isFullscreen ? handlePointerDown : undefined}
        >
          {/* 左侧按钮组 - macOS 标准顺序：红(关闭)、黄(最小化)、绿(全屏) */}
          <div className="flex gap-2" onPointerDown={(e) => e.stopPropagation()}>
            <button 
              onClick={onClose} 
              className="w-3 h-3 rounded-full bg-[#ff5f57] hover:bg-[#ff4136] border-none cursor-pointer" 
              title="关闭" 
            />
            <button 
              onClick={onClose} 
              className="w-3 h-3 rounded-full bg-[#febc2e] hover:bg-[#f5a623] border-none cursor-pointer" 
              title="最小化" 
            />
            <button 
              onClick={toggleFullscreen} 
              className="w-3 h-3 rounded-full bg-[#28c840] hover:bg-[#1db954] border-none cursor-pointer" 
              title={isFullscreen ? '退出全屏' : '全屏'} 
            />
          </div>
          {/* 居中标题 */}
          <span className="flex-1 text-center text-sm font-medium text-gray-700 select-none">{title}</span>
          {/* 右侧占位，保持标题居中 */}
          <div className="w-[52px]" />
        </div>
        
        {/* 内容区域 */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
