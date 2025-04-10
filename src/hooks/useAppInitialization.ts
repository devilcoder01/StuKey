import { useState, useEffect } from 'react';
import axios from 'axios';
import { useWallet } from '../context/WalletContext';
import { useSignAuth } from '../context/authSingnatureContext';
import { useUserdetail } from '../context/userInformation';
import { useToastNotification } from './useToastNotification';
import { useStudentContract } from '../utils/ContractInterection';
// import { getScoreandNFT } from '../utils/ContractInterection';

// Get backend URL from environment variables
const backendURL = process.env.BACKEND_URL || 'http://localhost:5555';

/**
 * Hook for initializing the application and loading user data
 * This hook handles fetching user data when the app first loads
 */
export const useAppInitialization = () => {
  const [isInitializing, setIsInitializing] = useState(true);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const { isAuthenticated, user } = useSignAuth();
  const { userAccount, isConnected } = useWallet();
  const { 
    setUserName, 
    setEmailAddress, 
    setWalletAddress, 
    setGithubUsername, 
    setEngagementScore, 
    setNftTokenId 
  } = useUserdetail();
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

      if (response.status === 201 && response.data) {
        const userData = response.data.user || response.data;
        
        // Update user context with fetched data
        if (userData.username) setUserName(userData.username);
        if (userData.email) setEmailAddress(userData.email);
        if (userData.walletAddress) setWalletAddress(userData.walletAddress);
        if (userData.githubUsername) setGithubUsername(userData.githubUsername);
        if (userData.engagementScore) setEngagementScore(userData.engagementScore);
        
        // If we have users array data structure
        if (response.data.users && response.data.users[0]) {
          const user = response.data.users[0];
          if (user.engagementScore) setEngagementScore(user.engagementScore);
        }

        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return false;
    }
  };

  // Function to fetch blockchain data
  const fetchBlockchainData = async (walletAddress: string) => {
    try {
      const result = await getScoreandNFT(walletAddress);
      if (result.success) {
        setEngagementScore(parseInt(result.score));
        if (result.tokenId) setNftTokenId(parseInt(result.tokenId));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error fetching blockchain data:', error);
      return false;
    }
  };

  // Initialize app data
  useEffect(() => {
    const initializeApp = async () => {
      setIsInitializing(true);
      
      // Only fetch data if user is authenticated and wallet is connected
      if (isAuthenticated && isConnected && userAccount) {
        try {
          // Fetch user data from backend
          const userDataFetched = await fetchUserData(userAccount);
          
          // Fetch blockchain data
          const blockchainDataFetched = await fetchBlockchainData(userAccount);
          
          // Set wallet address in user context
          setWalletAddress(userAccount);
          
          setIsDataLoaded(userDataFetched || blockchainDataFetched);
        } catch (error) {
          console.error('Error during app initialization:', error);
          showError('Failed to load user data. Please try refreshing the page.');
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
    isDataLoaded
  };
};
