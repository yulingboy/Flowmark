import { useState, useEffect, useRef } from 'react';
import { message } from 'antd';
import { Clock } from '@/components/Clock/Clock';
import { Search } from '@/components/Search/Search';
import { ShortcutsContainer, AddShortcutModal, AddFolderModal, BatchEditToolbar } from '@/components/Shortcuts';
import { Background } from '@/components/Background/Background';
import { SettingsButton, SettingsPanel, WallpaperModal } from '@/components/Settings';
import { ContextMenu, ErrorBoundary } from '@/components/common';
import type { ContextMenuItem } from '@/components/common';
import { PlusSquareOutlined, FolderOutlined, ReloadOutlined, EditOutlined, SettingOutlined } from '@ant-design/icons';
import { WallpaperIcon } from '@/components/common/icons';
import { useSettingsStore } from '@/stores/settingsStore';
import { useShortcutsStore } from '@/stores/shortcutsStore';

import type { ShortcutItem } from '@/types';
import { GRID } from '@/constants';
import { preloadImage } from '@/utils/imagePreloader';

function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAddShortcutOpen, setIsAddShortcutOpen] = useState(false);
  const [isAddFolderOpen, setIsAddFolderOpen] = useState(false);
  const [isWallpaperOpen, setIsWallpaperOpen] = useState(false);
  const [editingShortcut, setEditingShortcut] = useState<ShortcutItem | null>(null);
  const [contextMenu, setContextMenu] = useState({ isOpen: false, x: 0, y: 0 });
  
  const { backgroundUrl, showClock, showSearch, showShortcuts, autoFocusSearch } = useSettingsStore();
  const { shortcuts, setShortcuts, updateShortcut, addShortcut, addFolder, deleteShortcut, batchEditMode, toggleBatchEdit } = useShortcutsStore();
  const searchRef = useRef<HTMLInputElement>(null);

  // 预加载背景图片
  useEffect(() => {
    if (backgroundUrl) {
      preloadImage(backgroundUrl, { priority: 'high' });
    }
  }, [backgroundUrl]);

  // 键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;
      
      if (e.key === 'Escape') {
        if (isSettingsOpen) setIsSettingsOpen(false);
        else if (isAddShortcutOpen) { setIsAddShortcutOpen(false); setEditingShortcut(null); }
        else if (isAddFolderOpen) setIsAddFolderOpen(false);
        else if (isWallpaperOpen) setIsWallpaperOpen(false);
        return;
      }
      
      if (isInput) return;
      
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      } else if ((e.ctrlKey || e.metaKey) && e.key === ',') {
        e.preventDefault();
        setIsSettingsOpen(true);
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        setIsAddShortcutOpen(true);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isSettingsOpen, isAddShortcutOpen, isAddFolderOpen, isWallpaperOpen]);

  useEffect(() => {
    if (autoFocusSearch && showSearch) {
      const timer = setTimeout(() => searchRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [autoFocusSearch, showSearch]);

  const handleSaveShortcut = (shortcut: { id?: string; name: string; url: string; icon: string; openMode: 'tab' | 'popup' }) => {
    if (shortcut.id) {
      updateShortcut(shortcut.id, { name: shortcut.name, url: shortcut.url, icon: shortcut.icon, openMode: shortcut.openMode });
      message.success('快捷方式已更新');
    } else {
      addShortcut({ name: shortcut.name, url: shortcut.url, icon: shortcut.icon, openMode: shortcut.openMode, size: '1x1' });
      message.success('快捷方式已添加');
    }
  };

  const handleEditShortcut = (item: ShortcutItem) => { setEditingShortcut(item); setIsAddShortcutOpen(true); };
  const handleCloseModal = () => { setIsAddShortcutOpen(false); setEditingShortcut(null); };
  const handleDeleteShortcut = (item: ShortcutItem) => { deleteShortcut(item.id); message.success('快捷方式已删除'); };
  const handleContextMenu = (e: React.MouseEvent) => { e.preventDefault(); setContextMenu({ isOpen: true, x: e.clientX, y: e.clientY }); };

  const contextMenuItems: ContextMenuItem[] = [
    { icon: <PlusSquareOutlined />, label: '添加标签', onClick: () => setIsAddShortcutOpen(true) },
    { icon: <FolderOutlined />, label: '新文件夹', onClick: () => setIsAddFolderOpen(true) },
    { icon: <WallpaperIcon />, label: '更换壁纸', onClick: () => setIsWallpaperOpen(true), rightIcon: <ReloadOutlined /> },
    { icon: <EditOutlined />, label: '批量编辑', onClick: () => toggleBatchEdit() },
    { icon: <SettingOutlined />, label: '设置', onClick: () => setIsSettingsOpen(true) },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '100px', gap: '24px' }}
      onContextMenu={handleContextMenu}>
      <Background imageUrl={backgroundUrl} />
      <SettingsButton onClick={() => setIsSettingsOpen(true)} className="fixed top-4 right-4" />
      <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <ContextMenu isOpen={contextMenu.isOpen} position={{ x: contextMenu.x, y: contextMenu.y }} items={contextMenuItems}
        onClose={() => setContextMenu(prev => ({ ...prev, isOpen: false }))} />
      <AddShortcutModal isOpen={isAddShortcutOpen} onClose={handleCloseModal} onSave={handleSaveShortcut} editItem={editingShortcut} />
      <AddFolderModal isOpen={isAddFolderOpen} onClose={() => setIsAddFolderOpen(false)} onSave={addFolder} />
      <WallpaperModal isOpen={isWallpaperOpen} onClose={() => setIsWallpaperOpen(false)} />
      
      {showClock && <ErrorBoundary><Clock /></ErrorBoundary>}
      {showSearch && <ErrorBoundary><Search placeholder="搜索内容" inputRef={searchRef} /></ErrorBoundary>}
      {showShortcuts && (
        <div style={{ marginTop: '32px' }}>
          <ErrorBoundary>
            <ShortcutsContainer shortcuts={shortcuts} columns={GRID.COLUMNS} rows={GRID.ROWS} unit={GRID.UNIT} gap={GRID.GAP}
              onShortcutsChange={setShortcuts} onEditShortcut={handleEditShortcut} onDeleteShortcut={handleDeleteShortcut} />
          </ErrorBoundary>
        </div>
      )}
      
      {batchEditMode && <BatchEditToolbar />}
    </div>
  );
}

export default App;
