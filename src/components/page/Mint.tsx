import { useEffect, useState, useRef, useCallback } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import axios from "axios";
import Score from "../ui/Score";
import Credential from "../ui/Credential";
import { faGithub } from "@fortawesome/free-brands-svg-icons"; // Import icons
import { useWallet } from "../../context/WalletContext";
import { useStudentContract } from "../../utils/ContractInterection";
import { useToastNotification } from "../../hooks/useToastNotification";
import { useAppInstuctor } from "../../context/AppInstuctor";

function Mint() {
  const { mintNFT, updateEngageScore, getScoreandNFT } = useStudentContract();
  const { isMinted, setAppInstructorData, offChainEngagementScore, githubusername, onChainEngagementScore, nftTokenID } = useAppInstuctor(); // State to track if NFT is minted
  const { userAccount } = useWallet();
  const [isGithubConnected, setIsGithubConnected] = useState(false);
  const { showSuccess, showError, showInfo } = useToastNotification();
  // const [ setIsEmailConnected] = useState(false);
  // const [ setEmailAddress] = useState<string | null>(null);
  const [githubMetrics, setGithubMetrics] = useState<any>(null);
  const [isLoadingGithub, setIsLoadingGithub] = useState(false);
  const [lastScanned, setLastScanned] = useState<Date | null>(null);


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


  // Check if GitHub is connected on component mount
  useEffect(() => {
    if (userAccount && githubusername) {
      setIsGithubConnected(true);
      fetchGithubMetrics();
    }
  }, [userAccount, githubusername]);

  // Check if the on-chain score needs to be updated when scores change
  useEffect(() => {
    // If NFT is minted and we have both scores, check if update is needed
    if (isMinted && offChainEngagementScore && onChainEngagementScore) {
      // Log for debugging
      console.log(`Score comparison - Off-chain: ${offChainEngagementScore}, On-chain: ${onChainEngagementScore}`);
    }
  }, [isMinted, offChainEngagementScore, onChainEngagementScore]);

  // Check URL parameters for GitHub connection status
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const githubConnected = urlParams.get('github_connected');
    const error = urlParams.get('error');

    if (githubConnected === 'true') {
      showSuccess("GitHub account connected successfully!");
      // Remove the query parameters from the URL without refreshing the page
      window.history.replaceState({}, document.title, window.location.pathname);
      // Fetch GitHub metrics after successful connection
      fetchGithubMetrics();
    } else if (githubConnected === 'false' && error) {
      showError(`GitHub connection failed: ${error}`);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Fetch GitHub metrics from the backend
  const fetchGithubMetrics = useCallback(async () => {
    if (!userAccount) return;

    setIsLoadingGithub(true);
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || "https://stukey-server.vercel.app";
      const response = await axios.get(`${backendUrl}/api/v1/github/metrics`, {
        params: { walletAddress: userAccount }
      });

      if (response.data.success) {
        setGithubMetrics(response.data.metrics);
        setLastScanned(response.data.lastScanned ? new Date(response.data.lastScanned) : null);
        // Update the engagement score in the app context
        setAppInstructorData({
          offChainEngagementScore: response.data.score
        });
      }
    } catch (error) {
      console.error("Error fetching GitHub metrics:", error);
    } finally {
      setIsLoadingGithub(false);
    }
  }, [userAccount, setAppInstructorData]);

  // Trigger a new GitHub scan
  const triggerGithubScan = async () => {
    if (!userAccount) {
      showError("Please connect your wallet first.");
      return;
    }

    setIsLoadingGithub(true);
    showInfo("Scanning GitHub repositories...");

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || "https://stukey-server.vercel.app";
      const response = await axios.post(`${backendUrl}/api/v1/github/scan`, {
        walletAddress: userAccount
      });

      if (response.data.success) {
        setGithubMetrics(response.data.metrics);
        setLastScanned(new Date());
        setAppInstructorData({
          offChainEngagementScore: response.data.score
        });
        showSuccess(`GitHub scan completed! Your score: ${response.data.score}`);
      } else {
        showError(`Scan failed: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error scanning GitHub:", error);
      showError("Failed to scan GitHub repositories. Please try again later.");
    } finally {
      setIsLoadingGithub(false);
    }
  };

  // --- Handlers for GitHub ---
  const handleGithubConnect = () => {
    if (!userAccount) {
      showError("Please connect your wallet first.");
      return;
    }
    showInfo("Redirecting to GitHub for authentication...");
    // Construct the URL with the walletAddress as a query parameter
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "https://stukey-server.vercel.app"; // Use environment variable or default
    const githubAuthUrl = `${backendUrl}/api/v1/auth/github?walletAddress=${encodeURIComponent(userAccount)}`;
    window.location.href = githubAuthUrl;
  };

  const handleGithubDisconnect = async () => {
    if (!userAccount) {
      showError("Please connect your wallet first.");
      return;
    }

    try {
      setIsLoadingGithub(true);
      showInfo("Disconnecting GitHub account...");

      const backendUrl = import.meta.env.VITE_BACKEND_URL || "https://stukey-server.vercel.app";
      const response = await axios.post(`${backendUrl}/api/v1/auth/github/disconnect`, {
        walletAddress: userAccount
      });

      if (response.data.success) {
        // Update local state
        setIsGithubConnected(false);
        setGithubMetrics(null);
        setLastScanned(null);

        // Update app context
        setAppInstructorData({
          githubusername: null,
          // Update the engagement score (subtract GitHub points)
          offChainEngagementScore: Math.max(0, (offChainEngagementScore || 0) - 20)
        });

        showSuccess("GitHub account disconnected successfully");
      } else {
        showError(response.data.message || "Failed to disconnect GitHub account");
      }
    } catch (error) {
      console.error("Error disconnecting GitHub:", error);
      showError("Failed to disconnect GitHub account. Please try again later.");
    } finally {
      setIsLoadingGithub(false);
    }
  };

  // // --- Handlers for Email (Example) ---
  // const handleEmailConnect = () => {
  //   // Add actual Email connection logic here (e.g., verification flow)
  //   console.log("Connecting Email...");
  //   showInfo("Initiating email verification process...");

  //   // Simulate email verification process
  //   setTimeout(() => {
  //     setIsEmailConnected(true);
  //     setEmailAddress("user@example.com"); // Replace with actual email after connection
  //     showSuccess("Email verified successfully!");
  //   }, 1500);
  // };

  // const handleEmailDisconnect = () => {
  //   // Add actual Email disconnection logic here
  //   console.log("Disconnecting Email...");
  //   showInfo("Removing email verification...");

  //   setIsEmailConnected(false);
  //   setEmailAddress(null);
  //   showSuccess("Email disconnected successfully");
  // };

  const handleMintNFT = async () => {
    if (!userAccount) {
      showError("Please connect your wallet first");
      return;
    }

    // Get the current score to use (default to 36 if not available)
    const currentScore = offChainEngagementScore || 36;

    // Check if NFT is already minted
    if (isMinted && nftTokenID && nftTokenID !== "0") {
      // If already minted, check if the new score is higher than the on-chain score
      const onChainScore = Number(onChainEngagementScore || 0);

      if (currentScore <= onChainScore) {
        showInfo("Your current score is not higher than your on-chain score. No update needed.");
        return;
      }

      // Update the score if it's higher
      showInfo("Updating your NFT score...");
      const updateResult = await updateEngageScore(userAccount, currentScore);

      if (!updateResult) {
        showError("Failed to update NFT score");
        return;
      }

      // Update the on-chain score in the app context
      setAppInstructorData({
        onChainEngagementScore: currentScore
      });

      // Refresh the blockchain data to get the updated score
      try {
        const result = await getScoreandNFT(userAccount);
        if (result.success) {
          setAppInstructorData({
            onChainEngagementScore: Number(result.score)
          });
        }
      } catch (error) {
        console.error("Error refreshing blockchain data:", error);
      }

      showSuccess("NFT score updated successfully!");
    } else {
      // Mint a new NFT if not already minted
      showInfo("Initiating NFT minting process...");
      const nftmint = await mintNFT(userAccount, currentScore);

      if (!nftmint) {
        showError("Failed to mint NFT");
        return;
      }

      // Update the app context
      setAppInstructorData({
        isMinted: true,
        onChainEngagementScore: currentScore
      });

      // Refresh the blockchain data to get the token ID
      try {
        const result = await getScoreandNFT(userAccount);
        if (result.success) {
          setAppInstructorData({
            nftTokenID: result.tokenId,
            onChainEngagementScore: Number(result.score)
          });
        }
      } catch (error) {
        console.error("Error refreshing blockchain data:", error);
      }

      showSuccess("NFT minted successfully!");
    }
  };

  return (
    <div ref={containerRef}>
      <div className="px-4 sm:px-8 md:px-16 lg:px-32 xl:px-52 py-8 sm:py-12 md:py-14 flex flex-col lg:flex-row justify-between items-center max-w-7xl mx-auto">
        <div className="w-full">
          <div className="flex flex-col lg:flex-row justify-between w-full mb-5 gap-8">
            <div>
              <div className="flex flex-col gap-4">
                <div className="text-3xl sm:text-4xl md:text-5xl font-satoshi-medium" ref={titleRef}>Proof of Student</div>
                <div className="text-sm sm:text-sm md:text-base font-[Satoshi-Regular] max-w-xs sm:max-w-sm md:max-w-md" ref={descriptionRef}>
                  Rewards for Students in the Age of Blockchain — Prove Your
                  Student Identity Without Sharing Personal Data
                </div>
              </div>
              <div className="my-8 sm:my-10 md:my-11" ref={buttonRef}>
                <button
                  onClick={() => handleMintNFT()}
                  className="px-4 sm:px-5 py-2 bg-[#2B2928] text-white rounded-full cursor-pointer transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 w-full sm:w-auto font-satoshi-medium text-sm sm:text-base"
                  disabled={isLoadingGithub}
                >
                  {isLoadingGithub ? "Loading..." :
                   isMinted ?
                     (offChainEngagementScore && onChainEngagementScore && offChainEngagementScore > onChainEngagementScore) ?
                       "Update Score" : "Minted"
                     : "Mint Score"}
                </button>
              </div>
            </div>
            <div ref={scoreRef} className="flex-shrink-0">
              <Score engagePoint={offChainEngagementScore} />
            </div>
          </div>
          <div>
            <div className="text-base sm:text-lg font-satoshi-medium mb-4 sm:mb-5" ref={credentialsRef}>Credentials</div>
            <div className="flex flex-col sm:flex-row gap-4">
              {/* GitHub Credential Instance */}
              <Credential
                icon={faGithub}
                title="Github"
                description="Connect your GitHub to verify your activity"
                points={20}
                isConnected={isGithubConnected}
                username={githubusername || ""}
                onConnect={handleGithubConnect}
                onDisconnect={handleGithubDisconnect}
                isLoading={isLoadingGithub}
                metrics={githubMetrics ? {
                  commits: githubMetrics.totalCommits || 0,
                  stars: githubMetrics.totalStars || 0,
                  repos: githubMetrics.publicRepos || 0,
                  lastScanned: lastScanned
                } : null}
                onRefresh={triggerGithubScan}
              />
              {/* Email Credential Instance (Example) */}
              {/* <Credential
                icon={faEnvelope}
                title="Email"
                description="Connect your Email to verify your identity"
                points={10}
                isConnected={isEmailConnected}
                username={emailAddress}
                onConnect={handleEmailConnect}
                onDisconnect={handleEmailDisconnect}
              /> */}
              {/* Add more Credential instances here for other types */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Mint;
