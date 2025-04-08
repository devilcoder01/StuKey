import { EIP6963ProviderDetail } from '../types/wallet.types';

export interface NetworkConfig {
  chainId: string;
  chainName: string;
  rpcUrls: string[];
  blockExplorerUrls: string[];
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

export const MONAD_TESTNET: NetworkConfig = {
  chainId: '0x2797', // 10143 in hex
  chainName: 'Monad Testnet',
  rpcUrls: ['https://testnet-rpc.monad.xyz'],
  blockExplorerUrls: ['https://testnet.monadexplorer.com/'],
  nativeCurrency: {
    name: 'Monad',
    symbol: 'MON',
    decimals: 18,
  },
};

export async function changeNetwork(provider: EIP6963ProviderDetail, networkConfig: NetworkConfig = MONAD_TESTNET): Promise<boolean> {
  try {
    await provider.provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: networkConfig.chainId }],
    });
    return true;
  } catch (switchError: any) {
    // This error code indicates that the chain has not been added to the wallet
    if (switchError.code === 4902) {
      try {
        await provider.provider.request({
          method: 'wallet_addEthereumChain',
          params: [networkConfig],
        });
        return true;
      } catch (addError) {
        console.error('Failed to add network:', addError);
        throw new Error('Failed to add network to wallet');
      }
    }
    console.error('Failed to switch network:', switchError);
    throw new Error('Failed to switch network');
  }
}
