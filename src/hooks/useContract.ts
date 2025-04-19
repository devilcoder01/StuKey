// import { useWallet } from '../context/WalletContext';
// import { getContractConfig } from '../config/contracts';
// import { ethers } from 'ethers';

// export const useContract = () => {
//   const { currentNetwork } = useWallet();

//   const getContract = () => {
//     if (!currentNetwork) return null;
    
//     const contractConfig = getContractConfig(currentNetwork.chainId);
//     if (!contractConfig) return null;

//     const provider = new ethers.providers.Web3Provider(window.ethereum);
//     const signer = provider.getSigner();
    
//     return new ethers.Contract(
//       contractConfig.address,
//       contractConfig.abi,
//       signer
//     );
//   };

//   const executeContractMethod = async (methodName: string, ...args: any[]) => {
//     const contract = getContract();
//     if (!contract) throw new Error('Contract not initialized');

//     return await contract[methodName](...args);
//   };

//   return {
//     getContract,
//     executeContractMethod,
//   };
// };