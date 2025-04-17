import {useState, useEffect} from "react";
import { useWallet } from "../../context/WalletContext";
import { useWalletAuth } from "../../hooks/useWalletAuth";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";
import { useAppInstuctor } from "../../context/AppInstuctor";

const WalletConnectModal: React.FC = () => {
  const {showWalletpopUp, setAppInstructorData} = useAppInstuctor();
  const { providers, isWalletConnecting, selectedWallet, userAccount } = useWallet();
  const { signinMessage, walletConnect } = useWalletAuth();
  const [isMessageSigning, setIsMessageSigning] = useState(false);
  const navigate = useNavigate();

  const [loaderTextMsg, setLoaderTextMsg] = useState("Loading Resoponse.....");

  useEffect(() => {
    if (isWalletConnecting) {
      setLoaderTextMsg("Connecting wallet...");
    } else if (isMessageSigning) {
      setLoaderTextMsg("Signing message...");
    } else {
      setLoaderTextMsg("Loading Response.....");
    }
  }, [isWalletConnecting, isMessageSigning]);

  if (!showWalletpopUp) {
    return null;
  }

  const hangleSignin = async () => {
    setIsMessageSigning(true)
    const success = await signinMessage();
    if (success) {
      setIsMessageSigning(false)
      setAppInstructorData({
        showWalletpopUp : false
      })
      navigate("/home");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 font-[Satoshi-Regular]">
      <div className="bg-[#1E1E1E] rounded-4xl p-6 max-w-md w-full text-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-extrabold">Connect Wallet</h2>
          <button
            onClick={() => setAppInstructorData({
              showWalletpopUp : false
            })}
            className="text-gray-300 hover:text-white cursor-pointer"
          >
            &times;
          </button>
        </div>

        {/* {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )} */}

        {isWalletConnecting || isMessageSigning ? (
          <div className="flex justify-center items-center py-8">
            <LoadingSpinner size="large" text={loaderTextMsg} />
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-300 mb-4">
              Select a wallet to connect to this application:
            </p>

            {providers.length > 0 ? (
              providers.map((provider) => (
                <div
                  key={provider.info.uuid}
                  onClick={() => walletConnect(provider)}
                  className="flex items-center justify-between p-4 border border-gray-700 rounded-2xl hover:bg-[#141313] cursor-pointer"
                >
                  <div className="flex items-center">
                    <img
                      src={provider.info.icon}
                      alt={provider.info.name}
                      className="w-8 h-8 mr-3"
                    />
                    <span className="font-medium">{provider.info.name}</span>
                  </div>
                  <div className="bg-[#2B2928] px-4 py-1 rounded-lg text-white text-sm">
                    installed
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-400">
                No wallet providers detected. Please install a wallet extension.
              </div>
            )}

            {userAccount && selectedWallet && (
              <div>
                <div className="h-0.5 bg-gray-700 rounded-full"></div>
                <div className="text-left py-4 text-gray-400">
                  Sign in to continue
                </div>
                <div className="flex items-center justify-between p-4 border border-gray-700 rounded-lg hover:bg-gray-800 cursor-pointer">
                  <div className="flex items-center">
                    <img
                      src={selectedWallet?.info?.icon || ""}
                      alt={selectedWallet?.info?.name || ""}
                      className="w-8 h-8 mr-3"
                    />
                    <span className="font-medium">
                      {selectedWallet?.info?.name || ""}
                    </span>
                  </div>
                  <button
                    className="bg-[#FE0444] px-4 py-1 rounded-lg text-white text-sm cursor-pointer"
                    onClick={() => hangleSignin()}
                  >
                    Sign in
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletConnectModal;
