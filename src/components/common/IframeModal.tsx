import { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Spin } from 'antd';

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
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, posX: 0, posY: 0 });

  // 打开时重置
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setPosition({ x: 0, y: 0 });
    }
  }, [isOpen]);

  // 拖拽处理
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
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

  // 键盘事件
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        isFullscreen ? setIsFullscreen(false) : onClose();
      }
    };
    if (isOpen) document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, isFullscreen]);

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!isDragging && modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen && !isFullscreen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose, isFullscreen, isDragging]);

  const handleRefresh = () => {
    if (iframeRef.current) { setIsLoading(true); iframeRef.current.src = url; }
  };

  const handleToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen) setPosition({ x: 0, y: 0 });
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        ref={modalRef}
        className={isFullscreen ? 'fixed inset-4 bg-white shadow-2xl rounded-lg flex flex-col' : 'bg-white shadow-2xl rounded-lg w-[900px] h-[600px] flex flex-col'}
        style={isFullscreen ? {} : { transform: `translate(${position.x}px, ${position.y}px)` }}
      >
        <div className={`flex items-center justify-between px-4 py-3 border-b border-gray-200 ${!isFullscreen ? 'cursor-move' : ''}`}
          onMouseDown={!isFullscreen ? handleMouseDown : undefined}>
          <span className="text-sm font-medium text-gray-700 select-none">{title || url}</span>
          <div className="flex gap-2" onMouseDown={(e) => e.stopPropagation()}>
            <button onClick={handleRefresh} className="w-3 h-3 rounded-full bg-yellow-400 hover:bg-yellow-500 border-none cursor-pointer" title="刷新" />
            <button onClick={handleToggleFullscreen} className="w-3 h-3 rounded-full bg-green-400 hover:bg-green-500 border-none cursor-pointer" title={isFullscreen ? '退出全屏' : '全屏'} />
            <button onClick={() => window.open(url, '_blank')} className="w-3 h-3 rounded-full bg-blue-400 hover:bg-blue-500 border-none cursor-pointer" title="新标签页打开" />
            <button onClick={onClose} className="w-3 h-3 rounded-full bg-red-400 hover:bg-red-500 border-none cursor-pointer" title="关闭" />
          </div>
        </div>
        <div className="flex-1 relative">
          {isLoading && <div className="absolute inset-0 flex items-center justify-center bg-white"><Spin tip="加载中..." /></div>}
          <iframe ref={iframeRef} src={url} className="w-full h-full border-none" onLoad={() => setIsLoading(false)} title={title || 'iframe'} sandbox="allow-same-origin allow-scripts allow-popups allow-forms" />
        </div>
      </div>
    </div>,
    document.body
  );
}
