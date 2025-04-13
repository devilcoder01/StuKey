import { useEffect, useState } from "react";
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
  const { isMinted, setAppInstructorData, offChainEngagementScore } = useAppInstuctor(); // State to track if NFT is minted
  const { userAccount } = useWallet();
  const [isGithubConnected, setIsGithubConnected] = useState(false);
  const [githubUsername, setGithubUsername] = useState<string | null>(null);
  const { showSuccess, showError, showInfo } = useToastNotification();
  const [isEmailConnected, setIsEmailConnected] = useState(false);
  const [emailAddress, setEmailAddress] = useState<string | null>(null);

  // --- Handlers for GitHub ---
  const handleGithubConnect = async () => {
    showInfo("Redirecting to GitHub for authentication...");
    window.location.href = "http://localhost:5555/api/v1/auth/github/";
  };

  const handleGithubDisconnect = () => {
    // Add actual GitHub disconnection logic here
    console.log("Disconnecting GitHub...");
    showInfo("Disconnecting GitHub account...");

    // Here you would typically call an API to disconnect the account
    // For now, we'll just update the UI state
    setIsGithubConnected(false);
    setGithubUsername(null);
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
    <div>
      <div className="px-52 py-20 flex justify-between items-center max-w-7xl mx-auto">
        <div className=" w-full">
          <div className="flex justify-between w-full mb-8">
            <div>
              <div className="flex flex-col gap-4">
                <div className="text-5xl font-medium">Proof of Student</div>
                <div className="text-[0.7rem] mfont-normal w-96">
                  Rewards for Students in the Age of Blockchain — Prove Your
                  Student Identity Without Sharing Personal Data
                </div>
              </div>
              <div className="my-11">
                <button
                  onClick={() => handleMintNFT()}
                  className="px-6 py-3 bg-[#2B2928] text-white rounded-full cursor-pointer"
                >
                  {isMinted ? "Minted" : "Mint Score"}
                </button>
              </div>
            </div>
            <div>
              <Score engagePoint={offChainEngagementScore} />
            </div>
          </div>
          <div className="">
            <div className="text-lg font-medium mb-5">Credentials</div>{" "}
            {/* Changed title */}
            <div className="flex gap-4">
              {" "}
              {/* Added flex container for credentials */}
              {/* GitHub Credential Instance */}
              <Credential
                icon={faGithub}
                title="Github"
                description="Connect your GitHub to verify your activity"
                points={20}
                isConnected={isGithubConnected}
                username={githubUsername}
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
                username={emailAddress} // Display email if connected
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
