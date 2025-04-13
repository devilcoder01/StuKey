import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "../../context/WalletContext";
import { useWalletAuth } from "../../hooks/useWalletAuth";
import LoadingSpinner from "../common/LoadingSpinner";
import { formatAddress } from "../../utils"; // Use shared function
import { useAppInstuctor } from "../../context/AppInstuctor";

function Navbar() {
  const { isAuthenticated, isAuthPending, setAppInstructorData } = useAppInstuctor();
  const { userAccount, isWalletConnecting, isConnected } = useWallet();
  const { signOut } = useWalletAuth();
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
      setAppInstructorData({
        showWalletpopUp : true
      })
    }
  };

  return (
    <nav className="bg-white ">
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
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 cursor-pointer "
                >
                  Home
                </button>
                <button
                  onClick={() => navigate("/mint")}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 cursor-pointer"
                >
                  Mint
                </button>
                <button
                  onClick={() => navigate("/user")}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 cursor-pointer"
                >
                  Profile
                </button>
              </>
            )}

            <button
              onClick={handleWalletAction}
              disabled={isWalletConnecting || isAuthPending}
              className="bg-[#2B2928] px-5 h-11 rounded-full text-white flex justify-center items-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
            {isAuthenticated && isConnected && (
              <div className="text-sm text-gray-600 mr-2">
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
