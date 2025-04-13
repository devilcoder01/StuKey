import { useState } from "react";
import { useWallet } from "../context/WalletContext";
import { useSignAuth } from "./useSignAuth";
import { signMessage } from "../utils/signmessage";
import { EIP6963ProviderDetail } from "../types/wallet.types";
import { useToastNotification } from "./useToastNotification";

export const useWalletAuth = () => {
  const { connectWallet, disconnectWallet, selectedWallet, userAccount } =
    useWallet();
  const { login, logout } = useSignAuth();
  const [error, setError] = useState<string | null>(null);
  const { showSuccess, showError, showInfo } = useToastNotification();

  // Helper to handle errors
  const handleError = (message: string) => {
    setError(message);
    return false;
  };

  const walletConnect = async (provider: EIP6963ProviderDetail) => {
    try {
      await connectWallet(provider);
      showSuccess("Wallet connected successfully!");
      return true;
    } catch (err) {
      showError("Failed to connect wallet");
      setError(err instanceof Error ? err.message : "Failed to connect wallet");
    }
  };

  const signinMessage = async () => {
    try {
      if (!selectedWallet || !userAccount) {
        return handleError("Failed to connect wallet");
      }

      // 2. Sign Message
      const message = "Sign this message to verify ownership of this wallet.";
      const signature = await signMessage(selectedWallet, userAccount, message);

      if (typeof signature !== "string") {
        
        return handleError("Failed to sign message");
      }
    

      // 3. Login (auth backend)
      await login(userAccount, signature);
      showSuccess("Authenticated successfully!");

      return true;
    } catch (err) {
      showError("Failed to sign the message");
      return handleError(
        err instanceof Error ? err.message : "Fail to sign the message"
      );
    }
  };

  const connectAndSignIn = async (provider: EIP6963ProviderDetail) => {
    setError(null);

    try {
      // 1. Connect Wallet
      await connectWallet(provider);

      if (!selectedWallet || !userAccount) {
        return handleError("Failed to connect wallet");
      }

      // 2. Sign Message
      const message = "Sign this message to verify ownership of this wallet.";
      const signature = await signMessage(selectedWallet, userAccount, message);

      if (typeof signature !== "string") {
        return handleError("Failed to sign message");
      }

      // 3. Login (auth backend)
      await login(userAccount, signature);

      return true;
    } catch (err) {
      return handleError(
        err instanceof Error ? err.message : "Authentication failed"
      );
    }
  };

  const signOut = async () => {
    try {
      logout();
      await disconnectWallet();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign out");
      return false;
    }
  };

  const clearError = () => setError(null);

  return {
    connectAndSignIn,
    signOut,
    error,
    clearError,
    walletConnect,
    signinMessage,
  };
};
