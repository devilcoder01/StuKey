import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "../../context/WalletContext";
import { useWalletAuth } from "../../hooks/useWalletAuth";
import LoadingSpinner from "../common/LoadingSpinner";
import { useAppInstuctor } from "../../context/AppInstuctor";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {SUPPORTED_NETWORKS, NetworkConfig} from "../../config/networks";
import { useToastNotification } from "../../hooks/useToastNotification";

function Navbar() {
  const { isAuthenticated, isAuthPending, setAppInstructorData } =
    useAppInstuctor();
  const { isWalletConnecting, isConnected, switchChain, chainId, error } = useWallet();
  const { signOut } = useWalletAuth();
  const [buttonText, setButtonText] = useState("Connect");
  const navigate = useNavigate();
  const [networkName, setNetworkName] = useState<string>("Ethereum Mainnet");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { showInfo, showSuccess, showError } = useToastNotification();

  // Refs for GSAP animations
  const logoRef = useRef(null);
  const buttonRef = useRef(null);
  const navRef = useRef(null);

  useEffect(() => {
    if (isConnected) {
      setButtonText("Disconnect");
      currentNetwork();
    } else {
      navigate("/");
      setButtonText("Connect");
    }
  }, [isConnected, isAuthenticated]);

  // Show error messages from wallet context
  useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error, showError]);


  const handleWalletAction = async () => {
    if (isConnected) {
      await signOut();
      navigate("/");
    } else {
      setAppInstructorData({
        showWalletpopUp: true,
      });
    }
  };
  const currentNetwork = async () => {
    if (!chainId) return;
    const network = SUPPORTED_NETWORKS.find((n) => n.chainId === chainId);
    if (network) {
      setNetworkName(network.chainName);
    } else if(!network) {
      console.log(network,chainId);
      setNetworkName("Unknown Network");
    }
  };
  function handleChainSelect(network: NetworkConfig): void {
    console.log(`Selected chain: ${network.chainName}`);
    showInfo(`Switching to ${network.chainName}...`);
    setNetworkName(network.chainName);
    switchChain(network.chainId)
      .then(success => {
        if (success) {
          showSuccess(`Successfully switched to ${network.chainName}`);
        }
      });
    setDropdownOpen(false); // Close the dropdown after selecting a chain
  }

  // Use GSAP animations
  useGSAP(() => {
    const tl = gsap.timeline();

    // Animate the logo
    tl.from(logoRef.current, {
      opacity: 0,
      scale: 0.8,
      duration: 0.8,
      ease: "power3.out",
    });

    // Animate the navigation bar
    tl.from(
      navRef.current,
      {
        y: -50,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
      },
      "-=0.4"
    );

    // Animate the button
    tl.from(
      buttonRef.current,
      {
        scale: 0.8,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
      },
      "-=0.3"
    );
  }, [logoRef, buttonRef, navRef]);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-[#121212]" ref={navRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div
              className="flex items-center w-32 sm:w-44 overflow-hidden cursor-pointer"
              ref={logoRef}
              onClick={() => isAuthenticated && navigate("/home")}
            >
              <img
                src="/white-icon.svg"
                alt="logo"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Mobile menu button */}
          {isAuthenticated && isConnected && (
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-300 hover:text-white p-2"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          )}

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-5">
            {isAuthenticated && isConnected && (
              <>
                <button
                  onClick={() => navigate("/home")}
                  className="px-3 py-2 rounded-md text-sm font-satoshi-medium text-gray-300 hover:text-white cursor-pointer transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
                >
                  Home
                </button>
                <button
                  onClick={() => navigate("/mint")}
                  className="px-3 py-2 rounded-md text-sm font-satoshi-medium text-gray-300 hover:text-white cursor-pointer transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
                >
                  Mint
                </button>
                <button
                  onClick={() => navigate("/store")}
                  className="px-3 py-2 rounded-md text-sm font-satoshi-medium text-gray-300 hover:text-white cursor-pointer transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
                >
                  Store
                </button>
                <button
                  onClick={() => navigate("/user")}
                  className="px-3 py-2 rounded-md text-sm font-satoshi-medium text-gray-300 hover:text-white cursor-pointer transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
                >
                  Profile
                </button>
              </>
            )}

            <button
              ref={buttonRef}
              onClick={handleWalletAction}
              disabled={isWalletConnecting || isAuthPending}
              className="bg-[#2B2928] px-5 h-11 rounded-full text-white flex justify-center items-center cursor-pointer font-satoshi-medium"
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
              <button
                className="relative text-sm text-gray-300 mr-2 flex items-center border-2 border-white rounded-full px-3 h-11 cursor-pointer"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <div className="rounded-full cursor-pointer flex items-center justify-center">
                  <span className="text-white font-satoshi-bold text-sm">{networkName}</span>
                </div>
                <div className="flex items-center">
                  {dropdownOpen && (
                    <div className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-40 bg-[#2B2928] rounded-2xl shadow-lg z-20 overflow-hidden">
                      <ul className="py-1">
                        {SUPPORTED_NETWORKS.map((network) => (
                          <li
                            key={network.chainId}
                            onClick={() => handleChainSelect(network)}
                            className="px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white cursor-pointer"
                          >
                            {network.chainName}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </button>
            )}
          </div>

          {/* Mobile connect button */}
          {!isAuthenticated && (
            <button
              onClick={handleWalletAction}
              disabled={isWalletConnecting || isAuthPending}
              className="md:hidden bg-[#2B2928] px-4 h-10 rounded-full text-white flex justify-center items-center cursor-pointer text-sm font-satoshi-medium"
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
          )}
        </div>

        {/* Mobile menu, show/hide based on menu state */}
        {mobileMenuOpen && isAuthenticated && isConnected && (
          <div className="md:hidden pt-2 pb-3 space-y-1 border-t border-gray-700 mt-2">
            <button
              onClick={() => {
                navigate("/home");
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-3 text-base font-satoshi-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-md"
            >
              Home
            </button>
            <button
              onClick={() => {
                navigate("/mint");
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-3 text-base font-satoshi-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-md"
            >
              Mint
            </button>
            <button
              onClick={() => {
                navigate("/store");
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-3 text-base font-satoshi-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-md"
            >
              Store
            </button>
            <button
              onClick={() => {
                navigate("/user");
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-3 text-base font-satoshi-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-md"
            >
              Profile
            </button>

            <div className="flex justify-between items-center px-3 py-3">
              <button
                onClick={handleWalletAction}
                disabled={isWalletConnecting || isAuthPending}
                className="bg-[#2B2928] px-4 py-2 rounded-full text-white flex justify-center items-center cursor-pointer text-sm font-satoshi-medium"
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

              <button
                className="text-sm text-gray-300 flex items-center border-2 border-white rounded-full px-3 py-2 cursor-pointer"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <span className="text-white font-satoshi-bold text-sm">{networkName}</span>
                {dropdownOpen && (
                  <div className="absolute right-4 mt-40 w-40 bg-[#2B2928] rounded-2xl shadow-lg z-20 overflow-hidden">
                    <ul className="py-1">
                      {SUPPORTED_NETWORKS.map((network) => (
                        <li
                          key={network.chainId}
                          onClick={() => handleChainSelect(network)}
                          className="px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white cursor-pointer"
                        >
                          {network.chainName}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
