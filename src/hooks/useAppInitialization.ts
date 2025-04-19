import { useCallback, useEffect } from "react";
import axios from "axios";
import { useWallet } from "../context/WalletContext";
import { useToastNotification } from "./useToastNotification";
import { useStudentContract } from "../utils/ContractInterection";
import { useAppInstuctor } from "../context/AppInstuctor";

// Get backend URL from environment variables
const backendURL = process.env.BACKEND_URL || "http://localhost:5555";

/**
 * Hook for initializing the application and loading user data
 * This hook handles fetching user data when the app first loads
 */
export const useAppInitialization = () => {
  const {
    isInitializing,
    isDataLoaded,
    isAuthenticated,
    setAppInstructorData,
    walletAddress,
  } = useAppInstuctor();
  const { userAccount, isConnected } = useWallet();
  const { showError } = useToastNotification();
  const { getScoreandNFT } = useStudentContract();
  const {chainId} = useWallet();

  // Function to fetch user data from backend
  const fetchUserData = useCallback(
    async (walletAddress: string) => {
      try {
        const response = await axios.get(`${backendURL}/api/v1/user`, {
          params: {
            walletAddress: walletAddress,
          },
        });

        if (response.status === 200 && response.data) {
          const userData = response.data.user || response.data;

          // Update user context with fetched data
          if (userData) {
            setAppInstructorData({
              username: userData.username || "",
              email: userData.email || "",
              githubusername: userData.githubUsername || "",
            });
          }

          // If we have users array data structure
          if (response.data.users && response.data.users[0]) {
            const user = response.data.users[0];
            setAppInstructorData({ offChainEngagementScore: user.engagementScore || 0 });
          }

          return true;
        } else if (response.status === 204) {
          setAppInstructorData({
            isFirstUser: true,
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        return false;
      }
    },
    [setAppInstructorData]
  );

  const CreateUserData = async (username: string) => {
    try {
      const response = await axios.post(`${backendURL}/api/v1/newuser`, {
        username: username.trim(),
        walletAddress: walletAddress,
      });
      if (response.status === 200 || response.status === 201) {
        setAppInstructorData({ username: username.trim() });
        setAppInstructorData({
          isFirstUser: false,
        });
      } else {
        console.warn("Unexpected success status:", response.status);
        showError("Failed to update username. Unexpected status.");
      }
    } catch (error) {
      console.error("Error updating username:", error);
      if (axios.isAxiosError(error)) {
        showError(`Error: ${error.response?.data?.message || error.message}`);
      } else {
        showError("An unexpected error occurred while updating username.");
      }
      return false;
    }
  };

  // Function to fetch blockchain data
  const fetchBlockchainData = useCallback(
    async (walletAddress: string) => {
      try {
        const result = await getScoreandNFT(walletAddress);
        if (result.success) {
          setAppInstructorData({
            walletAddress: walletAddress,
            nftTokenID: result.tokenId,
            onChainEngagementScore: result.score,
          });
          return true;
        }
        return false;
      } catch (error) {
        console.error("Error fetching blockchain data:", error);
        return false;
      }
    },
    [getScoreandNFT, setAppInstructorData]
  );

  // Initialize app data
  useEffect(() => {
    const initializeApp = async () => {
      if (!isInitializing && isAuthenticated && isConnected && userAccount) {
        setAppInstructorData({
          isInitializing: true,
        });
        try {
          await Promise.all([
            fetchUserData(userAccount),
            fetchBlockchainData(userAccount),
          ]);

          setAppInstructorData({
            walletAddress: userAccount,
            isDataLoaded: true,
            isInitializing: false,
          });
        } catch (error) {
          console.error("Error during app initialization:", error);
          showError(
            "Failed to load user data. Please try refreshing the page."
          );
          setAppInstructorData({
            isDataLoaded: false,
          });
        }
      } else {
        // If not authenticated, we're still "loaded" just without user data
        setAppInstructorData({
          isDataLoaded: true,
        });
      }

      setAppInstructorData({
        isInitializing: false,
      });
    };

    initializeApp();
  }, [chainId]);

  return {
    isInitializing,
    isDataLoaded,
    CreateUserData,
  };
};
