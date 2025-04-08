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

  const connectAndSignIn = async (providerWithInfo: EIP6963ProviderDetail) => {
    setError(null);
    setIsSigningIn(true);

    try {
      // First connect the wallet
      await connectWallet(providerWithInfo);

      if (!selectedWallet || !userAccount) {
        throw new Error('Failed to connect wallet');
      }

      // Prepare to sign message

      // Then sign the message
      const message = "Sign this message to verify ownership of this wallet.";
      const signature = await signMessage(selectedWallet, userAccount, message);

      if (typeof signature !== 'string') {
        throw new Error('Failed to sign message');
      }

      // Verify signature

      // Finally authenticate with the backend
      await login(userAccount, signature);

      setIsSigningIn(false);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
      setIsSigningIn(false);
      return false;
    }
  };

  const signOut = async () => {
    // Start sign out process
    try {
      // First log out from the auth context
      logout();

      // Then disconnect the wallet
      await disconnectWallet();

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign out');
      return false;
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    connectAndSignIn,
    signOut,
    isSigningIn,
    error,
    clearError,
  };
};
