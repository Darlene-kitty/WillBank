import { useCallback, useState } from 'react';

interface ToastConfig {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

export function useToast() {
  const [toast, setToast] = useState<ToastConfig & { visible: boolean }>({
    message: '',
    type: 'info',
    duration: 3000,
    visible: false,
  });

  const showToast = useCallback((config: ToastConfig) => {
    setToast({
      ...config,
      visible: true,
    });
  }, []);

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, visible: false }));
  }, []);

  const showSuccess = useCallback((message: string, duration = 3000) => {
    showToast({ message, type: 'success', duration });
  }, [showToast]);

  const showError = useCallback((message: string, duration = 3000) => {
    showToast({ message, type: 'error', duration });
  }, [showToast]);

  const showInfo = useCallback((message: string, duration = 3000) => {
    showToast({ message, type: 'info', duration });
  }, [showToast]);

  const showWarning = useCallback((message: string, duration = 3000) => {
    showToast({ message, type: 'warning', duration });
  }, [showToast]);

  return {
    toast,
    showToast,
    hideToast,
    showSuccess,
    showError,
    showInfo,
    showWarning,
  };
}
