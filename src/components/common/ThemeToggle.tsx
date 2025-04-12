import React from 'react';
import { useTheme } from '../../context/Themeprovider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-full transition-colors duration-200 ${className} ${
        theme === 'dark' 
          ? 'bg-secondary-dark text-background-dark hover:bg-secondary-dark/80' 
          : 'bg-secondary-light text-background-light hover:bg-secondary-light/80'
      }`}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <FontAwesomeIcon 
        icon={theme === 'light' ? faMoon : faSun} 
        className="w-5 h-5" 
      />
    </button>
  );
};

export default ThemeToggle;
