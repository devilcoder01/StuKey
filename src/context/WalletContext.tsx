import React, { createContext, useContext, useState } from "react";
import { useSyncProviders } from "../hooks/useSyncProviders";

interface WalletContextType {
  userAccount: string | null;
  selectedWallet: EIP6963ProviderDetail | null;
  connectWallet: (providerWithInfo: EIP6963ProviderDetail) => Promise<void>;
  providers: ReturnType<typeof useSyncProviders>
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedWallet, setSelectedWallet] = useState<EIP6963ProviderDetail | null>(null);
  const [userAccount, setUserAccount] = useState<string | null>(null);
  const providers = useSyncProviders();

  const connectWallet = async (providerWithInfo: EIP6963ProviderDetail) => {
    try {
      const accounts = (await providerWithInfo.provider.request({
        method: "eth_requestAccounts",
      })) as string[];
      setSelectedWallet(providerWithInfo);
      setUserAccount(accounts?.[0]);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  return (
    <WalletContext.Provider value={{ userAccount, selectedWallet, connectWallet, providers }}>
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
