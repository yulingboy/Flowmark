import { useEffect, useRef, useState } from 'react';

interface IframeModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title?: string;
}

export function IframeModal({ isOpen, onClose, url, title }: IframeModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl overflow-hidden relative w-[90vw] h-[85vh] max-w-6xl flex flex-col"
      >
        {/* 标题栏 */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-100 border-b border-gray-200">
          <div className="flex items-center gap-2">
            {/* macOS 风格按钮 */}
            <button
              onClick={onClose}
              className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 cursor-pointer border-none"
              title="关闭"
            />
            <button
              className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 cursor-pointer border-none"
              title="最小化"
            />
            <button
              onClick={() => window.open(url, '_blank')}
              className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 cursor-pointer border-none"
              title="在新标签页打开"
            />
          </div>
          
          {/* 标题 */}
          <div className="flex-1 text-center">
            <span className="text-sm text-gray-600 truncate">{title || url}</span>
          </div>
          
          {/* 占位 */}
          <div className="w-16" />
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
            src={url}
            className="w-full h-full border-none"
            onLoad={() => setIsLoading(false)}
            title={title || 'iframe content'}
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />
        </div>
      </div>
    </div>
  );
}
