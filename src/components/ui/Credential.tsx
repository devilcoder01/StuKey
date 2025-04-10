import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import DisconnectModal from "./DisconnectModel"; // <-- modular

interface CredentialProps {
  icon: IconDefinition;
  title: string;
  description: string;
  points: number;
  isConnected: boolean;
  username?: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
}

const Credential = ({
  icon,
  title,
  description,
  points,
  isConnected,
  username,
  onConnect,
  onDisconnect,
}: CredentialProps) => {
  const [showModal, setShowModal] = useState(false);

  const handleDisconnectClick = () => setShowModal(true);
  const confirmDisconnect = () => {
    onDisconnect();
    setShowModal(false);
  };
  const cancelDisconnect = () => setShowModal(false);

  return (
    <div>
      <div className="w-72 h-40 rounded-2xl bg-[#D9D9D9] text-black px-8 flex flex-col justify-center gap-5 relative">
        <div className="flex gap-5 items-center">
          <div className="text-3xl">
            <FontAwesomeIcon icon={icon} />
          </div>
          {username && (
            <div className="text-lg">{username}</div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <div className="text-lg font-semibold">{title}</div>
          <div className="text-[0.7rem] w-32">{description}</div>
        </div>

        <div className="absolute right-4 bottom-4">
          {isConnected ? (
            <button
              className="px-2 py-1 bg-[#353231] text-white rounded-lg"
              onClick={handleDisconnectClick}
            >
              Connected
            </button>
          ) : (
            <button
              className="px-2 py-1 bg-[#2B2928] text-white rounded-lg"
              onClick={onConnect}
            >
              Connect
            </button>
          )}
        </div>

        <div className="absolute right-4 top-4 text-right">
          <div className="text-2xl font-semibold">{points}</div>
          <div className="text-[0.7rem] font-light">points</div>
        </div>
      </div>

      {showModal && (
        <DisconnectModal
          title={title}
          onCancel={cancelDisconnect}
          onConfirm={confirmDisconnect}
        />
      )}
    </div>
  );
};

export default Credential;
