import { useEffect, useRef } from 'react';
import { message } from 'antd';
import { Clock } from '@/features/clock';
import { Search, useSearchStore } from '@/features/search';
import { ShortcutsContainer, AddShortcutModal, AddFolderModal, BatchEditToolbar, useShortcutsStore } from '@/features/shortcuts';
import { SettingsButton, SettingsPanel, WallpaperModal, useGeneralStore } from '@/features/settings';
import { Background, useBackgroundStore } from '@/components/Background';
import { ContextMenu, ErrorBoundary } from '@/components/common';
import type { ContextMenuItem } from '@/components/common';
import { PlusSquareOutlined, FolderOutlined, ReloadOutlined, EditOutlined, SettingOutlined } from '@ant-design/icons';
import { WallpaperIcon } from '@/components/common/icons';
import { registerBuiltinPlugins } from '@/plugins/builtin';
import { useModals, useKeyboardShortcuts, useContextMenu } from '@/hooks';

import type { ShortcutItem } from '@/types';
import { GRID } from '@/constants';
import { preloadImage } from '@/utils/imagePreloader';

// 注册内置插件
registerBuiltinPlugins();

function App() {
  const searchRef = useRef<HTMLInputElement>(null);
  
  // 弹窗状态管理
  const modals = useModals();
  
  // 右键菜单
  const { contextMenu, handleContextMenu, closeContextMenu } = useContextMenu(modals.hasOpenModal);
  
  // Store
  const { backgroundUrl } = useBackgroundStore();
  const { showClock, showSearch, showShortcuts } = useGeneralStore();
  const { autoFocusSearch } = useSearchStore();
  const { shortcuts, setShortcuts, updateShortcut, addShortcut, addFolder, deleteItem, batchEditMode, toggleBatchEdit } = useShortcutsStore();

  // 键盘快捷键
  useKeyboardShortcuts({
    searchRef,
    hasOpenModal: modals.hasOpenModal,
    onEscape: modals.closeCurrentModal,
    onOpenSettings: modals.openSettings,
    onOpenAddShortcut: modals.openAddShortcut,
  });

  // 预加载背景图片
  useEffect(() => {
    if (backgroundUrl) {
      preloadImage(backgroundUrl, { priority: 'high' });
    }
  }, [backgroundUrl]);

  // 自动聚焦搜索框
  useEffect(() => {
    if (autoFocusSearch && showSearch) {
      const timer = setTimeout(() => searchRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [autoFocusSearch, showSearch]);

  // 保存快捷方式
  const handleSaveShortcut = (shortcut: { id?: string; name: string; url: string; icon: string; openMode: 'tab' | 'popup' }) => {
    if (shortcut.id) {
      updateShortcut(shortcut.id, { name: shortcut.name, url: shortcut.url, icon: shortcut.icon, openMode: shortcut.openMode });
      message.success('快捷方式已更新');
    } else {
      addShortcut({ name: shortcut.name, url: shortcut.url, icon: shortcut.icon, openMode: shortcut.openMode, size: '1x1' });
      message.success('快捷方式已添加');
    }
  };

  // 删除快捷方式
  const handleDeleteShortcut = (item: ShortcutItem) => {
    deleteItem(item.id);
    message.success('快捷方式已删除');
  };

  // 右键菜单项
  const contextMenuItems: ContextMenuItem[] = [
    { icon: <PlusSquareOutlined />, label: '添加标签', onClick: modals.openAddShortcut },
    { icon: <FolderOutlined />, label: '新文件夹', onClick: modals.openAddFolder },
    { icon: <WallpaperIcon />, label: '更换壁纸', onClick: modals.openWallpaper, rightIcon: <ReloadOutlined /> },
    { icon: <EditOutlined />, label: '批量编辑', onClick: toggleBatchEdit },
    { icon: <SettingOutlined />, label: '设置', onClick: modals.openSettings },
  ];

  return (
    <div
      className="min-h-screen flex flex-col items-center pt-[100px] gap-6"
      onContextMenu={handleContextMenu}
    >
      <Background imageUrl={backgroundUrl} />
      <SettingsButton onClick={modals.openSettings} className="fixed top-4 right-4" />
      
      {/* 弹窗 */}
      <SettingsPanel isOpen={modals.isSettingsOpen} onClose={modals.closeSettings} />
      <ContextMenu isOpen={contextMenu.isOpen} position={{ x: contextMenu.x, y: contextMenu.y }} items={contextMenuItems} onClose={closeContextMenu} />
      <AddShortcutModal isOpen={modals.isAddShortcutOpen} onClose={modals.closeAddShortcut} onSave={handleSaveShortcut} editItem={modals.editingShortcut} />
      <AddFolderModal isOpen={modals.isAddFolderOpen} onClose={modals.closeAddFolder} onSave={addFolder} />
      <WallpaperModal isOpen={modals.isWallpaperOpen} onClose={modals.closeWallpaper} />
      
      {/* 主内容 */}
      {showClock && <ErrorBoundary><Clock /></ErrorBoundary>}
      {showSearch && <ErrorBoundary><Search placeholder="搜索内容" inputRef={searchRef} /></ErrorBoundary>}
      {showShortcuts && (
        <div className="mt-8">
          <ErrorBoundary>
            <ShortcutsContainer
              shortcuts={shortcuts}
              columns={GRID.COLUMNS}
              rows={GRID.ROWS}
              unit={GRID.UNIT}
              gap={GRID.GAP}
              onShortcutsChange={setShortcuts}
              onEditShortcut={modals.openEditShortcut}
              onDeleteShortcut={handleDeleteShortcut}
            />
          </ErrorBoundary>
        </div>
      )}
      
      {batchEditMode && <BatchEditToolbar />}
    </div>
  );
}

export default App;
