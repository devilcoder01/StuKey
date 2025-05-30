import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../components/page/Home";
import Mint from "../components/page/Mint";
import Landing from "../components/page/Landing";
import UserPage from "../components/page/UserPage";
import Store from "../components/page/Store";
import ProtectedRoute from "./ProtectedRoute";
import { useWallet } from "../context/WalletContext";
import { useAppInstuctor } from "../context/AppInstuctor";

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAppInstuctor();
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
        path="/store"
        element={
          <ProtectedRoute>
            <Store />
          </ProtectedRoute>
        }
      />

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
