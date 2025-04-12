import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "../../context/WalletContext";
import { useShowWalletPopup } from "../../context/ShowWalletPopup";
import { useSignAuth } from "../../context/authSingnatureContext";
import { useWalletAuth } from "../../hooks/useWalletAuth";
import LoadingSpinner from "../common/LoadingSpinner";
import { formatAddress } from "../../utils"; // Use shared function
import ThemeToggle from "../common/ThemeToggle";
import { useTheme } from "../../context/Themeprovider";

function Navbar() {
  const { setShowWalletPopup } = useShowWalletPopup();
  const { isAuthenticated, isAuthPending } = useSignAuth();
  const { userAccount, isWalletConnecting, isConnected } = useWallet();
  const { signOut } = useWalletAuth();
  const { theme } = useTheme();
  const [buttonText, setButtonText] = useState("Connect");
  const navigate = useNavigate();

  useEffect(() => {
    console.log(isWalletConnecting, isAuthenticated)
    if (isConnected ) {
      setButtonText("Disconnect");
    } else {
      setButtonText("Connect");
    };

  }, [isConnected, isAuthenticated]);

  const handleWalletAction = async () => {
    if (isConnected) {
      await signOut();
      navigate("/");
    } else {
      setShowWalletPopup(true);
    }
  };

  return (
    <nav className="bg-background-light dark:bg-background-dark border-b border-gray-200 dark:border-gray-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex items-center w-44 overflow-hidden cursor-pointer">
              <img
                src="/icon.svg"
                alt="logo"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="flex items-center space-x-5">
            {isAuthenticated && isConnected && (
              <>
                <button
                  onClick={() => navigate("/home")}
                  className="px-3 py-2 rounded-md text-sm font-medium text-text-light dark:text-text-dark hover:text-primary-light dark:hover:text-primary-dark cursor-pointer transition-colors duration-200"
                >
                  Home
                </button>
                <button
                  onClick={() => navigate("/mint")}
                  className="px-3 py-2 rounded-md text-sm font-medium text-text-light dark:text-text-dark hover:text-primary-light dark:hover:text-primary-dark cursor-pointer transition-colors duration-200"
                >
                  Mint
                </button>
                <button
                  onClick={() => navigate("/user")}
                  className="px-3 py-2 rounded-md text-sm font-medium text-text-light dark:text-text-dark hover:text-primary-light dark:hover:text-primary-dark cursor-pointer transition-colors duration-200"
                >
                  Profile
                </button>
                <button
                  onClick={() => navigate("/theme")}
                  className="px-3 py-2 rounded-md text-sm font-medium text-text-light dark:text-text-dark hover:text-primary-light dark:hover:text-primary-dark cursor-pointer transition-colors duration-200"
                >
                  Theme
                </button>
              </>
            )}

            <button
              onClick={handleWalletAction}
              disabled={isWalletConnecting || isAuthPending}
              className="bg-primary-light dark:bg-primary-dark px-5 h-11 rounded-full text-background-light dark:text-background-dark flex justify-center items-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isWalletConnecting || isAuthPending ? (
                <div className="flex items-center">
                  <LoadingSpinner size="small" color="border-white" />
                  <span className="ml-2">{buttonText}</span>
                </div>
              ) : (
                buttonText
              )}
            </button>
            {/* Theme Toggle Button */}
            <ThemeToggle className="ml-2" />

            {isAuthenticated && isConnected && (
              <div className="text-sm text-text-light dark:text-text-dark mr-2">
                {/* {formatAddress(userAccount)} */}
                <div className="h-11 w-11 rounded-full bg-amber-500 cursor-pointer"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
