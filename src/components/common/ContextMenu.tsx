import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { ShortcutSize } from '@/types';

export interface ContextMenuItem {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  rightIcon?: React.ReactNode;
  type?: 'normal' | 'layout' | 'submenu';
  layoutOptions?: ShortcutSize[];
  currentLayout?: ShortcutSize;
  onLayoutSelect?: (size: ShortcutSize) => void;
  submenuItems?: { id: string; label: string; onClick: () => void }[];
}

interface ContextMenuProps {
  isOpen: boolean;
  position: { x: number; y: number };
  items: ContextMenuItem[];
  onClose: () => void;
}

export function ContextMenu({ isOpen, position, items, onClose }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [activeSubmenu, setActiveSubmenu] = useState<number | null>(null);

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
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      let x = position.x;
      let y = position.y;
      if (x + rect.width > vw) x = vw - rect.width - 10;
      if (y + rect.height > vh) y = vh - rect.height - 10;

      menu.style.left = `${x}px`;
      menu.style.top = `${y}px`;
    }
  }, [isOpen, position]);

  if (!isOpen) return null;

  const layoutSizes: { size: ShortcutSize; cols: number; rows: number }[] = [
    { size: '1x1', cols: 1, rows: 1 },
    { size: '1x2', cols: 1, rows: 2 },
    { size: '2x1', cols: 2, rows: 1 },
    { size: '2x2', cols: 2, rows: 2 },
    { size: '2x4', cols: 2, rows: 4 },
  ];

  const renderMenuItem = (item: ContextMenuItem, index: number) => {
    if (item.type === 'layout') {
      return (
        <div key={index} className="px-4 py-3">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-5 h-5 text-gray-600 flex items-center justify-center">{item.icon}</span>
            <span className="text-gray-800 text-sm">{item.label}</span>
          </div>
          <div className="flex gap-2 ml-8">
            {layoutSizes.map(({ size, cols, rows }) => (
              <button key={size} onClick={() => { item.onLayoutSelect?.(size); onClose(); }}
                className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all cursor-pointer ${
                  item.currentLayout === size ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white hover:border-gray-400'
                }`} title={size}>
                <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` }}>
                  {Array.from({ length: cols * rows }).map((_, i) => (
                    <div key={i} className={`w-1.5 h-1.5 rounded-sm ${item.currentLayout === size ? 'bg-blue-500' : 'bg-gray-400'}`} />
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (item.type === 'submenu' && item.submenuItems) {
      return (
        <div key={index} className="relative"
          onMouseEnter={() => setActiveSubmenu(index)}
          onMouseLeave={(e) => {
            const relatedTarget = e.relatedTarget as HTMLElement;
            if (relatedTarget?.closest('.submenu-panel')) return;
            setActiveSubmenu(null);
          }}>
          <button className="w-full px-4 py-3 flex items-center gap-3 hover:bg-black/5 transition-colors cursor-pointer border-none bg-transparent text-left">
            <span className="w-5 h-5 text-gray-600 flex items-center justify-center">{item.icon}</span>
            <span className="flex-1 text-gray-800 text-sm">{item.label}</span>
            {item.rightIcon && <span className="w-5 h-5 text-gray-500 flex items-center justify-center">{item.rightIcon}</span>}
          </button>
          {activeSubmenu === index && (
            <div className="submenu-panel absolute left-full top-0 min-w-[140px] py-2 rounded-xl shadow-xl"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.5)', marginLeft: '-4px', paddingLeft: '4px' }}
              onMouseEnter={() => setActiveSubmenu(index)}
              onMouseLeave={() => setActiveSubmenu(null)}>
              {item.submenuItems.length > 0 ? item.submenuItems.map((sub) => (
                <button key={sub.id} onClick={(e) => { e.stopPropagation(); sub.onClick(); onClose(); }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-black/5 transition-colors cursor-pointer border-none bg-transparent">
                  {sub.label}
                </button>
              )) : (
                <div className="px-4 py-2 text-sm text-gray-400">暂无文件夹</div>
              )}
            </div>
          )}
        </div>
      );
    }

    return (
      <button key={index} onClick={() => { item.onClick(); onClose(); }}
        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-black/5 transition-colors cursor-pointer border-none bg-transparent text-left">
        <span className="w-5 h-5 text-gray-600 flex items-center justify-center">{item.icon}</span>
        <span className="flex-1 text-gray-800 text-sm">{item.label}</span>
        {item.rightIcon && <span className="w-5 h-5 text-gray-500 flex items-center justify-center">{item.rightIcon}</span>}
      </button>
    );
  };

  return createPortal(
    <div ref={menuRef} className="fixed z-[200] min-w-[180px] py-2 rounded-2xl shadow-2xl"
      style={{ left: position.x, top: position.y, backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.3)' }}>
      {items.map(renderMenuItem)}
    </div>,
    document.body
  );
}
