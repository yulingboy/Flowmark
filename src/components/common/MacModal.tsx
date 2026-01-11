import { useEffect, useRef, useState, useCallback, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

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
  const modalRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, posX: 0, posY: 0 });

  // 重置状态 - 使用 ref 追踪
  const prevIsOpenRef = useRef(isOpen);
  useEffect(() => {
    if (isOpen && !prevIsOpenRef.current) {
      setPosition({ x: 0, y: 0 });
      setIsFullscreen(false);
    }
    prevIsOpenRef.current = isOpen;
     
  }, [isOpen]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (isFullscreen) return;
    e.stopPropagation();
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY, posX: position.x, posY: position.y };
  }, [isFullscreen, position]);

  useEffect(() => {
    if (!isDragging) return;
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({
        x: dragStartRef.current.posX + (e.clientX - dragStartRef.current.x),
        y: dragStartRef.current.posY + (e.clientY - dragStartRef.current.y),
      });
    };
    const handleMouseUp = () => setIsDragging(false);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

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
    // 阻止全局右键菜单
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('contextmenu', handleContextMenu, true);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', handleContextMenu, true);
    };
  }, [isOpen, onClose, isFullscreen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // 只响应左键点击 (button === 0)，忽略右键 (button === 2)
      if (e.button !== 0) return;
      if (!isDragging && modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen && !isFullscreen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose, isFullscreen, isDragging]);

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
              onClick={() => setIsFullscreen(!isFullscreen)} 
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
