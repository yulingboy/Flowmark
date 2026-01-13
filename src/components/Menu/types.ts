/**
 * Menu 组件类型定义
 */
import type { ReactNode } from 'react';
import type { ShortcutSize } from '@/types';

/** 右键菜单项 */
export interface ContextMenuItem {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  rightIcon?: ReactNode;
  type?: 'normal' | 'layout' | 'submenu';
  layoutOptions?: ShortcutSize[];
  disabledLayouts?: ShortcutSize[];
  currentLayout?: ShortcutSize;
  onLayoutSelect?: (size: ShortcutSize) => void;
  submenuItems?: { id: string; label: string; onClick: () => void }[];
  disabled?: boolean;
}

/** 右键菜单 Props */
export interface ContextMenuProps {
  isOpen: boolean;
  position: { x: number; y: number };
  items: ContextMenuItem[];
  onClose: () => void;
  ariaLabel?: string;
}
