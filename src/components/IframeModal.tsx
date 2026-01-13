import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Spin } from 'antd';
import { useModalBehavior } from './Modal/useModalBehavior';

// 位置缓存
interface ModalPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

const positionCache = new Map<string, ModalPosition>();

// 尺寸约束
const SIZE_CONSTRAINTS = {
  minWidth: 400,
  minHeight: 300,
  maxWidth: window.innerWidth - 100,
  maxHeight: window.innerHeight - 100,
};

// 获取缓存键
function getCacheKey(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return url;
  }
}

interface IframeModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title?: string;
  rememberPosition?: boolean;
  minSize?: { width: number; height: number };
  maxSize?: { width: number; height: number };
}

export function IframeModal({ 
  isOpen, 
  onClose, 
  url, 
  title,
  rememberPosition = true,
  minSize = { width: SIZE_CONSTRAINTS.minWidth, height: SIZE_CONSTRAINTS.minHeight },
  maxSize = { width: SIZE_CONSTRAINTS.maxWidth, height: SIZE_CONSTRAINTS.maxHeight },
}: IframeModalProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [size, setSize] = useState({ width: 900, height: 600 });
  const [isResizing, setIsResizing] = useState(false);
  const resizeStartRef = useRef({ x: 0, y: 0, width: 0, height: 0 });
  const originalOverflowRef = useRef<string>('');

  // 计算初始位置（从缓存恢复）
  const initialPosition = useMemo(() => {
    if (rememberPosition) {
      const cacheKey = getCacheKey(url);
      const cached = positionCache.get(cacheKey);
      if (cached) {
        return { x: cached.x, y: cached.y };
      }
    }
    return { x: 0, y: 0 };
  }, [url, rememberPosition]);

  // 使用 useModalBehavior hook
  const {
    position,
    setPosition,
    isFullscreen,
    setIsFullscreen,
    handlePointerDown,
    modalRef,
    isDragging,
  } = useModalBehavior({
    isOpen,
    onClose,
    enableDrag: true,
    enableFullscreen: true,
    enableClickOutside: !isResizing, // resize 时不关闭
    enableEscapeKey: true,
    initialPosition,
  });

  // Body 滚动锁定
  useEffect(() => {
    if (isOpen) {
      originalOverflowRef.current = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = originalOverflowRef.current;
    }
    
    return () => {
      document.body.style.overflow = originalOverflowRef.current;
    };
  }, [isOpen]);

  // 打开时恢复尺寸
  const prevIsOpenRef = useRef(isOpen);
  useEffect(() => {
    if (isOpen && !prevIsOpenRef.current) {
      setIsLoading(true);
      if (rememberPosition) {
        const cacheKey = getCacheKey(url);
        const cached = positionCache.get(cacheKey);
        if (cached) {
          setSize({ width: cached.width, height: cached.height });
        } else {
          setSize({ width: 900, height: 600 });
        }
      } else {
        setSize({ width: 900, height: 600 });
      }
    }
    prevIsOpenRef.current = isOpen;
  }, [isOpen, url, rememberPosition]);

  // 保存位置到缓存
  const savePosition = useCallback(() => {
    if (rememberPosition && !isFullscreen) {
      const cacheKey = getCacheKey(url);
      positionCache.set(cacheKey, {
        x: position.x,
        y: position.y,
        width: size.width,
        height: size.height,
      });
    }
  }, [rememberPosition, url, position, size, isFullscreen]);

  // 拖拽结束时保存位置
  useEffect(() => {
    if (!isDragging) {
      savePosition();
    }
  }, [isDragging, savePosition]);

  // 调整大小处理（IframeModal 特有逻辑）
  const handleResizeStart = useCallback((e: React.PointerEvent) => {
    if (isFullscreen) return;
    e.stopPropagation();
    e.preventDefault();
    setIsResizing(true);
    resizeStartRef.current = { x: e.clientX, y: e.clientY, width: size.width, height: size.height };
  }, [isFullscreen, size]);

  useEffect(() => {
    if (!isResizing) return;
    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = Math.max(minSize.width, Math.min(maxSize.width, 
        resizeStartRef.current.width + (e.clientX - resizeStartRef.current.x)));
      const newHeight = Math.max(minSize.height, Math.min(maxSize.height,
        resizeStartRef.current.height + (e.clientY - resizeStartRef.current.y)));
      setSize({ width: newWidth, height: newHeight });
    };
    const handleMouseUp = () => {
      setIsResizing(false);
      savePosition();
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, minSize, maxSize, savePosition]);

  const handleRefresh = () => {
    if (iframeRef.current) { setIsLoading(true); iframeRef.current.src = url; }
  };

  const handleToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen) setPosition({ x: 0, y: 0 });
  };

  if (!isOpen) return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onPointerDown={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
      aria-label={title || 'iframe 弹窗'}
    >
      <div
        ref={modalRef}
        className={isFullscreen 
          ? 'fixed inset-4 bg-white shadow-2xl rounded-lg flex flex-col' 
          : 'bg-white shadow-2xl rounded-lg flex flex-col relative'
        }
        style={isFullscreen ? {} : { 
          transform: `translate(${position.x}px, ${position.y}px)`,
          width: size.width,
          height: size.height,
        }}
      >
        <div 
          className={`flex items-center justify-between px-4 py-3 border-b border-gray-200 ${!isFullscreen ? 'cursor-move' : ''}`}
          onPointerDown={!isFullscreen ? handlePointerDown : undefined}
        >
          <span className="text-sm font-medium text-gray-700 select-none truncate max-w-[70%]">{title || url}</span>
          <div className="flex gap-2" onPointerDown={(e) => e.stopPropagation()}>
            <button 
              onClick={handleRefresh} 
              className="w-3 h-3 rounded-full bg-yellow-400 hover:bg-yellow-500 border-none cursor-pointer" 
              title="刷新"
              aria-label="刷新"
            />
            <button 
              onClick={handleToggleFullscreen} 
              className="w-3 h-3 rounded-full bg-green-400 hover:bg-green-500 border-none cursor-pointer" 
              title={isFullscreen ? '退出全屏' : '全屏'}
              aria-label={isFullscreen ? '退出全屏' : '全屏'}
            />
            <button 
              onClick={() => window.open(url, '_blank')} 
              className="w-3 h-3 rounded-full bg-blue-400 hover:bg-blue-500 border-none cursor-pointer" 
              title="新标签页打开"
              aria-label="新标签页打开"
            />
            <button 
              onClick={onClose} 
              className="w-3 h-3 rounded-full bg-red-400 hover:bg-red-500 border-none cursor-pointer" 
              title="关闭"
              aria-label="关闭"
            />
          </div>
        </div>
        <div className="flex-1 relative overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white">
              <Spin tip="加载中..." />
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
        {/* 调整大小手柄 */}
        {!isFullscreen && (
          <div
            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
            onPointerDown={handleResizeStart}
            style={{
              background: 'linear-gradient(135deg, transparent 50%, rgba(0,0,0,0.1) 50%)',
            }}
            aria-label="调整大小"
          />
        )}
      </div>
    </div>,
    document.body
  );
}
