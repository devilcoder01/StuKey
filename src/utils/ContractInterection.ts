
import dotenv from "dotenv";
import ABI from "../abi/Contract_ABI.json";
import {Contract} from "web3-eth-contract";
import { useWallet } from "../context/WalletContext";
dotenv.config();

const STUDENT_NFT_CONTRACT_ADDRESS = process.env.SEPOLIA_CONTRACT_ADDR || "0xc3C1Cc288c285Fb21D2824A645ed51D52D3c4BDc";

// Create a function that returns the contract instance
export const getContract = (provider: any) => {
  return new Contract(
    ABI,
    STUDENT_NFT_CONTRACT_ADDRESS,
    provider
  );
};

// Create a custom hook to get the contract with the current wallet
export const useStudentContract = () => {
  const { selectedWallet } = useWallet();

  const getScoreandNFT = async (address: string) => {
    if (!selectedWallet?.provider) {
      throw new Error("No wallet connected");
    }

    const contract = getContract(selectedWallet.provider);

    try {
      const result = await contract.methods.getStudentScore_or_nftID(address).call();

      // Type assertion to handle the contract return type
      const contractResult = result as unknown as { _tokenIds: string | number, _score: string | number };

      const tokenId = contractResult._tokenIds ? contractResult._tokenIds.toString() : '0';
      const score = contractResult._score ? contractResult._score.toString() : '0';
      return { success: true, tokenId, score };
    } catch (error) {
      console.error("Error getting the score:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "An unknown error occurred"
      };
    }
  };
  const tokenURI = async (tokenId: string) => {
    if (!selectedWallet?.provider) {
      throw new Error("No wallet connected");
    }

    const contract = getContract(selectedWallet.provider);

    try {
      const result = await contract.methods.tokenURI(tokenId).call();
      return result;
    } catch (error) {
      console.error("Error getting the token URI:", error);
      return null;
    }
  };

  const mintNFT = async (address: string, score: number) => {
    if (!selectedWallet?.provider) {
      throw new Error("No wallet connected");
    }
    const contract = getContract(selectedWallet.provider);

    try {
      await contract.methods.mintNFT(address, score, 365).send({ from: address });
      return true;
    } catch (error) {
      console.error("Error minting the NFT:", error);
      return false;
    }
  };

  const updateEngageScore = async (address: string, newScore: number) => {
    if (!selectedWallet?.provider) {
      throw new Error("No wallet connected");
    }
    const contract = getContract(selectedWallet.provider);

    try {
      await contract.methods.updateEngageScore(address, newScore).send({ from: address });
      return true;
    } catch (error) {
      console.error("Error updating NFT score:", error);
      return false;
    }
  };

  return {
    getScoreandNFT,
    mintNFT,
    tokenURI,
    updateEngageScore,
  };
}

