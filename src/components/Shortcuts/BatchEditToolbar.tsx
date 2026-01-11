import { useMemo } from 'react';
import { useShortcutsStore } from '@/stores/shortcutsStore';
import { isShortcutFolder } from '@/types';

const DeleteIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
  </svg>
);

const MoveIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
    <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export function BatchEditToolbar() {
  const { shortcuts, selectedIds, batchDelete, batchMoveToFolder, toggleBatchEdit, selectAll, clearSelection } = useShortcutsStore();
  const selectedCount = selectedIds.size;

  const folders = useMemo(() => 
    shortcuts.filter(isShortcutFolder).map((f) => ({ id: f.id, name: f.name })),
    [shortcuts]
  );

  const handleDelete = () => {
    if (selectedCount === 0) return;
    if (confirm(`确定删除选中的 ${selectedCount} 个标签吗？`)) {
      batchDelete();
    }
  };

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl px-6 py-3 flex items-center gap-4 z-50">
      <span className="text-gray-600 text-sm">已选择 {selectedCount} 项</span>
      
      <div className="h-6 w-px bg-gray-200" />
      
      <button onClick={selectAll} className="text-sm text-blue-500 hover:text-blue-600">全选</button>
      <button onClick={clearSelection} className="text-sm text-gray-500 hover:text-gray-600">取消全选</button>
      
      <div className="h-6 w-px bg-gray-200" />
      
      {/* 移动到文件夹 */}
      <div className="relative group">
        <button disabled={selectedCount === 0} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
          <MoveIcon />
          <span className="text-sm">移动至</span>
        </button>
        {folders.length > 0 && selectedCount > 0 && (
          <div className="absolute bottom-full left-0 mb-2 bg-white rounded-xl shadow-xl py-2 min-w-[120px] hidden group-hover:block">
            {folders.map((folder) => (
              <button key={folder.id} onClick={() => batchMoveToFolder(folder.id)}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">
                {folder.name}
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* 删除 */}
      <button onClick={handleDelete} disabled={selectedCount === 0}
        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-red-500 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed">
        <DeleteIcon />
        <span className="text-sm">删除</span>
      </button>
      
      <div className="h-6 w-px bg-gray-200" />
      
      {/* 退出批量编辑 */}
      <button onClick={toggleBatchEdit} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-gray-500 hover:bg-gray-100">
        <CloseIcon />
        <span className="text-sm">完成</span>
      </button>
    </div>
  );
}
