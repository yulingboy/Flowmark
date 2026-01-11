import { useMemo } from 'react';
import { Modal, message } from 'antd';
import { ExclamationCircleOutlined, DeleteOutlined, CloseOutlined, FolderOutlined } from '@ant-design/icons';
import { useShortcutsStore } from '../store';
import { isShortcutFolder } from '@/types';

export function BatchEditToolbar() {
  const { shortcuts, selectedIds, deleteItem, batchMoveToFolder, toggleBatchEdit, selectAll, clearSelection } = useShortcutsStore();
  const selectedCount = selectedIds.size;

  const folders = useMemo(() => 
    shortcuts.filter(isShortcutFolder).map((f) => ({ id: f.id, name: f.name })),
    [shortcuts]
  );

  const handleDelete = () => {
    if (selectedCount === 0) return;
    Modal.confirm({
      title: '删除确认',
      icon: <ExclamationCircleOutlined />,
      content: `确定删除选中的 ${selectedCount} 个标签吗？此操作无法撤销。`,
      okText: '删除', cancelText: '取消', okButtonProps: { danger: true },
      onOk: () => { deleteItem([...selectedIds]); message.success('已删除'); },
    });
  };

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl px-6 py-3 flex items-center gap-4 z-50">
      <span className="text-gray-600 text-sm">已选择 {selectedCount} 项</span>
      <div className="h-6 w-px bg-gray-200" />
      <button onClick={selectAll} className="text-sm text-blue-500 hover:text-blue-600">全选</button>
      <button onClick={clearSelection} className="text-sm text-gray-500 hover:text-gray-600">取消全选</button>
      <div className="h-6 w-px bg-gray-200" />
      <div className="relative group">
        <button disabled={selectedCount === 0} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
          <FolderOutlined /><span className="text-sm">移动至</span>
        </button>
        {folders.length > 0 && selectedCount > 0 && (
          <div className="absolute bottom-full left-0 mb-2 bg-white rounded-xl shadow-xl py-2 min-w-[120px] hidden group-hover:block">
            {folders.map((folder) => (
              <button key={folder.id} onClick={() => batchMoveToFolder(folder.id)}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">{folder.name}</button>
            ))}
          </div>
        )}
      </div>
      <button onClick={handleDelete} disabled={selectedCount === 0}
        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-red-500 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed">
        <DeleteOutlined /><span className="text-sm">删除</span>
      </button>
      <div className="h-6 w-px bg-gray-200" />
      <button onClick={toggleBatchEdit} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-gray-500 hover:bg-gray-100">
        <CloseOutlined /><span className="text-sm">完成</span>
      </button>
    </div>
  );
}
