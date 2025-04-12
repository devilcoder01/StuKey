import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../components/page/Home";
import Mint from "../components/page/Mint";
import Landing from "../components/page/Landing";
import UserPage from "../components/page/UserPage";
import ThemeSettings from "../components/page/ThemeSettings";
import ProtectedRoute from "./ProtectedRoute";
import { useSignAuth } from "../context/authSingnatureContext";
import { useWallet } from "../context/WalletContext";

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useSignAuth();
  const { isConnected } = useWallet();
  const [isPermission, setIsPermission] = useState(false);

  useEffect(() => {
    if (isAuthenticated && isConnected) {
      setIsPermission(true);
    } else {
      setIsPermission(false);
    }
  }, [isAuthenticated, isConnected]);

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
      <Route
        path="/theme"
        element={
          <ProtectedRoute>
            <ThemeSettings />
          </ProtectedRoute>
        }
      />

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
