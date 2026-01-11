import type { ToastType } from '@/hooks/useToast';
import { SuccessIcon, ErrorIcon, WarningIcon, InfoIcon, CloseIcon } from './icons';

interface ToastProps {
  type: ToastType;
  message: string;
  onDismiss: () => void;
}

const typeStyles: Record<ToastType, { bg: string; icon: React.ReactNode }> = {
  success: {
    bg: 'bg-green-50 border-green-200 text-green-800',
    icon: <SuccessIcon className="text-green-500" size={18} />,
  },
  error: {
    bg: 'bg-red-50 border-red-200 text-red-800',
    icon: <ErrorIcon className="text-red-500" size={18} />,
  },
  warning: {
    bg: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    icon: <WarningIcon className="text-yellow-500" size={18} />,
  },
  info: {
    bg: 'bg-blue-50 border-blue-200 text-blue-800',
    icon: <InfoIcon className="text-blue-500" size={18} />,
  },
};

export function Toast({ type, message, onDismiss }: ToastProps) {
  const { bg, icon } = typeStyles[type];

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg ${bg} animate-slide-in`}
      role="alert"
    >
      {icon}
      <span className="flex-1 text-sm">{message}</span>
      <button
        onClick={onDismiss}
        className="p-1 hover:bg-black/10 rounded transition-colors"
        aria-label="关闭"
      >
        <CloseIcon size={14} />
      </button>
    </div>
  );
}
