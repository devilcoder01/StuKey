import { useState } from "react";
import { formatAddress } from "../../utils";
import { useWallet } from "../../context/WalletContext";
import { signMessage } from "../../utils/signmessage";
import { changeNetwork } from "../../utils/changenetwork";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSignAuth } from "../../hooks/useSignAuth";
import { useToastNotification } from "../../hooks/useToastNotification";
import { useAppInstuctor } from "../../context/AppInstuctor";

function SignMessage() {
  const { userAccount, selectedWallet } = useWallet();
  const { setAppInstructorData } = useAppInstuctor();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useToastNotification();
  const {login} = useSignAuth();

  const verifySignHash = async (signHash: string, message: string) => {
    try {
      const response = await axios.post("http://localhost:5555/api/v1/verify", {
        message,
        signature: signHash,
        address: userAccount,
      });
      if (response.data.success) {
        showSuccess("Signature verified successfully!");
        setAppInstructorData({
          showWalletpopUp : false
        });
        navigate("/home");
      } else {
        console.error("Signature verification failed.");
        showError("Signature verification failed!");
      }
    } catch (error) {
      console.error("Error verifying signature:", error);
      showError("Failed to verify signature!");
    }
  };

  const handleSignIn = async () => {
    if (!selectedWallet) return;

    setLoading(true);
    try {
      const message = "Sign this message to verify ownership of this wallet.";
      if (!userAccount) {
        showError("User account is not available.");
        setLoading(false);
        return;
      }
      const signHash = await signMessage(selectedWallet, userAccount, message);
      if (typeof signHash === "string") {
        await changeNetwork(selectedWallet);
        await verifySignHash(signHash, message);
      } else {
        console.error("Invalid signHash type:", signHash);
        showError("Invalid signature.");
      }
    } catch (err) {
      console.error("Signing error:", err);
      showError("Error signing message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
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
            <div className="text-gray-600">({formatAddress(userAccount || "")})</div>
          </div>
        </div>
        <button
          onClick={handleSignIn}
          disabled={loading}
          className={`${
            loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          } bg-[#2B2928] px-7 py-2 rounded-full text-white flex justify-center items-center`}
        >
          {loading ? "Signing..." : "Sign in"}
        </button>
      </div>
    </div>
  );
}

export default SignMessage;
