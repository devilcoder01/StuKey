export const signMessage = async (providerWithInfo: EIP6963ProviderDetail, userAccount: string) => {
    const msgParams = JSON.stringify({
      domain: {
        name: "localhost",
        version: "1",
        chainId: 10143,
      },
      message: {
        address: userAccount,  // Wallet proving ownership
        timestamp: Date.now(),  // Prevent replay attacks
        nonce: Math.floor(Math.random() * 1000000), // Random unique number
        purpose: "Sign this message to verify ownership of this wallet.",
      },
      primaryType: "Verification",
      types: {
        EIP712Domain: [
          { name: "name", type: "string" },
          { name: "version", type: "string" },
          { name: "chainId", type: "uint256" },
        ],
        Verification: [
            { name: "address", type: "string" },
            { name: "timestamp", type: "uint256" },
            { name: "nonce", type: "uint256" },
            { name: "purpose", type: "string" },
          ],
      },
    });
    try {
      const method = "eth_signTypedData_v4";
      const sign = await providerWithInfo.provider.request({
        method: method,
        params: [userAccount, msgParams]
      });
      console.log(sign)
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };