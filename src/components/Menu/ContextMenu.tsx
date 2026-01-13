import { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Button } from 'antd';
import type { ShortcutSize } from '@/types';
import type { ContextMenuItem, ContextMenuProps } from './types';

export function ContextMenu({ isOpen, position, items, onClose, ariaLabel = '上下文菜单' }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [activeSubmenu, setActiveSubmenu] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [menuPosition, setMenuPosition] = useState(position);

  const selectableIndices = items
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => item.type !== 'layout' && !item.disabled)
    .map(({ index }) => index);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => {
          const currentPos = selectableIndices.indexOf(prev);
          const nextPos = currentPos < selectableIndices.length - 1 ? currentPos + 1 : 0;
          return selectableIndices[nextPos] ?? -1;
        });
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => {
          const currentPos = selectableIndices.indexOf(prev);
          const nextPos = currentPos > 0 ? currentPos - 1 : selectableIndices.length - 1;
          return selectableIndices[nextPos] ?? -1;
        });
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < items.length) {
          const item = items[selectedIndex];
          if (item && !item.disabled && item.type !== 'layout') {
            item.onClick();
            onClose();
          }
        }
        break;
      case 'ArrowRight':
        if (selectedIndex >= 0 && items[selectedIndex]?.type === 'submenu') {
          e.preventDefault();
          setActiveSubmenu(selectedIndex);
        }
        break;
      case 'ArrowLeft':
        if (activeSubmenu !== null) {
          e.preventDefault();
          setActiveSubmenu(null);
        }
        break;
    }
  }, [isOpen, items, selectedIndex, selectableIndices, activeSubmenu, onClose]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleScroll = () => onClose();

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
  }, [isOpen, onClose, handleKeyDown]);

  const prevIsOpenRef = useRef(isOpen);
  useEffect(() => {
    if (isOpen && !prevIsOpenRef.current) {
      setSelectedIndex(-1);
      setActiveSubmenu(null);
    }
    prevIsOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && menuRef.current) {
      const menu = menuRef.current;
      const rect = menu.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      let x = position.x;
      let y = position.y;
      
      if (x + rect.width > vw) {
        x = Math.max(10, position.x - rect.width);
      }
      
      if (y + rect.height > vh) {
        y = Math.max(10, position.y - rect.height);
      }

      setMenuPosition({ x, y });
    }
  }, [isOpen, position]);

  useEffect(() => {
    if (isOpen && menuRef.current) {
      menuRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const allLayoutSizes: { size: ShortcutSize; cols: number; rows: number }[] = [
    { size: '1x1', cols: 1, rows: 1 },
    { size: '1x2', cols: 1, rows: 2 },
    { size: '2x1', cols: 2, rows: 1 },
    { size: '2x2', cols: 2, rows: 2 },
    { size: '2x4', cols: 2, rows: 4 },
  ];

  const renderMenuItem = (item: ContextMenuItem, index: number) => {
    const isSelected = selectedIndex === index;
    const itemId = `context-menu-item-${index}`;

    if (item.type === 'layout') {
      const layoutSizes = item.layoutOptions 
        ? allLayoutSizes.filter(l => item.layoutOptions!.includes(l.size))
        : allLayoutSizes;
      const disabledSet = new Set(item.disabledLayouts || []);
      
      return (
        <div key={index} className="px-4 py-3" role="presentation">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-5 h-5 text-gray-600 flex items-center justify-center">{item.icon}</span>
            <span className="text-gray-800 text-sm">{item.label}</span>
          </div>
          <div className="flex gap-2 ml-8" role="group" aria-label="布局选项">
            {layoutSizes.map(({ size, cols, rows }) => {
              const isDisabled = disabledSet.has(size);
              const isCurrent = item.currentLayout === size;
              return (
                <Button 
                  key={size} 
                  size="small"
                  type={isCurrent ? 'primary' : 'default'}
                  disabled={isDisabled}
                  onClick={() => { if (!isDisabled) { item.onLayoutSelect?.(size); onClose(); } }}
                  className={`!w-8 !h-8 !p-0 ${isDisabled ? '!opacity-40 !cursor-not-allowed' : ''}`}
                  title={isDisabled ? `${size} (超出边界)` : size}
                  aria-pressed={isCurrent}
                  aria-disabled={isDisabled}
                >
                  <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` }}>
                    {Array.from({ length: cols * rows }).map((_, i) => (
                      <div key={i} className={`w-1.5 h-1.5 rounded-sm ${isCurrent ? 'bg-white' : isDisabled ? 'bg-gray-300' : 'bg-gray-400'}`} />
                    ))}
                  </div>
                </Button>
              );
            })}
          </div>
        </div>
      );
    }

    if (item.type === 'submenu' && item.submenuItems) {
      return (
        <div 
          key={index} 
          className="relative"
          role="menuitem"
          id={itemId}
          aria-haspopup="true"
          aria-expanded={activeSubmenu === index}
          aria-disabled={item.disabled}
          onMouseEnter={() => { setActiveSubmenu(index); setSelectedIndex(index); }}
          onMouseLeave={(e) => {
            const relatedTarget = e.relatedTarget as HTMLElement;
            if (relatedTarget?.closest('.submenu-panel')) return;
            setActiveSubmenu(null);
          }}
        >
          <div 
            className={`w-full px-4 py-3 flex items-center gap-3 transition-colors cursor-pointer ${
              isSelected ? 'bg-black/10' : 'hover:bg-black/5'
            } ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            tabIndex={-1}
          >
            <span className="w-5 h-5 text-gray-600 flex items-center justify-center">{item.icon}</span>
            <span className="flex-1 text-gray-800 text-sm">{item.label}</span>
            {item.rightIcon && <span className="w-5 h-5 text-gray-500 flex items-center justify-center">{item.rightIcon}</span>}
          </div>
          {activeSubmenu === index && (
            <div 
              className="submenu-panel absolute left-full top-0 min-w-[140px] py-2 rounded-xl shadow-xl"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.5)', marginLeft: '-4px', paddingLeft: '4px' }}
              role="menu"
              aria-label={item.label}
              onMouseEnter={() => setActiveSubmenu(index)}
              onMouseLeave={() => setActiveSubmenu(null)}
            >
              {item.submenuItems.length > 0 ? item.submenuItems.map((sub) => (
                <Button 
                  key={sub.id} 
                  type="text"
                  block
                  role="menuitem"
                  onClick={(e) => { e.stopPropagation(); sub.onClick(); onClose(); }}
                  className="!text-left !justify-start !px-4 !py-2 !h-auto"
                >
                  {sub.label}
                </Button>
              )) : (
                <div className="px-4 py-2 text-sm text-gray-400" role="menuitem" aria-disabled="true">暂无文件夹</div>
              )}
            </div>
          )}
        </div>
      );
    }

    return (
      <div 
        key={index}
        id={itemId}
        role="menuitem"
        aria-disabled={item.disabled}
        tabIndex={isSelected ? 0 : -1}
        onClick={() => { 
          if (!item.disabled) {
            item.onClick(); 
            onClose(); 
          }
        }}
        onMouseEnter={() => setSelectedIndex(index)}
        className={`w-full px-4 py-3 flex items-center gap-3 transition-colors cursor-pointer ${
          isSelected ? 'bg-black/10' : 'hover:bg-black/5'
        } ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <span className="w-5 h-5 text-gray-600 flex items-center justify-center">{item.icon}</span>
        <span className="flex-1 text-gray-800 text-sm">{item.label}</span>
        {item.rightIcon && <span className="w-5 h-5 text-gray-500 flex items-center justify-center">{item.rightIcon}</span>}
      </div>
    );
  };

  return createPortal(
    <div 
      ref={menuRef} 
      className="fixed z-[200] min-w-[180px] py-2 rounded-2xl shadow-2xl outline-none"
      style={{ 
        left: menuPosition.x, 
        top: menuPosition.y, 
        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
        backdropFilter: 'blur(20px)', 
        border: '1px solid rgba(255, 255, 255, 0.3)' 
      }}
      role="menu"
      aria-label={ariaLabel}
      aria-activedescendant={selectedIndex >= 0 ? `context-menu-item-${selectedIndex}` : undefined}
      tabIndex={-1}
    >
      {items.map(renderMenuItem)}
    </div>,
    document.body
  );
}
