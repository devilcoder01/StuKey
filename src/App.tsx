import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./components/page/Home";
import Mint from "./components/page/Mint";
import Landing from "./components/page/Landing";
import UserPage from "./components/page/UserPage";
import { useWallet, WalletProvider } from "./context/WalletContext";
import Navbar from "./components/ui/Navbar";
import { ShowWalletPopupProvider } from "./context/ShowWalletPopup";
import { AuthProvider, useAuth } from "./context/authContext";
import { useEffect } from "react";

function AppRoutes() {
  const { isAuthenticated } = useAuth();
  const { userAccount, connectWallet, providers } = useWallet();

  const CheckPreviousWalletConnection = async () => {
    const preprovider = localStorage.getItem("selectedWallet");
    if (preprovider && providers.length > 0) {  
      for (const provider of providers) {
        if (provider.info.name === preprovider) {
          // Check connection
          const account = await provider.provider.request({ method: "eth_accounts" });
          await connectWallet(provider);

        }
      }
  }};

  useEffect(() => {
    CheckPreviousWalletConnection();
  });


  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route
        path="/mint"
        element={isAuthenticated ? <Mint /> : <Navigate to="/" />}
      />
      <Route
        path="/home"
        element={isAuthenticated ? <Home /> : <Navigate to="/" />}
      />
      <Route
        path="/user"
        element={isAuthenticated ? <UserPage /> : <Navigate to="/" />}
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <ShowWalletPopupProvider>
        <WalletProvider>
          <Router>
            <Navbar />
            <AppRoutes />
          </Router>
        </WalletProvider>
      </ShowWalletPopupProvider>
    </AuthProvider>
  );
}

export default App;
