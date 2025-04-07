import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/page/Home";
import Mint from "./components/page/Mint";
import Landing from "./components/page/Landing";
import UserPage from "./components/page/UserPage";
import { WalletProvider } from "./context/WalletContext";
import Navbar from "./components/ui/Navbar";
import { ShowWalletPopupProvider } from "./context/ShowWalletPopup";
import { AuthProvider, useAuth } from "./context/authContext";

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/mint" element={isAuthenticated ? <Mint /> : <Navigate to="/" />} />
      <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/" />} />
      <Route path="/user" element={isAuthenticated ? <UserPage /> : <Navigate to="/" />} />
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
