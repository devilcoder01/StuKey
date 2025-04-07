import React, { useState } from "react";
import Score from "../ui/Score";
import Credential from "../ui/Credential";
import { faGithub } from "@fortawesome/free-brands-svg-icons"; // Import icons
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
function Mint() {
  const [isMinted, setIsMinted] = useState(false); // Renamed state variable

  // State for GitHub Credential
  const [isGithubConnected, setIsGithubConnected] = useState(false);
  const [githubUsername, setGithubUsername] = useState<string | null>(null);

  // State for Email Credential (Example)
  const [isEmailConnected, setIsEmailConnected] = useState(false);
  const [emailAddress, setEmailAddress] = useState<string | null>(null);


  // --- Handlers for GitHub ---
  const handleGithubConnect = async () => {
    // Add actual GitHub connection logic here (e.g., OAuth flow)
    // console.log("Connecting GitHub...");
    // setIsGithubConnected(true);
    // setGithubUsername("devilcoder01");
   // Replace with actual username after connection
  await axios.get("http://localhost:5555/api/v1/github/")
  };

  const handleGithubDisconnect = () => {
    // Add actual GitHub disconnection logic here
    console.log("Disconnecting GitHub...");
    setIsGithubConnected(false);
    setGithubUsername(null);
  };

  // --- Handlers for Email (Example) ---
   const handleEmailConnect = () => {
    // Add actual Email connection logic here (e.g., verification flow)
    console.log("Connecting Email...");
    setIsEmailConnected(true);
    setEmailAddress("user@example.com"); // Replace with actual email after connection
  };

  const handleEmailDisconnect = () => {
    // Add actual Email disconnection logic here
    console.log("Disconnecting Email...");
    setIsEmailConnected(false);
    setEmailAddress(null);
  };


  return (
    <div>

      <div className="px-52 py-20 flex justify-between items-center max-w-7xl mx-auto">
        <div className=" w-full">
          <div className="flex justify-between w-full mb-8">
            <div>
              <div className="flex flex-col gap-4">
                <div className="text-5xl font-medium">Proof of Student</div>
                <div className="text-[0.7rem] mfont-normal w-96">
                  Rewards for Students in the Age of Blockchain — Prove Your
                  Student Identity Without Sharing Personal Data
                </div>
              </div>
              <div className="my-11">
                <span className="px-6 py-3 bg-[#2B2928] text-white rounded-full cursor-pointer">
                  {isMinted ? "Minted" : "Mint Score"} {/* Use renamed state */}
                </span>
              </div>
            </div>
            <div>
              <Score />
            </div>
          </div>
          <div className="">
            <div className="text-lg font-medium mb-5">Credentials</div> {/* Changed title */}
            <div className="flex gap-4"> {/* Added flex container for credentials */}
              {/* GitHub Credential Instance */}
              <Credential
                icon={faGithub}
                title="Github"
                description="Connect your GitHub to verify your activity"
                points={20}
                isConnected={isGithubConnected}
                username={githubUsername}
                onConnect={handleGithubConnect}
                onDisconnect={handleGithubDisconnect}
              />

              {/* Email Credential Instance (Example) */}
               <Credential
                icon={faEnvelope}
                title="Email"
                description="Connect your Email to verify your identity"
                points={10}
                isConnected={isEmailConnected}
                username={emailAddress} // Display email if connected
                onConnect={handleEmailConnect}
                onDisconnect={handleEmailDisconnect}
              />

              {/* Add more Credential instances here for other types */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Mint;
