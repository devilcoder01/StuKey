

export async function changeNetwork(provider : EIP6963ProviderDetail) {
  try {
    await (provider as any) // Or window.ethereum if you don't support EIP-6963.
      .request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: 10143 }],
      })
  } catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask.
    if ((switchError as any).code === 4902) {
      try {
        await (provider as any) // Or window.ethereum if you don't support EIP-6963.
          .request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "10143",
                chainName: "Monad Testnet",
                rpcUrls: ["https://testnet-rpc.monad.xyz"],
                blockExplorerUrls: ["https://testnet.monadexplorer.com/"],
                symbol: "MON"
              },
            ],
          })
      } catch (addError) {
        // Handle "add" error.
        console.log("Some Error is happend see changenetwork.ts file")
      }
    }
    // Handle other "switch" errors.
  }
  
}

