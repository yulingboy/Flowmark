import { useEffect, RefObject } from 'react';

interface KeyboardShortcutsOptions {
  searchRef: RefObject<HTMLInputElement | null>;
  hasOpenModal: boolean;
  onEscape: () => void;
  onOpenSettings: () => void;
  onOpenAddShortcut: () => void;
}

/**
 * 全局键盘快捷键 Hook
 * 
 * 支持的快捷键：
 * - Escape: 关闭当前弹窗
 * - Ctrl/Cmd + K: 聚焦搜索框
 * - Ctrl/Cmd + ,: 打开设置
 * - Ctrl/Cmd + N: 添加快捷方式
 */
export function useKeyboardShortcuts({
  searchRef,
  hasOpenModal,
  onEscape,
  onOpenSettings,
  onOpenAddShortcut,
}: KeyboardShortcutsOptions) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;
      
      // Escape 键关闭弹窗
      if (e.key === 'Escape') {
        if (hasOpenModal) onEscape();
        return;
      }
      
      // 在输入框中不响应其他快捷键
      if (isInput) return;
      
      // Ctrl/Cmd + K: 聚焦搜索框
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
      // Ctrl/Cmd + ,: 打开设置
      else if ((e.ctrlKey || e.metaKey) && e.key === ',') {
        e.preventDefault();
        onOpenSettings();
      }
      // Ctrl/Cmd + N: 添加快捷方式
      else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        onOpenAddShortcut();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [searchRef, hasOpenModal, onEscape, onOpenSettings, onOpenAddShortcut]);
}
