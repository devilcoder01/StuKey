import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

interface AuthContextProps {
  user: any;
  isAuthenticated: boolean;
  loginWithWallet: (address: string, signature: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyUser = async () => {
      if (!token) {
        setIsAuthenticated(false);
        console.log("User is not authenticated");
        return;
      }
      try {
        const response = await axios.get("/api/auth/verify", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 200) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Token verification failed", error);
        setIsAuthenticated(false);
        localStorage.removeItem("token");
      }
    };

    verifyUser();
  }, []);

  useEffect(() => {
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete axios.defaults.headers.common['Authorization'];
    }
  }, []);

  const loginWithWallet = async (address: string, signature: string) => {
    try {
      const response = await axios.post('/api/auth/wallet', { address, signature });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
      setIsAuthenticated(true);
      navigate('/dashboard');
    } catch (error) {
      console.error('Wallet login failed', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
        await axios.post('/api/auth/logout');
        localStorage.removeItem('token'); // Remove the token
        setUser(null);
        setIsAuthenticated(false);
        navigate('/login');
    } catch (error) {
        console.error('Logout failed', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loginWithWallet, logout }}>
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
