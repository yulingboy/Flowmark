import { useState } from 'react';
import { Modal, Input } from 'antd';

interface AddFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
}

export function AddFolderModal({ isOpen, onClose, onSave }: AddFolderModalProps) {
  const [name, setName] = useState('');

  const handleOk = () => {
    if (name.trim()) {
      onSave(name.trim());
      setName('');
      onClose();
    }
  };

  const handleCancel = () => {
    setName('');
    onClose();
  };

  return (
    <Modal title="新建文件夹" open={isOpen} onOk={handleOk} onCancel={handleCancel}
      okText="创建" cancelText="取消" okButtonProps={{ disabled: !name.trim() }} destroyOnClose>
      <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="文件夹名称" autoFocus onPressEnter={handleOk} />
    </Modal>
  );
}
