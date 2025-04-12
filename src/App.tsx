import { BrowserRouter as Router } from "react-router-dom";
import { WalletProvider } from "./context/WalletContext";
import Navbar from "./components/layout/Navbar";
import { ShowWalletPopupProvider } from "./context/ShowWalletPopup";
import { AuthProvider } from "./context/authSingnatureContext";
import { ToastProvider } from "./context/ToastContext";
import AppRoutes from "./routes";
import ToastContainer from "./components/common/ToastContainer";
import { UserInormationProvider } from "./context/userInformation";
import WalletConnectModal from "./components/common/WalletConnectModal";
import AppInitializer from "./components/common/AppInitializer";
import { ThemeProvider } from "./context/Themeprovider";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <WalletProvider>
          <ShowWalletPopupProvider>
            <ToastProvider>
              <UserInormationProvider>
                <Router>
                  <AppInitializer>
                    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark transition-colors duration-200">
                      <Navbar />
                      <main className="flex-grow">
                        <AppRoutes />
                      </main>
                      <WalletConnectModal />
                      <ToastContainer />
                    </div>
                  </AppInitializer>
                </Router>
              </UserInormationProvider>
            </ToastProvider>
          </ShowWalletPopupProvider>
        </WalletProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
