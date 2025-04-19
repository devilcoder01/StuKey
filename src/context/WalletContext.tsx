import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useSyncProviders } from "../hooks/useSyncProviders";
import { EIP6963ProviderDetail } from "../types/wallet.types";
import { SUPPORTED_NETWORKS } from "../config/networks";
/**
 *
 *connectWallet,
  disconnectWallet,
  switchChain,
  clearError,
  providers,
  isWalletConnecting,
  error,
  userAccount,
  selectedWallet,
  chainId,
  isConnected

  👆 This all can be accessable anywhere in the components
 */


type WalletState = {
  isWalletConnecting: boolean;
  error: string | null;
  userAccount: string | null;
  selectedWallet: EIP6963ProviderDetail | null;
  chainId: string | null;
  isConnected: boolean;
};

type WalletContextType = WalletState & {
  connectWallet(provider: EIP6963ProviderDetail): Promise<void>;
  disconnectWallet(): void;
  switchChain(chainId: string): Promise<boolean>;
  clearError(): void;
  providers: ReturnType<typeof useSyncProviders>;
  setWalletStateData(walletState: Partial<WalletState>): void;
};

const defaultState: WalletState = {
  isWalletConnecting: false,
  error: null,
  userAccount: null,
  selectedWallet: null,
  chainId: null,
  isConnected: false
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<WalletState>(defaultState);
  const providers = useSyncProviders();

  // Restore saved wallet if available
  useEffect(() => {
    const tryRestoreWallet = async () => {
      const saved = localStorage.getItem("selectedWallet");
      if (!saved || providers.length === 0) return;

      const found = providers.find(p => p.info.name === saved);
      if (!found) return;

      try {
        const [account] = await found.provider.request({ method: "eth_requestAccounts" });
        const chainId = await found.provider.request({ method: "eth_chainId" });

        setState({
          ...defaultState,
          userAccount: account,
          selectedWallet: found,
          isConnected: true,
          chainId,
        });
      } catch {
        localStorage.removeItem("selectedWallet");
      }
    };
    tryRestoreWallet();
  }, [providers]);

  const setWalletStateData = (useCallback((walletState: Partial<WalletState>) => {
    setState(prev => ({ ...prev, ...walletState }));
  }, []));

  /**
   * Connects the wallet and saves the selected wallet in local storage.
   */
  const connectWallet = useCallback(async (provider: EIP6963ProviderDetail) => {
    setState(prev => ({ ...prev, isWalletConnecting: true, error: null }));

    try {
      const [account] = await provider.provider.request({ method: "eth_requestAccounts" });
      const chainId = await provider.provider.request({ method: "eth_chainId" });

      localStorage.setItem("selectedWallet", provider.info.name);
      setState({
        isWalletConnecting: false,
        error: null,
        userAccount: account,
        selectedWallet: provider,
        chainId,
        isConnected: true
      });
    } catch (err: any) {
      setState(prev => ({
        ...prev,
        isWalletConnecting: false,
        isConnected: false,
        error: err?.message || "Failed to connect wallet",
      }));
    }
  }, []);


  /**
   * Disconnects the wallet and clears the local storage.
   */
  const disconnectWallet = useCallback(async () => {
    try {
      if (state.selectedWallet) {
        try {
          await state.selectedWallet.provider.request({
            method: "wallet_revokePermissions",
            params: [{ eth_accounts: {} }],
          });
        } catch {}
      }
    } finally {
      localStorage.clear();
      setState(defaultState);
    }
  }, [state.selectedWallet]);

  /**
   * Switches the chain of the connected wallet.
   * If the chain doesn't exist in the wallet, it will attempt to add it.
   */
  const switchChain = useCallback(async (chainId: string) => {
    if (!state.selectedWallet) {
      setState(prev => ({ ...prev, error: "No wallet connected", isConnected: false }));
      return false;
    }

    try {
      // First try to switch to the chain
      await state.selectedWallet.provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId }],
      });

      setState(prev => ({ ...prev, chainId }));
      return true;
    } catch (err: any) {
      // If the error code is 4902, the chain is not added to the wallet
      if (err.code === 4902) {
        try {
          // Find the network configuration
          const networkConfig = SUPPORTED_NETWORKS.find(network => network.chainId === chainId);

          if (!networkConfig) {
            setState(prev => ({ ...prev, error: "Network configuration not found" }));
            return false;
          }

          // Request to add the chain to the wallet
          await state.selectedWallet.provider.request({
            method: "wallet_addEthereumChain",
            params: [{
              chainId: networkConfig.chainId,
              chainName: networkConfig.chainName,
              nativeCurrency: networkConfig.nativeCurrency,
              rpcUrls: networkConfig.rpcUrls,
              blockExplorerUrls: networkConfig.blockExplorerUrls
            }],
          });

          // After adding, try to switch again
          await state.selectedWallet.provider.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId }],
          });

          setState(prev => ({ ...prev, chainId }));
          return true;
        } catch (addError: any) {
          setState(prev => ({ ...prev, error: addError?.message || "Failed to add network" }));
          return false;
        }
      } else {
        const errorMessage = err?.message || "Chain switch failed";
        setState(prev => ({ ...prev, error: errorMessage }));
        return false;
      }
    }
  }, [state.selectedWallet]);

  const clearError = () => setState(prev => ({ ...prev, error: null }));


  /**
   * Listens for account and chain changes and updates the state accordingly.
   */
  useEffect(() => {
    const wallet = state.selectedWallet?.provider;
    if (!wallet) return;

    const onAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) disconnectWallet();
      else setState(prev => ({ ...prev, userAccount: accounts[0], isConnected: true }));
    };

    const onChainChanged = (chainId: string) => {
      console.log("Chain changed to", chainId);
      setState(prev => ({ ...prev, chainId }));
    };

    wallet.on("accountsChanged", onAccountsChanged);
    wallet.on("chainChanged", onChainChanged);
    wallet.on("disconnect", disconnectWallet);

    return () => {
      wallet.removeListener("accountsChanged", onAccountsChanged);
      wallet.removeListener("chainChanged", onChainChanged);
      wallet.removeListener("disconnect", disconnectWallet);
    };
  }, [state.selectedWallet, disconnectWallet]);

  return (
    <WalletContext.Provider value={{ ...state, connectWallet, disconnectWallet, switchChain, clearError, providers, setWalletStateData }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used inside WalletProvider");
  return ctx;
};
