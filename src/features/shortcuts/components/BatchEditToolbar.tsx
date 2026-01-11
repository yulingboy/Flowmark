import { useMemo } from 'react';
import { Modal, message, Button, Dropdown, Divider, Space } from 'antd';
import { ExclamationCircleOutlined, DeleteOutlined, CloseOutlined, FolderOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useShortcutsStore } from '../store';
import { isShortcutFolder } from '@/types';

export function BatchEditToolbar() {
  const { shortcuts, selectedIds, deleteItem, batchMoveToFolder, toggleBatchEdit, selectAll, clearSelection } = useShortcutsStore();
  const selectedCount = selectedIds.size;

  const folders = useMemo(() => 
    shortcuts.filter(isShortcutFolder).map((f) => ({ id: f.id, name: f.name })),
    [shortcuts]
  );

  const folderMenuItems: MenuProps['items'] = folders.map(folder => ({
    key: folder.id,
    label: folder.name,
    onClick: () => batchMoveToFolder(folder.id),
  }));

  const handleDelete = () => {
    if (selectedCount === 0) return;
    Modal.confirm({
      title: '删除确认',
      icon: <ExclamationCircleOutlined />,
      content: `确定删除选中的 ${selectedCount} 个标签吗？此操作无法撤销。`,
      okText: '删除',
      cancelText: '取消',
      okButtonProps: { danger: true },
      onOk: () => {
        deleteItem([...selectedIds]);
        message.success('已删除');
      },
    });
  };

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl px-6 py-3 z-50">
      <Space split={<Divider type="vertical" />}>
        <span className="text-gray-600 text-sm">已选择 {selectedCount} 项</span>

        <Space>
          <Button type="link" size="small" onClick={selectAll}>
            全选
          </Button>
          <Button type="text" size="small" onClick={clearSelection}>
            取消全选
          </Button>
        </Space>

        <Dropdown
          menu={{ items: folderMenuItems }}
          disabled={selectedCount === 0 || folders.length === 0}
          placement="top"
        >
          <Button icon={<FolderOutlined />} disabled={selectedCount === 0}>
            移动至
          </Button>
        </Dropdown>

        <Button
          danger
          icon={<DeleteOutlined />}
          onClick={handleDelete}
          disabled={selectedCount === 0}
        >
          删除
        </Button>

        <Button icon={<CloseOutlined />} onClick={toggleBatchEdit}>
          完成
        </Button>
      </Space>
    </div>
  );
}
