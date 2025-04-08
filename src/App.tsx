import { BrowserRouter as Router } from "react-router-dom";
import { WalletProvider } from "./context/WalletContext";
import Navbar from "./components/layout/Navbar";
import { ShowWalletPopupProvider } from "./context/ShowWalletPopup";
import { AuthProvider } from "./context/authContext";
import AppRoutes from "./routes";
import WalletConnectModal from "./components/common/WalletConnectModal";

function App() {
  return (
    <AuthProvider>
      <WalletProvider>
        <ShowWalletPopupProvider>
          <Router>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">
                <AppRoutes />
              </main>
              <WalletConnectModal />
            </div>
          </Router>
        </ShowWalletPopupProvider>
      </WalletProvider>
    </AuthProvider>
  );
}

export default App;
