import React, { createContext, useContext, useEffect, useState } from "react";
import { useSyncProviders } from "../hooks/useSyncProviders";
import { EIP6963ProviderDetail } from "../types/wallet.types";

interface WalletState {
  isConnecting: boolean;
  error: string | null;
  userAccount: string | null;
  selectedWallet: EIP6963ProviderDetail | null;
  chainId: string | null;
}

interface WalletContextType extends WalletState {
  connectWallet: (providerWithInfo: EIP6963ProviderDetail) => Promise<void>;
  disconnectWallet: () => void;
  switchChain: (chainId: string) => Promise<boolean>;
  providers: ReturnType<typeof useSyncProviders>;
  clearError: () => void;
}

const initialState: WalletState = {
  isConnecting: false,
  error: null,
  userAccount: null,
  selectedWallet: null,
  chainId: null,
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<WalletState>(initialState);
  const providers = useSyncProviders();

  // Try to restore wallet connection from localStorage on mount
  useEffect(() => {
    const restoreWalletConnection = async () => {
      const savedWalletName = localStorage.getItem("selectedWallet");

      if (savedWalletName && providers.length > 0) {
        const savedProvider = providers.find(
          (provider) => provider.info.name === savedWalletName
        );

        if (savedProvider) {
          try {
            const accounts = (await savedProvider.provider.request({
              method: "eth_requestAccounts",
            })) as string[];

            if (accounts && accounts.length > 0) {
              const chainId = await savedProvider.provider.request({
                method: "eth_chainId",
              }) as string;

              setState({
                ...state,
                selectedWallet: savedProvider,
                userAccount: accounts[0],
                chainId,
              });
            }
          } catch (error) {
            console.error("Failed to restore wallet connection:", error);
            localStorage.removeItem("selectedWallet");
          }
        }
      }
    };

    restoreWalletConnection();
  }, [providers]);

  const connectWallet = async (providerWithInfo: EIP6963ProviderDetail) => {
    setState({
      ...state,
      isConnecting: true,
      error: null,
    });

    try {
      const accounts = (await providerWithInfo.provider.request({
        method: "eth_requestAccounts",
      })) as string[];

      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts found");
      }

      const chainId = await providerWithInfo.provider.request({
        method: "eth_chainId",
      }) as string;

      localStorage.setItem("selectedWallet", providerWithInfo.info.name);

      setState({
        isConnecting: false,
        error: null,
        selectedWallet: providerWithInfo,
        userAccount: accounts[0],
        chainId,
      });

      return accounts[0];
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      setState({
        ...state,
        isConnecting: false,
        error: error instanceof Error ? error.message : "Failed to connect wallet",
      });
    }
  };

  const disconnectWallet = async () => {
    try {
      if (state.selectedWallet) {
        // Some wallets support this method, but not all
        try {
          await state.selectedWallet.provider.request({
            method: "wallet_revokePermissions",
            params: [
              {
                eth_accounts: {},
              },
            ],
          });
        } catch (e) {
          // Ignore errors, as not all wallets support this method
        }
      }

      localStorage.removeItem("selectedWallet");
      setState(initialState);
    } catch (error) {
      console.error("Failed to disconnect wallet:", error);
      setState({
        ...state,
        error: error instanceof Error ? error.message : "Failed to disconnect wallet",
      });
    }
  };

  const switchChain = async (chainId: string): Promise<boolean> => {
    if (!state.selectedWallet) {
      setState({
        ...state,
        error: "No wallet connected",
      });
      return false;
    }

    try {
      await state.selectedWallet.provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId }],
      });

      setState({
        ...state,
        chainId,
      });

      return true;
    } catch (error) {
      console.error("Failed to switch chain:", error);
      setState({
        ...state,
        error: error instanceof Error ? error.message : "Failed to switch chain",
      });
      return false;
    }
  };

  const clearError = () => {
    setState({
      ...state,
      error: null,
    });
  };

  useEffect(() => {
    if (state.selectedWallet) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected their wallet
          disconnectWallet();
        } else {
          // User switched accounts
          setState({
            ...state,
            userAccount: accounts[0],
          });
        }
      };

      const handleChainChanged = (chainId: string) => {
        setState({
          ...state,
          chainId,
        });
      };

      const handleDisconnect = () => {
        disconnectWallet();
      };

      // Set up listeners
      state.selectedWallet.provider.on("accountsChanged", handleAccountsChanged);
      state.selectedWallet.provider.on("chainChanged", handleChainChanged);
      state.selectedWallet.provider.on("disconnect", handleDisconnect);

      // Cleanup listeners when selectedWallet changes or component unmounts
      return () => {
        state.selectedWallet.provider.removeListener("accountsChanged", handleAccountsChanged);
        state.selectedWallet.provider.removeListener("chainChanged", handleChainChanged);
        state.selectedWallet.provider.removeListener("disconnect", handleDisconnect);
      };
    }
  }, [state.selectedWallet]);

  return (
    <WalletContext.Provider
      value={{
        ...state,
        connectWallet,
        disconnectWallet,
        switchChain,
        providers,
        clearError,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};
