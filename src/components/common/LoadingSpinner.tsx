import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  fullScreen?: boolean;
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = 'border-[#dadada]',
  fullScreen = false,
  text
}) => {
  // Size mapping
  const sizeClasses = {
    small: 'h-6 w-6 border-2',
    medium: 'h-10 w-10 border-2',
    large: 'h-16 w-16 border-5'
  };

  const spinnerClasses = `animate-spin rounded-full ${sizeClasses[size]} border-t-transparent ${color}`;

  // If fullScreen is true, center the spinner in the viewport
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center z-50 font-[Satoshi-Regular]">
        <div className={spinnerClasses}></div>
        {text && <p className="mt-4 text-[#fff]">{text}</p>}
      </div>
    );
  }

  // Otherwise, render the spinner inline
  return (
    <div className="flex flex-col items-center justify-center font-[Satoshi-Regular]">
      <div className={spinnerClasses}></div>
      {text && <p className="mt-9  text-[#dadada] text-sm">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
