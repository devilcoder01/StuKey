
export interface NetworkConfig {
  chainId: string;
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorerUrls: string[];
  iconUrl: string;
}

export const SUPPORTED_NETWORKS: NetworkConfig[] = [
  {
    chainId: '0x1',
    chainName: 'Ethereum Mainnet',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://eth-mainnet.g.alchemy.com/v2/your-api-key'],
    blockExplorerUrls: ['https://etherscan.io'],
    iconUrl: '/icons/eth.svg'
  },
  {
    chainId: '0x2105',
    chainName: 'Base Mainnet',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://mainnet.base.org'],
    blockExplorerUrls: ['https://basescan.org'],
    iconUrl: '/icons/base.svg'
  },
  {
    chainId : '0x279F',
    chainName: 'Monad Testnet',
    nativeCurrency: {
      name: 'Monad',
      symbol: 'MON',
      decimals: 18,
    },
    rpcUrls: ['https://testnet-rpc.monad.xyz'],
    blockExplorerUrls: ['https://testnet.monadexplorer.com/'],
    iconUrl: '/icons/monad.svg'
  },
  {
    chainId : "0x4268",
    chainName: "Holeskey Testnet",
    nativeCurrency: {
      name: "Holeskey",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://1rpc.io/holeskey"],
    blockExplorerUrls: ["https://holeskey-testnet.monadexplorer.com/"],
    iconUrl: "/icons/holeskey.svg",
  },
  {
    chainId : "0xaa36a7",
    chainName: "Sepolia Testnet",
    nativeCurrency: {
      name: "Holeskey",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://sepolia.infura.io/"],
    blockExplorerUrls: ["https://sepolia.etherscan.io/"],
    iconUrl: "/icons/holeskey.svg",
  }
  // Add more networks as needed
];

export const getNetworkByChainId = (chainId: string): NetworkConfig | undefined => {
  return SUPPORTED_NETWORKS.find(network => network.chainId.toLowerCase() === chainId.toLowerCase());
};