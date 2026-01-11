import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

interface ConfirmDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onConfirm,
  onCancel,
  title,
  message,
  confirmLabel = '确认',
  cancelLabel = '取消',
  danger = false,
}: ConfirmDialogProps) {
  return (
    <Modal
      open={isOpen}
      title={
        <span>
          <ExclamationCircleOutlined className={`mr-2 ${danger ? 'text-red-500' : 'text-yellow-500'}`} />
          {title}
        </span>
      }
      onOk={onConfirm}
      onCancel={onCancel}
      okText={confirmLabel}
      cancelText={cancelLabel}
      okButtonProps={{ danger }}
      centered
    >
      <p className="text-gray-600">{message}</p>
    </Modal>
  );
}
