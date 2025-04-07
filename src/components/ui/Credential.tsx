import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface CredentialProps {
    icon: IconDefinition;
    title: string;
    description: string;
    points: number;
    isConnected: boolean;
    username?: string | null; // Optional username/identifier
    onConnect: () => void;
    onDisconnect: () => void;
}

function Credential({
    icon,
    title,
    description,
    points,
    isConnected,
    username,
    onConnect,
    onDisconnect,
}: CredentialProps) {
    const [showModal, setShowModal] = useState(false);

    const handleDisconnectClick = () => {
        setShowModal(true); // Show the custom modal
    };

    const confirmDisconnect = () => {
        onDisconnect(); // Call the disconnect handler passed via props
        setShowModal(false); // Close the modal
    };

    const cancelDisconnect = () => {
        setShowModal(false); // Close the modal
    };

    return (
        <div>
            <div className="w-72 h-40 rounded-2xl bg-[#D9D9D9] text-black px-8 flex flex-col justify-center gap-5 relative">
                <div className="flex gap-5 items-center">
                    <div className="exclamatory text-3xl ">
                        <FontAwesomeIcon icon={icon} /> {/* Use prop */}
                    </div>
                    {username && ( /* Conditionally render username */
                        <div>
                            <div className="username text-lg ">{username}</div>
                        </div>
                    )}
                </div>
                <div className="flex flex-col gap-2">
                    <div className="text-lg font-semibold">{title}</div> {/* Use prop */}
                    <div className="text-[0.7rem] w-32">
                        {description} {/* Use prop */}
                    </div>
                </div>
                <div className="text-white absolute right-4 bottom-4">
                    {isConnected ? (
                        <button
                            className="px-2 py-1 bg-[#353231] rounded-lg cursor-pointer"
                            onClick={handleDisconnectClick} // Trigger modal first
                        >
                            Connected
                        </button>
                    ) : (
                        <button
                            className="px-2 py-1 bg-[#2B2928] rounded-lg cursor-pointer"
                            onClick={onConnect} // Call connect handler directly
                        >
                            Connect
                        </button>
                    )}
                </div>
                <div className="score flex flex-col absolute right-4 top-4">
                    <div className="text-2xl font-semibold">{points}</div> {/* Use prop */}
                    <div className="text-[0.7rem] font-light">points</div>
                </div>
            </div>

            {/* Custom Confirmation Modal */}
            {showModal && (
                // ... existing modal code ...
                 <div className="fixed z-50 inset-0 bg-black bg-opacity-10 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <p className="mb-4">Do you want to disconnect {title}?</p> {/* Use title prop */}
                        <div className="flex justify-end gap-4">
                            <button
                                className="px-4 py-2 bg-gray-300 rounded-lg cursor-pointer"
                                onClick={cancelDisconnect}
                            >
                                Cancel
                            </button>
                            <button
                                className="cursor-pointer px-4 py-2 bg-[#353231] text-white rounded-lg"
                                onClick={confirmDisconnect} // Calls onDisconnect prop
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
