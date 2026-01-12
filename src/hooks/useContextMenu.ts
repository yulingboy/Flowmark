import { useState, useCallback } from 'react';

interface ContextMenuState {
  isOpen: boolean;
  x: number;
  y: number;
}

/**
 * 右键菜单 Hook
 */
export function useContextMenu(disabled: boolean = false) {
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    isOpen: false,
    x: 0,
    y: 0,
  });

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    // 如果禁用（如有弹窗打开），不显示右键菜单
    if (disabled) return;
    setContextMenu({ isOpen: true, x: e.clientX, y: e.clientY });
  }, [disabled]);

  const closeContextMenu = useCallback(() => {
    setContextMenu(prev => ({ ...prev, isOpen: false }));
  }, []);

  return {
    contextMenu,
    handleContextMenu,
    closeContextMenu,
  };
}
