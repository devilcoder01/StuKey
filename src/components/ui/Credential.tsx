import React, { useState } from "react";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Credential() {
    const [gitUserName, setgitUserName] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const handleDisconnect = () => {
        setShowModal(true); // Show the custom modal
    };

    const confirmDisconnect = () => {
        setIsConnected(false);
        setgitUserName(null);
        setShowModal(false); // Close the modal
    };

    const cancelDisconnect = () => {
        setShowModal(false); // Close the modal
    };

    const handleConnect = () => {
        setIsConnected(true);
        setgitUserName("devilcoder01"); // Replace with actual username
    };

    return (
        <div>
            <div className="w-96 h-52 rounded-2xl bg-[#D9D9D9] text-black px-8 flex flex-col justify-center gap-5 relative">
                <div className="flex gap-5 items-center">
                    <div className="exclamatory text-5xl ">
                        <FontAwesomeIcon icon={faGithub} />
                    </div>
                    <div>
                        <div className="username text-lg ">{gitUserName}</div>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="text-lg font-semibold">Github</div>
                    <div className="text-[0.7rem] w-32">
                        Connect your GitHub to verify your activity
                    </div>
                </div>
                <div className="text-white absolute right-8 bottom-8">
                    {isConnected ? (
                        <button
                            className="px-4 py-2 bg-[#353231] rounded-lg cursor-pointer"
                            onClick={handleDisconnect}
                        >
                            Connected
                        </button>
                    ) : (
                        <button
                            className="px-4 py-2 bg-[#2B2928] rounded-lg cursor-pointer"
                            onClick={handleConnect}
                        >
                            Connect
                        </button>
                    )}
                </div>
                <div className="score flex flex-col absolute right-8 top-10">
                    <div className="text-2xl font-semibold">20</div>
                    <div className="text-[0.7rem] font-light">points</div>
                </div>
            </div>

            {/* Custom Confirmation Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-0 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <p className="mb-4">Do you want to disconnect GitHub?</p>
                        <div className="flex justify-end gap-4">
                            <button
                                className="px-4 py-2 bg-gray-300 rounded-lg"
                                onClick={cancelDisconnect}
                            >
                                Cancel
                            </button>
                            <button
                                className="cursor-pointer px-4 py-2 bg-[#353231] text-white rounded-lg"
                                onClick={confirmDisconnect}
                            >
                                Disconnect
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Credential;
