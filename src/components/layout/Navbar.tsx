import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "../../context/WalletContext";
import { useWalletAuth } from "../../hooks/useWalletAuth";
import LoadingSpinner from "../common/LoadingSpinner";
import { formatAddress } from "../../utils"; // Use shared function
import { useAppInstuctor } from "../../context/AppInstuctor";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

function Navbar() {
  const { isAuthenticated, isAuthPending, setAppInstructorData } = useAppInstuctor();
  const { userAccount, isWalletConnecting, isConnected } = useWallet();
  const { signOut } = useWalletAuth();
  const [buttonText, setButtonText] = useState("Connect");
  const navigate = useNavigate();

  // Refs for GSAP animations
  const logoRef = useRef(null);
  const buttonRef = useRef(null);
  const navRef = useRef(null);

  useEffect(() => {
    if (isConnected) {
      setButtonText("Disconnect");
    } else {
      navigate("/");
      setButtonText("Connect");
    }
  }, [isConnected, isAuthenticated]);

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

  return (
    <nav className="bg-[#121212]" ref={navRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div
              className="flex items-center w-44 overflow-hidden cursor-pointer"
              ref={logoRef}
            >
              <img
                src="/white-icon.svg"
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
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white cursor-pointer"
                >
                  Home
                </button>
                <button
                  onClick={() => navigate("/mint")}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white cursor-pointer"
                >
                  Mint
                </button>
                <button
                  onClick={() => navigate("/user")}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white cursor-pointer"
                >
                  Profile
                </button>
              </>
            )}

            <button
              ref={buttonRef}
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
              <div className="text-sm text-gray-300 mr-2">
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
