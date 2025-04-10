import React, { useEffect, useState } from 'react';
import { Toast as ToastType, useToast } from '../../context/ToastContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faCircleExclamation, faExclamation, faTriangleExclamation, faXmark } from '@fortawesome/free-solid-svg-icons';
interface ToastProps {
  toast: ToastType;
}

const Toast: React.FC<ToastProps> = ({ toast }) => {
  const { removeToast } = useToast();
  const [isExiting, setIsExiting] = useState(false);

  // Set background color based on toast type
  const getBgColor = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-[#78A083]';
      case 'error':
        return 'bg-[#BE3144]';
      case 'warning':
        return 'bg-[#D49B54]';
      case 'info':
        return 'bg-[#0E2954]';
      default:
        return 'bg-[#A594F9]';
    }
  };

  // Get icon based on toast type
  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return (
          <FontAwesomeIcon icon={faCircleCheck} />
        );
      case 'error':
        return (
          <FontAwesomeIcon icon = {faXmark} />
        );
      case 'warning':
        return (
         <FontAwesomeIcon icon={faTriangleExclamation} />
        );
      case 'info':
        return (
          <FontAwesomeIcon icon={faCircleExclamation} />
        );
      default:
        return null;
    }
  };

  // Handle close button click
  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      removeToast(toast.id);
    }, 300); // Match this with the CSS transition time
  };

  // Auto-remove toast after duration
  useEffect(() => {
    if (toast.duration !== Infinity) {
      const timer = setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => {
          removeToast(toast.id);
        }, 300);
      }, toast.duration - 300); // Subtract transition time

      return () => clearTimeout(timer);
    }
  }, [toast, removeToast]);

  return (
    <div 
      className={`flex items-center w-full max-w-xs p-4 mb-4 text-white rounded-full shadow-lg ${getBgColor()} ${
        isExiting ? 'animate-fade-out' : 'animate-fade-in'
      } transition-opacity duration-3000 relative`}
      role="alert"
    >
      <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8  text-white">
        {getIcon()}
      </div>
      <div className="mx-2 text-sm font-semibold">{toast.message}</div>
      <button
        type="button"
        className="ml-auto -mx-1.5 -my-1.5 text-white hover:text-gray-200 focus:outline-none absolute top-4 right-4 opacity-0"
        onClick={handleClose}
        aria-label="Close"
      >
        <FontAwesomeIcon icon={faXmark} />
      </button>
    </div>
  );
};

export default Toast;
