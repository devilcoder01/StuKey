import React, {
  useEffect,
} from "react";
import {
  clearAuthState,
  getAuthState,
  saveAuthState,
  verifySignature,
} from "../services/auth.service";
import { useAppInstuctor } from "../context/AppInstuctor";

/**
 * login, logout, user, error, isAuthenticated from bakend side
 */




export const useSignAuth = () => {
  const {setAppInstructorData} = useAppInstuctor();

  // Check for existing auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authState = getAuthState();

        if (authState) {
          setAppInstructorData({
            isAuthenticated: true,
            isAuthPending: false,
            isInitializing: false,
            error: null,
          });
        } else {
          setAppInstructorData({
            isAuthPending: false,
            isInitializing: false,
            
          });
        }
      } catch (error) {
        setAppInstructorData({
          isAuthenticated: false,
          isAuthPending: false,
          isInitializing: false,
          error: "Failed to restore authentication session",
        });
      }
    };

    checkAuth();
  }, []);

  const login = async (address: string, signature: string) => {
    setAppInstructorData({
      isAuthPending: true,
      error: null,
    });

    try {
      const message = "Sign this message to verify ownership of this wallet.";
      const result = await verifySignature(message, signature, address);

      if (result.success) {
        // Save auth state to localStorage
        saveAuthState(address, signature);

        setAppInstructorData({
          isAuthenticated: true,
          isAuthPending: false,
          error: null,
        });
      } else {
        setAppInstructorData({
          isAuthenticated: false,
          isAuthPending: false,
          error: "Authentication failed",
        });
      }
    } catch (error) {
      setAppInstructorData({
        isAuthenticated: false,
        isAuthPending: false,
        error: "Authentication failed",
      });
    }
  };

  const logout = () => {
    clearAuthState();
    setAppInstructorData({
      isAuthenticated: false,
      isAuthPending: false,
      error: null,
    });
  };

  const clearError = () => {
    setAppInstructorData({
      error: null,
    });
  };

  return {
    login,
    logout,
    clearError,
  };
};

