import { Toast } from './Toast';
import type { Toast as ToastType } from '@/hooks/useToast';
import { Z_INDEX } from '@/constants';

interface ToastContainerProps {
  toasts: ToastType[];
  onDismiss: (id: string) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

const positionStyles = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
};

export function ToastContainer({ toasts, onDismiss, position = 'top-right' }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div
      className={`fixed ${positionStyles[position]} flex flex-col gap-2 max-w-sm`}
      style={{ zIndex: Z_INDEX.TOAST }}
    >
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          type={toast.type}
          message={toast.message}
          onDismiss={() => onDismiss(toast.id)}
        />
      ))}
    </div>
  );
}
