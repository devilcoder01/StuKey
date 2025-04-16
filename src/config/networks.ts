import { Chain } from 'viem'

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
    chainName: 'Base',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://mainnet.base.org'],
    blockExplorerUrls: ['https://basescan.org'],
    iconUrl: '/icons/base.svg'
  },
  // Add more networks as needed
];

export const getNetworkByChainId = (chainId: string): NetworkConfig | undefined => {
  return SUPPORTED_NETWORKS.find(network => network.chainId.toLowerCase() === chainId.toLowerCase());
};