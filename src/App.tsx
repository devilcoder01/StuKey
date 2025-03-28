import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/page/Home";
import Mint from "./components/page/Mint";
import Landing from "./components/page/Landing";
import UserPage from "./components/page/UserPage";
import { WalletProvider } from "./context/WalletContext";

function App() {
  return (
    <WalletProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/mint" element={<Mint />} />
          <Route path="/home" element={<Home />} />
          <Route path="/user" element={<UserPage />} />
        </Routes>
      </Router>
    </WalletProvider>
  );
}

export default App;
