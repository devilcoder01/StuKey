import { BrowserRouter as Router } from "react-router-dom";
import { WalletProvider } from "./context/WalletContext";
import Navbar from "./components/layout/Navbar";
import { ToastProvider } from "./context/ToastContext";
import AppRoutes from "./routes";
import ToastContainer from "./components/common/ToastContainer";
import WalletConnectModal from "./components/common/WalletConnectModal";
import AppInitializer from "./components/common/AppInitializer";
import { AppInstructorProvider } from "./context/AppInstuctor";
import { StoreProvider } from "./context/StoreContext";
import FirstUser from "./components/common/FirstUser";
function App() {
  return (
    <WalletProvider>
      <AppInstructorProvider>
        <ToastProvider>
          <StoreProvider>
            <Router>
              <AppInitializer>
                <div className="flex flex-col min-h-screen">
                  <Navbar />
                  <main className="flex-grow">
                    <AppRoutes />
                  </main>
                  <FirstUser/>
                  <WalletConnectModal />
                  <ToastContainer />
                </div>
              </AppInitializer>
            </Router>
          </StoreProvider>
        </ToastProvider>
      </AppInstructorProvider>
    </WalletProvider>
  );
}

export default App;
