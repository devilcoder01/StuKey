import React from 'react';
import { useTheme } from '../../context/Themeprovider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon, faCircleCheck } from '@fortawesome/free-solid-svg-icons';

const ThemeSettings: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-text-light dark:text-text-dark">Theme Settings</h1>
      
      <div className="bg-background-light dark:bg-background-dark border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm mb-8 transition-colors duration-200">
        <h2 className="text-xl font-semibold mb-4 text-text-light dark:text-text-dark">Choose Theme</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Light Theme Option */}
          <div 
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 flex items-center
              ${theme === 'light' 
                ? 'border-accent-light bg-accent-light/10' 
                : 'border-gray-200 dark:border-gray-700 hover:border-accent-light dark:hover:border-accent-dark'
              }`}
            onClick={() => setTheme('light')}
          >
            <div className="bg-white rounded-full p-3 mr-4 shadow-sm">
              <FontAwesomeIcon icon={faSun} className="text-yellow-500 text-xl" />
            </div>
            <div className="flex-grow">
              <h3 className="font-medium text-text-light dark:text-text-dark">Light Theme</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Bright and clean interface</p>
            </div>
            {theme === 'light' && (
              <FontAwesomeIcon icon={faCircleCheck} className="text-accent-light text-xl" />
            )}
          </div>
          
          {/* Dark Theme Option */}
          <div 
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 flex items-center
              ${theme === 'dark' 
                ? 'border-accent-dark bg-accent-dark/10' 
                : 'border-gray-200 dark:border-gray-700 hover:border-accent-light dark:hover:border-accent-dark'
              }`}
            onClick={() => setTheme('dark')}
          >
            <div className="bg-gray-800 rounded-full p-3 mr-4 shadow-sm">
              <FontAwesomeIcon icon={faMoon} className="text-indigo-300 text-xl" />
            </div>
            <div className="flex-grow">
              <h3 className="font-medium text-text-light dark:text-text-dark">Dark Theme</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Easy on the eyes at night</p>
            </div>
            {theme === 'dark' && (
              <FontAwesomeIcon icon={faCircleCheck} className="text-accent-dark text-xl" />
            )}
          </div>
        </div>
      </div>
      
      {/* Theme Preview */}
      <div className="bg-background-light dark:bg-background-dark border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm transition-colors duration-200">
        <h2 className="text-xl font-semibold mb-4 text-text-light dark:text-text-dark">Theme Preview</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Colors */}
          <div>
            <h3 className="font-medium mb-3 text-text-light dark:text-text-dark">Colors</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-12 h-6 bg-primary-light dark:bg-primary-dark rounded mr-2"></div>
                <span className="text-sm text-text-light dark:text-text-dark">Primary</span>
              </div>
              <div className="flex items-center">
                <div className="w-12 h-6 bg-secondary-light dark:bg-secondary-dark rounded mr-2"></div>
                <span className="text-sm text-text-light dark:text-text-dark">Secondary</span>
              </div>
              <div className="flex items-center">
                <div className="w-12 h-6 bg-accent-light dark:bg-accent-dark rounded mr-2"></div>
                <span className="text-sm text-text-light dark:text-text-dark">Accent</span>
              </div>
              <div className="flex items-center">
                <div className="w-12 h-6 bg-error-light dark:bg-error-dark rounded mr-2"></div>
                <span className="text-sm text-text-light dark:text-text-dark">Error</span>
              </div>
              <div className="flex items-center">
                <div className="w-12 h-6 bg-warning-light dark:bg-warning-dark rounded mr-2"></div>
                <span className="text-sm text-text-light dark:text-text-dark">Warning</span>
              </div>
              <div className="flex items-center">
                <div className="w-12 h-6 bg-info-light dark:bg-info-dark rounded mr-2"></div>
                <span className="text-sm text-text-light dark:text-text-dark">Info</span>
              </div>
            </div>
          </div>
          
          {/* UI Elements */}
          <div>
            <h3 className="font-medium mb-3 text-text-light dark:text-text-dark">UI Elements</h3>
            <div className="space-y-4">
              <button className="bg-primary-light dark:bg-primary-dark text-background-light dark:text-background-dark px-4 py-2 rounded-md">
                Primary Button
              </button>
              <div className="flex space-x-2">
                <button className="bg-accent-light dark:bg-accent-dark text-white px-3 py-1 rounded-md text-sm">
                  Accept
                </button>
                <button className="bg-error-light dark:bg-error-dark text-white px-3 py-1 rounded-md text-sm">
                  Decline
                </button>
              </div>
              <div className="p-3 bg-info-light/10 dark:bg-info-dark/10 border-l-4 border-info-light dark:border-info-dark rounded-r-md">
                <p className="text-sm text-text-light dark:text-text-dark">This is an info message</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeSettings;
