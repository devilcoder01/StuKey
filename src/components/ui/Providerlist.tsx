import { formatAddress } from "../../utils";
import { useWallet } from "../../context/WalletContext";
import { signMessage } from "../../utils/signmessage";
import { changeNetwork } from "../../utils/changenetwork";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useShowWalletPopup } from "../../context/ShowWalletPopup";
import { useAuth } from "../../context/authContext";

function Providerlist() {
  const { userAccount, selectedWallet, connectWallet, providers } = useWallet();
  const { setShowWalletPopup } = useShowWalletPopup();
  const navigate = useNavigate()
  const {setIsAuthenticated} = useAuth();

  const verifySignHash = async (signHash: string, message: string) => {
    try {
      const response = await axios.post("http://localhost:5555/api/v1/verify", {
        message, // Include the message object
        signature: signHash, // The signature
        address: userAccount, // The user's wallet address
      });
      if(response.data.success){
        console.log("Signature verified successfully!");
        setShowWalletPopup(false);
        setIsAuthenticated(true);
        navigate("/home");
      }
    } catch (error) {
      console.error("Error verifying signature:", error);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 flex justify-center">
        Wallets Detected:
      </h2>
      <div className="flex flex-wrap gap-4 flex-col">
        {providers.length > 0 ? (
          providers?.map((provider: EIP6963ProviderDetail) => (
            <div
              key={provider.info.uuid}
              onClick={() => connectWallet(provider)}
              className="flex items-center gap-2 p-4 border border-gray-300 rounded-full hover:bg-gray-100 transition relative"
            >
              <img
                src={provider.info.icon}
                alt={provider.info.name}
                className="w-8 h-8"
              />
              <div className="font-medium">{provider.info.name}</div>

              <button
                onClick={() => connectWallet(provider)}
                className="bg-[#2B2928] px-7 py-2 rounded-full text-white flex justify-center items-center absolute right-5 cursor-pointer"
              >
                Connect
              </button>
            </div>
          ))
        ) : (
          <div className="italic text-gray-500">
            No Announced Wallet Providers
          </div>
        )}
      </div>
      <hr className="my-4 border-gray-300" />
      <h2 className="text-lg font-medium">
        {userAccount ? "" : "No "}Wallet Selected
      </h2>
      {userAccount && (
        <div className="mt-4 p-4 border border-gray-300 rounded-full bg-gray-50 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img
              src={selectedWallet?.info?.icon || ""}
              alt={selectedWallet?.info?.name || ""}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <div className="font-bold text-lg">
                {selectedWallet?.info?.name || ""}
              </div>
              <div className="text-gray-600">
                ({formatAddress(userAccount)})
              </div>
            </div>
          </div>
          <button
            onClick={async () => {
              if (selectedWallet) {
                // const msgParams = {
                //   address: userAccount,
                //   timestamp: Date.now(),
                //   nonce: Math.floor(Math.random() * 1000000),
                //   purpose: "Sign this message to verify ownership of this wallet.",
                // };
                const message = "Sign this message to verify ownership of this wallet."
                const signHash = await signMessage(selectedWallet, userAccount, message);
                if (typeof signHash === "string") {
                  await changeNetwork(selectedWallet);
                  await verifySignHash(signHash, message); // Pass the message object
                } else {
                  console.error("Invalid signHash type:", signHash);
                }
              }
            }}
            className="bg-[#2B2928] px-7 py-2 rounded-full text-white flex justify-center items-center cursor-pointer"
          >
            Sign in
          </button>
        </div>
      )}
    </div>
  );
}

export default Providerlist;
