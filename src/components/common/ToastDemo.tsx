import React from 'react';
import { useToastNotification } from '../../hooks/useToastNotification';

/**
 * A demo component to showcase toast notifications
 */
const ToastDemo: React.FC = () => {
  const { showSuccess, showError, showWarning, showInfo } = useToastNotification();

  return (
    <div className="p-6 bg-[#1E1E1E] rounded-lg shadow-md text-white">
      <h2 className="text-xl font-semibold mb-4">Toast Notification Demo</h2>
      <p className="mb-4 text-gray-300">
        Click the buttons below to see different types of toast notifications.
      </p>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => showSuccess('Success! Your action was completed.')}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        >
          Success Toast
        </button>
        <button
          onClick={() => showError('Error! Something went wrong.')}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Error Toast
        </button>
        <button
          onClick={() => showWarning('Warning! This action may have consequences.')}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
        >
          Warning Toast
        </button>
        <button
          onClick={() => showInfo('Info: This is a helpful message.')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Info Toast
        </button>
        <button
          onClick={() => {
            // Show multiple toasts in sequence
            showInfo('Starting a sequence of operations...');

            setTimeout(() => {
              showWarning('Processing your request...');
            }, 1000);

            setTimeout(() => {
              showSuccess('All operations completed successfully!');
            }, 2000);
          }}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
        >
          Toast Sequence
        </button>
      </div>
    </div>
  );
};

export default ToastDemo;
