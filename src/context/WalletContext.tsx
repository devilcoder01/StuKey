import React, { createContext, useContext, useEffect, useState } from "react";
import { useSyncProviders } from "../hooks/useSyncProviders";

interface WalletContextType {
  userAccount: string | null;
  selectedWallet: EIP6963ProviderDetail | null;
  connectWallet: (providerWithInfo: EIP6963ProviderDetail) => Promise<void>;
  providers: ReturnType<typeof useSyncProviders>;
  disconnectWallet: (providerWithInfo: EIP6963ProviderDetail) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedWallet, setSelectedWallet] =
    useState<EIP6963ProviderDetail | null>(null);
  const [userAccount, setUserAccount] = useState<string | null>(null);
  const providers = useSyncProviders(); // Mutable variable

  const connectWallet = async (providerWithInfo: EIP6963ProviderDetail) => {
    try {
      const accounts = (await providerWithInfo.provider.request({
        method: "eth_requestAccounts",
      })) as string[];
      localStorage.setItem("selectedWallet", providerWithInfo.info.name);
      setSelectedWallet(providerWithInfo);
      setUserAccount(accounts?.[0]);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };
  const disconnectWallet = async (providerWithInfo: EIP6963ProviderDetail) => {
    try {
      await providerWithInfo.provider.request({
        method: "wallet_revokePermissions",
        params: [
          {
            eth_accounts: {},
          },
        ],
      });
      localStorage.removeItem("selectedWallet"); // Remove the selected wallet from localStorage
      setSelectedWallet(null);
      setUserAccount(null);
    } catch (error) {
      console.error("Failed to disconnect wallet:", error);
    }
  };
  useEffect(() => {
    if (selectedWallet) {
      const handleDisconnect = (accounts: string[]) => {
        setUserAccount(accounts.length > 0 ? accounts[0] : null);
        if (accounts.length === 0) {
          setSelectedWallet(null); // Optional: fully disconnect if no accounts
        }
      };

      // Set up the listener
      selectedWallet.provider.on("chainChanged", (chainID) =>{
        window.location.reload();
      });
      selectedWallet.provider.on("disconnect", handleDisconnect);

      // Cleanup listener when selectedWallet changes or component unmounts
      return () => {
        // selectedWallet.provider.removelistener("chainChanged");
        selectedWallet.provider.removeListener(
          "disconnect",
          handleDisconnect
        );
      };
    }
  }, [selectedWallet]);
  return (
    <WalletContext.Provider
      value={{
        userAccount,
        selectedWallet,
        connectWallet,
        providers,
        disconnectWallet,
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
