import { useCallback } from 'react';
import { useToast, ToastType } from '../context/ToastContext';

/**
 * Custom hook for easy toast notifications
 * 
 * @returns Object with methods for showing different types of toasts
 */
export const useToastNotification = () => {
  const { addToast } = useToast();

  const showToast = useCallback(
    (message: string, type: ToastType = 'info', duration = 5000) => {
      addToast(message, type, duration);
    },
    [addToast]
  );

  const showSuccess = useCallback(
    (message: string, duration = 5000) => {
      addToast(message, 'success', duration);
    },
    [addToast]
  );

  const showError = useCallback(
    (message: string, duration = 5000) => {
      addToast(message, 'error', duration);
    },
    [addToast]
  );

  const showWarning = useCallback(
    (message: string, duration = 5000) => {
      addToast(message, 'warning', duration);
    },
    [addToast]
  );

  const showInfo = useCallback(
    (message: string, duration = 5000) => {
      addToast(message, 'info', duration);
    },
    [addToast]
  );

  return {
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};
