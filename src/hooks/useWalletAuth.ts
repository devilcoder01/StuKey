import { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { useAuth } from '../context/authContext';
import { signMessage } from '../utils/signmessage';
import { EIP6963ProviderDetail } from '../types/wallet.types';

export const useWalletAuth = () => {
  const { connectWallet, disconnectWallet, selectedWallet, userAccount } = useWallet();
  const { login, logout } = useAuth();

  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper to handle errors
  const handleError = (message: string) => {
    setIsSigningIn(false);
    setError(message);
    return false;
  };

  const connectAndSignIn = async (provider: EIP6963ProviderDetail) => {
    setIsSigningIn(true);
    setError(null);

    try {
      // 1. Connect Wallet
      await connectWallet(provider);

      if (!selectedWallet || !userAccount) {
        return handleError('Failed to connect wallet');
      }

      // 2. Sign Message
      const message = "Sign this message to verify ownership of this wallet.";
      const signature = await signMessage(selectedWallet, userAccount, message);

      if (typeof signature !== 'string') {
        return handleError('Failed to sign message');
      }

      // 3. Login (auth backend)
      await login(userAccount, signature);

      setIsSigningIn(false);
      return true;
    } catch (err) {
      return handleError(err instanceof Error ? err.message : 'Authentication failed');
    }
  };

  const signOut = async () => {
    try {
      logout();
      await disconnectWallet();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign out');
      return false;
    }
  };

  const clearError = () => setError(null);

  return {
    connectAndSignIn,
    signOut,
    isSigningIn,
    error,
    clearError,
  };
};
