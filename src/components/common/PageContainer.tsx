import React, { useState, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface PageContainerProps {
  children: React.ReactNode;
  title?: string;
  loading?: boolean;
}

const PageContainer: React.FC<PageContainerProps> = ({ 
  children, 
  title,
  loading = false
}) => {
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate page loading
  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 500); // Short delay to show loading state
      
      return () => clearTimeout(timer);
    }
    
    setIsLoading(loading);
  }, [loading]);
  
  return (
    <div className="container mx-auto px-4 py-8">
      {title && (
        <h1 className="text-2xl font-bold mb-6">{title}</h1>
      )}
      
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <LoadingSpinner size="large" text="Loading content..." />
        </div>
      ) : (
        children
      )}
    </div>
  );
};

export default PageContainer;
