import { useState } from 'react';
import Providerlist from './Providerlist';

function Navbar() {
  const [showWalletPopup, setShowWalletPopup] = useState(false);
  
  return (
    <div>
      {/* Navigation */}
      <nav className="px-6 py-4 flex justify-between items-center max-w-7xl mx-auto mt-8">
        {/* Logo */}
        <div className="flex items-center w-44 overflow-hidden">
          <img src="/icon.svg" alt="logo" className="w-full h-full object-cover" />
        </div>

        {/* Navigation Links */}
        <div className="flex items-center space-x-15 text-lg">
          <a href="#" className="text-black font-medium">
            Home
          </a>
          <a href="#" className="text-black font-medium">
            About
          </a>
          <button
            className="bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-7 rounded-full cursor-pointer"
            onClick={() => setShowWalletPopup(true)}
          >
            Connect
          </button>
        </div>
      </nav>

      {/* Wallet Popup */}
      {showWalletPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
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