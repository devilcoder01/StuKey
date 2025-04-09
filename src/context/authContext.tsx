import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { clearAuthState, getAuthState, saveAuthState, verifySignature } from "../services/auth.service";

/**
 * login, logout, user, error, isAuthenticated from bakend side
 */
interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  user: {
    address: string | null;
    signature?: string | null;
  } | null;
}

interface AuthContextProps extends AuthState {
  login: (address: string, signature: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: true,
  error: null,
  user: null,
};

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>(initialState);

  // Check for existing auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authState = getAuthState();

        if (authState) {
          setState({
            isAuthenticated: true,
            isLoading: false,
            error: null,
            user: {
              address: authState.address,
              signature: authState.signature,
            },
          });
        } else {
          setState({
            ...initialState,
            isLoading: false,
          });
        }
      } catch (error) {
        setState({
          isAuthenticated: false,
          isLoading: false,
          error: 'Failed to restore authentication session',
          user: null,
        });
      }
    };

    checkAuth();
  }, []);

  const login = async (address: string, signature: string) => {
    setState({
      ...state,
      isLoading: true,
      error: null,
    });

    try {
      const message = "Sign this message to verify ownership of this wallet.";
      const result = await verifySignature(message, signature, address);

      if (result.success) {
        // Save auth state to localStorage
        saveAuthState(address, signature);

        setState({
          isAuthenticated: true,
          isLoading: false,
          error: null,
          user: {
            address,
            signature,
          },
        });
      } else {
        setState({
          isAuthenticated: false,
          isLoading: false,
          error: 'Authentication failed',
          user: null,
        });
      }
    } catch (error) {
      setState({
        isAuthenticated: false,
        isLoading: false,
        error: 'Authentication failed',
        user: null,
      });
    }
  };

  const logout = () => {
    clearAuthState();
    setState({
      isAuthenticated: false,
      isLoading: false,
      error: null,
      user: null,
    });
  };

  const clearError = () => {
    setState({
      ...state,
      error: null,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
