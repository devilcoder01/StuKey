import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "../../context/WalletContext";
import { useShowWalletPopup } from "../../context/ShowWalletPopup";
import { useAuth } from "../../context/authContext";
import { useWalletAuth } from "../../hooks/useWalletAuth";
import LoadingSpinner from "../common/LoadingSpinner";

function Navbar() {
  const { showWalletPopup, setShowWalletPopup } = useShowWalletPopup();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { userAccount, selectedWallet, isConnecting } = useWallet();
  const { signOut, isSigningIn } = useWalletAuth();
  const [buttonText, setButtonText] = useState("Connect");
  const navigate = useNavigate();

  // Format address for display (e.g., 0x1234...5678)
  const formatAddress = (address: string | null) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  useEffect(() => {
    if (selectedWallet && isAuthenticated) {
      setButtonText("Disconnect");
    } else {
      setButtonText("Connect");
    }
  }, [selectedWallet, isAuthenticated]);

  const handleWalletAction = async () => {
    if (isAuthenticated && selectedWallet) {
      await signOut();
      navigate("/");
    } else {
      setShowWalletPopup(true);
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 cursor-pointer" onClick={() => navigate("/")}>
              <h1 className="text-xl font-bold">StuNFT</h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated && (
              <>
                <button
                  onClick={() => navigate("/home")}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Home
                </button>
                <button
                  onClick={() => navigate("/mint")}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Mint
                </button>
                <button
                  onClick={() => navigate("/user")}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Profile
                </button>
              </>
            )}

            {isAuthenticated && userAccount && (
              <div className="text-sm text-gray-600 mr-2">
                {formatAddress(userAccount)}
              </div>
            )}

            <button
              onClick={handleWalletAction}
              disabled={isConnecting || isSigningIn || authLoading}
              className="bg-[#2B2928] px-7 py-2 rounded-full text-white flex justify-center items-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {(isConnecting || isSigningIn || authLoading) ? (
                <div className="flex items-center">
                  <LoadingSpinner size="small" color="border-white" />
                  <span className="ml-2">{buttonText}</span>
                </div>
              ) : (
                buttonText
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
