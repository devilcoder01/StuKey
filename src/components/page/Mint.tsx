import { useEffect, useState } from "react";
import Score from "../ui/Score";
import Credential from "../ui/Credential";
import { faGithub } from "@fortawesome/free-brands-svg-icons"; // Import icons
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useWallet } from "../../context/WalletContext";
import { useStudentContract } from "../../utils/ContractInterection";
import { useToastNotification } from "../../hooks/useToastNotification";
function Mint() {
  
  const [isMinted, setIsMinted] = useState(false); // State to track if NFT is minted
  const { userAccount } = useWallet();
  const [isGithubConnected, setIsGithubConnected] = useState(false);
  const [githubUsername, setGithubUsername] = useState<string | null>(null);
  const [engagePoint, setengagePoint] = useState<number | null>(null);
  const [isminted, setisminted] = useState(false);
  const { showSuccess, showError, showInfo } = useToastNotification();
  const [isEmailConnected, setIsEmailConnected] = useState(false);
  const [emailAddress, setEmailAddress] = useState<string | null>(null);
  const {getScoreandNFT , mintNFT} = useStudentContract();

  const handleGetScore = async () => {
    if (!userAccount) {
      console.error("No wallet connected");
      showError("No wallet connected. Please connect your wallet first.");
      return;
    }
    showInfo("Fetching your score and NFT status...");
    const result = await getScoreandNFT(userAccount);
    if (result.success) {
      setengagePoint(parseInt(result.score));
      showSuccess("Successfully retrieved your score!");
    } else {
      console.error(result.error);
      showError("Failed to get your score. Please try again later.");
    }
  };

  useEffect(() => {
    handleGetScore();
  }, [userAccount]);

  useEffect(() => {
    if (!userAccount) return;

    try {
      axios.get("http://localhost:5555/api/v1/user", {
        headers : {
          "Content-Type": "application/json",
        },
        params : {
          walletAddress: userAccount
        }
      }).then((res) => {
        if (res.data.user?.githubUsername) {
          setIsGithubConnected(true);
          setGithubUsername(res.data.user.githubUsername);
          showSuccess("GitHub account connected!");
        }
        if (res.data.users?.[0]?.engagementScore) {
          setengagePoint(res.data.users[0].engagementScore);
        }
      }).catch(err => {
        console.error("Error fetching user data:", err);
        showError("Failed to fetch user data");
      });
    } catch (error) {
      console.error(error);
      showError("An error occurred while fetching user data");
    }
  }, [userAccount, showSuccess, showError]); // Ensure the effect runs only when `userAccount` changes


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
                onClick={() => {
                  if (!userAccount) {
                    showError("Please connect your wallet first");
                    return;
                  }
                  showInfo("Initiating NFT minting process...");
                  mintNFT(userAccount, engagePoint || 36)
                    .then(() => {
                      setIsMinted(true);
                      showSuccess("NFT minted successfully!");
                    })
                    .catch((error) => {
                      console.error("Minting error:", error);
                      showError("Failed to mint NFT. Please try again.");
                    });
                }}
                 className="px-6 py-3 bg-[#2B2928] text-white rounded-full cursor-pointer">
                  {isMinted ? "Minted" : "Mint Score"}
                </button>
              </div>
            </div>
            <div>
              <Score engagePoint={engagePoint} />
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
