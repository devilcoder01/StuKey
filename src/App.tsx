import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/page/Home";
import Mint from "./components/page/Mint";
import Landing from "./components/page/Landing";
import UserPage from "./components/page/UserPage";
import { useWallet, WalletProvider } from "./context/WalletContext";
import Navbar from "./components/ui/Navbar";
import { ShowWalletPopupProvider } from "./context/ShowWalletPopup";
import { AuthProvider, useAuth } from "./context/authContext";

function App() {
  return (
    <AuthProvider>
      <ShowWalletPopupProvider>
        <WalletProvider>
          <Router>
            <Navbar />
            <Routes >
              <Route path="/" element={<Landing />} />
              <Route path="/mint" element={<Mint />} />
              <Route path="/home" element={<Home />} />
              <Route path="/user" element={<UserPage />} />
            </Routes>
          </Router>
        </WalletProvider>
      </ShowWalletPopupProvider>
    </AuthProvider>
  );
}

export default App;
