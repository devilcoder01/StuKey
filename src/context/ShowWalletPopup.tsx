import { createContext, useContext, useState, ReactNode } from 'react';

interface ShowWalletPopupContextType {
  showWalletPopup: boolean;
  setShowWalletPopup: (show: boolean) => void;
}

const ShowWalletPopupContext = createContext<ShowWalletPopupContextType | undefined>(undefined);

export function ShowWalletPopupProvider({ children }: { children: ReactNode }) {
  const [showWalletPopup, setShowWalletPopup] = useState(false);

  return (
    <ShowWalletPopupContext.Provider value={{ showWalletPopup, setShowWalletPopup }}>
      {children}
    </ShowWalletPopupContext.Provider>
  );
}

export function useShowWalletPopup() {
  const context = useContext(ShowWalletPopupContext);
  if (context === undefined) {
    throw new Error('useShowWalletPopup must be used within a ShowWalletPopupProvider');
  }
  return context;
}
