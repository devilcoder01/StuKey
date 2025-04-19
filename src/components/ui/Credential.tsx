import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faSync, faCodeBranch, faStar, faCode } from "@fortawesome/free-solid-svg-icons";
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
  isLoading?: boolean;
  metrics?: {
    commits?: number;
    stars?: number;
    repos?: number;
    lastScanned?: Date | null;
  } | null;
  onRefresh?: () => void;
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
  isLoading = false,
  metrics = null,
  onRefresh,
}: CredentialProps) => {
  const [showModal, setShowModal] = useState(false);
  const [showMetrics, setShowMetrics] = useState(false);

  const handleDisconnectClick = () => setShowModal(true);
  const confirmDisconnect = () => {
    onDisconnect();
    setShowModal(false);
  };
  const cancelDisconnect = () => setShowModal(false);

  // Format date to a readable string
  const formatDate = (date: Date | null | undefined) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleString();
  };

  return (
    <div>
      <div className="w-full sm:w-72 h-auto min-h-40 rounded-2xl bg-[#D9D9D9] text-black px-4 sm:px-8 flex flex-col justify-center relative py-6">
        <div className="absolute top-4 left-4 sm:left-8 flex items-center gap-2 sm:gap-3">
          <div className="text-lg sm:text-xl">
            <FontAwesomeIcon icon={icon} />
          </div>
          <div>
            <div className="text-xs sm:text-sm font-satoshi-medium">{title}</div>
          </div>
        </div>

        <div className="flex flex-col gap-2 mb-8 mt-8">
          {username && <div className="text-lg sm:text-xl font-satoshi-medium truncate">{username}</div>}

          {/* GitHub Metrics Section */}
          {isConnected && metrics && (
            <div className="mt-2">
              <button
                onClick={() => setShowMetrics(!showMetrics)}
                className="text-xs underline text-gray-700 mb-1 font-sans"
              >
                {showMetrics ? 'Hide metrics' : 'Show metrics'}
              </button>

              {showMetrics && (
                <div className="bg-gray-200 p-2 rounded-lg text-xs space-y-1 mt-1 font-sans">
                  <div className="flex items-center gap-1">
                    <FontAwesomeIcon icon={faCode} className="text-gray-700" />
                    <span>Commits: {metrics.commits}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FontAwesomeIcon icon={faStar} className="text-gray-700" />
                    <span>Stars: {metrics.stars}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FontAwesomeIcon icon={faCodeBranch} className="text-gray-700" />
                    <span>Repositories: {metrics.repos}</span>
                  </div>
                  <div className="text-[0.65rem] text-gray-600 mt-1">
                    Last scanned: {formatDate(metrics.lastScanned)}
                  </div>
                  {onRefresh && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRefresh();
                      }}
                      disabled={isLoading}
                      className="flex items-center gap-1 text-[0.65rem] text-blue-700 hover:text-blue-900 mt-1 touch-manipulation"
                    >
                      <FontAwesomeIcon icon={faSync} spin={isLoading} />
                      {isLoading ? 'Scanning...' : 'Rescan repositories'}
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="absolute bottom-4 left-4 sm:left-8 text-[0.65rem] sm:text-[0.7rem] w-28 sm:w-32 font-sans">{description}</div>

        <div className="absolute right-4 bottom-4">
          {isConnected ? (
            <button
              className="px-2 py-1.5 bg-[#353231] text-white text-xs sm:text-sm rounded-lg transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 touch-manipulation"
              onClick={handleDisconnectClick}
              disabled={isLoading}
            >
              Connected
            </button>
          ) : (
            <button
              className="px-2 py-1.5 bg-[#2B2928] text-white text-xs sm:text-sm rounded-lg cursor-pointer transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 touch-manipulation"
              onClick={onConnect}
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Connect'}
            </button>
          )}
        </div>

        <div className="absolute right-4 top-4 text-right">
          <div className="text-xl sm:text-2xl font-satoshi-bold">{points}</div>
          <div className="text-[0.65rem] sm:text-[0.7rem] font-sans">points</div>
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
