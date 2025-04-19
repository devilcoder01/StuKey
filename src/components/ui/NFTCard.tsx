import React, { useEffect } from "react";
import { formatAddress } from "../../utils";
import { useStudentContract } from "../../utils/ContractInterection";
import axios from "axios";

interface NFTCardProps {
  tokenId: string | null;
  score: number | null;
  walletAddress: string | null;
}

const NFTCard: React.FC<NFTCardProps> = ({ tokenId, score, walletAddress }) => {
  const { tokenURI } = useStudentContract();
  const [nftImage, setNftImage] = React.useState<string | null>(null);

  const fetchNftImage = async (tokenId: string) => {
    const uri = await tokenURI(tokenId);
    if (!uri || Array.isArray(uri)) return;
    const response = await axios.get(uri as string);
    const metadata = response.data;
    const imageUrl = metadata.image;
    return imageUrl;
  };

  useEffect(() => {
    if (tokenId) {
      (async () => {
        const image = await fetchNftImage(tokenId);
        setNftImage(image);
      })();
    }
  }, [tokenId]);

  // If no token ID, show a placeholder
  if (!tokenId || tokenId === "0") {
    return (
      <div className="w-full max-w-sm bg-[#1E1E1E] rounded-xl overflow-hidden shadow-lg">
        <div className="p-6 text-center">
          <h3 className="text-xl font-semibold text-white mb-4">
            No NFT Minted Yet
          </h3>
          <p className="text-gray-400 mb-4">
            Mint your Student NFT to unlock discounts and benefits.
          </p>
          <button
            onClick={() => (window.location.href = "/mint")}
            className="px-5 py-2 bg-[#2B2928] text-white rounded-full cursor-pointer transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
          >
            Go to Mint Page
          </button>
        </div>
      </div>
    );
  }

  // Calculate discount tier based on score
  const getDiscountTier = (score: number | null) => {
    if (!score) return "5%";
    if (score > 70) return "15%";
    if (score >= 41) return "13%";
    if (score >= 20) return "7%";
    return "5%";
  };

  return (
    <div className="w-full max-w-sm bg-[#1E1E1E]  rounded-xl overflow-hidden shadow-lg">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold text-white">Student NFT</h3>
            <p className="text-gray-300 text-sm">Token ID: #{tokenId}</p>
          </div>
          <div className="bg-green-900 bg-opacity-20 px-3 py-1 rounded-lg">
            <span className="text-green-300 text-sm font-medium">Active</span>
          </div>
        </div>

        <div className="mb-6">
          {/* Using aspect-ratio to maintain consistent container proportions */}
          <div className="w-full h-[31rem] aspect-square bg-black bg-opacity-30 rounded-lg relative overflow-hidden">
            {/* NFT Image with improved positioning */}
            {nftImage ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src={nftImage}
                  alt="NFT"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-white text-lg">
                Loading...
              </div>
            )}
            {/* Caption at the bottom */}
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 py-2 text-center">
              <div className="text-white text-sm">StuKey NFT</div>
            </div>
          </div>
        </div>

        <div className="border-t border-white border-opacity-20 pt-4">
          <div className="flex justify-between mb-2">
            <span className="text-gray-300">Owner</span>
            <span className="text-white">
              {walletAddress ? formatAddress(walletAddress) : "Unknown"}
            </span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-300">Score</span>
            <span className="text-white">{score || 0}/100</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Discount Tier</span>
            <span className="text-white">{getDiscountTier(score)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTCard;