import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  fullScreen?: boolean;
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = 'border-gray-900',
  fullScreen = false,
  text
}) => {
  // Size mapping
  const sizeClasses = {
    small: 'h-6 w-6 border-2',
    medium: 'h-10 w-10 border-2',
    large: 'h-16 w-16 border-4'
  };

  const spinnerClasses = `animate-spin rounded-full ${sizeClasses[size]} border-t-transparent ${color}`;

  // If fullScreen is true, center the spinner in the viewport
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center z-50">
        <div className={spinnerClasses}></div>
        {text && <p className="mt-4 text-gray-300">{text}</p>}
      </div>
    );
  }

  // Otherwise, render the spinner inline
  return (
    <div className="flex flex-col items-center justify-center">
      <div className={spinnerClasses}></div>
      {text && <p className="mt-2 text-gray-700 text-sm">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
