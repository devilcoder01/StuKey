export const signMessage = async (providerWithInfo: EIP6963ProviderDetail, userAccount: string, message: string) => {
    // const msgParams = JSON.stringify({
    //   domain: {
    //     name: "localhost",
    //     version: "1",
    //     chainId: 1,
    //   },
    //   message: message,
    //   primaryType: "Verification",
    //   types: {
    //     EIP712Domain: [
    //       { name: "name", type: "string" },
    //       { name: "version", type: "string" },
    //       { name: "chainId", type: "uint256" },
    //     ],
    //     Verification: [
    //         { name: "address", type: "string" },
    //         { name: "timestamp", type: "uint256" },
    //         { name: "nonce", type: "uint256" },
    //         { name: "purpose", type: "string" },
    //       ],
    //   },
    // });
    try {
      const method = "personal_sign";
      const msg = `0x${Buffer.from(message, 'utf8').toString('hex')}`;
      const sign = await providerWithInfo.provider.request({
        method: method,
        params: [msg, userAccount],
      });
      return sign;
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };