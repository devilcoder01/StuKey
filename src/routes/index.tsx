import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../components/page/Home';
import Mint from '../components/page/Mint';
import Landing from '../components/page/Landing';
import UserPage from '../components/page/UserPage';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../context/authContext';
import { useWalletAuth } from '../hooks/useWalletAuth';

const AppRoutes: React.FC = () => {
  const {isSigningIn} = useWalletAuth();
  const { isAuthenticated } = useAuth();
  const [isPermission, setIsPermission] = useState(false);
  useEffect(() => {
    if(isAuthenticated && isSigningIn){
      setIsPermission(true);
    }
    else{
      setIsPermission(false);
    }
  }
  , [isAuthenticated, isSigningIn]);

  return (
    <Routes>
      {/* Public routes */}
      <Route 
        path="/" 
        element={isPermission ? <Navigate to="/home" /> : <Landing />} 
      />
      
      {/* Protected routes */}
      <Route 
        path="/home" 
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/mint" 
        element={
          <ProtectedRoute>
            <Mint />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/user" 
        element={
          <ProtectedRoute>
            <UserPage />
          </ProtectedRoute>
        } 
      />
      
      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
