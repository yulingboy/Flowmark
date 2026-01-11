import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Menu } from 'antd';
import type { MenuProps } from 'antd';
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

const layoutSizes: { size: ShortcutSize; cols: number; rows: number }[] = [
  { size: '1x1', cols: 1, rows: 1 },
  { size: '1x2', cols: 1, rows: 2 },
  { size: '2x1', cols: 2, rows: 1 },
  { size: '2x2', cols: 2, rows: 2 },
  { size: '2x4', cols: 2, rows: 4 },
];

function LayoutSelector({ currentLayout, onSelect }: { currentLayout?: ShortcutSize; onSelect: (size: ShortcutSize) => void }) {
  return (
    <div className="flex gap-2 px-3 py-2">
      {layoutSizes.map(({ size, cols, rows }) => (
        <button key={size} onClick={() => onSelect(size)}
          className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all cursor-pointer ${
            currentLayout === size ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white hover:border-gray-400'
          }`} title={size}>
          <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` }}>
            {Array.from({ length: cols * rows }).map((_, i) => (
              <div key={i} className={`w-1.5 h-1.5 rounded-sm ${currentLayout === size ? 'bg-blue-500' : 'bg-gray-400'}`} />
            ))}
          </div>
        </button>
      ))}
    </div>
  );
}

export function ContextMenu({ isOpen, position, items, onClose }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [adjustedPosition, setAdjustedPosition] = useState(position);

  useEffect(() => {
    if (isOpen) {
      setAdjustedPosition(position);
    }
  }, [isOpen, position]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // 调整位置防止超出屏幕
  useEffect(() => {
    if (isOpen && menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      let x = position.x;
      let y = position.y;
      if (x + rect.width > vw) x = vw - rect.width - 10;
      if (y + rect.height > vh) y = vh - rect.height - 10;
      setAdjustedPosition({ x, y });
    }
  }, [isOpen, position]);

  if (!isOpen) return null;

  const menuItems: MenuProps['items'] = items.map((item, index) => {
    if (item.type === 'layout') {
      return {
        key: `layout-${index}`,
        label: (
          <div>
            <div className="flex items-center gap-2 mb-2">
              {item.icon}
              <span>{item.label}</span>
            </div>
            <LayoutSelector currentLayout={item.currentLayout} onSelect={(size) => { item.onLayoutSelect?.(size); onClose(); }} />
          </div>
        ),
      };
    }

    if (item.type === 'submenu' && item.submenuItems) {
      return {
        key: `submenu-${index}`,
        icon: item.icon,
        label: item.label,
        children: item.submenuItems.length > 0
          ? item.submenuItems.map(sub => ({
              key: sub.id,
              label: sub.label,
              onClick: () => { sub.onClick(); onClose(); },
            }))
          : [{ key: 'empty', label: '暂无文件夹', disabled: true }],
      };
    }

    return {
      key: `item-${index}`,
      icon: item.icon,
      label: (
        <div className="flex items-center justify-between w-full">
          <span>{item.label}</span>
          {item.rightIcon && <span className="ml-2 text-gray-400">{item.rightIcon}</span>}
        </div>
      ),
      onClick: () => { item.onClick(); onClose(); },
    };
  });

  return createPortal(
    <div
      ref={menuRef}
      className="fixed z-[200]"
      style={{ left: adjustedPosition.x, top: adjustedPosition.y }}
    >
      <Menu
        items={menuItems}
        style={{ 
          minWidth: 180, 
          borderRadius: 12,
          boxShadow: '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12)',
        }}
      />
    </div>,
    document.body
  );
}
