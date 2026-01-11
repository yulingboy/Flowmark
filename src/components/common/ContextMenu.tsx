import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export interface ContextMenuItem {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  rightIcon?: React.ReactNode;
}

interface ContextMenuProps {
  isOpen: boolean;
  position: { x: number; y: number };
  items: ContextMenuItem[];
  onClose: () => void;
}

export function ContextMenu({ isOpen, position, items, onClose }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleScroll = () => onClose();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('scroll', handleScroll, true);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('scroll', handleScroll, true);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // 调整位置，防止超出屏幕
  useEffect(() => {
    if (isOpen && menuRef.current) {
      const menu = menuRef.current;
      const rect = menu.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let adjustedX = position.x;
      let adjustedY = position.y;

      if (position.x + rect.width > viewportWidth) {
        adjustedX = viewportWidth - rect.width - 10;
      }
      if (position.y + rect.height > viewportHeight) {
        adjustedY = viewportHeight - rect.height - 10;
      }

      menu.style.left = `${adjustedX}px`;
      menu.style.top = `${adjustedY}px`;
    }
  }, [isOpen, position]);

  if (!isOpen) return null;

  return createPortal(
    <div
      ref={menuRef}
      className="fixed z-[200] min-w-[180px] py-2 rounded-2xl shadow-2xl"
      style={{
        left: position.x,
        top: position.y,
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.5)',
      }}
    >
      {items.map((item, index) => (
        <button
          key={index}
          onClick={() => {
            item.onClick();
            onClose();
          }}
          className="w-full px-4 py-3 flex items-center gap-3 hover:bg-black/5 transition-colors cursor-pointer border-none bg-transparent text-left"
        >
          <span className="w-5 h-5 text-gray-600 flex items-center justify-center">
            {item.icon}
          </span>
          <span className="flex-1 text-gray-800 text-base">{item.label}</span>
          {item.rightIcon && (
            <span className="w-5 h-5 text-gray-500 flex items-center justify-center">
              {item.rightIcon}
            </span>
          )}
        </button>
      ))}
    </div>,
    document.body
  );
}
