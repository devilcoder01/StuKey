import React, { useState } from 'react';
import axios from 'axios';
import { useAppInstuctor } from '../../context/AppInstuctor'; // Assuming this context holds walletAddress and setter
import { useToastNotification } from '../../hooks/useToastNotification';
import { useAppInitialization } from '../../hooks/useAppInitialization';

const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5555";

function FirstUser() {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { walletAddress, isFirstUser } = useAppInstuctor();
  const { showSuccess, showError } = useToastNotification();
  const { CreateUserData } = useAppInitialization()

  if (!isFirstUser) {
    return null;
  }

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!username.trim() || !walletAddress) {
      showError("Username cannot be empty and wallet must be connected.");
      return;
    }
    setIsLoading(true);
    await CreateUserData(username.trim())
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="relative bg-gradient-to-br from-[#232526] to-[#414345] p-8 rounded-2xl shadow-2xl w-[90vw] max-w-md text-white flex flex-col items-center">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex justify-center">
          <div className="bg-indigo-600 rounded-full p-4 shadow-lg border-4 border-[#232526]">
            <svg width="36" height="36" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" fill="#fff" fillOpacity="0.15"/>
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="#fff"/>
            </svg>
          </div>
        </div>
        <div className="mt-8 mb-2 text-center">
          <h2 className="text-2xl font-bold mb-1 tracking-tight">Welcome to StuNFT!</h2>
          <p className="mb-4 text-gray-300 text-sm">
            Set your unique username to get started and personalize your experience.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={handleUsernameChange}
              placeholder="Enter your desired username"
              required
              className="w-full px-4 py-2 border border-gray-700 bg-[#232526] text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              disabled={isLoading}
            />
          </div>
          <div className="flex flex-col sm:flex-row justify-end gap-2 mt-2">
            {/* Optional: Add a cancel button */}
            <button
              type="button"
              // onClick={handleCancel}
              disabled={isLoading}
              className="px-4 py-2 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !username.trim()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition font-semibold"
            >
              {isLoading ? "Saving..." : "Save Username"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FirstUser;
