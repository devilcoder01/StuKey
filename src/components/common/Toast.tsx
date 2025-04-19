import React, { useEffect, useState } from 'react';
import { Toast as ToastType, useToast } from '../../context/ToastContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faXmark, faInfoCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

interface ToastProps {
  toast: ToastType;
}

const Toast: React.FC<ToastProps> = ({ toast }) => {
  const { removeToast } = useToast();
  const [isExiting, setIsExiting] = useState(false);

  // Toast configuration based on type
  const toastConfig = {
    success: {
      icon: faCheck,
      bgColor: 'bg-green-500',
      borderColor: 'border-green-600'
    },
    error: {
      icon: faXmark,
      bgColor: 'bg-red-500',
      borderColor: 'border-red-600'
    },
    warning: {
      icon: faExclamationTriangle,
      bgColor: 'bg-amber-500',
      borderColor: 'border-amber-600'
    },
    info: {
      icon: faInfoCircle,
      bgColor: 'bg-blue-500',
      borderColor: 'border-blue-600'
    }
  }[toast.type] || {
    icon: faInfoCircle,
    bgColor: 'bg-gray-700',
    borderColor: 'border-gray-800'
  };

  // Handle close
  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => removeToast(toast.id), 200);
  };

  // Auto-remove toast after duration
  useEffect(() => {
    // Default duration is 5000ms if not specified
    const duration = toast.duration ?? 5000;

    if (duration !== Infinity) {
      const timer = setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => removeToast(toast.id), 200);
      }, duration - 200);

      return () => clearTimeout(timer);
    }
  }, [toast, removeToast]);

  return (
    <div
      className={`flex items-center w-auto max-w-xs py-2 px-3 mb-2 text-white rounded-md shadow-md
        ${toastConfig.bgColor} border-l-4 ${toastConfig.borderColor}
        ${isExiting ? 'opacity-0 translate-x-3' : 'opacity-100'}
        transform transition-all duration-200 ease-in-out hover:shadow-lg hover:scale-[1.02]`}
      role="alert"
      onClick={handleClose}
    >
      <div className="flex-shrink-0 mr-2">
        <FontAwesomeIcon icon={toastConfig.icon} className="text-sm" />
      </div>
      <p className="text-sm font-medium truncate">{toast.message}</p>
      <div className="ml-auto pl-3">
        <div className="inline-flex items-center justify-center rounded-md text-white hover:bg-white hover:bg-opacity-20 p-1">
          <FontAwesomeIcon icon={faXmark} className="text-xs" />
        </div>
      </div>
    </div>
  );
};

export default Toast;
