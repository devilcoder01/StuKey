import { EIP6963ProviderDetail } from '../types/wallet.types';

export const signMessage = async (providerWithInfo: EIP6963ProviderDetail, userAccount: string, message: string): Promise<string | undefined> => {
  try {
    const method = "personal_sign";
    const msg = `0x${Buffer.from(message, 'utf8').toString('hex')}`;
    const sign = await providerWithInfo.provider.request({
      method: method,
      params: [msg, userAccount],
    });
    return sign as string;
  } catch (error) {
    console.error("Failed to sign message:", error);
    throw new Error(error instanceof Error ? error.message : 'Failed to sign message');
  }
};
