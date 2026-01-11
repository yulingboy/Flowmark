import { useState, useEffect, useRef } from 'react';
import { Clock } from '@/components/Clock/Clock';
import { Search } from '@/components/Search/Search';
import { ShortcutsContainer, AddShortcutModal } from '@/components/Shortcuts';
import { Background } from '@/components/Background/Background';
import { SettingsButton, SettingsPanel } from '@/components/Settings';
import { ContextMenu } from '@/components/common';
import type { ContextMenuItem } from '@/components/common';
import { useSettingsStore } from '@/stores/settingsStore';
import { useShortcutsStore } from '@/stores/shortcutsStore';
import type { ShortcutItem } from '@/types';

// 右键菜单图标
const AddIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
    <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M12 8v8M8 12h8" />
  </svg>
);

const FolderIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
    <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
  </svg>
);

const WallpaperIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
    <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" />
  </svg>
);

const RefreshIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <path d="M23 4v6h-6M1 20v-6h6" /><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
  </svg>
);

const EditIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const SettingsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
  </svg>
);

function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAddShortcutOpen, setIsAddShortcutOpen] = useState(false);
  const [editingShortcut, setEditingShortcut] = useState<ShortcutItem | null>(null);
  const [contextMenu, setContextMenu] = useState({ isOpen: false, x: 0, y: 0 });
  
  const { backgroundUrl, showClock, showSearch, showShortcuts, autoFocusSearch } = useSettingsStore();
  const { shortcuts, setShortcuts, updateShortcut, addShortcut, deleteShortcut } = useShortcutsStore();
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocusSearch && showSearch) {
      const timer = setTimeout(() => searchRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [autoFocusSearch, showSearch]);

  const handleSaveShortcut = (shortcut: { id?: string; name: string; url: string; icon: string; openMode: 'tab' | 'popup' }) => {
    if (shortcut.id) {
      updateShortcut(shortcut.id, { name: shortcut.name, url: shortcut.url, icon: shortcut.icon, openMode: shortcut.openMode });
    } else {
      addShortcut({ name: shortcut.name, url: shortcut.url, icon: shortcut.icon, openMode: shortcut.openMode, size: '1x1' });
    }
  };

  const handleEditShortcut = (item: ShortcutItem) => { setEditingShortcut(item); setIsAddShortcutOpen(true); };
  const handleCloseModal = () => { setIsAddShortcutOpen(false); setEditingShortcut(null); };
  const handleDeleteShortcut = (item: ShortcutItem) => deleteShortcut(item.id);
  const handleContextMenu = (e: React.MouseEvent) => { e.preventDefault(); setContextMenu({ isOpen: true, x: e.clientX, y: e.clientY }); };

  const contextMenuItems: ContextMenuItem[] = [
    { icon: <AddIcon />, label: '添加标签', onClick: () => setIsAddShortcutOpen(true) },
    { icon: <FolderIcon />, label: '新文件夹', onClick: () => console.log('新文件夹') },
    { icon: <WallpaperIcon />, label: '更换壁纸', onClick: () => console.log('更换壁纸'), rightIcon: <RefreshIcon /> },
    { icon: <EditIcon />, label: '批量编辑', onClick: () => console.log('批量编辑') },
    { icon: <SettingsIcon />, label: '设置', onClick: () => setIsSettingsOpen(true) },
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
      
      {showClock && <Clock />}
      {showSearch && <Search placeholder="搜索内容" inputRef={searchRef} />}
      {showShortcuts && (
        <div style={{ marginTop: '32px' }}>
          <ShortcutsContainer shortcuts={shortcuts} columns={12} rows={4} unit={72} gap={20}
            onShortcutsChange={setShortcuts} onEditShortcut={handleEditShortcut} onDeleteShortcut={handleDeleteShortcut} />
        </div>
      )}
    </div>
  );
}

export default App;
