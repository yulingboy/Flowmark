import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  icon?: ReactNode;
  title?: string;
  children: ReactNode;
  width?: string;
}

export function Modal({ isOpen, onClose, icon, title, children, width = '480px' }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // ESC 键关闭
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // 点击外部关闭
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl overflow-hidden relative"
        style={{ width }}
      >
        {/* 关闭按钮 */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={onClose}
            className="w-3 h-3 rounded-full bg-yellow-400 hover:bg-yellow-500 cursor-pointer border-none"
            title="最小化"
          />
          <button
            className="w-3 h-3 rounded-full bg-green-400 hover:bg-green-500 cursor-pointer border-none"
            title="最大化"
          />
          <button
            onClick={onClose}
            className="w-3 h-3 rounded-full bg-red-400 hover:bg-red-500 cursor-pointer border-none"
            title="关闭"
          />
        </div>

        {/* 内容区域 */}
        <div className="px-8 py-12 text-center">
          {/* 图标 */}
          {icon && (
            <div className="mb-6 flex justify-center">
              {icon}
            </div>
          )}

          {/* 标题 */}
          {title && (
            <h3 className="text-lg font-medium text-gray-800 mb-4">{title}</h3>
          )}

          {/* 内容 */}
          <div className="text-sm text-gray-600 leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

// 默认图标组件 - 箱子图标
export function BoxIcon() {
  return (
    <div className="w-20 h-20 relative">
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* 底座圆形 */}
        <ellipse cx="40" cy="65" rx="30" ry="8" fill="#e5e7eb" />
        {/* 箱子主体 */}
        <rect x="20" y="30" width="40" height="30" rx="2" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="2" />
        {/* 箱子盖子 */}
        <path d="M18 30 L40 20 L62 30 L40 35 Z" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1" />
        {/* 箱子内部阴影 */}
        <rect x="25" y="35" width="30" height="20" fill="#e5e7eb" />
        {/* 文件 */}
        <rect x="30" y="25" width="20" height="25" rx="1" fill="white" stroke="#d1d5db" strokeWidth="1" />
        <line x1="33" y1="32" x2="47" y2="32" stroke="#d1d5db" strokeWidth="1" />
        <line x1="33" y1="36" x2="47" y2="36" stroke="#d1d5db" strokeWidth="1" />
        <line x1="33" y1="40" x2="42" y2="40" stroke="#d1d5db" strokeWidth="1" />
      </svg>
    </div>
  );
}
