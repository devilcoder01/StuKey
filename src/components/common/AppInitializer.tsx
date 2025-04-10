import React from 'react';
import { useAppInitialization } from '../../hooks/useAppInitialization';
import LoadingSpinner from './LoadingSpinner';

interface AppInitializerProps {
  children: React.ReactNode;
}

/**
 * Component that handles app initialization and shows a loading spinner
 * while the app is initializing
 */
const AppInitializer: React.FC<AppInitializerProps> = ({ children }) => {
  const { isInitializing } = useAppInitialization();

  if (isInitializing) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center z-50">
        <LoadingSpinner size="large" text="Loading your data..." />
      </div>
    );
  }

  return <>{children}</>;
};

export default AppInitializer;
