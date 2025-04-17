import { useEffect, useState, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Score from "../ui/Score";
import Credential from "../ui/Credential";
import { faGithub } from "@fortawesome/free-brands-svg-icons"; // Import icons
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { useWallet } from "../../context/WalletContext";
import { useStudentContract } from "../../utils/ContractInterection";
import { useToastNotification } from "../../hooks/useToastNotification";
import { useAppInstuctor } from "../../context/AppInstuctor";

function Mint() {
  const { mintNFT } = useStudentContract();
  const { isMinted, setAppInstructorData, offChainEngagementScore , githubusername} = useAppInstuctor(); // State to track if NFT is minted
  const { userAccount } = useWallet();
  const [isGithubConnected, setIsGithubConnected] = useState(false);
  // const [githubUsername, setGithubUsername] = useState<string | null>(null);
  const { showSuccess, showError, showInfo } = useToastNotification();
  const [isEmailConnected, setIsEmailConnected] = useState(false);
  const [emailAddress, setEmailAddress] = useState<string | null>(null);


  // Refs for animation
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const buttonRef = useRef(null);
  const scoreRef = useRef(null);
  const credentialsRef = useRef(null);

  // GSAP Timeline Animation
  useGSAP(() => {
    const tl = gsap.timeline();

    // Animate the container
    tl.from(containerRef.current, {
      opacity: 0,
      y: 50,
      duration: 0.6,
      ease: "power3.out",
    });

    // Animate the title
    tl.from(
      titleRef.current,
      {
        opacity: 0,
        y: 30,
        duration: 0.4,
        ease: "power3.out",
      },
      "-=0.4"
    );

    // Animate the description
    tl.from(
      descriptionRef.current,
      {
        opacity: 0,
        y: 20,
        duration: 0.4,
        ease: "power3.out",
      },
      "-=0.3"
    );

    // Animate the button
    tl.from(
      buttonRef.current,
      {
        opacity: 0,
        scale: 0.9,
        duration: 0.4,
        ease: "power3.out",
      },
      "-=0.3"
    );

    // Animate the score
    tl.from(
      scoreRef.current,
      {
        opacity: 0,
        x: 50,
        duration: 0.4,
        ease: "power3.out",
      },
      "-=0.3"
    );

    // Animate the credentials section
    tl.from(
      credentialsRef.current,
      {
        opacity: 0,
        y: 30,
        duration: 0.4,
        ease: "power3.out",
      },
      "-=0.3"
    );
  }, [containerRef, titleRef, descriptionRef, buttonRef, scoreRef, credentialsRef]);


  // --- Handlers for GitHub ---
  const handleGithubConnect = () => {
    if (!userAccount) {
      showError("Please connect your wallet first.");
      return;
    }
    showInfo("Redirecting to GitHub for authentication...");
    // Construct the URL with the walletAddress as a query parameter
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5555"; // Use environment variable or default
    const githubAuthUrl = `${backendUrl}/api/v1/auth/github?walletAddress=${encodeURIComponent(userAccount)}`;
    window.location.href = githubAuthUrl;
  };

  const handleGithubDisconnect = () => {
    // Add actual GitHub disconnection logic here
    console.log("Disconnecting GitHub...");
    showInfo("Disconnecting GitHub account...");

    // Here you would typically call an API to disconnect the account
    // For now, we'll just update the UI state
    setIsGithubConnected(false);
    // setGithubUsername(null);
    showSuccess("GitHub account disconnected successfully");
  };

  // --- Handlers for Email (Example) ---
  const handleEmailConnect = () => {
    // Add actual Email connection logic here (e.g., verification flow)
    console.log("Connecting Email...");
    showInfo("Initiating email verification process...");

    // Simulate email verification process
    setTimeout(() => {
      setIsEmailConnected(true);
      setEmailAddress("user@example.com"); // Replace with actual email after connection
      showSuccess("Email verified successfully!");
    }, 1500);
  };

  const handleEmailDisconnect = () => {
    // Add actual Email disconnection logic here
    console.log("Disconnecting Email...");
    showInfo("Removing email verification...");

    setIsEmailConnected(false);
    setEmailAddress(null);
    showSuccess("Email disconnected successfully");
  };

  const handleMintNFT = async () => {
    // Add actual NFT minting logic here
    if (!userAccount) {
      showError("Please connect your wallet first");
      return;
    }
    showInfo("Initiating NFT minting process...");
    const nftmint = await mintNFT(userAccount, offChainEngagementScore || 36)  //Change it later
    if (!nftmint) {
      showError("Failed to mint NFT");
      return;
    }
    setAppInstructorData({
      isMinted : true
    })

    setTimeout(() => {
      showSuccess("NFT minted successfully!");
    }, 1500);
  };

  return (
    <div ref={containerRef}>
      <div className="px-4 sm:px-8 md:px-16 lg:px-32 xl:px-52 py-8 sm:py-12 md:py-14 flex flex-col lg:flex-row justify-between items-center max-w-7xl mx-auto">
        <div className="w-full">
          <div className="flex flex-col lg:flex-row justify-between w-full mb-5 gap-8">
            <div>
              <div className="flex flex-col gap-4">
                <div className="text-3xl sm:text-4xl md:text-5xl font-[Satoshi-Medium]" ref={titleRef}>Proof of Student</div>
                <div className="text-xs sm:text-sm md:text-base font-[Satoshi-Regular] max-w-xs sm:max-w-sm md:max-w-md" ref={descriptionRef}>
                  Rewards for Students in the Age of Blockchain — Prove Your
                  Student Identity Without Sharing Personal Data
                </div>
              </div>
              <div className="my-8 sm:my-10 md:my-11" ref={buttonRef}>
                <button
                  onClick={() => handleMintNFT()}
                  className="px-4 sm:px-5 py-2 bg-[#2B2928] text-white rounded-full cursor-pointer transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 w-full sm:w-auto font-[Satoshi-Medium]"
                >
                  {isMinted ? "Minted" : "Mint Score"}
                </button>
              </div>
            </div>
            <div ref={scoreRef} className="flex-shrink-0">
              <Score engagePoint={offChainEngagementScore} />
            </div>
          </div>
          <div>
            <div className="text-base sm:text-lg font-[Satoshi-Medium] mb-4 sm:mb-5" ref={credentialsRef}>Credentials</div>
            <div className="flex flex-col sm:flex-row gap-4">
              {/* GitHub Credential Instance */}
              <Credential
                icon={faGithub}
                title="Github"
                description="Connect your GitHub to verify your activity"
                points={20}
                isConnected={isGithubConnected}
                username={"msjan"}
                onConnect={handleGithubConnect}
                onDisconnect={handleGithubDisconnect}
              />
              {/* Email Credential Instance (Example) */}
              <Credential
                icon={faEnvelope}
                title="Email"
                description="Connect your Email to verify your identity"
                points={10}
                isConnected={isEmailConnected}
                username={emailAddress}
                onConnect={handleEmailConnect}
                onDisconnect={handleEmailDisconnect}
              />
              {/* Add more Credential instances here for other types */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Mint;
