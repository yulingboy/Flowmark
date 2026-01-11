import { message } from 'antd';
import { useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export function useToast() {
  const [messageApi, contextHolder] = message.useMessage();

  const showToast = useCallback((type: ToastType, content: string) => {
    messageApi[type](content);
  }, [messageApi]);

  const success = useCallback((content: string) => messageApi.success(content), [messageApi]);
  const error = useCallback((content: string) => messageApi.error(content), [messageApi]);
  const warning = useCallback((content: string) => messageApi.warning(content), [messageApi]);
  const info = useCallback((content: string) => messageApi.info(content), [messageApi]);

  return {
    contextHolder,
    showToast,
    success,
    error,
    warning,
    info,
  };
}
