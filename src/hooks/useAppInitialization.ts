import { useState, useEffect } from "react";
import axios from "axios";
import { useWallet } from "../context/WalletContext";
import { useSignAuth } from "../context/authSingnatureContext";
import { useUserdetail } from "../context/userInformation";
import { useToastNotification } from "./useToastNotification";
import { useStudentContract } from "../utils/ContractInterection";
// import { getScoreandNFT } from '../utils/ContractInterection';

// Get backend URL from environment variables
const backendURL = process.env.BACKEND_URL || "http://localhost:5555";

/**
 * Hook for initializing the application and loading user data
 * This hook handles fetching user data when the app first loads
 */
export const useAppInitialization = () => {
  const [isInitializing, setIsInitializing] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const { isAuthenticated, user } = useSignAuth();
  const { userAccount, isConnected } = useWallet();
  const { setUserData } = useUserdetail();
  const { showError } = useToastNotification();
  const { getScoreandNFT } = useStudentContract();

  // Function to fetch user data from backend
  const fetchUserData = async (walletAddress: string) => {
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
          setUserData({
            userName: userData.username || "",
            email: userData.email || "",
            walletAddress: userData.walletAddress || "",
            githubUsername: userData.githubUsername || "",
            engagementScore: userData.engagementScore || 0,
          });
        }

        // If we have users array data structure
        if (response.data.users && response.data.users[0]) {
          const user = response.data.users[0];
          setUserData({engagementScore: user.engagementScore || 0,})
        }

        return true;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      return false;
    }
  };

  const CreateUserData = async () => {
    try {
      // create a user
      // The 'body' key might be incorrect. Axios expects the data directly as the second argument.
      // Also, 'walletAddres' seems to have a typo, it should likely be 'walletAddress'.
      const createAccount = await axios.post(`${backendURL}/api/v1/newuser`, {
        // Remove the 'body' wrapper
        username: "danio", // Consider making this dynamic or passed as an argument
        walletAddress: userAccount, // Corrected typo: walletAddres -> walletAddress
      });
      if (createAccount.status === 201) {
        console.log("UserCreated");
        return true;
      }
      // It might be better to check for specific error statuses or rely on the catch block
      else if (createAccount.status === 500) {
        console.error("Server error during user creation:", createAccount.data); // Log server error message if available
        return false;
      } else {
        // Handle other non-201 statuses if necessary
        console.warn(
          "Unexpected status code during user creation:",
          createAccount.status
        );
        return false;
      }
    } catch (error) {
      // Log the specific Axios error for more details
      if (axios.isAxiosError(error)) {
        console.error(
          "Axios error creating new user:",
          error.response?.data || error.message
        );
      } else {
        console.error("Error creating new user:", error);
      }
      return false;
    }
  };

  // Function to fetch blockchain data
  const fetchBlockchainData = async (walletAddress: string) => {
    try {
      const result = await getScoreandNFT(walletAddress);
      if (result.success) {
        setUserData({
          nftTokenId : result.tokenId,
          engagementScore: result.score,
        })
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error fetching blockchain data:", error);
      return false;
    }
  };

  // Initialize app data
  useEffect(() => {
    const initializeApp = async () => {
      setIsInitializing(true);

      if (isAuthenticated && isConnected && userAccount) {
        try {
          const userDataFetched = await fetchUserData(userAccount);

          if (!userDataFetched) {
            CreateUserData();
          }

          const blockchainDataFetched = await fetchBlockchainData(userAccount);

          // Set wallet address in user context
          setUserData({walletAddress: userAccount});

          setIsDataLoaded(userDataFetched || blockchainDataFetched);
        } catch (error) {
          console.error("Error during app initialization:", error);
          showError(
            "Failed to load user data. Please try refreshing the page."
          );
          setIsDataLoaded(false);
        }
      } else {
        // If not authenticated, we're still "loaded" just without user data
        setIsDataLoaded(true);
      }

      setIsInitializing(false);
    };

    initializeApp();
  }, [isAuthenticated, isConnected, userAccount]);

  return {
    isInitializing,
    isDataLoaded,
  };
};
