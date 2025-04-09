import { BrowserRouter as Router } from "react-router-dom";
import { WalletProvider } from "./context/WalletContext";
import Navbar from "./components/layout/Navbar";
import { ShowWalletPopupProvider } from "./context/ShowWalletPopup";
import { AuthProvider } from "./context/authContext";
import { ToastProvider } from "./context/ToastContext";
import AppRoutes from "./routes";
import WalletConnectModal from "./components/common/WalletConnectModal";
import ToastContainer from "./components/common/ToastContainer";

function App() {
  return (
    <AuthProvider>
      <WalletProvider>
        <ShowWalletPopupProvider>
          <ToastProvider>
            <Router>
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow">
                  <AppRoutes />
                </main>
                <WalletConnectModal />
                <ToastContainer />
              </div>
            </Router>
          </ToastProvider>
        </ShowWalletPopupProvider>
      </WalletProvider>
    </AuthProvider>
  );
}

export default App;
