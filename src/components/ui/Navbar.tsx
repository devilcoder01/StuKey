import Providerlist from './Providerlist';
import { useShowWalletPopup } from '../../context/ShowWalletPopup';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import { useEffect, useState } from 'react';
import { useWallet } from '../../context/WalletContext';


function Navbar() {
  const { showWalletPopup, setShowWalletPopup } = useShowWalletPopup();
  const { isAuthenticated , setIsAuthenticated } = useAuth();
  const [isConnect, setIsConnect] = useState("Connect"); // Fix destructuring
  const navigate = useNavigate();
  const { selectedWallet, disconnectWallet} = useWallet();

  useEffect(() => {
    if (selectedWallet) {
      setIsConnect("Disconnect");
      setIsAuthenticated(true)
    } else {
      setIsConnect("Connect");
      // setShowWalletPopup(true)
      setIsAuthenticated(false)
    }
  }, [selectedWallet]); // Ensure state updates when `isAuthenticated` changes

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div>
      {/* Navigation */}
      <nav className="px-6 py-4 flex justify-between items-center max-w-7xl mx-auto mt-8">
        {/* Logo */}
        <div className="flex items-center w-44 overflow-hidden">
          <img src="/icon.svg" alt="logo" className="w-full h-full object-cover" />
        </div>

        {/* Navigation Links */}
        <div className="flex items-center space-x-10 text-lg">
          {/* <div className="text-black font-medium cursor-pointer" onClick={() => navigate('/home')}>
            Home
          </div>
          <div className="text-black font-medium cursor-pointer">
            About
          </div> */}
          <button
            className="bg-red-500 hover:bg-red-600 text-white font-medium h-12 px-7 rounded-full cursor-pointer"
            // onClick={() => handleWalletConnect()}
            onClick={() => {
              if (selectedWallet) {
                disconnectWallet(selectedWallet);
              } else {
                setShowWalletPopup(true);
              }
            }}
          >
            {isConnect}
          </button>
          <div className='h-12 w-12 rounded-full bg-amber-500 cursor-pointer'>

          </div>
        </div>
      </nav>

      {/* Wallet Popup */}
      {showWalletPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer"
              onClick={() => setShowWalletPopup(false)}
            >
              ✕
            </button>
            <Providerlist/>
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;