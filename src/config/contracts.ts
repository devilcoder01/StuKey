interface ContractConfig {
  address: string;
  abi: any;
}

export const CONTRACT_ADDRESSES: Record<string, ContractConfig> = {
  '0x1': {
    address: '0x...',  // Ethereum contract address
    abi: [...],        // Ethereum contract ABI
  },
  '0x2105': {
    address: '0x...',  // Base contract address
    abi: [...],        // Base contract ABI
  },
  // Add more networks as needed
};

export const getContractConfig = (chainId: string): ContractConfig | undefined => {
  return CONTRACT_ADDRESSES[chainId];
};