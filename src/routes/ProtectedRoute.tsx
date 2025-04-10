import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSignAuth } from '../context/authSingnatureContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectPath = '/'
}) => {
  const { isAuthenticated, isAuthPending } = useSignAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (isAuthPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="large" text="Verifying authentication..." />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // Render children if authenticated
  return <>{children}</>;
};

export default ProtectedRoute;
